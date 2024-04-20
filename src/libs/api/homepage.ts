import { getGlobal } from './get-global';

export const getHomepageSlug = async () => {
  let homepageSlug = `homepage`;

  const settings = await getGlobal({ slug: `settings` });

  if (
    settings &&
    settings.homePage &&
    typeof settings.homePage === `object` &&
    settings.homePage.slug
  ) {
    homepageSlug = settings.homePage.slug;
  }

  return homepageSlug;
};
