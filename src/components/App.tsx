import { Route, Routes } from 'react-router-dom';
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

function App() {
    const [userId, setUserId] = useState(0)
    const [token, setToken] = useState('')
    const [cartId, setCartId] = useState(0)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [total, setTotal] = useState(0)


    useEffect(() => {
        setTotal(Number(localStorage.getItem('total')))
    },)

    return (
        <div className="App">
            <div>
                <Routes>
                    <Route path="/" element={<><Header total={total} /><Home setTotal={setTotal} isLoggedIn={isLoggedIn} cartId={cartId} userId={userId} /></>} />

                    <Route path="/sign-up" element={<><Header /><div className='container'><SignUpForm /></div></>} />
                    <Route path="/sign-in" element={<><Header /><div className='container'><SignInForm cartIdSetter={setCartId} tokenSetter={setToken} userIdSetter={setUserId} isLoggedInSetter={setIsLoggedIn} /></div></>} />
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
                    {/* className='cart' */}
                    <Route path="/product/:productId" element={<><Header total={total} /><ProductPage /></>} />
                    <Route path="/checkout" element={<><Header total={total} /><Checkout /></>} />
                    <Route path="/addProduct" element={<div className='container'><AdminAddProduct /></div>} />

                </Routes >
            </div>
        </div >
    );
}

export default App;
