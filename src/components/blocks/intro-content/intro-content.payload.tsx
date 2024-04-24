import { Page } from '@/types/payload-types';
import {
  IntroContent as BlockComponent,
  IIntroContent as IBlockComponent,
} from './intro-content';

interface IBlockPayload {
  data: Extract<NonNullable<Page['layout']>[0], { blockType: 'intro-content' }>;
  id?: string;
}

export const IntroContentPayload = ({ data, id }: IBlockPayload) => {
  const dataPayload: IBlockComponent['data'] = {
    title: data.title?.html || undefined,
    desc: data.desc?.html || undefined,
    link: data.links && data.links.length > 0 ? data.links[0].link : undefined,
    image: data.image || undefined,
    imageCaption:
      data.image && typeof data.image === `object` && data.image.caption?.html
        ? data.image.caption.html
        : undefined,
    imagePosition: data.imagePosition || undefined,
    displayIcon:
      data.links && data.links.length > 0
        ? data.links[0].link.displayIcon
        : false,
    icon:
      data.links && data.links.length > 0 ? data.links[0].link.icon : undefined,
    iconPosition:
      data.links && data.links.length > 0
        ? data.links[0].link.iconPosition
        : undefined,
  };

  return <BlockComponent data={dataPayload} id={id} />;
};
