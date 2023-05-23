import { Navbar, Nav } from 'rsuite';
import '../styles/Header.css'
import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Typography } from '@mui/material';

type Props = {
    isLoggedIn?: boolean;
    total?: number;
}
// props: IsLoggedInProps
export function Header(props: Props) {
    const [isLoggedIn, setIsLoggedIn] = useState<string | null>('')
    const [total, setTotal] = useState(0)



    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('isLoggedIn'))
        setTotal(Number(localStorage.getItem('total')))
        // setTotal(props.total)
        
        // console.log(`isLoggedIn ----> ${Boolean(localStorage.getItem('isLoggedIn'))}`);
    },)

    return <div>
        <Navbar>
            <Nav>
                {/* //NavLink  instead of Link */}
                <Nav.Item  as={NavLink} to='/'>Home</Nav.Item>
            </Nav>
            <Nav pullRight>
                {/* props.isLoggedIn */}
                {/* isLoggedIn === 'true' */}
                {isLoggedIn === 'true'
                    ? <>
                        {/* <Nav.Item as={NavLink} to='/cart'><Typography color={'red'}>{props.total}$</Typography></Nav.Item> */}
                        <Nav.Item as={NavLink}  to='/cart'><Typography sx={{ mr: 0.5 }} color={'red'}>{total} $</Typography><ShoppingCartIcon /></Nav.Item>
                        <Nav.Item as={NavLink}  to='/logout'>logout</Nav.Item>
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