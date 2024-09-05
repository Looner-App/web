// @ts-nocheck
'use client';
import {
  AFrameScene,
  targetComponent,
} from '@/components/aframeTarget/function';

const html = `
<a-scene
renderer="color-management:true; antialias: true"
gltf-model="draco-decoder-path: https://cdn.8thwall.com/web/aframe/draco-decoder/"
        get-target
        xr-web="allowedDevices: any">

    <a-camera
            cursor="fuse: true; rayOrigin: mouse"
            id="camera"
            raycaster="objects: .cantap"
    ></a-camera>


</a-scene>

`;
const AframeTarget = ({ link, asset3d = null }) => {
  return (
    <AFrameScene
      sceneHtml={html}
      components={[
        {
          name: `get-target`,
          val: targetComponent({ link, asset3d }),
        },
      ]}
    />
  );
};

export default AframeTarget;
