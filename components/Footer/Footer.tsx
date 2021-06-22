import styles from "./Footer.module.scss";
import Link from "next/link";

interface FooterProps {
  content?: [];
}

export const Footer = ({ ...props }: FooterProps) => {
  return (
    <div className={styles.Footer}>
      <p>omg me</p>
      <Link href="/">
        <a>Privacy policy</a>
      </Link>
      <Link href="/">
        <a>Sitemap</a>
      </Link>
    </div>
  );
};
