import { Page } from '@/types/payload-types';

import { IntroContentPayload } from './intro-content';
import { MapItemsPayload } from './map-items';
import { TextContentPayload } from './text-content';

import { CardsPayload } from './cards';
import { RoadmapPayload } from './roadmap';

const blockComponents = {
  'intro-content': IntroContentPayload,
  'map-items': MapItemsPayload,
  'text-content': TextContentPayload,
  cards: CardsPayload,
  roadmap: RoadmapPayload,
};

export const Blocks: React.FC<{
  blocks: Page['layout'];
}> = ({ blocks }) => {
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  return (
    <div className="flex flex-col gap-52">
      {hasBlocks &&
        blocks.map((block, _i) => {
          const { sectionID, blockType } = block;

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType];

            return (
              <Block
                key={`block-${_i}`}
                // @ts-expect-error: perbaiki aku
                data={block}
                id={sectionID || undefined}
              />
            );
          } else {
            // Block undefined
            return (
              <section key={`block-${_i}`} className="block-undefined">
                <p className="py-10 text-center border">
                  Block <b>{blockType}</b> undefined
                </p>
              </section>
            );
          }
        })}
    </div>
  );
};
