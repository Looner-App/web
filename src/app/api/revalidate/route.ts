import { NextResponse, NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';

const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get(`token`);
  const path = searchParams.get(`path`);

  // Check for secret token to confirm this is a valid request
  if (REVALIDATE_TOKEN && REVALIDATE_TOKEN !== token) {
    return NextResponse.json({
      revalidate: false,
      message: `Invalid token`,
    });
  }

  // Check for path to validate
  if (typeof path != `string` || path == ``) {
    return NextResponse.json({
      revalidate: false,
      message: `Invalid path`,
    });
  }

  try {
    // This should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    revalidatePath(path);

    return NextResponse.json({
      revalidate: true,
      message: `Revalidate \`${path}\` success`,
    });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    console.log(err);

    return NextResponse.json(
      {
        revalidate: false,
        message: `Error revalidating: ${err}`,
      },
      { status: 500 },
    );
  }
}
