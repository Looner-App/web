/* eslint-disable @typescript-eslint/quotes */

import localFont from 'next/font/local';

export const cyberbang = localFont({
  variable: '--font-cyberbang',
  display: 'swap',
  src: [
    {
      path: './cyberbang/cyberbang.otf',
    },
  ],
});

export const neometric = localFont({
  variable: '--font-neometric',
  display: 'swap',
  src: [
    {
      path: './neometric/Fontspring-DEMO-neometric-hairline.otf',
      weight: '100',
    },
    {
      path: './neometric/Fontspring-DEMO-neometric-extralight.otf',
      weight: '200',
    },
    {
      path: './neometric/Fontspring-DEMO-neometric-light.otf',
      weight: '300',
    },
    {
      path: './neometric/Fontspring-DEMO-neometric-regular.otf',
      weight: '400',
    },
    {
      path: './neometric/Fontspring-DEMO-neometric-medium.otf',
      weight: '500',
    },
    {
      path: './neometric/Fontspring-DEMO-neometric-bold.otf',
      weight: '700',
    },
    {
      path: './neometric/Fontspring-DEMO-neometric-extrabold.otf',
      weight: '800',
    },
    {
      path: './neometric/Fontspring-DEMO-neometric-heavy.otf',
      weight: '900',
    },
  ],
});

export const neometricAlt = localFont({
  variable: '--font-neometric-alt',
  display: 'swap',
  src: [
    {
      path: './neometric/Fontspring-DEMO-neometricalt-hairline.otf',
      weight: '100',
    },
    {
      path: './neometric/Fontspring-DEMO-neometricalt-extralight.otf',
      weight: '200',
    },
    {
      path: './neometric/Fontspring-DEMO-neometricalt-light.otf',
      weight: '300',
    },
    {
      path: './neometric/Fontspring-DEMO-neometricalt-regular.otf',
      weight: '400',
    },
    {
      path: './neometric/Fontspring-DEMO-neometricalt-medium.otf',
      weight: '500',
    },
    {
      path: './neometric/Fontspring-DEMO-neometricalt-bold.otf',
      weight: '700',
    },
    {
      path: './neometric/Fontspring-DEMO-neometricalt-extrabold.otf',
      weight: '800',
    },
    {
      path: './neometric/Fontspring-DEMO-neometricalt-heavy.otf',
      weight: '900',
    },
  ],
});

export const montserrat = localFont({
  variable: '--font-montserrat',
  display: 'swap',
  src: [
    {
      path: './montserrat/Montserrat-Thin.otf',
      weight: '100',
    },
    {
      path: './montserrat/Montserrat-ExtraLight.otf',
      weight: '200',
    },
    {
      path: './montserrat/Montserrat-Light.otf',
      weight: '300',
    },
    {
      path: './montserrat/Montserrat-Regular.otf',
      weight: '400',
    },
    {
      path: './montserrat/Montserrat-Medium.otf',
      weight: '500',
    },
    {
      path: './montserrat/Montserrat-SemiBold.otf',
      weight: '600',
    },
    {
      path: './montserrat/Montserrat-Bold.otf',
      weight: '700',
    },
    {
      path: './montserrat/Montserrat-ExtraBold.otf',
      weight: '800',
    },
    {
      path: './montserrat/Montserrat-Black.otf',
      weight: '900',
    },
  ],
});

export const montserratAlt = localFont({
  variable: '--font-montserrat-alt',
  display: 'swap',
  src: [
    {
      path: './montserrat/MontserratAlternates-Thin.otf',
      weight: '100',
    },
    {
      path: './montserrat/MontserratAlternates-ExtraLight.otf',
      weight: '200',
    },
    {
      path: './montserrat/MontserratAlternates-Light.otf',
      weight: '300',
    },
    {
      path: './montserrat/MontserratAlternates-Regular.otf',
      weight: '400',
    },
    {
      path: './montserrat/MontserratAlternates-Medium.otf',
      weight: '500',
    },
    {
      path: './montserrat/MontserratAlternates-SemiBold.otf',
      weight: '600',
    },
    {
      path: './montserrat/MontserratAlternates-Bold.otf',
      weight: '700',
    },
    {
      path: './montserrat/MontserratAlternates-ExtraBold.otf',
      weight: '800',
    },
    {
      path: './montserrat/MontserratAlternates-Black.otf',
      weight: '900',
    },
  ],
});

export const fonts = {
  className: `${neometric.className} ${neometricAlt.className} ${montserrat.className} ${montserratAlt.className} ${cyberbang.className}`,
  variable: `${neometric.variable} ${neometricAlt.variable} ${montserrat.variable} ${montserratAlt.variable} ${cyberbang.variable}`,
};
