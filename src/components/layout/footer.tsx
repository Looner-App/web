import { getGlobal } from '@/libs/api';
import { SocialLinks } from '../SocialLinks';

export const Footer = async () => {
  const header = await getGlobal({ slug: `header` });

  return (
    <footer className="bg-black border-t mt-10">
      <div className="container py-10 flex max-lg:flex-col gap-12 max-lg:justify-center max-lg:items-center lg:justify-between">
        <div>
          &copy; {new Date().getFullYear()} {header?.logo?.title} all rights
          reserved
        </div>
        <SocialLinks />
      </div>
    </footer>
  );
};
