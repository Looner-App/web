// @ts-nocheck
'use client';
import {
  AFrameScene,
  getData,
  mapLoadingScreenComponent,
} from '@/components/aframe/function';

const html = `<a-scene
map-loading-screen renderer="color-management:true; antialias: true;"
 fog="color: #e9cfb9; type: exponential; density: 0.010;"
  gltf-model="draco-decoder-path: https://cdn.8thwall.com/web/aframe/draco-decoder/"
  xr-web="allowedDevices: any"
   inspector="url: https://cdn.jsdelivr.net/gh/aframevr/aframe-inspector@master/dist/aframe-inspector.min.js"
   >
  <div id="gradient" class="gradient-move absolute-fill">
    <div class="spinner-wrapper">
      <div class="spinner"></div>
    </div>
    <h1 class="poweredby">Powered By Looner</h1>
  </div>
  <a-assets>
    <a-asset-item id="doty" src="/avatar.glb" />
    <img id="clouds" src="/clouds.jpg">
  </a-assets>
  <a-entity id="land-mat" material="color: #6a816a"></a-entity>
  <a-entity id="building-mat" material="color: #c2c2c2"></a-entity>
  <a-entity id="park-mat" material="color: #116e28"></a-entity>
  <a-entity id="parking-mat" material="color: #707070"></a-entity>
  <a-entity id="road-mat" material="color: #343232"></a-entity>
  <a-entity id="transit-mat" material="color: #000000"></a-entity>
  <a-entity id="sand-mat" material="color: #d3c592"></a-entity>
  <a-entity id="water-mat" material="color: #5d81a2"></a-entity>
  <a-entity light="type: directional;
           intensity: 0.3;
           cast-shadow: true;
           shadow-map-height: 2048;
           shadow-map-width: 2048;
           shadow-camera-top: 15;
           shadow-camera-bottom: -15;
           shadow-camera-left: -15;
           shadow-camera-right: 15;
           shadow-radius: 4;
           target: #character;" position="0 10 0" shadow></a-entity>
  <a-light type="ambient" intensity="0.8"></a-light>
  <a-camera near="1" far="200" raycaster="objects: .cantap" cursor="fuse: false; rayOrigin: mouse;" wasd-controls="enabled: false" lightship-map-controls="target: 0 4 0; min-distance: 5.5; max-distance: 25;"></a-camera>
  <a-sky id="outer-sky" radius="100" material="
      shader: lightship-map-sky-gradient;
      topColor: #6b8cb8;
      exponent: 0.65"></a-sky>
   <a-sky
    id="inner-sky"
    radius="90"
    xrextras-spin="speed: 500000"
    material="
      shader: standard;
      src: #clouds;
      transparent: true;
      repeat: 4 4;
      opacity: 0.35;"
  ></a-sky>
    <a-plane
    scale="100 100 1"
    rotation="-90 0 0"
    position="0 0.01 0"
    material="shader: shadow"
    shadow="cast: false; receive: true;"
  ></a-plane>
  <lightship-map get-data scale="100 100 100" responsive-map-theme="mode: time" lightship-map-add-wayspots="primitive: custom-wayspot; meters: 25; min: 0.05;">
    <a-entity id="character" gltf-model="#doty" rotation="0 180 0" scale="0.08 0.08 0.08" lightship-map-motion-direction lightship-map-walk-animation="idle: Action; walk: walking; run: walking;" shadow></a-entity>
  </lightship-map>
</a-scene>
`;
const Aframe = ({ data = [] }: any) => {
  return (
    <AFrameScene
      sceneHtml={html}
      components={[
        {
          name: `map-loading-screen`,
          val: mapLoadingScreenComponent,
        },
        {
          name: `get-data`,
          val: getData(data),
        },
      ]}
    />
  );
};

export default Aframe;
