// @ts-nocheck
'use client';
import { AFrameScene, targetComponent } from '@/components/aframe/function';
import usePermission from '@/components/aframe/permission';

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
const Aframe = ({ link }) => {
  const permit = usePermission();
  if (!permit.permission.camera) {
    // notify user to allow camera access with tailwind
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please allow camera access</h1>
          <button
            onClick={permit.motionSensor}
            className="uppercase border inline-block
                  px-5 py-2 rounded-md transition duration-300 hocustive:bg-white hocustive:text-jet-black font-bold"
          >
            Allow Camera & Motion Sensor
          </button>
        </div>
      </div>
    );
  }
  return (
    <AFrameScene
      sceneHtml={html}
      components={[
        {
          name: `get-target`,
          val: targetComponent({ link }),
        },
      ]}
    />
  );
};

export default Aframe;
