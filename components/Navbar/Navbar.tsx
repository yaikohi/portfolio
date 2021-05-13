import styles from './Navbar.module.css';

interface NavbarProps {
    links?: [],
}

export const Navbar = ({ links }: NavbarProps) => {
    return (
        <div className={styles.Navbar}>
            <h1>Navbar</h1>
            <ul>
                <li>Home</li>
                <li>About</li>
                <li>Work</li>
                <li>Experiences</li>
            </ul>
        </div>
    )
}
