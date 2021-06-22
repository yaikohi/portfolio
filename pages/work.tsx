import styles from '../styles/Work.module.scss'
import Dashboard from "../components/Dashboard/Dashboard";

export default function Work() {
  return (
    <div>
      <h1> Work </h1>
      <div className={styles.items}>
        <Dashboard />
      </div>
    </div>
  );
}
