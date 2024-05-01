import { ImagePayload } from '@/components/image';
import { LinkPayload } from '@/components/link';
import { mergeStyle } from '@/libs/helper';

import { HeaderWrapper } from './header-wrapper';
import { ButtonMobileMenu } from './button-mobile-menu';
import { BackdropMobileMenu } from './backdrop-mobile-menu';
import { getGlobal } from '@/libs/api';
// import { FaInstagram, FaTiktok, FaXTwitter, FaYoutube } from 'react-icons/fa6';

export const Header = async () => {
  const header = await getGlobal({ slug: `header` });
  // const settings = await getGlobal({ slug: `settings` });

  const title = header?.logo.title;
  const logo = header?.logo.image;
  const navMenus = header?.menu.links;
  // const socialLinks = settings?.socialLinks;

  return (
    <>
      <BackdropMobileMenu />

      <HeaderWrapper className="fixed top-0 left-0 right-0 z-20 bg-black font-neometric-alt">
        <div className="container py-6 lg:py-8 flex justify-between space-x-16">
          <div>
            <LinkPayload
              href="/"
              className="uppercase italic text-3xl font-black text-white"
            >
              {logo ? (
                <ImagePayload
                  src={logo}
                  blur={false}
                  width={124}
                  height={25}
                  className="w-auto max-w-40"
                />
              ) : (
                <>{title}</>
              )}
            </LinkPayload>
          </div>
          <div className="hidden lg:flex space-x-24 items-center">
            <ul className="flex space-x-6 font-bold text-lg">
              {navMenus &&
                navMenus?.length > 0 &&
                navMenus.map((item, _i) => (
                  <li key={_i}>
                    {item.link && (
                      <LinkPayload
                        href={item.link}
                        className={mergeStyle(
                          `relative transition duration-300 before:bg-fade-white before:w-0 before:h-px before:absolute before:-bottom-1 before:left-1/2 before:-translate-x-1/2 before:transition-all before:duration-300`,
                          `before:hocustive:w-full`,
                        )}
                      />
                    )}
                  </li>
                ))}
            </ul>
            <div>
              <LinkPayload
                href={`/account`}
                className="bg-azure-blue text-white transition hocustive:bg-white hocustive:text-black rounded-lg font-semibold md:py-3 py-2 md:px-6 px-4 disabled:opacity-50 text-sm md:text-lg flex w-fit items-center space-x-2"
              >
                <span>Connect</span>
              </LinkPayload>
            </div>
          </div>
          <div className="flex items-center flex-shrink-0 lg:hidden lg:px-10">
            <ButtonMobileMenu />
          </div>
          <div className="absolute bottom-0 left-0 right-0 invisible transition-all duration-300 translate-y-full bg-black opacity-0 mobile-menu-open:visible mobile-menu-open:opacity-100">
            <div className="container relative py-7">
              <ul className="flex flex-col items-center space-y-3 uppercase font-medium text-lg text-fade-white">
                {navMenus &&
                  navMenus.length > 0 &&
                  navMenus.map((item, _i) => (
                    <li key={_i}>
                      {item.link && (
                        <LinkPayload
                          href={item.link}
                          className={mergeStyle(
                            `relative transition duration-300 before:bg-fade-white before:w-0 before:h-px before:absolute before:-bottom-1 before:left-1/2 before:-translate-x-1/2 before:transition-all before:duration-300`,
                            `before:hocustive:w-full`,
                          )}
                        />
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
        {/* <div className="container  py-6 lg:py-8 max-w-screen-xl"> */}
        {/* <div className="flex items-center justify-between lg:justify-normal lg:-mx-10">
            <div className="block lg:hidden lg:px-10" /> */}

        {/* Logo */}
        {/* <div className="flex-shrink-0 lg:px-10">
              <LinkPayload
                href="/"
                className="uppercase italic text-3xl font-black text-white"
              >
                {logo ? (
                  <ImagePayload
                    src={logo}
                    blur={false}
                    width={124}
                    height={25}
                    className="w-auto max-w-40"
                  />
                ) : (
                  <>{title}</>
                )}
              </LinkPayload>
            </div> */}

        {/* Desktop Nav Menu */}
        {/* <div className="hidden lg:flex lg:items-center lg:flex-shrink-0 lg:space-x-8 lg:px-10">
              <ul className="flex space-x-6 font-bold text-lg">
                {navMenus &&
                  navMenus?.length > 0 &&
                  navMenus.map((item, _i) => (
                    <li key={_i}>
                      {item.link && (
                        <LinkPayload
                          href={item.link}
                          className={mergeStyle(
                            `relative transition duration-300 before:bg-fade-white before:w-0 before:h-px before:absolute before:-bottom-1 before:left-1/2 before:-translate-x-1/2 before:transition-all before:duration-300`,
                            `before:hocustive:w-full`,
                          )}
                        />
                      )}
                    </li>
                  ))}
              </ul>
            </div> */}

        {/* Social Links - Desktop */}
        {/* <div className="hidden lg:flex lg:items-center lg:flex-shrink-0 lg:ml-auto lg:space-x-8 lg:px-10">
              {socialLinks && (
                <ul className="flex justify-center space-x-3 text-fade-white">
                  {socialLinks.instagram && (
                    <li>
                      <LinkPayload
                        href={socialLinks.instagram}
                        target="_blank"
                        title="Instagram"
                      >
                        <FaInstagram />
                      </LinkPayload>
                    </li>
                  )}
                  {socialLinks.twitter && (
                    <li>
                      <LinkPayload
                        href={socialLinks.twitter}
                        target="_blank"
                        title="X (Previouly Twitter)"
                      >
                        <FaXTwitter />
                      </LinkPayload>
                    </li>
                  )}
                  {socialLinks.tiktok && (
                    <li>
                      <LinkPayload
                        href={socialLinks.tiktok}
                        target="_blank"
                        title="Tiktok"
                      >
                        <FaTiktok />
                      </LinkPayload>
                    </li>
                  )}
                  {socialLinks.youtube && (
                    <li>
                      <LinkPayload
                        href={socialLinks.youtube}
                        target="_blank"
                        title="Youtube"
                      >
                        <FaYoutube />
                      </LinkPayload>
                    </li>
                  )}
                </ul>
              )}
            </div> */}

        {/* Mobile Toggle Menu */}
        {/* <div className="flex items-center flex-shrink-0 lg:hidden lg:px-10">
              <ButtonMobileMenu />
            </div> */}
        {/* </div>
        </div> */}

        {/* Mobile Nav Menu */}
        {/* <div className="absolute bottom-0 left-0 right-0 invisible transition-all duration-300 translate-y-full bg-black opacity-0 mobile-menu-open:visible mobile-menu-open:opacity-100">
          <div className="container relative py-7">
            <ul className="flex flex-col items-center space-y-3 uppercase font-medium text-lg text-fade-white">
              {navMenus &&
                navMenus.length > 0 &&
                navMenus.map((item, _i) => (
                  <li key={_i}>
                    {item.link && (
                      <LinkPayload
                        href={item.link}
                        className={mergeStyle(
                          `relative transition duration-300 before:bg-fade-white before:w-0 before:h-px before:absolute before:-bottom-1 before:left-1/2 before:-translate-x-1/2 before:transition-all before:duration-300`,
                          `before:hocustive:w-full`,
                        )}
                      />
                    )}
                  </li>
                ))}
            </ul>

            {/* Social Links - Mobile */}
        {/* <ul className="flex justify-center space-x-3 text-lg mt-5 pt-5 border-t text-fade-white">
              {socialLinks?.instagram && (
                <li>
                  <LinkPayload
                    href={socialLinks.instagram}
                    target="_blank"
                    title="Instagram"
                  >
                    <FaInstagram />
                  </LinkPayload>
                </li>
              )}
              {socialLinks?.twitter && (
                <li>
                  <LinkPayload
                    href={socialLinks.twitter}
                    target="_blank"
                    title="X (Previouly Twitter)"
                  >
                    <FaXTwitter />
                  </LinkPayload>
                </li>
              )}
              {socialLinks?.tiktok && (
                <li>
                  <LinkPayload
                    href={socialLinks.tiktok}
                    target="_blank"
                    title="Tiktok"
                  >
                    <FaTiktok />
                  </LinkPayload>
                </li>
              )}
              {socialLinks?.youtube && (
                <li>
                  <LinkPayload
                    href={socialLinks.youtube}
                    target="_blank"
                    title="Youtube"
                  >
                    <FaYoutube />
                  </LinkPayload>
                </li>
              )}
            </ul> */}
        {/* </div>
        </div>  */}
      </HeaderWrapper>
    </>
  );
};
