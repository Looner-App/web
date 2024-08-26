'use client';

import { Switch } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as THREE from 'three';
// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { mergeStyle } from '@/libs/helper';
import 'mapbox-gl/dist/mapbox-gl.css';
import './mapbox.css';
import { format } from 'date-fns';

mapboxgl.accessToken = String(process.env.NEXT_PUBLIC_MAPBOX_TOKEN);
const customMarker = `/live_marker.svg`;

// const coinModelPath = `/coin.glb`;

export interface IMapbox extends React.HTMLAttributes<HTMLDivElement> {
  data: {
    markers: {
      lat: number;
      lng: number;
      status: `live` | `looted`;
      title: string;
      desc?: string;
      image?: string;
      createdAt: Date;
      claimedBy?: string;
      claimedDuration?: string;
      publicUniqueLink?: boolean;
      uniqueLink?: string;
      marker_3d?: {
        url?: string | null;
      };
    }[];
    initZoom?: number;
  };
}

export const Mapbox = ({ data, className, ...props }: IMapbox) => {
  const { markers, initZoom = 8 } = data;
  const initLat = markers.length > 0 ? markers[0].lat : 0;
  const initLng = markers.length > 0 ? markers[0].lng : 0;

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapMarkersRef = useRef<mapboxgl.Marker[]>([]);

  const [showMarkerLive, setMarkerLive] = useState(true);
  const [showMarkerLooted, setMarkerLooted] = useState(true);

  // const isNearUser = (
  //   from: {
  //     lat: number;
  //     lng: number;
  //   },
  //   to: {
  //     lat: number;
  //     lng: number;
  //   },
  //   threshold = 30,
  // ) => {
  //   const distance = harversine(from.lat, from.lng, to.lat, to.lng);
  //   return distance <= threshold;
  // };
  const mixers: THREE.AnimationMixer[] = [];
  const load3DModel = (
    map: mapboxgl.Map,
    coordinates: [number, number],
    modelUrl: string,
    id: string | null = null,
    clip: string | null = null,
    rotation = [Math.PI / 2, 0, 0],
    scale = 1,
  ) => {
    const modelOrigin = coordinates;
    const modelAltitude = 0;

    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude,
    );

    const modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      rotateX: rotation[0],
      rotateY: rotation[1],
      rotateZ: rotation[2],
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits() * scale,
    };

    const customLayer = {
      id: id ?? `3d-model-${coordinates[0]}-${coordinates[1]}`,
      type: `custom`,
      renderingMode: `3d`,
      onAdd: function (map: mapboxgl.Map, gl: WebGLRenderingContext) {
        // @ts-ignore
        this.camera = new THREE.Camera();
        // @ts-ignore
        this.scene = new THREE.Scene();

        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0, -70, 100).normalize();
        // @ts-ignore
        this.scene.add(directionalLight);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff);
        directionalLight2.position.set(0, 70, 100).normalize();
        // @ts-ignore
        this.scene.add(directionalLight2);

        const loader = new GLTFLoader();
        loader.load(modelUrl, (gltf: any) => {
          const model = gltf.scene;
          // @ts-ignore
          this.scene.add(model);

          const mixer = new THREE.AnimationMixer(model);
          if (clip) {
            const pickClip = gltf.animations.find(
              (_clip: any) => _clip.name === clip,
            );
            if (pickClip) {
              mixer.clipAction(pickClip).play();
              mixers.push(mixer);
            }
          }
        });

        // @ts-ignore
        this.map = map;
        // @ts-ignore
        this.renderer = new THREE.WebGLRenderer({
          canvas: map.getCanvas(),
          context: gl,
          antialias: true,
        });

        // @ts-ignore
        this.renderer.autoClear = false;
      },
      render: function (gl: WebGLRenderingContext, matrix: number[]) {
        const rotationX = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(1, 0, 0),
          modelTransform.rotateX,
        );
        const rotationY = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(0, 1, 0),
          modelTransform.rotateY,
        );
        const rotationZ = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(0, 0, 1),
          modelTransform.rotateZ,
        );

        const m = new THREE.Matrix4().fromArray(matrix);
        const l = new THREE.Matrix4()
          .makeTranslation(
            modelTransform.translateX,
            modelTransform.translateY,
            // @ts-ignore
            modelTransform.translateZ,
          )
          .scale(
            new THREE.Vector3(
              modelTransform.scale,
              -modelTransform.scale,
              modelTransform.scale,
            ),
          )
          .multiply(rotationX)
          .multiply(rotationY)
          .multiply(rotationZ);

        // @ts-ignore
        this.camera.projectionMatrix = m.multiply(l);

        // @ts-ignore
        const delta = this.map.frameRate || 1 / 60; // assume 60fps if not available
        mixers.forEach((mixer) => mixer.update(delta));

        // @ts-ignore
        this.renderer.resetState();
        // @ts-ignore
        this.renderer.render(this.scene, this.camera);
        // @ts-ignore
        this.map.triggerRepaint();
      },
    };

    // Add the custom layer to the map
    // @ts-ignore
    map.addLayer(customLayer);
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style:
        process.env.NEXT_PUBLIC_MAPBOX_STYLE ||
        `mapbox://styles/mapbox/dark-v11`,
      center: [initLng, initLat],
      zoom: initZoom,
      pitch: 60,
      bearing: -60,
      antialias: true,
    });

    map.on(`style.load`, () => {
      const layers = map.getStyle().layers;

      const labelLayerId =
        layers.find(
          (layer: any) => layer.type === `symbol` && layer.layout[`text-field`],
        )?.id ?? ``;
      map.addLayer(
        {
          id: `add-3d-buildings`,
          source: `composite`,
          'source-layer': `building`,
          filter: [`==`, `extrude`, `true`],
          type: `fill-extrusion`,
          minzoom: 15,
          paint: {
            'fill-extrusion-color': `#aaa`,
            'fill-extrusion-height': [
              `interpolate`,
              [`linear`],
              [`zoom`],
              15,
              0,
              15.05,
              [`get`, `height`],
            ],
            'fill-extrusion-base': [
              `interpolate`,
              [`linear`],
              [`zoom`],
              15,
              0,
              15.05,
              [`get`, `min_height`],
            ],
            'fill-extrusion-opacity': 0.6,
          },
        },
        labelLayerId,
      );
    });

    // Clustering and Marker Setup
    map.on(`load`, () => {
      map.addSource(`markers`, {
        type: `geojson`,
        data: {
          type: `FeatureCollection`,
          features: data.markers.map((marker) => ({
            type: `Feature`,
            properties: {
              ...marker,
              cluster: false,
            },
            geometry: {
              type: `Point`,
              coordinates: [marker.lng, marker.lat],
            },
          })),
        },
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      });

      map.addLayer({
        id: `clusters`,
        type: `circle`,
        source: `markers`,
        filter: [`has`, `point_count`],
        paint: {
          'circle-color': [
            `step`,
            [`get`, `point_count`],
            `#1B1B1B`,
            100,
            `#0D0D0D`,
            750,
            `#000000`,
          ],
          'circle-radius': [
            `step`,
            [`get`, `point_count`],
            20,
            100,
            30,
            750,
            40,
          ],
          'circle-stroke-color': `#F9A32C`,
          'circle-stroke-width': 2,
        },
      });

      map.addLayer({
        id: `cluster-count`,
        type: `symbol`,
        source: `markers`,
        filter: [`has`, `point_count`],
        layout: {
          'text-field': `{point_count_abbreviated}`,
          'text-font': [`DIN Offc Pro Medium`, `Arial Unicode MS Bold`],
          'text-size': 12,
        },
        paint: {
          'text-color': `#F9A32C`,
        },
      });

      map.addLayer({
        id: `unclustered-point`,
        type: `symbol`,
        source: `markers`,
        filter: [`!has`, `point_count`],
        layout: {
          'icon-image': [`get`, `icon`],
          'icon-size': 1.5,
        },
      });

      // Hide markers when they are part of a cluster
      const hideMarkersInClusters = () => {
        const markers = document.querySelectorAll(`[data-id]`);
        markers.forEach((marker: any) => {
          marker.style.display = `none`;
        });

        const features = map.querySourceFeatures(`markers`, {
          filter: [`!has`, `point_count`],
        });

        features.forEach((feature) => {
          // @ts-ignore
          const uniqueLink = feature.properties.uniqueLink;
          const markerElement = document.querySelector(
            `[data-id="${uniqueLink}"]`,
          );
          if (markerElement) {
            // @ts-ignore
            markerElement.style.display = `block`;
          }
        });
      };

      // Inspect a cluster on click
      map.on(`click`, `clusters`, function (e) {
        const features = map.queryRenderedFeatures(e.point, {
          layers: [`clusters`],
        });
        // @ts-ignore
        const clusterId = features[0].properties.cluster_id;
        map
          .getSource(`markers`)
          // @ts-ignore
          .getClusterExpansionZoom(clusterId, function (err, zoom) {
            if (err) return;

            map.easeTo({
              // @ts-ignore
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          });
      });

      map.on(`zoomend`, hideMarkersInClusters);
      map.on(`moveend`, hideMarkersInClusters);
      map.on(`click`, `clusters`, hideMarkersInClusters);

      // Add markers to map
      data.markers.forEach((item, _i) => {
        if (item.marker_3d?.url) {
          console.log(`3D Model URL:`, item.marker_3d.url);
          // Uncomment to enable 3D model loading
          load3DModel(
            map,
            [item.lng, item.lat],
            `/coin.glb`,
            null,
            null,
            undefined,
            0.1,
          );
        }
        const markerElement = document.createElement(`div`);
        markerElement.setAttribute(
          `class`,
          item.status === `looted`
            ? `mapbox__marker--looted`
            : `mapbox__marker--live`,
        );
        markerElement.setAttribute(`data-id`, item.uniqueLink || ``);
        markerElement.style.width = item.status === `looted` ? `10px` : `64px`;
        markerElement.style.height = item.status === `looted` ? `10px` : `64px`;

        if (item.status === `looted`) {
          markerElement.innerHTML = `<span class="relative inline-flex rounded-full h-2/3 w-2/3 bg-fade-red point-marker" />`;
        } else {
          markerElement.innerHTML = `<img
              src="${customMarker}"
              alt="marker"
              class="absolute top-0 left-0 w-full h-full point-marker point-marker-live"
              key="${_i}-keyless"
            />`;
        }

        const mapMarker = new mapboxgl.Marker(markerElement)
          .setLngLat([item.lng, item.lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<div class="text-jet-black">
                  <div class="text-lg font-bold">${item.title}</div>
                  <hr class="my-3" />
                  ${
                    item.image
                      ? `<img src="${item.image}" alt="${item.title}" class="mb-3 w-full" />`
                      : ``
                  }
                  ${
                    item.desc
                      ? `<div class="mb-2">${item.desc}</div><hr class="my-3" />`
                      : ``
                  }
                  <div>
                    <span class="flex-shrink-0">Current status</span>: <b class="capitalize flex-shrink-0">${item.status}</b>
                  </div>
                  <div>
                    <span class="flex-shrink-0">Dropped date</span>: <b class="capitalize flex-shrink-0">${format(item.createdAt, `MMM dd, yyyy, KK:mmaaa`)}</b>
                  </div>
                  ${
                    item.claimedBy
                      ? `<div><span class="flex-shrink-0">Claimed by</span>: <b class="capitalize flex-shrink-0">${item.claimedBy}</b></div>`
                      : ``
                  }
                  ${
                    item.claimedDuration
                      ? `<div><span class="flex-shrink-0">Claimed in</span>: <b class="capitalize flex-shrink-0">${item.claimedDuration}</b></div>`
                      : ``
                  }
                  ${
                    !item.claimedBy && item.publicUniqueLink
                      ? `<div class='w-full' style="visibility: hidden" id="${item.uniqueLink}" ><a href="/augmented/${item.uniqueLink}" class="mt-4 justify-center bg-azure-blue text-white transition hocustive:bg-azure-blue/20 hocustive:text-black rounded-lg font-semibold py-3 px-6  disabled:opacity-50 text-lg flex w-full items-center space-x-2">Start AR</a></div>`
                      : ``
                  }
                </div>`,
            ),
          )
          .addTo(map);

        mapMarkersRef.current.push(mapMarker);
      });

      // Initially hide all markers part of a cluster
      hideMarkersInClusters();

      // Implement hide/show functionality for markers based on status
      const updateMarkerVisibility = () => {
        mapMarkersRef.current.forEach((mapMarker, index) => {
          const marker = markers[index];
          const markerElement = mapMarker.getElement();
          if (
            (marker.status === `live` && !showMarkerLive) ||
            (marker.status === `looted` && !showMarkerLooted)
          ) {
            markerElement.style.display = `none`;
          } else {
            markerElement.style.display = `block`;
          }
        });
        hideMarkersInClusters(); // Also hide markers that are part of clusters
      };

      updateMarkerVisibility();
      map.on(`moveend`, updateMarkerVisibility);
      map.on(`zoomend`, updateMarkerVisibility);
    });

    return () => {
      map.remove();
      mapMarkersRef.current = [];
    };
  }, [data.markers, showMarkerLive, showMarkerLooted]);

  return (
    <div className={mergeStyle(`mapbox`, className)} {...props}>
      <div className="mapbox__map" ref={mapContainerRef} />

      <div className="absolute top-2 left-2 bg-zinc-800 border rounded-lg p-2">
        <ul className="space-y-2 font-bold text-xs md:text-sm">
          <li>
            <label className="flex items-center space-x-2 select-none cursor-pointer">
              <Switch
                checked={showMarkerLive}
                onChange={() => setMarkerLive(!showMarkerLive)}
                className={mergeStyle(
                  `relative inline-flex h-[18px] w-[46px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 bg-bright-blue`,
                  !showMarkerLive && `bg-zinc-500`,
                )}
              >
                <span
                  aria-hidden="true"
                  className={mergeStyle(
                    `pointer-events-none inline-block h-[14px] w-[14px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`,
                    showMarkerLive ? `translate-x-7` : `translate-x-0`,
                  )}
                />
              </Switch>
              <span>Live</span>
            </label>
          </li>
          <li>
            <label className="flex items-center space-x-2 select-none cursor-pointer">
              <Switch
                checked={showMarkerLooted}
                onChange={() => setMarkerLooted(!showMarkerLooted)}
                className={mergeStyle(
                  `relative inline-flex h-[18px] w-[46px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 bg-fade-red`,
                  !showMarkerLooted && `bg-zinc-500`,
                )}
              >
                <span
                  aria-hidden="true"
                  className={mergeStyle(
                    `pointer-events-none inline-block h-[14px] w-[14px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`,
                    showMarkerLooted ? `translate-x-7` : `translate-x-0`,
                  )}
                />
              </Switch>
              <span>Looted</span>
            </label>
          </li>
        </ul>
      </div>
    </div>
  );
};
