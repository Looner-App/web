import { Page } from '@/types/payload-types';
import { Roadmap } from './roadmap';

interface RoadmapPayloadProps {
  data: Extract<NonNullable<Page['layout']>[0], { blockType: 'roadmap' }>;
  id?: string;
}

export const RoadmapPayload = ({ data, id }: RoadmapPayloadProps) => {
  const dataPayload = {
    image: data.image,
    imageMobile: data.imageMobile,
  };
  return <Roadmap data={dataPayload} id={id} />;
};
