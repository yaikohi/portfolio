import styles from "./Navbar.module.css";
import Link from "next/link";

interface NavbarProps {
  links?: [];
}

export const Navbar = ({ links }: NavbarProps) => {
  return (
    <div className={styles.Navbar}>
      <h1>Navbar</h1>
      <ul>
        <Link passHref href="/">
          <a className={styles.link}>Home</a>
        </Link>
        <Link passHref href="/about">
          <a className={styles.link}>About</a>
        </Link>
        <Link passHref href="/work">
          <a className={styles.link}>Work</a>
        </Link>
        <Link passHref href="/contact">
          <a className={styles.link}>Contact</a>
        </Link>
      </ul>
    </div>
  );
};
