import { Route, Routes, useNavigate } from 'react-router-dom';
import '../styles/App.css';
import { Header } from './Header';
import { SignUpForm } from './SignUpForm';
import { SignInForm } from './SignInForm';
import { Home } from './Home';
import { useEffect, useState } from 'react';
import { Logout } from './Logout';
import { Cart } from './Cart';
import { ProductPage } from './products/ProductPage';
import Checkout from './Checkout/Checkout';
import { Btn } from './Checkout/Btn';
import { AdminAddProduct } from './Admin/AdminAddProduct';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ListIcon from '@mui/icons-material/List';
import { Admin } from './Admin/Admin';


// const actions = [
//     { icon: <AddIcon />, name: 'add product', link: 'addProduct' },
//     { icon: <DeleteIcon />, name: 'delete product', link: 'deleteProduct' },
//     { icon: <ListIcon />, name: 'product list', link: 'productList' },

// ];

function App() {
    const [userId, setUserId] = useState(0)
    const [token, setToken] = useState('')
    const [cartId, setCartId] = useState(0)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [total, setTotal] = useState(0)
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    // const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        setTotal(Number(localStorage.getItem('total')))
    },)

    return (
        <div className="App">
            <div>
                <Routes>
                    <Route path="/" element={<><Header total={total} /><Home setTotal={setTotal} isLoggedIn={isLoggedIn} cartId={cartId} userId={userId} /></>} />

                    <Route path="/sign-up" element={<><Header /><div className='container'><SignUpForm /></div></>} />
                    <Route path="/sign-in" element={<><Header /><div className='container'>
                        {/* setIsAdmin={setIsAdmin} */}
                        <SignInForm cartIdSetter={setCartId} tokenSetter={setToken} userIdSetter={setUserId} isLoggedInSetter={setIsLoggedIn} />
                    </div></>} />
                    {/* setIsAdmin={setIsAdmin} */}
                    <Route path="/logout" element={<><Header total={total} /><div className='container'><Logout cartId={cartId} token={token} isLoggedInSetter={setIsLoggedIn} /></div></>} />
                    <Route path="/cart" element={
                        <>
                            <Header total={total} />
                            <div >
                                <Cart setTotal={setTotal} total={total} />
                            </div>
                            <div className='fixed'>
                                <Btn />
                            </div>
                        </>
                    } />
                    <Route path="/product/:productId" element={<><Header total={total} /><ProductPage setTotal={setTotal} /></>} />
                    <Route path="/checkout" element={<><Header total={total} /><Checkout /></>} />
                    <Route path="/admin" element={<><Header total={total} /><div className='container'><Admin /></div></>} />
                </Routes >
            </div>
            {/* <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={() => navigate(action.link)}
                    />
                ))}
            </SpeedDial> */}
        </div >
    );
}

export default App;
