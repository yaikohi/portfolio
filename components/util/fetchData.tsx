import axios from "axios";
import { Coin as CoinT } from "../../interfaces/Coin.d";

// https://stackoverflow.com/questions/62217642/react-and-typescript-which-types-for-axios-response
// https://github.com/axios/axios/blob/master/index.d.ts#L140
// https://github.com/axios/axios#example
export async function getData(url: string) {
  try {
    const res = await axios.get<CoinT[]>(url);
    const data = res.data;
    return data;
  } catch (err) {
    console.log(err.message);
  }
}
