export const proxyUrl = (url: string) => {
  return `${process.env.NEXT_PUBLIC_SITE_URL}/api/media/${url}`;
};
