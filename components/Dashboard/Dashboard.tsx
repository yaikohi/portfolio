//  * https://github.com/renaissancetroll/reactjs-crypto-api-dashboard/blob/master/src/App.js
// * for connecting to a coinbase websocket in a react project

// using useRef hooks to update a variable without reloading the component: https://www.smashingmagazine.com/2020/11/react-useref-hook/
import { useEffect, useState, useRef, SyntheticEvent } from "react";
// import io from "socket.io";

import { CoinList } from "../CoinList/CoinList";
import { CoinDetails } from "../CoinChart/CoinChart";
import { SearchBar } from "../SearchBar/SearchBar";
import { useSWRFetch } from "../util/fetchData";
import { formatData } from "../util/formatData";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const CoinGeckoApiUrl =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=ethereum%2C%20cardano%2C%20xrp%2C%20polkadot%2C%20litecoin%2C%20dash%2C%20chainlink%2C%20vechain%2C%20tron&order=market_cap_desc&per_page=100&page=1&sparkline=false";

  // Two different URLS; one for the coinbase API & one for the coinbase WSS
  const apiUrl = "https://api.pro.coinbase.com";

  const wsUrl = "wss://ws-feed.pro.coinbase.com";

  // the ref 'first' will prevent the first api call
  // socket is our websocket reference
  let first = useRef(false);
  const socket = useRef(null);

  const [currencies, setcurrencies] = useState([]); // all the currencies
  const [coinId, setCoinId] = useState(""); // the coin to be selected
  const [price, setprice] = useState("0.00"); // the price of the selected coin
  const [pastData, setpastData] = useState({}); // for the initial render

  const { coins, isLoading, isError } = useSWRFetch(CoinGeckoApiUrl);

  useEffect(() => {
    socket.current = new WebSocket(wsUrl);
    let pairs = [];

    const fetchPairs = async () => {
      await fetch(apiUrl + "/products")
        .then((res) => res.json())
        .then((data) => (pairs = data));
      console.log(pairs);

      let filtered = pairs.filter((coinId) => {
        if (coinId.quote_currency === "EUR") {
          return coinId;
        }
      });

      filtered = filtered.sort((a, b) => {
        if (a.base_currency < b.base_currency) {
          return -1;
        }
        if (a.base_currency > b.base_currency) {
          return 1;
        }
        return 0;
      });
      setcurrencies(filtered);
      first.current = true;
    };
    fetchPairs();
  }, []);

  useEffect(() => {
    if (!first.current) {
      console.log("returning to the first render");
      return;
    }
    // subscription to the coinbase websocket
    let currenciesList = [];
    currencies.map((currency) => {
      currenciesList.push(currency.id);
    });

    // console.log(currenciesList)

    let wsSubMsg = {
      type: "subscribe",
      product_ids: currenciesList,
      channels: ["ticker"],
    };

    let jsonWsSubMsg = JSON.stringify(wsSubMsg);

    socket.current.send(jsonWsSubMsg);

    let historicalDataURL = `${apiUrl}/products/${coinId}/candles?granularity=86400`;
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
        console.log("non-ticker event", e);
        return;
      }

      if (data.product_id === coinId) {
        setprice(data.price);
      }
    };
  }, [coinId]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    let unsubMsg = {
      type: "unsubscribe",
      product_ids: [coinId],
      channels: ["ticker"],
    };
    let unsub = JSON.stringify(unsubMsg);

    socket.current.send(unsub);

    setCoinId(e.target.value);
  };

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error... </div>;

  if (coins)
    return (
      <div className={styles.container}>
        <div>
        {
            <select
              placeholder="Select a crypto/fiat pair..."
              name="currency"
              value={coinId}
              onChange={handleSelect}
            >
              {currencies.map((cur, idx) => {
                return (
                  <option key={idx} value={cur.id}>
                    {cur.display_name}
                  </option>
                );
              })}
            </select>
          }
        </div>
        <div>
          <CoinDetails price={price} data={pastData} />
        </div>
        <div className={styles.Dashboard}>
          <CoinList coins={coins} />
        </div>
      </div>
    );
}
