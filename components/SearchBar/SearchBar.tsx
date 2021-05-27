import React from 'react'
import styles from './SearchBar.module.css'

interface SearchBarProps {
    
}

const SearchBar = (props: SearchBarProps) => {
    return (
        <div className={styles.search_bar}>
            <input className={styles.search_input} placeholder="Search..."/>
        </div>
    )
}

export default SearchBar
