import Dashboard from "../components/Dashboard/Dashboard";
import { CoinDetails } from "../components/CoinDetails/CoinDetails";

import styles from "../styles/Work.module.css";

export default function Work() {
  return (
    <div>
      <h1> My work </h1>
      <div> 
        <CoinDetails />
      </div>

      <div>
        <Dashboard />
      </div>

    </div>
  );
}