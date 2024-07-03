'use client';

import { Switch } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import mapboxgl, { MarkerOptions } from 'mapbox-gl';
import { harversine, mergeStyle } from '@/libs/helper';
import 'mapbox-gl/dist/mapbox-gl.css';
import './mapbox.css';
import { format } from 'date-fns';

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

  const [showMarkerLive, setMarkerLive] = useState(true);
  const [showMarkerLooted, setMarkerLooted] = useState(true);

  // Check if location is near the user

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

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style:
        process.env.NEXT_PUBLIC_MAPBOX_STYLE ||
        `mapbox://styles/mapbox/dark-v11`,
      center: [initLng, initLat],
      zoom: initZoom,
    });
    // Clsutering
    map.on(`load`, () => {
      // Add a new source from our GeoJSON data and set the
      // 'cluster' option to true.
      map.addSource(`markers`, {
        type: `geojson`,
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
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
        clusterMaxZoom: 10, // Max zoom to cluster points on
        clusterRadius: 40, // Radius of each cluster when clustering points (defaults to 50)
      });

      map.addLayer({
        id: `clusters`,
        type: `circle`,
        source: `markers`,
        filter: [`has`, `point_count`],
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          'circle-color': [
            `step`,
            [`get`, `point_count`],
            `#1B1B1B`, // color for clusters with count less than 100
            100,
            `#0D0D0D`, // color for clusters with count between 100 and 750
            750,
            `#000000`, // color for clusters with count greater than or equal to 750
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
          'circle-stroke-color': `#F9A32C`, // border color
          'circle-stroke-width': 2, // border width
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
          'text-color': `#F9A32C`, // Set the text color to white
        },
      });

      async function hideMarkersInClusters() {
        // Show all markers
        const markers = document.querySelectorAll(`[data-id]`);
        let shouldBeHide: any = [];

        // Get all clusters
        const clusters = map
          .querySourceFeatures(`markers`)
          // @ts-ignore
          .filter((feature) => feature.properties.cluster_id);

        const bunchOfAsync = clusters.map((cluster) => {
          return (
            map
              .getSource(`markers`)
              // @ts-ignore
              .getClusterLeaves(cluster.properties.cluster_id, Infinity, 0)
          );
        });
        const _data = await Promise.all(bunchOfAsync);
        _data.forEach((geoJson: any) => {
          const geoData = geoJson._data;
          shouldBeHide = geoData.features.map((feature: any) => {
            const _prop = feature?.properties;
            return String(_prop?.uniqueLink).split(`/`).pop();
          });
        });
        // compare if the marker is in the cluster or not and hide it
        markers &&
          markers.forEach((marker: any) => {
            const dataId = marker.getAttribute(`data-id`);
            const markerElement = document.querySelector(
              `[data-id="${dataId}"]`,
            );
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
      // inspect a cluster on click
      map.on(`click`, `clusters`, function (e) {
        const features = map.queryRenderedFeatures(e.point, {
          layers: [`clusters`],
        });
        // @ts-ignore
        const clusterId = features[0].properties.cluster_id;
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
    // Add geolocate control to the map.
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserLocation: false,
    });
    // Add to mapbox
    map.addControl(geolocate);

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), `top-right`);
    // Create markers
    data.markers.forEach((item, _i) => {
      if (!mapMarkersRef.current[_i] || mapMarkersRef.current[_i] == null) {
        return;
      }
      const extractUniqueLink = item.uniqueLink?.split(`/`);
      const uniqueLink = extractUniqueLink?.[extractUniqueLink.length - 1];
      const linkToAugmented = `/augmented/${uniqueLink}`;
      //set data-link on mapMarkersRef.current[_i]
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
    // listen coords
    geolocate.on(`geolocate`, (e: any) => {
      const lat = e?.coords?.latitude;
      const lng = e?.coords?.longitude;
      // change html popup content
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
            //remove spinner
            // @ts-ignore
            _marker.getElementsByClassName(`point-marker`)[0].style.animation =
              `none`;
          }
          return;
        }
        //get document by id uniqueLink
        //listne on click
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
        // @ts-ignore
        const liveMarker = _marker.getElementsByClassName(`point-marker-live`);
        if (liveMarker.length > 0) {
          //add spinner
          // @ts-ignore
          _marker.getElementsByClassName(`point-marker`)[0].style.animation =
            `bounce 1s infinite`;
        }
      });
    });
    // Clean up on unmount
    return () => map.remove();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const markers = mapContainerRef.current.querySelectorAll(
      `.mapbox__marker--live`,
    ) as unknown as HTMLDivElement[];

    markers.forEach((marker) => {
      if (showMarkerLive) {
        marker.style.visibility = `visible`;
      } else {
        marker.style.visibility = `hidden`;
      }
    });
  }, [showMarkerLive]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const markers = mapContainerRef.current.querySelectorAll(
      `.mapbox__marker--looted`,
    ) as unknown as HTMLDivElement[];

    markers.forEach((marker) => {
      if (showMarkerLooted) {
        marker.style.visibility = `visible`;
      } else {
        marker.style.visibility = `hidden`;
      }
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
          {markers.map((item, _i) =>
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
