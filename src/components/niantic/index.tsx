import './niantic.css';
import dynamic from 'next/dynamic';

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

const AframeDynamic = dynamic(() => import(`@/components/aframe`), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
const Index = ({ data, ...props }: IMapbox) => {
  const markers = data.markers
    .map((marker) => {
      const getLastUniqueLink = (uniqueLink: string) => {
        return uniqueLink.split(`/`).pop();
      };
      return {
        lat: marker.lat,
        lng: marker.lng,
        status: marker.status,
        id: marker?.uniqueLink
          ? getLastUniqueLink(marker?.uniqueLink)
          : Math.random().toString(36).substring(7),
        marker_3d: marker.marker_3d?.url,
      };
    })
    .filter((marker) => marker.marker_3d);
  return (
    <div {...props}>
      <AframeDynamic data={markers} />
    </div>
  );
};

export default Index;
