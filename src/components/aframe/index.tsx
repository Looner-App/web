// @ts-nocheck
'use client';
import {
  AFrameScene,
  changeTerrain,
  getData,
  lighstipModules,
  mapLoadingScreenComponent,
} from '@/components/aframe/function';
import usePermission from '@/components/aframe/permission';

const html = `<a-scene
modules-lighship
map-loading-screen
renderer="color-management:true; antialias: true;"
 fog="color: #776EBF; type: exponential; density: 0.018;"
  gltf-model="draco-decoder-path: https://cdn.8thwall.com/web/aframe/draco-decoder/"
  xr-web="allowedDevices: any"
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
    <a-entity id="land-mat" material="color: #8AD1A2;"></a-entity>
  <a-entity id="building-mat" material="color: #628776; opacity: 0.2;"></a-entity>
  <a-entity id="park-mat" material="color: #628776"></a-entity>
  <a-entity id="parking-mat" material="color: #707070"></a-entity>
  <a-entity id="road-mat" material="color: #575757"></a-entity>
  <a-entity id="transit-mat" material="color: #3B3B3B"></a-entity>
  <a-entity id="sand-mat" material="color: #E2D8A6"></a-entity>
  <a-entity id="water-mat" material="color:#6090AF"></a-entity>
<a-entity id=“sky-mat" material="color: #00FFD5”; opacity: 0.25;”></a-entity>
<a-entity id=“fog-mat" material="color: #776EBF”; opacity: 0.2;”></a-entity>

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
      exponent: 0.25"></a-sky>
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

  <lightship-map
  themeBuilderComponent
    land-material="#land-mat"
    building-material="#building-mat"
    park-material="#park-mat"
    parking-material="#parking-mat"
    road-material="#road-mat"
    transit-material="#transit-mat"
    sand-material="#sand-mat"
    water-material="#water-mat"
   get-data scale="100 100 100" responsive-map-theme="mode: time" lightship-map-add-wayspots="primitive: custom-wayspot; meters: 25; min: 0.05;">
    <a-entity id="character" gltf-model="#doty" rotation="0 180 0" scale="0.02 0.02 0.02" lightship-map-motion-direction lightship-map-walk-animation="idle: Action; walk: walking; run: walking;" shadow></a-entity>
  </lightship-map>
</a-scene>
`;

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="spinner animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white mb-4"></div>
      <p className="text-white text-lg font-semibold">Loading...</p>
    </div>
  );
};
const Aframe = ({ data = [] }: any) => {
  const permissions = usePermission();

  if (!permissions.geoPermission.geo) {
    return <Loader />;
  }
  const generateItem = async () => {
    if (typeof window !== `undefined` && `geolocation` in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`/custom/generate-item`, {
            method: `POST`,
            headers: {
              'Content-Type': `application/json`,
            },
            body: JSON.stringify({ lat: latitude, lng: longitude }),
            credentials: `include`,
          });
          if (!response.ok) {
            throw new Error(`Failed to generate item`);
          }
          const data = await response.json();
          console.log(`Generated item:`, data);
        } catch (error) {
          console.error(`Error generating item:`, error);
        }
      });
    }
  };
  generateItem();

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
        {
          name: `change-terrain`,
          val: changeTerrain,
        },
        {
          name: `modules-lighship`,
          val: lighstipModules,
        },
      ]}
    />
  );
};

export default Aframe;
