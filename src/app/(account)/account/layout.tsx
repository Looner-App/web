import { getUser } from '@/libs/api';
import { Image } from '@/components/image';
import { ButtonLogout } from './button-logout';
import { MenuItem } from './menu-item';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const userID = Number(user?.id);
  const name = String(user?.name);
  const country = user?.country || `-`;

  const menuItems = [
    {
      href: `/account`,
      label: `Items`,
      segment: null,
    },
    {
      href: `/account/settings`,
      label: `Setting`,
      segment: `settings`,
    },
  ];

  return (
    <div className="container overflow-hidden py-5">
      <div className="space-y-5 md:space-y-0 md:flex md:space-x-5 lg:space-x-10">
        <div className="bg-jet-black rounded-md p-8 md:flex-shrink h-fit border">
          <div className="flex md:flex-col space-x-5 md:space-x-0 md:space-y-8">
            <div>
              <Image
                src={`https://robohash.org/${userID}`}
                alt={name}
                width={180}
                height={180}
                className="rounded-full overflow-hidden max-w-[70px] md:max-w-none mx-auto"
                priority
              />
              <a
                href="https://robohash.org"
                target="_blank"
                className="block text-center mt-3 text-[8px] md:text-[10px]"
              >
                © Robohash.org
              </a>
            </div>

            <div className="flex flex-col md:space-y-2">
              <div className="text-lg">
                Hello, <span className="font-black">{name}</span>
              </div>
              <div className="text-sm">{country}</div>
            </div>
          </div>

          <div className="mt-6">
            <ButtonLogout className="w-full text-xs border border-white text-white transition duration-300 hocustive:bg-white hocustive:text-jet-black uppercase font-medium rounded px-4 py-2" />
          </div>
        </div>

        <div className="md:flex-grow space-y-5 flex flex-col overflow-x-hidden">
          <div className="bg-jet-black rounded-md flex-shrink-0 px-5 py-2 border">
            <div className="overflow-x-auto py-2">
              <ul className="flex space-x-5 uppercase text-sm font-bold w-full">
                {menuItems.map((item, _i) => (
                  <MenuItem key={_i} href={item.href} segment={item.segment}>
                    {item.label}
                  </MenuItem>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-jet-black rounded-md p-8 flex-grow border">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
