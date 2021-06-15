import { CoinList } from "../CoinList/CoinList";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./Dashboard.module.css";

import { useSWRFetch } from "../util/fetchData";
import { useSocket } from "../useSocket/useSocket";

function Dashboard() {
  const { coins, isLoading, isError } = useSWRFetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=ethereum%2C%20cardano%2C%20xrp%2C%20polkadot%2C%20litecoin%2C%20dash%2C%20chainlink%2C%20vechain%2C%20tron&order=market_cap_desc&per_page=100&page=1&sparkline=false"
  );
  const socket = useSocket({
    wsUrl: "wss://ws-feed.pro.coinbase.com",
    eventName: "jo",
    callback: 0,
  });
  
  // subscription to the coinbase websocket
  const wsSub = {
    type: "subscribe",
    product_ids: ["ADA-EUR", "VET-EUR"],
    channels: ["ticker"],
  };
  
  socket.send(wsSub);
  
  // socket.onmessage = (e: Event) => {
  //   let data;
  //   if (data.type !== "ticker") {
  //     return;
  //   } 
  //   if (data.product_id === pair) {
  //     setprice(data.price);
  //   }
  // };

  // unsubscribe message to stop the coinbase ws stream
  const wsUnSub = {
    type: "unsubscribe",
    product_ids: ["ADA-EUR", "VET-EUR"],
    channels: ["ticker"],
  };



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
