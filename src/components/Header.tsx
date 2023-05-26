import { Navbar, Nav } from 'rsuite';
import '../styles/Header.css'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Button, Typography } from '@mui/material';
import { Buffer } from 'buffer';
import { blue } from '@mui/material/colors';


type Props = {
    isLoggedIn?: boolean;
    total?: number;
}
// props: IsLoggedInProps
export function Header(props: Props) {
    const [isLoggedIn, setIsLoggedIn] = useState<string | null>('')
    const [total, setTotal] = useState(0)
    const [isAdmin, setIsAdmin] = useState(false)
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()

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

    return <div>
        <Navbar>
            <Nav>
                {/* //NavLink  instead of Link */}
                <Nav.Item as={NavLink} to='/'>Home</Nav.Item>
            </Nav>
            <Nav pullRight>
                {/* props.isLoggedIn */}
                {/* isLoggedIn === 'true' */}
                {isLoggedIn === 'true'
                    ? <>
                        {/* <Button variant="contained" onClick={adminButton} >Admin</Button> */}
                        {isAdmin && <Nav.Item as={NavLink} to='/admin'>Admin</Nav.Item>}
                        <Nav.Item as={NavLink} to='/cart'><Typography sx={{ mr: 0.5 }} color={'red'}>{total} $</Typography><ShoppingCartIcon /></Nav.Item>
                        <Nav.Item as={NavLink} to='/logout'>logout</Nav.Item>
                    </>
                    : <>
                        <Nav.Item as={NavLink} to='/sign-in'>Sign In</Nav.Item>
                        <Nav.Item as={NavLink} to='/sign-up'>Sign up</Nav.Item>
                    </>
                }
            </Nav>

        </Navbar>
        {/* <button onClick={ }>Sign Up</button>
        <button>Sign In</button> */}
    </div>
}
//  {/*<Link to="/sign-in">Sign In</Link>*/}