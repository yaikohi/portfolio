// * https://github.com/renaissancetroll/reactjs-crypto-api-dashboard/blob/master/src/App.js
// * for connecting to a coinbase websocket in a react project

// using useRef hooks to update a variable without reloading the component: https://www.smashingmagazine.com/2020/11/react-useref-hook/
import { useEffect, useState, useRef } from "react";
import io from "socket.io";

import { CoinList } from "../CoinList/CoinList";
import { SearchBar } from "../SearchBar/SearchBar";
import { useSWRFetch } from "../util/fetchData";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const apiUrl =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=ethereum%2C%20cardano%2C%20xrp%2C%20polkadot%2C%20litecoin%2C%20dash%2C%20chainlink%2C%20vechain%2C%20tron&order=market_cap_desc&per_page=100&page=1&sparkline=false";
  const wsUrl = "wss://ws-feed.pro.coinbase.com";

  const socket = useRef(null);

  const { coins, isLoading, isError } = useSWRFetch(apiUrl);

  useEffect(() => {
    socket.current = io.on(wsUrl, (socket) => {
      console.log(socket);
    });
  }, []);

  useEffect(() => {
    // subscription to the coinbase websocket
    const wsSubMsg = {
      type: "subscribe",
      product_ids: ["ADA-EUR", "VET-EUR"],
      channels: ["ticker"],
    };

    socket.current.send(wsSubMsg);
    socket.current.onmessage((event: Event) => {
      console.log(event);
    });

    let wsUnsubMsg = {
      type: "unsubscribe",
      product_ids: ["ADA-EUR", "VET-EUR"],
      channels: ["ticker"]
    };
    socket.current.send(wsUnsubMsg);


  }, []);

  if (isLoading) return <div>Loading</div>;

  if (isError) return <div>Error {isError} </div>;

  if (coins)
    return (
      <div className={styles.Dashboard}>
        <h2>Crypto-Dashboard</h2>
        <p>Dashboard</p>
        <SearchBar />
        <CoinList coins={coins} />
      </div>
    );
}

export default Dashboard;
