import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Account - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
