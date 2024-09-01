import { NextRequest, NextResponse } from 'next/server';

const PROXY_CORS_ALLOWS = (process.env.PROXY_CORS_ALLOWS || ``)
  .split(`,`)
  .map((origin) => origin.trim());
const PROXY_CORS_METHODS = process.env.PROXY_CORS_METHODS || `GET, HEAD, POST`;
const PROXY_URL = process.env.PROXY_URL || `https://backend.looner.xyz/media`;

export async function GET(
  request: NextRequest,
  { params }: { params: { pathname: string[] } },
) {
  try {
    // Join the captured pathname segments to form the full path
    const mediaPath = params.pathname.join(`/`);

    // Construct the target URL by appending the captured path to the external server URL
    const targetUrl = `${PROXY_URL}/${mediaPath}`;

    // Check for the origin of the request and set CORS headers
    const requestOrigin = request.headers.get(`origin`);
    const corsHeaders = new Headers();

    if (
      PROXY_CORS_ALLOWS.includes(`*`) ||
      PROXY_CORS_ALLOWS.includes(requestOrigin ?? ``)
    ) {
      corsHeaders.set(`Access-Control-Allow-Origin`, requestOrigin || `*`);
      corsHeaders.set(`Access-Control-Allow-Methods`, PROXY_CORS_METHODS);
      corsHeaders.set(
        `Access-Control-Allow-Headers`,
        `Content-Type, Authorization`,
      );
      corsHeaders.set(`Access-Control-Allow-Credentials`, `true`);
    }

    // Forward the request to the target URL
    const response = await fetch(targetUrl, {
      headers: {
        ...Object.fromEntries(request.headers),
        ...Object.fromEntries(corsHeaders),
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      return new NextResponse(null, {
        status: response.status,
        statusText: response.statusText,
        headers: corsHeaders,
      });
    }

    // Pass the response back to the client with the appropriate content type and CORS headers
    const data = await response.arrayBuffer();
    const contentType =
      response.headers.get(`content-type`) || `application/octet-stream`;

    corsHeaders.set(`Content-Type`, contentType);

    return new NextResponse(data, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error(`Error during proxy:`, error);
    return NextResponse.json(
      {
        message: `Error processing request`,
      },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  // Handle CORS preflight requests
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': `*`,
      'Access-Control-Allow-Methods': PROXY_CORS_METHODS,
      'Access-Control-Allow-Headers': `Content-Type, Authorization`,
    },
  });
}
