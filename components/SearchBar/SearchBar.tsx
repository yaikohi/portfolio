import React, { FC } from 'react'
import styles from './SearchBar.module.css'

interface SearchBarProps {
    
}

export const SearchBar: FC<SearchBarProps> = ({ ...props }: SearchBarProps) => {
    return (
        <div className={styles.search_bar}>
            <input className={styles.search_input} placeholder="Search..."/>
        </div>
    )
}

