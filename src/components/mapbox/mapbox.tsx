'use client';

import { Switch } from '@headlessui/react';
import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import mapboxgl, { MarkerOptions } from 'mapbox-gl';
import { harversine, mergeStyle } from '@/libs/helper';

import 'mapbox-gl/dist/mapbox-gl.css';
import './mapbox.css';

mapboxgl.accessToken = String(process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

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
  const { markers, initZoom = 10 } = data;
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
                    ? `<div class='w-full'><a href="${item.uniqueLink}" class="mt-4 justify-center bg-azure-blue text-white transition hocustive:bg-azure-blue/20 hocustive:text-black rounded-lg font-semibold py-3 px-6  disabled:opacity-50 text-lg flex w-full items-center space-x-2">Claim</a></div>`
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
        if (isNear) {
          _marker
            .getElementsByClassName(`pulse-marker`)[0]
            .classList.add(`bg-green-500`);
          _marker
            .getElementsByClassName(`point-marker`)[0]
            .classList.add(`bg-green-500`);
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
      </div>

      <div className="hidden">
        {markers.map((item, _i) =>
          item.status === `looted` ? (
            <div
              key={_i}
              ref={(e) => e && (mapMarkersRef.current[_i] = e)}
              className={`mapbox__marker--looted relative flex items-center justify-center h-[10px] w-[10px]`}
            >
              <span className="relative inline-flex rounded-full h-2/3 w-2/3 bg-fade-red" />
            </div>
          ) : (
            <div
              key={_i}
              ref={(e) => e && (mapMarkersRef.current[_i] = e)}
              className={`mapbox__marker--live relative flex items-center justify-center h-[14px] w-[14px]`}
            >
              <span className="pulse-marker animate-ping absolute inline-flex h-full w-full rounded-full bg-bright-blue opacity-50" />
              <span className="point-marker relative inline-flex rounded-full h-2/3 w-2/3 bg-bright-blue" />
            </div>
          ),
        )}
      </div>
    </div>
  );
};
