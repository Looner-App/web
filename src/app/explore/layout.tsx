import { Metadata } from 'next';
import Script from 'next/script';
import { Meta } from 'next/dist/lib/metadata/generate/meta';

export const metadata: Metadata = {
  title: `Explore - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
};
const AR_TOKEN = process.env.AR_TOKEN;
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Meta name="8thwall:renderer" content="aframe:1.3.0" />
      <Meta name="8thwall:package" content="@8thwall.xrextras" />
      <Meta
        name="8thwall:dependencies"
        content="eyJhcHBLZXkiOiJ5ZWhPZ2dUeVJVbW1qOXJLVnFrNklNUEdEZ0hUQmN6Zm9MZ0NzYzJ6T0FrVmo4YjFNWUdjQmVRWFlleU5iUEVvcHltNnNMIiwiZGVwZW5kZW5jaWVzIjpbeyJtb2R1bGVJZCI6ImFhZjk2ZDI5LTA0YTYtNDlhYy1iMTliLTQ4OGM1YTk0Nzg1MSIsImFsaWFzIjoibGlnaHRzaGlwLW1hcHMiLCJjb25maWciOnt9fV19"
      />
      <Script
        type="text/javascript"
        src="//cdn.8thwall.com/web/aframe/8frame-1.3.0.min.js"
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
      <Script
        crossOrigin="anonymous"
        src="https://cdn.8thwall.com/web/hosting/modules8-llffcbe7.js"
      />
      <Script
        crossOrigin="anonymous"
        src="https://static.8thwall.app/modules/v1/aaf96d29-04a6-49ac-b19b-488c5a947851/version/major/1/module.js?s=3bd9d7cd-bed8-4db3-8e58-ac4ee5c75bad"
      ></Script>

      {children}
    </>
  );
}
