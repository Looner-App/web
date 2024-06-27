import type { Metadata, Viewport } from 'next';
import { Footer, Header } from '@/components/layout';
import { MenuProvider } from '@/libs/context';
import { mergeStyle } from '@/libs/helper';
import { fonts } from '@/fonts';
import '@/styles/app.css';
import { headers } from 'next/headers';

import SlugLayout from '@/components/layout/slug';

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
  const menu = headerList.get(`x-use-menu`) === `1`;
  const removeStyle = headerList.get(`x-remove-min-h`) === `1`;
  const isClaim = headerList.get(`x-is-claim`) === `1`;
  return (
    <html lang="en">
      <body
        className={mergeStyle(
          `${!isClaim ? `mt-[90px]` : `h-[100vh]`} lg:mt-[100px]`,
          fonts.variable,
        )}
      >
        <MenuProvider>
          <SlugLayout>
            {menu && <Header />}
            <main
              className={`w-full ${!removeStyle && `min-h-[calc(100vh - 120px)] mt-40 mb-52`} ${isClaim && `justify-center items-center`} flex flex-col h-full`}
            >
              {children}
            </main>
            {!removeStyle && <Footer />}
          </SlugLayout>
        </MenuProvider>
      </body>
    </html>
  );
}
