export const getParamsFromURL = (url: string) => {
  let regex = /[?&]([^=#]+)=([^&#]*)/g,
    params: any = {},
    match;
  while ((match = regex.exec(url))) {
    params[match[1]] = match[2];
  }
  return params;
};
