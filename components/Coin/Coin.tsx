import { Coin as CoinProps } from '../../interfaces/Coin.d'
import styles from './Coin.module.css'

export const Coin = ({
    name, 
    symbol, 
    current_price,
    market_cap,
    total_volume, 
}: CoinProps) => {
    return (
        <div className={styles.coin}>
            <div className={styles.title}>
                <h1>{name}</h1>
                <p><i>{symbol}</i></p>
            </div>
            <ul className={styles.list}>
                <li>Price: {current_price} eur</li>
                <li>Marketcap: {market_cap}</li>
                <li>Volume: {total_volume}</li>
            </ul>
        </div>
    )
}
