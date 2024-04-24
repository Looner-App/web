import type { Metadata, Viewport } from 'next';
import { Footer, Header } from '@/components/layout';
import { MenuProvider } from '@/libs/context';
import { mergeStyle } from '@/libs/helper';
import { fonts } from '@/fonts';
import '@/styles/app.css';

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
        <div className="bg-grid" />
        <MenuProvider>
          <Header />
          <div className="min-h-[calc(100vh-120px)] flex flex-col justify-center">
            <main className="w-full">{children}</main>
          </div>
          <Footer />
        </MenuProvider>
      </body>
    </html>
  );
}
