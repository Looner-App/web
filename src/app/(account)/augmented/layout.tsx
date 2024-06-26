import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: `Augmented - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
};
const AR_TOKEN = process.env.AR_TOKEN;
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        type="text/javascript"
        src="//cdn.8thwall.com/web/aframe/8frame-1.4.1.min.js"
      ></Script>
      <Script
        async
        src={`//apps.8thwall.com/xrweb?appKey=${AR_TOKEN}`}
      ></Script>
      <Script
        type="text/javascript"
        src="//cdn.8thwall.com/web/xrextras/xrextras.js"
      ></Script>
      <Script
        type="text/javascript"
        src="//cdn.8thwall.com/web/aframe/aframe-extras-6.1.1.min.js"
      ></Script>
      {children}
    </>
  );
}
