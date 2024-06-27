export const removeTrailingSlash = (text: string) => {
  // Remove first trailing slash
  text = text.replace(/^\/+/g, ``);

  // Remove end trailing slash
  text = text.replace(/^\/|\/$/g, ``);

  return text;
};

export const nl2br = (text: string) => {
  return text.replace(/(?:\r\n|\r|\n)/g, `<br/>`);
};

export const toEllipsis = (address?: string, head = 6, tail = 4) => {
  if (!address) return ``;
  return [
    address.slice(0, head),
    `...`,
    tail > 0 ? address.slice(-tail) : ``,
  ].join(``);
};
