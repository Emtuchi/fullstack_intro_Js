import {useState} from "react";

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function register(ev) {
        ev.preventDefault(); // stop app from refreshing when u submit the form
        const response = await fetch('http://localhost:3001/register', { // fetch data from this url from our server
            method: 'POST',
            body: JSON.stringify({username,password}),
            headers: {'Content-Type':'application/json'},
        })
        if (response.status === 200) {
            alert('registeration successful');
        } else {
            alert('registeration failed');
        }
    }
    return (
        <form action="" className="login-Register" onSubmit={register}> {/* use the register function when form is submitted */}
            <input type="text" 
                   placeholder="username" 
                   value={username}
                   onChange={ev => setUsername(ev.target.value)}/>
            <input type="password" 
                   placeholder="password"
                   value={password}
                   onChange={ev => setPassword(ev.target.value)} />
            <button>Register</button>
        </form>
    );
}