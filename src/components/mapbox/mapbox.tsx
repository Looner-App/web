'use client';

import { Switch } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import mapboxgl, { MarkerOptions } from 'mapbox-gl';
import { harversine, mergeStyle } from '@/libs/helper';
import * as THREE from 'three';
import 'mapbox-gl/dist/mapbox-gl.css';
import './mapbox.css';
import { format } from 'date-fns';
// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

mapboxgl.accessToken = String(process.env.NEXT_PUBLIC_MAPBOX_TOKEN);
const customMarker = `/live_marker.svg`;

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
  const mapMarkersRef = useRef<MarkerOptions[]>([]);
  const mixers: THREE.AnimationMixer[] = [];

  const [showMarkerLive, setMarkerLive] = useState(true);
  const [showMarkerLooted, setMarkerLooted] = useState(true);

  const isNearUser = (
    from: {
      lat: number;
      lng: number;
    },
    to: {
      lat: number;
      lng: number;
    },
    threshold = 30,
  ) => {
    const distance = harversine(from.lat, from.lng, to.lat, to.lng);
    return distance <= threshold;
  };

  const placeModelOnMap = (
    map: mapboxgl.Map,
    coordinates: [number, number],
    id: string | null = null,
    clip: string | null = null,
    rotation: [number, number, number] = [Math.PI / 2, 0, 0],
    scale = 1,
    modelUrl?: string | null,
  ) => {
    if (!modelUrl) {
      return;
    }
    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
      coordinates,
      0,
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
      type: `custom` as const,
      renderingMode: `3d` as const,
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
            if (pickClip) mixer.clipAction(pickClip).play();
            mixers.push(mixer);
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
        this.renderer.resetState();
        // @ts-ignore
        this.renderer.render(this.scene, this.camera);
        // @ts-ignore
        this.map.triggerRepaint();
      },
    };

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

      // Place models when style is loaded
      markers
        .filter((marker) => marker.marker_3d?.url)
        .forEach((marker) =>
          placeModelOnMap(
            map,
            [marker.lng, marker.lat],
            null,
            null,
            [Math.PI / 2, 0, 0],
            1,
            marker?.marker_3d?.url ?? null,
          ),
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
            properties: marker,
            geometry: {
              type: `Point`,
              coordinates: [marker.lng, marker.lat],
            },
          })),
        },
        cluster: true,
        clusterMaxZoom: 10,
        clusterRadius: 40,
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

      async function hideMarkersInClusters() {
        const markers = document.querySelectorAll(`[data-id]`);
        let shouldBeHide: any = [];

        const clusters = map
          .querySourceFeatures(`markers`)
          .filter((feature) => feature.properties?.cluster_id);

        const bunchOfAsync = clusters.map((cluster) =>
          map
            .getSource(`markers`)
            // @ts-ignore
            .getClusterLeaves(cluster.properties.cluster_id, Infinity, 0),
        );
        const _data = await Promise.all(bunchOfAsync);
        _data.forEach((geoJson: any) => {
          const geoData = geoJson._data;
          shouldBeHide = geoData.features.map((feature: any) => {
            const _prop = feature?.properties;
            return String(_prop?.uniqueLink).split(`/`).pop();
          });
        });

        markers.forEach((marker: any) => {
          const dataId = marker.getAttribute(`data-id`);
          const markerElement = document.querySelector(`[data-id="${dataId}"]`);
          if (markerElement) {
            if (shouldBeHide.includes(dataId)) {
              // @ts-ignore
              markerElement.style.visibility = `hidden`;
            } else {
              // @ts-ignore
              markerElement.style.visibility = `visible`;
            }
          }
        });
      }

      map.on(`click`, `clusters`, function (e) {
        const features = map.queryRenderedFeatures(e.point, {
          layers: [`clusters`],
        });
        const clusterId = features[0].properties?.cluster_id;
        map
          .getSource(`markers`)
          // @ts-ignore
          .getClusterExpansionZoom(clusterId, function (err: any, zoom: any) {
            if (err) return;

            map.easeTo({
              // @ts-ignore
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
            hideMarkersInClusters();
          });
      });
      map.on(`mouseenter`, `clusters`, function () {
        map.getCanvas().style.cursor = `pointer`;
        hideMarkersInClusters();
      });
      map.on(`mouseleave`, `clusters`, function () {
        map.getCanvas().style.cursor = ``;
        hideMarkersInClusters();
      });
      map.on(`moveend`, hideMarkersInClusters);
      map.on(`zoomend`, hideMarkersInClusters);
      map.on(`move`, hideMarkersInClusters);
      map.on(`zoom`, hideMarkersInClusters);
      setTimeout(() => {
        hideMarkersInClusters();
      }, 1000);
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserLocation: false,
    });

    map.addControl(geolocate);
    map.addControl(new mapboxgl.NavigationControl(), `top-right`);

    geolocate.on(`geolocate`, (e: any) => {
      const lat = e?.coords?.latitude;
      const lng = e?.coords?.longitude;
      data.markers.forEach((item, _i) => {
        if (!mapMarkersRef.current[_i] || mapMarkersRef.current[_i] == null) {
          return;
        }
        if (!mapContainerRef.current) return;
        const _marker = mapMarkersRef.current[_i] as HTMLDivElement;
        const isNear = isNearUser(
          { lat: lat, lng: lng },
          { lat: item.lat, lng: item.lng },
        );
        if (!isNear) {
          const markerPoint =
            _marker.getElementsByClassName(`point-marker-live`);
          if (markerPoint.length > 0) {
            // @ts-ignore
            _marker.getElementsByClassName(`point-marker`)[0].style.animation =
              `none`;
          }
          return;
        }
        _marker.addEventListener(`click`, (e: any) => {
          const id = e?.target?.offsetParent?.dataset?.id ?? ``;
          setTimeout(() => {
            const getEl = document.getElementById(id);
            if (getEl) {
              if (!isNear) {
                getEl.style.visibility = `hidden`;
              } else {
                getEl.style.visibility = `visible`;
              }
            }
          }, 100);
        });
        const liveMarker = _marker.getElementsByClassName(`point-marker-live`);
        if (liveMarker.length > 0) {
          // @ts-ignore
          _marker.getElementsByClassName(`point-marker`)[0].style.animation =
            `bounce 1s infinite`;
        }
      });
    });

    // Create standard markers
    data.markers
      .filter((e) => !e.marker_3d)
      .forEach((item, _i) => {
        if (!mapMarkersRef.current[_i] || mapMarkersRef.current[_i] == null) {
          return;
        }
        const extractUniqueLink = item.uniqueLink?.split(`/`);
        const uniqueLink = extractUniqueLink?.[extractUniqueLink.length - 1];
        const linkToAugmented = `/augmented/${uniqueLink}`;
        const mapMark: any = mapMarkersRef.current[_i];
        mapMark?.setAttribute(`data-id`, uniqueLink);
        new mapboxgl.Marker(mapMarkersRef.current[_i])
          .setLngLat([item.lng, item.lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<div class="text-jet-black">
                <div class="text-lg font-bold">${item.title}</div>
                <hr class="my-3" />
                ${item.image ? `<img src="${item.image}" alt="${item.title}" class="mb-3 w-full" />` : ``}
                ${
                  item.desc
                    ? `<div class="mb-2">${item.desc}</div>
                      <hr class="my-3" />`
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
                    ? `<div class='w-full' style="visibility: hidden" id="${uniqueLink}" ><a href="${linkToAugmented}" class="mt-4 justify-center bg-azure-blue text-white transition hocustive:bg-azure-blue/20 hocustive:text-black rounded-lg font-semibold py-3 px-6  disabled:opacity-50 text-lg flex w-full items-center space-x-2">Start AR</a></div>`
                    : ``
                }
              </div>`,
            ),
          )
          .addTo(map);
      });

    return () => map.remove();
  }, [markers]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const markers = mapContainerRef.current.querySelectorAll(
      `.mapbox__marker--live`,
    ) as unknown as HTMLDivElement[];

    markers.forEach((marker) => {
      marker.style.visibility = showMarkerLive ? `visible` : `hidden`;
    });
  }, [showMarkerLive]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const markers = mapContainerRef.current.querySelectorAll(
      `.mapbox__marker--looted`,
    ) as unknown as HTMLDivElement[];

    markers.forEach((marker) => {
      marker.style.visibility = showMarkerLooted ? `visible` : `hidden`;
    });
  }, [showMarkerLooted]);

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
        <div className="hidden">
          {markers
            .filter((item) => !item.marker_3d?.url)
            .map((item, _i) =>
              item.status === `looted` ? (
                <div
                  key={_i}
                  ref={(e) => e && (mapMarkersRef.current[_i] = e)}
                  className={`mapbox__marker--looted relative flex items-center justify-center h-[10px] w-[10px]`}
                >
                  <span className="relative inline-flex rounded-full h-2/3 w-2/3 bg-fade-red point-marker" />
                </div>
              ) : (
                <div
                  key={_i}
                  ref={(e) => e && (mapMarkersRef.current[_i] = e)}
                  className={`mapbox__marker--live relative flex items-center justify-center h-[64px] w-[64px]`}
                >
                  <img
                    src={customMarker}
                    alt="marker"
                    className="absolute top-0 left-0 w-full h-full point-marker point-marker-live"
                  />
                </div>
              ),
            )}
        </div>
      </div>
    </div>
  );
};
