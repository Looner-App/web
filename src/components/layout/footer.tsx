import { FaInstagram, FaTiktok, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { getGlobal } from '@/libs/api';
import { LinkPayload } from '@/components/link';

export const Footer = async () => {
  const settings = await getGlobal({ slug: `settings` });
  const socialLinks = settings?.socialLinks;
  const header = await getGlobal({ slug: `header` });

  return (
    <footer className="bg-jet-black border-t mt-10">
      <div className="container py-10 flex space-x-12 justify-between">
        <div>
          &copy; {new Date().getFullYear()} {header?.logo?.title} all rights
          reserved
        </div>
        {socialLinks && (
          <ul className="flex justify-center space-x-8 text-2xl">
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
      </div>
    </footer>
  );
};
