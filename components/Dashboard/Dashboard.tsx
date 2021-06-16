//  * https://github.com/renaissancetroll/reactjs-crypto-api-dashboard/blob/master/src/App.js
// * for connecting to a coinbase websocket in a react project

// using useRef hooks to update a variable without reloading the component: https://www.smashingmagazine.com/2020/11/react-useref-hook/
import { useEffect, useState, useRef } from "react";
// import io from "socket.io";

import { CoinList } from "../CoinList/CoinList";
import { CoinDetails } from "../CoinDetails/CoinDetails";
import { SearchBar } from "../SearchBar/SearchBar";
import { useSWRFetch } from "../util/fetchData";
import { formatData } from "../util/formatData";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  // Two different URLS; one for the coinbase API & one for the coinbase WSS
  const apiUrl = "https://api.pro.coinbase.com";

  const CoinGeckoApiUrl =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=ethereum%2C%20cardano%2C%20xrp%2C%20polkadot%2C%20litecoin%2C%20dash%2C%20chainlink%2C%20vechain%2C%20tron&order=market_cap_desc&per_page=100&page=1&sparkline=false";
  const wsUrl = "wss://ws-feed.pro.coinbase.com";

  // the ref 'first' will prevent the first api call
  // socket is our websocket reference 
  let first = useRef(false);
  const socket = useRef(null);

  const [currencies, setcurrencies] = useState([]);
  const [pair, setpair] = useState("");
  const [price, setprice] = useState("0.00");
  const [pastData, setpastData] = useState({});

  const { coins, isLoading, isError } = useSWRFetch(CoinGeckoApiUrl);

  useEffect(() => {
    socket.current = new WebSocket(wsUrl);
    let pairs = [];

    const fetchPairs = async () => {
      await fetch(apiUrl + '/products')
        .then((res) => res.json())
        .then((data) => (pairs = data))
        console.log(pairs);

      let filtered = pairs.filter((pair) => {
        if (pair.quote_currency === "EUR") {
          return pair;
        }
      })

      filtered = filtered.sort((a, b) => {
        if (a.base_currency < b.base_currency) {
          return -1;
        }
        if (a.base_currency > b.base_currency) {
          return 1;
        }
        return 0;
      });
      console.log(filtered)
      setcurrencies(filtered);

      first.current = true;
    }

    fetchPairs();
  }, [])

  useEffect(() => {
    if (!first.current) {
      console.log('returning to the first render');
      return;
    }
    // subscription to the coinbase websocket

    console.log('running pair change');
    let wsSubMsg = {
      type: "subscribe",
      product_ids: ["ADA-EUR", "VET-EUR"],
      channels: ["ticker"],
    };
    let jsonWsSubMsg = JSON.stringify(wsSubMsg);
    socket.current.send(jsonWsSubMsg);

    let historicalDataURL = `${apiUrl}/products/${pair}/candles?granularity=86400`;
    const fetchHistoricalData = async () => {
      let dataArr = [];
      await fetch(historicalDataURL)
        .then((res) => res.json())
        .then((data) => (dataArr = data));

      let formattedData = formatData(dataArr);
      setpastData(formattedData);
    };

    fetchHistoricalData();

    socket.current.onmessage = (e) => {
      let data = JSON.parse(e.data);
      if (data.type !== "ticker") {
        console.log('non-ticker event', e)
        return;
      }

      if (data.product_id === pair) {
        setprice(data.price);
      }
    };
  }, [pair]);

  const handleSelect = (e) => {
    let unsubMsg = {
      type: "unsubscribe",
      product_ids: [pair],
      channels: ["ticker"]
    };
    let unsub = JSON.stringify(unsubMsg);

    socket.current.send(unsub);

    setpair(e.target.value);
  };

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error... </div>;

  if (coins)
    return (
      <div className={styles.Dashboard}>
         <div className="container">
           {
             <select name="currency" value={pair} onChange={handleSelect}>
               {currencies.map((cur, idx) => {
                 return (
                   <option key={idx} value={cur.id}>
                     {cur.display_name}
                   </option>
                 );
               })}
             </select>
           }
           <CoinDetails price={price} data={pastData} />
         </div>
         
        <h2>Crypto-Dashboard</h2>
        <p>Dashboard</p>
        <SearchBar />
        <CoinList coins={coins} />
      </div>
    );
  }