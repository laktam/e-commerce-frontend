import { Alert, Button, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { BASE_URL } from "../const";


type SetterProps = {
    userIdSetter: React.Dispatch<React.SetStateAction<number>>;
    tokenSetter: React.Dispatch<React.SetStateAction<string>>;
    cartIdSetter: React.Dispatch<React.SetStateAction<number>>;
    isLoggedInSetter: React.Dispatch<React.SetStateAction<boolean>>;
    // setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SignInForm(props: SetterProps) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [nameError, setNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState(false)
    const navigate = useNavigate();


    const loginUser = {
        name: name,
        password: password,
    }


    // React.FormEvent<HTMLFormElement>
    // React.MouseEvent<HTMLButtonElement>
    async function checkSignIn(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoginError(false)
        try {
            // getting the token
            let response = await axios.post(BASE_URL + 'auth/login', loginUser)
            const token = response.data.access_token;

            //
            localStorage.setItem('token', token)
            localStorage.setItem('isLoggedIn', 'true')


            //send token to App component
            props.tokenSetter(token)

            setName('')
            setPassword('')

            // getting the id
            response = await axios.get(
                BASE_URL + 'auth/profile',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            const userId = response.data.sub;
            //test if admin
            if (userId === 1) {
                localStorage.setItem('isAdmin', 'true')
                // props.setIsAdmin(true)
            } else {
                localStorage.setItem('isAdmin', '')
            }
            props.userIdSetter(userId);
            //getting user cart
            response = await axios.get(BASE_URL + 'user/cart/' + userId
                , {
                    headers: { Authorization: `Bearer ${token}` }
                })

            const cartId = response.data
            console.log(cartId)

            //sending cart id to App component
            props.cartIdSetter(cartId)
            localStorage.setItem('cartId', cartId.toString())
            localStorage.setItem('userId', userId.toString())

            response = await axios.put(BASE_URL + 'user/addCart/',
                {
                    cartId: cartId,
                    userId: userId
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            //total
            response = await axios.get(BASE_URL + 'user/total/' + userId,
                {
                    headers: { Authorization: `Bearer ${token}` }
                })

            localStorage.setItem('total', response.data.toString())

            //change sign in link to logout
            navigate('/')
        } catch (error: any) {
            setLoginError(true)
            // console.log(error);

            // let msg: string;
            // for (msg of error.response.data.message) {
            //     if (msg.includes('name')) {
            //         setNameError(msg)
            //     } if (msg.includes('password')) {
            //         setPasswordError(msg)
            //     }
            // }
        }
    }

    return (
        <>


            <form onSubmit={checkSignIn}>
                <TextField
                    required
                    error={loginError}
                    helperText={nameError}
                    margin="dense" label="username" variant="outlined" type="text" value={name} onChange={e => { setName(e.target.value) }} /><br />

                <TextField
                    required
                    error={loginError}
                    helperText={passwordError}
                    margin="dense" label="password" variant="outlined" type="password" value={password} onChange={e => { setPassword(e.target.value) }} /><br />

                <Button type='submit' variant="outlined" >Sign In</Button>

                {loginError && <Alert severity="error" sx={{ mt: 2 }}>wrong login</Alert>}



                {/* <label>username:
                <input type='text' value={name} onChange={e => { setName(e.target.value) }} />
            </label><br />

            <label>password:
                <input type="password" value={password} onChange={e => { setPassword(e.target.value) }} />
            </label><br /> */}
                {/* <input type="submit" value='Sign In' onClick={checkSignIn} /> */}
            </form >
        </>
    );

}

//try {
            // getting the token
        //     let response = await axios.post(BASE_URL + 'auth/login', loginUser)
        //     const token = response.data.access_token;

        //     //
        //     localStorage.setItem('token', token)
        //     localStorage.setItem('isLoggedIn', 'true')


        //     //send token to App component
        //     props.tokenSetter(token)

        //     setName('')
        //     setPassword('')

        //     // getting the id
        //     response = await axios.get(
        //         BASE_URL + 'auth/profile',
        //         {
        //             headers: { Authorization: `Bearer ${token}` }
        //         }
        //     )
        //     const userId = response.data.sub;
        //     props.userIdSetter(userId);

        //     //creating cart
        //     response = await axios.post(BASE_URL + 'cart/create', {}, {
        //         headers: { Authorization: `Bearer ${token}` }
        //     }
        //     )

        //     const cartId = response.data.id
        //     //sending cart id to App component
        //     props.cartIdSetter(cartId)
        //     localStorage.setItem('cartId', cartId.toString())
        //     localStorage.setItem('userId', userId.toString())

        //     response = await axios.put(BASE_URL + 'user/addCart',
        //         {
        //             cartId: cartId,
        //             userId: userId
        //         },
        //         {
        //             headers: { Authorization: `Bearer ${token}` }
        //         }
        //     )

        //     //change sign in link to logout
        //     navigate('/')
        // } catch (error: any) {
        //     setLoginError(true)
        //     // console.log(error);

        //     // let msg: string;
        //     // for (msg of error.response.data.message) {
        //     //     if (msg.includes('name')) {
        //     //         setNameError(msg)
        //     //     } if (msg.includes('password')) {
        //     //         setPasswordError(msg)
        //     //     }
        //     // }
        // }