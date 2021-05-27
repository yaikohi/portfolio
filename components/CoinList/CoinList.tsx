import { Coin } from "../Coin/Coin";
import { Coin as CoinT } from "../../interfaces/Coin.d";
import styles from "./CoinList.module.css";

interface CoinListProps {
  coins?: Array<CoinT>;
}

export const CoinList = ({ coins }: CoinListProps) => {
  return (
    <div className={styles.Coinlist}>
      {coins.map((coin) => {
        return (
          <Coin
            name={coin.name}
            symbol={coin.symbol}
            current_price={coin.current_price}
            market_cap={coin.market_cap}
            total_volume={coin.total_volume}
          />
        );
      })}
    </div>
  );
};
