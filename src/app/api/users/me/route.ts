import { getUser } from '@/libs/api';

export async function GET() {
  const result = await getUser();
  return Response.json(result);
}
