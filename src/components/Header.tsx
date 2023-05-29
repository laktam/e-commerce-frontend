import { Navbar, Nav } from 'rsuite';
import '../styles/Header.css'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Button, InputAdornment, TextField, Typography } from '@mui/material';
import { Buffer } from 'buffer';
import { blue } from '@mui/material/colors';
import SearchIcon from '@mui/icons-material/Search';
import { BASE_URL } from '../const';
import axios from 'axios';
import { ProductDB } from '../types';

type Props = {
    isLoggedIn?: boolean;
    total?: number;
    setSearchProducts: React.Dispatch<React.SetStateAction<ProductDB[] | undefined>>;
}
// props: IsLoggedInProps
export function Header(props: Props) {
    const [isLoggedIn, setIsLoggedIn] = useState<string | null>('')
    const [total, setTotal] = useState(0)
    const [isAdmin, setIsAdmin] = useState(false)
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()
    const [searchName, setSearchName] = useState('')
    const adminButton = () => {
        navigate('/admin')
    }

    const parseJwt = (token: any) => {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    }

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('isLoggedIn'))
        setTotal(Number(localStorage.getItem('total')))
        setIsAdmin(Boolean(localStorage.getItem('isAdmin')))
        const token = localStorage.getItem('token')
        if (token !== '') {
            if (parseJwt(localStorage.getItem('token')).username === 'admin') {
                setIsAdmin(true)
            } else {
                setIsAdmin(false)
            }
        } else {
            setIsAdmin(false)
        }

    },)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        axios.get(BASE_URL + 'product/search/' + searchName)
            .then(
                (response) => {
                    console.log(response);
                    props.setSearchProducts(response.data)
                }
            ).catch(
                (err) => {
                    console.log(err);

                }
            )
        navigate('/')


    }

    const searchStyle = {
        backgroundColor: 'white',

    }

    return <div>
        <Navbar>
            <Nav appearance='tabs'>
                {/* //NavLink  instead of Link */}
                <Nav.Item as={NavLink} to='/' onClick={() => { props.setSearchProducts(undefined) }} ><Typography variant='h6'>Home</Typography></Nav.Item>
            </Nav>
            <Nav appearance='tabs' pullRight style={{ display: 'flex', alignItems: 'center' }}>
                {/* props.isLoggedIn */}
                {/* isLoggedIn === 'true' */}
                {isLoggedIn === 'true'
                    ? <>
                        {/* <Button variant="contained" onClick={adminButton} >Admin</Button> */}

                        <form onSubmit={handleSubmit} style={{ display: 'inline-block', float: 'left' }}>
                            <TextField label="Search" type="search" size='small'
                                onChange={(e) => { setSearchName(e.target.value) }}
                                value={searchName}
                                sx={searchStyle}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </form>

                        {isAdmin && <Nav.Item as={NavLink} to='/admin'><Typography variant='h6'>Admin</Typography></Nav.Item>}
                        <Nav.Item as={NavLink} to='/cart'><Typography sx={{ mr: 0.5 }} color={'red'}>{total} $</Typography><ShoppingCartIcon /></Nav.Item>
                        <Nav.Item as={NavLink} to='/logout' onClick={() => { props.setSearchProducts(undefined) }}><Typography variant='h6'>logout</Typography></Nav.Item>
                    </>
                    : <>
                        <Nav.Item as={NavLink} to='/sign-in' ><Typography variant='h6'>Sign In</Typography></Nav.Item>
                        <Nav.Item as={NavLink} to='/sign-up'><Typography variant='h6'>Sign Up</Typography></Nav.Item>
                    </>
                }
            </Nav>

        </Navbar>
        {/* <button onClick={ }>Sign Up</button>
        <button>Sign In</button> */}
    </div>
}
//  {/*<Link to="/sign-in">Sign In</Link>*/}