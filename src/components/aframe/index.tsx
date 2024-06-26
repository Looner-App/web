'use client';
import { useEffect } from 'react';
/* eslint-disable prettier/prettier */
const scripts = [
  {
    src: `//cdn.8thwall.com/web/aframe/8frame-1.4.1.min.js`,
    async: true,
  },
  {
    src: `//apps.8thwall.com/xrweb?appKey=yehOggTyRUmmj9rKVqk6IMPGDgHTBczfoLgCsc2zOAkVj8b1MYGcBeQXYeyNbPEopym6sL`, //TODO : it should be dynamic on .env
    async: true,
  },
  {
    src: `//cdn.8thwall.com/web/xrextras/xrextras.js`,
    async: false,
  },
  {
    src: `//cdn.8thwall.com/web/aframe/aframe-extras-6.1.1.min.js`,
    async: false,
  },
];
type AframeSceneProps = {
  children: React.ReactNode;
};
const Aframe = (props: AframeSceneProps) => {
  const { children } = props;
  useEffect(() => {
    scripts.forEach((script) => {
      const scriptElement = document.createElement(`script`);
      script?.src && (scriptElement.src = script.src);
      script?.async && (scriptElement.async = true);
      document.body.appendChild(scriptElement);
    });
  }, []);
  return <a-scene {...props}>{children}</a-scene>;
};

export default Aframe;
