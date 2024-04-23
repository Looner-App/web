import { Page } from '@/types/payload-types';
import { Cards } from './cards';

interface CardsPayloadProps {
  data: Extract<NonNullable<Page['layout']>[0], { blockType: 'cards' }>;
  id?: string;
}

export const CardsPayload = ({ data, id }: CardsPayloadProps) => {
  const dataPayload = {
    title: data.title?.html || undefined,
    description: data.description?.html || undefined,
    cardsList: data.cardsList,
  };
  return <Cards data={dataPayload} id={id} />;
};
