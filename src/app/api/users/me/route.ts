import { getUser } from '@/libs/api';
import { cookies } from 'next/headers';

export async function GET() {
  const result = await getUser(cookies().toString());
  return Response.json(result);
}
