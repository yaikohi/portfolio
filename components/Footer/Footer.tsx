import styles from "./Footer.module.css";
import Link from "next/link";

interface FooterProps {
  content?: [];
}

export const Footer = ({ content }: FooterProps) => {
  return (
    <div className={styles.Footer}>
      <p>Erik Beem 2021 All Rights Reserved</p>
      <Link href="/">
        <a>Privacy policy</a>
      </Link>
      <Link href="/">
        <a>Sitemap</a>
      </Link>
    </div>
  );
};
