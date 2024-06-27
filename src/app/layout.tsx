import type { Metadata, Viewport } from 'next';
import { Footer, Header } from '@/components/layout';
import { MenuProvider } from '@/libs/context';
import { mergeStyle } from '@/libs/helper';
import { fonts } from '@/fonts';
import '@/styles/app.css';
import Script from 'next/script';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME,
  icons: `${process.env.NEXT_PUBLIC_SITE_URL}/favicon.ico`,
};

export const viewport: Viewport = {
  width: `device-width`,
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = headers();
  const pathname = headerList.get(`x-current-path`);
  console.log(pathname);
  return (
    <html lang="en">
      <Script
        type="text/javascript"
        src="//cdn.8thwall.com/web/aframe/8frame-1.4.1.min.js"
      ></Script>
      <Script
        async
        src="//apps.8thwall.com/xrweb?appKey=yehOggTyRUmmj9rKVqk6IMPGDgHTBczfoLgCsc2zOAkVj8b1MYGcBeQXYeyNbPEopym6sL"
      ></Script>
      <Script
        type="text/javascript"
        src="//cdn.8thwall.com/web/xrextras/xrextras.js"
      ></Script>
      <Script
        type="text/javascript"
        src="//cdn.8thwall.com/web/aframe/aframe-extras-6.1.1.min.js"
      ></Script>
      <body className={mergeStyle(`mt-[90px] lg:mt-[100px]`, fonts.variable)}>
        <MenuProvider>
          {pathname !== `/augmented` && <Header />}

          <main className="w-full min-h-[calc(100vh-120px)] flex flex-col h-full mt-40 mb-52">
            {children}
          </main>
          <Footer />
        </MenuProvider>
      </body>
    </html>
  );
}
