import styles from "./Navbar.module.scss";
import Link from "next/link";

interface NavbarProps {
  links?: [];
}

export const Navbar = ({ links }: NavbarProps) => {
  return (
    <div className={styles.Navbar}>
      <h1>v3</h1>
      <ul>
        <Link passHref href="/">
          <a>Home</a>
        </Link>
        <Link passHref href="/about">
          <a>About</a>
        </Link>
        <Link passHref href="/work">
          <a>Work</a>
        </Link>
        <Link passHref href="/contact">
          <a>Contact</a>
        </Link>
      </ul>
    </div>
  );
};
