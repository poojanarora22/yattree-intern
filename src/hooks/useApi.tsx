import axios, {AxiosRequestConfig, Method} from 'axios';
import {useCallback, useState} from 'react';
import {BASE_URL} from '../constants/URLS';
import {getTokens, getVerifiedToken} from '../utilities/token';
import useCleanUp from './useCleanUp';

type useApiType = {
  url?: string | null;
  method: Method;
  payload?: any;
  isSecureEntry?: boolean;
  isCustomURL?: boolean;
};

export const useApi = ({
  url,
  method,
  payload = null,
  isSecureEntry = true,
  isCustomURL = false,
}: useApiType): [any, any, any, boolean] => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logoutUser] = useCleanUp();

  const getUrl = useCallback(
    (customURL: string | null = '') => {
      if (isCustomURL) {
        return `${BASE_URL}${customURL}`;
      } else {
        return `${BASE_URL}${url}`;
      }
    },
    [url],
  );

  const getAxiosConfig = useCallback(
    async (customPayload?: any, customURL?: string | null, headers?: any) => {
      const axiosConfig: AxiosRequestConfig = {
        url: getUrl(customURL || ''),
        method,
      };

      if (customPayload) {
        axiosConfig.data = customPayload;
      }

      axiosConfig.headers = {
        Accept: '*/*',
        'Content-Type': 'multipart/form-data',
        'x-client-id': '2a4ryDvb8ZZ3C3D2',
      };

      if (isSecureEntry) {
        const tokens = await getTokens();
        const newTokens = await getVerifiedToken(tokens);
        if (newTokens) {
          axiosConfig.headers = {
            ...axiosConfig.headers,
            'x-auth-token': newTokens?.accessToken,
          };
        } else {
          logoutUser();
        }
      }

      if (headers) {
        axiosConfig.headers = {...axiosConfig.headers, ...headers};
      }

      return axiosConfig;
    },
    [method, url, isSecureEntry, payload],
  );

  const apiCall = useCallback(
    async (
      customPayload = payload,
      customURL?: string | null,
      headers?: any,
    ) => {
      setLoading(true);
      axios(await getAxiosConfig(customPayload, customURL, headers))
        .then(res => {
          console.log('API url : ', url);
          console.log('API payload : ', customPayload);
          console.log('API response', res.data);
          setResponse(res.data);
        })
        .catch(err => {
          console.log('API url : ', url);
          console.log('API payload : ', customPayload);
          console.log('API error : ', err.response);
          setError(err.response.data);
          if (err?.response?.data?.statusCode === 401) {
            logoutUser();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getAxiosConfig, payload, url],
  );

  return [apiCall, response, error, loading];
};
