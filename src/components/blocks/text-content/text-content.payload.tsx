import { Page } from '@/types/payload-types';
import {
  TextContent as BlockComponent,
  ITextContent as IBlockComponent,
} from './text-content';

interface IBlockPayload {
  data: Extract<NonNullable<Page['layout']>[0], { blockType: 'text-content' }>;
  id?: string;
}

export const TextContentPayload = ({ data, id }: IBlockPayload) => {
  const dataPayload: IBlockComponent['data'] = {
    content: data.content?.html || ``,
  };

  return <BlockComponent data={dataPayload} id={id} />;
};
