import React from "react";
import { Line } from "react-chartjs-2";
import styles from "./CoinChart.module.scss";
interface CoinChartProps {
  price: any;
  data: any;
}

// TODO make a chart zoomable for possible improved readability https://www.chartjs.org/chartjs-plugin-zoom/guide/options.html
export function CoinChart({ price, data }: CoinChartProps) {
  const opts = {
    animation: {
      duration: 0,
    },
    tooltips: {
      intersect: false,
      mode: "index",
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  if (price === "0.00") {
    return <><p>Select a coin.</p> </>;
  }
  return (
    <div className={styles.container}>
      <div className={styles.price}>
        <h2>{`${price}`}</h2>
        <div className={styles.chart}>
          {/* https://stackoverflow.com/questions/67618984/react-typescript-chart-js-error-type-is-missing-in-type */}
          <Line type="line" data={data} options={opts} />
        </div>
      </div>
    </div>
  );
}
