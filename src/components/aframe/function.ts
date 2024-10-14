/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
// A React component for 8th Wall AFrame scenes. The scene HTML can be supplied, along with
// any components or primitives that should be registered, and any image targets that should be
// loaded if something other than the automatically loaded set is wanted. Passing
// DISABLE_IMAGE_TARGETS will prevent any image targets from loading, including ones that would
// otherwise enabled automatically.
// Helper function to make sure that aframe components are only registered once, since they can't
// be cleanly unregistered.
import { useEffect } from 'react';

const registeredComponents = new Set();
const registerComponents = (components) =>
  components.forEach(({ name, val }) => {
    if (registeredComponents.has(name)) {
      return;
    }
    registeredComponents.add(name);
    window.AFRAME.registerComponent(name, val);
  });
// Helper function to make sure that aframe systems are only registered once, since they can't
// be cleanly unregistered.
const registeredSystems = new Set();
const registerSystems = (systems) =>
  systems.forEach(({ name, val }) => {
    if (registeredSystems.has(name)) {
      return;
    }
    registeredSystems.add(name);
    window.AFRAME.registerSystem(name, val);
  });
// Helper function to make sure that aframe primitives are only registered once, since they can't
// be cleanly unregistered.
const registeredPrimitives = new Set();
const registerPrimitives = (primitives) =>
  primitives.forEach(({ name, val }) => {
    if (registeredPrimitives.has(name)) {
      return;
    }
    registeredPrimitives.add(name);
    window.AFRAME.registerPrimitive(name, val);
  });

// A react component for loading and unloading an aframe scene. The initial scene contents should
// be specified as an html string in sceneHtml. All props must be specified when the component
// mounts. Updates to props will be ignored.
//
// Optionally, aframe coponents to register for this scene can be passed as [{name, val}] arrays.
// Care is needed here to not define the same component different across scenes, since aframe
// components can't be unloaded.
//
// Optionally imageTargets can be specified to override the set loaded by default.
function AFrameScene({
  sceneHtml,
  imageTargets,
  components,
  systems,
  primitives,
}) {
  useEffect(() => {
    if (imageTargets) {
      window.XR8.XrController.configure({ imageTargets });
    }
    if (components) {
      registerComponents(components);
    }
    if (systems) {
      registerSystems(systems);
    }
    if (primitives) {
      registerPrimitives(primitives);
    }
    const html = document.getElementsByTagName(`html`)[0];
    const origHtmlClass = html.className;
    document.body.insertAdjacentHTML(`beforeend`, sceneHtml);
    // Cleanup
    return () => {
      const ascene = document.getElementsByTagName(`a-scene`)[0];
      ascene.parentNode.removeChild(ascene);
      html.className = origHtmlClass;
    };
    // eslint-disable-next-line
  }, []);
  return null;
}

const DISABLE_IMAGE_TARGETS = [];

const mapLoadingScreenComponent = {
  init() {
    const scene = this.el.sceneEl;
    const dismissLoadScreen = () => {
      console.log(`ready`);
    };

    const getPosition = function (options) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    };

    getPosition()
      .then(() => {
        scene.hasLoaded
          ? dismissLoadScreen()
          : scene.addEventListener(`loaded`, dismissLoadScreen);
      })
      .catch((err) => {
        console.error(err.message);
      });
  },
};
const madeMarker = (data) => {
  const item = document.createElement(`lightship-map-point`);
  item.setAttribute(`id`, data.id);
  item.setAttribute(`lat-lng`, `${data.lat} ${data.lng}`);
  item.setAttribute(`position`, { x: 0, y: 25, z: 0 });
  item.setAttribute(`scale`, `0.75 0.75 0.75`);
  item.setAttribute(`gltf-model`, `url(${data.marker_3d})`);
  item.setAttribute(`class`, `cantap`);
  item.setAttribute(`animation-mixer`, `clip:idle floating`);

  return item;
};
const getData = (data = []) => {
  return {
    async init() {
      this.lightshipMap = document.querySelector(`lightship-map`);
      const fragment = document.createDocumentFragment();
      this.requestInProgress = false;
      const len = data.length;
      let i = 0;
      const addMarker = () => {
        if (i < len) {
          const sw = data[i];
          if (sw?.status !== `looted`) {
            const target = madeMarker(sw);
            target.addEventListener(`click`, async () => {
              target.setAttribute(`animation-mixer`, `clip:tap coin`);
              const id = sw?.id;
              const isTargetAR = sw?.isTargetAR;
              // Send PATCH request to the API endpoint
              try {
                if (isTargetAR) {
                  window.location.href = `/augmented/${id}`;
                  return;
                }
                const response = await fetch(`/api/users/claim`, {
                  method: `PATCH`,
                  headers: {
                    'Content-Type': `application/json`,
                  },
                  body: JSON.stringify({ id }), // Pass the id in the request body
                });

                if (!response.ok) {
                  // Show alert and redirect to the login page if the request fails
                  alert(`Failed to claim user. Please log in to continue.`);
                  window.location.href = `/`; // Redirect to the login page
                } else {
                  target.setAttribute(`visible`, false);
                }
              } catch (error) {
                console.error(`Error during the fetch request:`, error);
                alert(`Failed to claim user. Please log in to continue.`);
                window.location.href = `/`; // Redirect to the login page
              }
            });
            fragment.appendChild(target);
            i++;
            requestAnimationFrame(addMarker);
          }
        } else {
          this.lightshipMap.appendChild(fragment);
        }
      };
      requestAnimationFrame(addMarker);
    },
  };
};
const changeTerrain = {
  async init() {
    const landMat = document.getElementById(`land-mat`);
    const buildingMat = document.getElementById(`building-mat`);
    const parkMat = document.getElementById(`park-mat`);
    const parkingMat = document.getElementById(`parking-mat`);
    const roadMat = document.getElementById(`road-mat`);
    const transitMat = document.getElementById(`transit-mat`);
    const sandMat = document.getElementById(`sand-mat`);
    const waterMat = document.getElementById(`water-mat`);
    landMat.setAttribute(`land-material`, `#land-mat`);
    buildingMat.setAttribute(`building-material`, `#building-mat`);
    parkMat.setAttribute(`park-material`, `#park-mat`);
    parkingMat.setAttribute(`parking-material`, `#parking-mat`);
    roadMat.setAttribute(`road-material`, `#road-mat`);
    transitMat.setAttribute(`transit-material`, `#transit-mat`);
    sandMat.setAttribute(`sand-material`, `#sand-mat`);
    waterMat.setAttribute(`water-material`, `#water-mat`);
    landMat.setAttribute(`material`, `color: #8AD1A2`);
  },
};

const lighstipModules = {
  init() {
    const lightshipMaps = window.Modules8.getModule({
      moduleId: `aaf96d29-04a6-49ac-b19b-488c5a947851`,
    });
  },
};

const themeBuilderComponent = {
  init() {
    // custom theme materials
    const landMat = document.getElementById(`land-mat`);
    const buildingMat = document.getElementById(`building-mat`);
    const parkMat = document.getElementById(`park-mat`);
    const parkingMat = document.getElementById(`parking-mat`);
    const roadMat = document.getElementById(`road-mat`);
    const transitMat = document.getElementById(`transit-mat`);
    const sandMat = document.getElementById(`sand-mat`);
    const waterMat = document.getElementById(`water-mat`);
  },
};
export {
  themeBuilderComponent,
  AFrameScene,
  DISABLE_IMAGE_TARGETS,
  mapLoadingScreenComponent,
  getData,
  changeTerrain,
  lighstipModules,
};
