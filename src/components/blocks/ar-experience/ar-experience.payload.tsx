import { Page } from '@/types/payload-types';
import { ArExperience } from '@/components/blocks/ar-experience/ar-experience';

interface ArExperiencePayloadProps {
  data: Extract<NonNullable<Page['layout']>[0], { blockType: 'ar-experience' }>;
  id?: string;
}

export const ArExperiencePayload = ({ id }: ArExperiencePayloadProps) => {
  return (
    <section id={id} className="block-ar-experience">
      <ArExperience />
    </section>
  );
};
