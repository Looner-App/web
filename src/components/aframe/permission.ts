'use client';
import { useState } from 'react';

const usePermission = () => {
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
      requestPermission();
    } else {
      // @ts-ignore
      if (typeof DeviceMotionEvent === `undefined`) {
        // @ts-ignore
        DeviceMotionEvent.requestPermission()
          .then((response: any) => {
            if (response == `granted`) {
              requestPermission();
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

  return { permission, motionSensor };
};

export default usePermission;
