import { useState, useEffect } from "react";
import { CoinList } from "../CoinList/CoinList";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./Dashboard.module.css";
import { Coin as CoinT } from "../../interfaces/Coin.d";
import axios from "axios";

function Dashboard({ ...props }) {
  const [coins, setCoins] = useState([]);
  const [coinsFetched, setCoinsFetched] = useState(false);
  const [coinsFetchedError, setCoinsFetchedError] = useState(null);

  useEffect(() => {
    axios
      .get<CoinT[]>(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=ethereum%2C%20cardano%2C%20xrp%2C%20polkadot%2C%20litecoin%2C%20dash%2C%20chainlink%2C%20vechain%2C%20tron&order=market_cap_desc&per_page=100&page=1&sparkline=false"
      )
      .then((res) => res.data)
      .then(
        (result) => {
          setCoinsFetched(true);
          setCoins(result);
        },
        (error) => {
          setCoinsFetched(true);
          setCoinsFetchedError(error);
        }
      );
  }, []);

  if (coinsFetched) {
    console.log(coins);
    return (
      <div className={styles.Dashboard}>
        <h2>Crypto-Dashboard</h2>
        <p>Dashboard</p>
        <SearchBar />
        <CoinList coins={coins} />
      </div>
    );
  } else if (!coinsFetchedError) {
    return (
      <>
        <p>Error: {coinsFetchedError}</p>
      </>
    );
  } else if (!coinsFetched) {
    return (
      <>
        <h2>Loading...</h2>
      </>
    );
  }
}

// export const GetServerSideProps = async () => {
//     const res = await fetch("https://api.coingecko.com/api/v3/coins/cardano")
//     const filteredCoins = await res.json()

//     console.log(filteredCoins)

//     return {
//       props: {
//         filteredCoins
//       }
//     }
//   }

export default Dashboard;
