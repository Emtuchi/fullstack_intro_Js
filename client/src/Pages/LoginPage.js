import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../usercontext"; //import a custom made hook

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext); //use usecontext function to make "usercontext" a custom made hook 

    async function login(ev) {
        ev.preventDefault();
        const response = await fetch('http://localhost:3001/login', { // make a request to this url, the url exist in our backend
           method: 'POST',
           body: JSON.stringify({username, password}),
           headers: {'Content-Type': 'application/json'},
           credentials: 'include',
        });
        if (response.ok) {
            response.json().then(userInfo => { //userinfo is the value of the response sent to our app after we login through the /login api, 
                //we set it to be username and id in the backend
                setUserInfo(userInfo);
                setRedirect(true); // change redirect parameter that was created by useState to "true" when request is successful
            })
        } else {
            alert('wrong credentials');
        }
    }

    if (redirect) {
        return <Navigate to={'/MyStories'} /> //if "redirect" is changed to true, navigate to /MyStories
    }

    return (
        <form action="" className="login-Register" onSubmit={login}>
            <input type="text" 
                   placeholder="username"
                   value={username}
                   onChange={ev => setUsername(ev.target.value)} />
            <input type="password" 
                   placeholder="password"
                   value={password}
                   onChange={ev => setPassword(ev.target.value)} />
            <button>Login</button>
        </form>
    );
}