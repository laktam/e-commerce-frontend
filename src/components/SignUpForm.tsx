import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../types";
// import TextField from "@mui/material/TextField";
// import Button from '@mui/material/Button';
import { TextField, Button } from '@mui/material';
import { BASE_URL } from "../const";



export function SignUpForm() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    // const [error, setError] = useState("");
    const [nameError, setNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');

    const navigate = useNavigate();

    const user: User = {
        name: name,
        password: password,
        email: email,
    }
    // React.FormEvent<HTMLFormElement>
    // React.MouseEvent<HTMLButtonElement>
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setNameError('')
        setPasswordError('')
        setEmailError('')

        axios.post(
            BASE_URL + 'auth/sign-up', user)
            .then((response) => {
                console.log(response.data)
                setName('')
                setEmail('')
                setPassword('')
                //redirect
                navigate('/sign-in')
            }).catch((err) => {
                let msg = '';

                for (msg of err.response.data.message) {
                    if (msg.includes('name')) {
                        setNameError(msg)
                    } if (msg.includes('password')) {
                        setPasswordError(msg)
                    } if (msg.includes('email')) {
                        setEmailError(msg)
                    }
                }
                if (err.response.data.statusCode === 409) {
                    console.log(err.response.data.statusCode)
                    setNameError(err.response.data.message)
                }
                console.log(err.response.data.message)
            })

    }

    return (
        // onSubmit={handleSubmit}
        <>
            <form onSubmit={handleSubmit} >
                <TextField
                    sx={{
                        width: 150,
                        '& > :not(style)': { marginRight: 1 }
                    }}
                    required
                    margin="dense"
                    error={nameError.length ? true : false}
                    helperText={nameError}
                    label="username" variant="outlined" value={name} onChange={e => { setName(e.target.value) }} />

                <TextField
                    sx={{
                        width: 150
                    }}
                    required
                    error={passwordError.length ? true : false}
                    helperText={passwordError}
                    id="outlined-basic2" margin="dense" label="password" variant="outlined" type="password" value={password} onChange={e => { setPassword(e.target.value) }} /><br />
                <TextField
                    sx={{
                        width: 300
                    }}
                    required
                    error={emailError.length ? true : false}
                    helperText={emailError}
                    id="outlined-basic3" margin="dense" label="email" variant="outlined" value={email} onChange={e => { setEmail(e.target.value) }} /><br />

                <Button type="submit" variant="outlined" >Sign Up</Button>
                {/* onClick={handleSubmit} */}
                {/* <Button variant="contained">Contained</Button> */}


                {/* <label>username:
                <input type='text' value={name} onChange={e => { setName(e.target.value) }} />
            </label><br />
            <label>password:
                <input type="password" value={password} onChange={e => { setPassword(e.target.value) }} />
            </label><br />
            <label>email:
                <input type='email' value={email} onChange={e => { setEmail(e.target.value) }} />
            </label><br /> */}
                {/* <input type='submit' value='Sign Up' /> */}
            </form>
        </>
    );
}