import { Link } from "react-router-dom";

export default function Footer() {
    return ( 
        <footer>
            <nav>
                <Link to="/About">About</Link>
                <Link to="/Help">Help</Link>
                <Link to="/Terms">Terms</Link>
                <Link to="/Privacy">Privacy</Link>
            </nav>
        </footer>
    )
}
