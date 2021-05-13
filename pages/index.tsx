import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { Navbar } from '../components/Navbar/Navbar'

export default function Index() {
  return (
  <div>
      <h1> Welcome to my Portfolio v3 </h1>
      <Navbar />
  </div>
  )
}
