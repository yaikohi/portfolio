import React, { useRef } from "react";
import { Line } from "react-chartjs-2";
import styles from "./CoinChart.module.css";
interface CoinChartProps {
  price: any;
  data: any;
}
export function CoinChart({ price, data }: CoinChartProps) {
  const opts = {
    animation: {
      duration: 0
    },
    tooltips: {
      intersect: false,
      mode: "index",
    },
    responsive: true,
    maintainAspectRatio: false,
    options: {
      transitions: {
        plugins: {
          title: {
            display: true,
            text: "Cryptic graph",
          },
        },
      },
    },
  };
  if (price === "0.00") {
    return <p>please select a currency pair</p>;
  }
  return (
    <div className={styles.CoinChart__container}>
      <div className={styles.CoinChart__price}>
        <h2>{`${price}`}</h2>
        <div className={styles.CoinChart__chart}>
          {/* https://stackoverflow.com/questions/67618984/react-typescript-chart-js-error-type-is-missing-in-type */}
          <Line type="line" data={data} options={opts} />
        </div>
      </div>
    </div>
  );
}
