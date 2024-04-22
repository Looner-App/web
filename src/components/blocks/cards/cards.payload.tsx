import { Page } from '@/types/payload-types';
import { Cards } from './cards';

interface CardsPayloadProps {
  data: Extract<NonNullable<Page['layout']>[0], { blockType: 'cards' }>;
  id?: string;
}

export const CardsPayload = ({ data, id }: CardsPayloadProps) => {
  return <Cards data={data} id={id} />;
};
