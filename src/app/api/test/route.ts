export async function GET() {
  return Response.json(
    {
      message: `ok`,
      data: {},
    },
    { status: 200 },
  );
}
