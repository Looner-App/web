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
