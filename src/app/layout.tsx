import type { Metadata, Viewport } from 'next';
import { Footer, Header } from '@/components/layout';
import { MenuProvider } from '@/libs/context';
import { mergeStyle } from '@/libs/helper';
import { fonts } from '@/fonts';
import '@/styles/app.css';

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
  return (
    <html lang="en">
      <body className={mergeStyle(`mt-[90px] lg:mt-[100px]`, fonts.variable)}>
        <MenuProvider>
          <SlugLayout>
            <Header />
            <main className="w-full min-h-[calc(100vh-120px)] flex flex-col h-full mt-40 mb-52">
              {children}
            </main>
            <Footer />
          </SlugLayout>
        </MenuProvider>
      </body>
    </html>
  );
}
