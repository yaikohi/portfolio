// * https://github.com/renaissancetroll/reactjs-crypto-api-dashboard/blob/master/src/App.js
// * for connecting to a coinbase websocket in a react project

// TODO - Fix the connecting issue (send method not allowed bc websocket is still connecting)
// TODO - Configure proper dates for the chart
// TODO - Make the chart look prettier.
// TODO - Make the page work.tsx look prettier. Split the list and charts. Design UI/UX.

// using useRef hooks to update a variable without reloading the component: https://www.smashingmagazine.com/2020/11/react-useref-hook/
import { useEffect, useState, useRef } from "react";

import { CoinList } from "../CoinList/CoinList";
import { CoinChart } from "../CoinChart/CoinChart";
import { useSWRFetch } from "../util/fetchData";
import { formatChartData } from "../util/formatChartData";
import styles from "./Dashboard.module.scss";

export default function Dashboard() {
  const CoinGeckoApiUrl =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=ethereum%2C%20cardano%2C%20xrp%2C%20polkadot%2C%20litecoin%2C%20dash%2C%20chainlink%2C%20vechain%2C%20tron&order=market_cap_desc&per_page=100&page=1&sparkline=false";

  // ? Two different URLS; one for the coinbase API & one for the coinbase WSS
  const apiUrl = "https://api.pro.coinbase.com";
  const wsUrl = "wss://ws-feed.pro.coinbase.com";

  // ! the ref 'first' should prevent the first websocket call
  // ? socket is our websocket reference
  let first = useRef(false);
  const socket = useRef(null);

  const [price, setprice] = useState("0.00"); // the price of the selected coin
  const [pastData, setpastData] = useState({}); // for the initial render

  const { coins, isLoading, isError } = useSWRFetch(CoinGeckoApiUrl);

  const [coinId, setCoinId] = useState(""); // the coin to be selected
  const [currencies, setcurrencies] = useState([]); // all the currencies

  useEffect(() => {
    socket.current = new WebSocket(wsUrl);

    let pairs = [];
    const fetchPairs = async () => {
      await fetch(apiUrl + "/products")
        .then((res) => res.json())
        .then((data) => (pairs = data));
      // ? saves the currencies that have a pair with EUR
      let filtered = pairs.filter((coin) => {
        if (coin.quote_currency === "EUR") {
          return coin;
        }
      });

      // ? filters coin pairs alphabetically
      filtered = filtered.sort((firstEl, secondEl) => {
        if (firstEl.base_currency < secondEl.base_currency) {
          return -1;
        }
        if (firstEl.base_currency > secondEl.base_currency) {
          return 1;
        }
        return 0;
      });
      // ? adds the filtered coin pairs to the `currencies` state
      setcurrencies(filtered);
      first.current = true;
    };
    fetchPairs();
  }, []);

  useEffect(() => {
    if (!first.current) {
      console.log("returning to the first render");
      return;
    } else {
      // ? creates a list of currencies
      let currenciesList = [];
      currencies.map((currency) => {
        currenciesList.push(currency.id);
      });

      let wsSubMsg = JSON.stringify({
        type: "subscribe",
        product_ids: currenciesList,
        channels: ["ticker"],
      });

      socket.current.onopen = () => {
        socket.current.send(wsSubMsg);
      };

      // ? SAVING THE HISTORICAL PRICE DATA OF A COIN
      const fetchHistoricalData = async () => {
        if (coinId != null) {
          let historicalDataURL = `${apiUrl}/products/${coinId}/candles?granularity=86400`;
          let dataArr = [];
          await fetch(historicalDataURL)
            .then((res) => res.json())
            .then((data) => (dataArr = data));
          let formattedData = formatChartData(dataArr);
          setpastData(formattedData);
        } else {
          console.log(`${coinId} is empty.`);
        }
      };

      fetchHistoricalData();

      // ? WHEN WEBSOCKET RESPONDS, PARSE THE RESPONSE
      socket.current.onmessage = (messageEvent: MessageEvent) => {
        let data = JSON.parse(messageEvent.data);

        // ? Removed non-ticker messageEvents
        if (data.type !== "ticker") {
          console.log("non-ticker event, discarding...", messageEvent);
          return;
        }

        // ? Only save currencies that satisfy coinId
        if (data.product_id === coinId) {
          setprice(data.price);
        }
      };
    }
  }, [coinId]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    // let unsubMsg = {
    //   type: "unsubscribe",
    //   product_ids: [coinId],
    //   channels: ["ticker"],
    // };
    // let unsub = JSON.stringify(unsubMsg);
    // socket.current.send(unsub);
    setCoinId(e.target.value);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error... </div>;

  return (
    <div className={styles.container}>
      {
        <select
          className={styles.select}
          placeholder="Select a crypto/fiat pair..."
          name="currency"
          defaultValue={coinId}
          onChange={handleSelect}
        >
          <option defaultValue="Select a crypto-pair">
            Select a crypto-pair
          </option>
          {currencies.map((currency, id) => {
            return (
              <>
                <option key={id} value={currency.id}>
                  {currency.display_name}
                </option>
              </>
            );
          })}
        </select>
      }
      <div className={styles.Dashboard}>
        <CoinChart price={price} data={pastData} />
        {/* <CoinList coins={coins} /> */}
      </div>
    </div>
  );
}
