'use client';
import { useEffect, useState } from 'react';

const usePermission = () => {
  const [geoPermission, setGeoPermission] = useState<{
    geo: boolean;
  }>({
    geo: false,
  });
  const [permission, setPermission] = useState<{
    camera: boolean;
  }>({
    camera: false,
  });

  const onGranted = () => {
    setPermission({ camera: true });
  };

  const onDenied = () => {
    setPermission({ camera: false });
  };

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      onGranted();
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      if (
        // @ts-ignore
        error?.name === `NotAllowedError` ||
        // @ts-ignore
        error?.name === `PermissionDeniedError`
      ) {
        onDenied();
      } else {
        onDenied();
      }
    }
  };
  const motionSensor = () => {
    if (navigator.userAgent.toLowerCase().includes(`android`)) {
      console.log(`android`);
    } else {
      // @ts-ignore
      if (typeof DeviceMotionEvent === `undefined`) {
        // @ts-ignore
        DeviceMotionEvent.requestPermission()
          .then((response: any) => {
            if (response == `granted`) {
              console.log(`granted`);
            }
          })
          .catch(() => {
            onDenied();
          });
      } else {
        requestPermission();
      }
    }
  };

  const getGeoPermission = () => {
    if (navigator.geolocation) {
      setTimeout(() => {
        navigator.geolocation.getCurrentPosition(
          () => {
            setGeoPermission({ geo: true });
            motionSensor();
          },
          () => {
            setGeoPermission({ geo: false });
          },
        );
      }, 5000);
    }
  };

  useEffect(() => {
    getGeoPermission();
  }, []);
  return { permission, motionSensor, geoPermission };
};

export default usePermission;
