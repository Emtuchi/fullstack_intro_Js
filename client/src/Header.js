import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./usercontext";

export default function Header() {
    // Destructure setUserInfo and userInfo from UserContext to access user data
    const { setUserInfo, userInfo } = useContext(UserContext);

    // useEffect hook to fetch the current user profile when the component mounts
    // The fetch request includes credentials (cookies) to identify the user
    useEffect(() => {
        fetch('http://localhost:3001/profile', {
            credentials: 'include', // Include cookies in the request
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo); // Update the context with the fetched user info
            });
        });
    }, []); // Empty dependency array means this effect runs once when the component mounts
    
    function logout() {
        fetch('http://localhost:3001/logout', {
            credentials: 'include',
            method: 'POST',
        });
        setUserInfo(null); //clear what is in userInfo by making it null, token will also be cleared in our backend
    }

    const username = userInfo?.username; // set username to be the value of the username in userInfo if it exists

    return (
        <header className="color_header">
            <Link to="/MyStories" className="rm-line">MyStories</Link>
            <nav>
                {username && (
                    <>
                      <Link to="/create">Create new post</Link>
                      <a href='/' onClick={logout}>Logout</a>
                    </>
                )}
                {!username && (
                    <>
                      <Link to="/login">Login</Link>
                      <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    )
}