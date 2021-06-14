import axios from "axios";
import useSWR from 'swr';

// https://stackoverflow.com/questions/62217642/react-and-typescript-which-types-for-axios-response
// https://github.com/axios/axios/blob/master/index.d.ts#L140
// https://github.com/axios/axios#example
// ApiResponse generic interface: https://www.freecodecamp.org/news/make-typescript-easy-using-basic-ts-generics/

interface ApiResponse<T> {
  errorMessage?: string;
  responseCode?: string;
  data?: T;
}

export async function getDataAsync<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const res = await axios.get(url);
    if (res.status === 200) {
      return res.data;
    }
    console.log(res.status);
  } catch (error) {
    console.log(error);
  }
}

export function getDataSync<T>(url: string) {
  axios.get<T>(url)
    .then((response) => response.data)
    .catch((error) => {
      console.error(error);
    });
}

const axiosFetcher = (url: string) => axios.get(url).then(res => res.data)

export function useSWRFetch(url: string) {
  const { data, error } = useSWR(url, axiosFetcher)

  return {
    coins: data,
    isLoading: !error && !data,
    isError: error,
  }
}