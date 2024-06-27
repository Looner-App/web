// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import { AFrameScene, targetComponent } from '@/components/aframe/function';

const html = `
<a-scene
renderer="color-management:true; antialias: true"
gltf-model="draco-decoder-path: https://cdn.8thwall.com/web/aframe/draco-decoder/"
        get-target
        xrweb>

    <a-camera
            cursor="fuse: true; rayOrigin: mouse"
            id="camera"
            raycaster="objects: .cantap"
    ></a-camera>


</a-scene>

`;
const Aframe = () => {
  const [allReady, setAllReady] = useState(false);

  useEffect(() => {
    if (window?.AFRAME) {
      setAllReady(true);
    }
  }, [window?.AFRAME]);
  if (!allReady) {
    return null;
  }
  return (
    <AFrameScene
      sceneHtml={html}
      components={[
        {
          name: `get-target`,
          val: targetComponent,
        },
      ]}
    />
  );
};

export default Aframe;
