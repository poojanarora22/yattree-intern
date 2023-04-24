const fetchResourceFromURI = async (uri: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

export const setFileOnServer = async (url: string, file: string) => {
  return fetch(url, {
    method: 'PUT',
    body: await fetchResourceFromURI(file),
  });
};
export const getFileFromServer = (url: string) => {
  return fetch(url, {
    method: 'GET',
  });
};
