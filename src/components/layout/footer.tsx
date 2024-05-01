import { getGlobal } from '@/libs/api';
import { SocialLinks } from '../SocialLinks';

export const Footer = async () => {
  const header = await getGlobal({ slug: `header` });

  return (
    <footer className="bg-black lg:border-t mt-10">
      <div className="lg:container py-10 flex max-lg:flex-col gap-6 lg:gap-12 max-lg:justify-center max-lg:items-center lg:justify-between">
        <div className="order-1 lg:order-0 max-lg:border-t max-lg:w-full max-lg:text-center max-lg:pt-6">
          &copy; {new Date().getFullYear()} {header?.logo?.title} all rights
          reserved
        </div>
        <div className="order-0 lg:order-1">
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
};
