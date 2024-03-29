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
import { Backdrop, Button, Grid, Paper, SpeedDial, SpeedDialAction, SpeedDialIcon, Typography } from '@mui/material';
import { Admin } from './Admin/Admin';
import axios from 'axios';
import { BASE_URL } from '../const';
import { Category, ProductDB } from '../types';
import { CategoryPage } from './products/CategoryPage';


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
    const [backDropOpen, setbackDropOpen] = useState(false)
    const [delPrdId, setDelPrdId] = useState(0)
    const [updateTable, setUpdateTable] = useState(false)
    const [searchProducts, setSearchProducts] = useState<ProductDB[]>()
    const [searchName, setSearchName] = useState('')
    const [allCategories, setAllCategories] = useState<Category[]>([])//contain ll products


    // getting all categories
    useEffect(() => {
        console.log('test ---------------------------')
        console.log(`${process.env.REACT_APP_BASE_URL}`);

        const l = localStorage.getItem('isLoggedIn')
        if (l === 'true') {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
        axios.get(`${process.env.REACT_APP_BASE_URL}/product/categories/`).then(
            (response) => {
                console.log('==========================> setAllCategories');
                
                setAllCategories(response.data)
            }
        ).catch((err) => {
            console.log(err)
        })
    }, [])


    useEffect(() => {
        setTotal(Number(localStorage.getItem('total')))
        const l = localStorage.getItem('isLoggedIn')
        if (l === 'true') {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    },)

    const deleteProduct = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/product/delete/${delPrdId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setUpdateTable(!updateTable)

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="App">
            <div>
                <Routes>
                    <Route element={<><Header setSearchName={setSearchName} setSearchProducts={setSearchProducts} total={total} /></>} >
                        <Route path="/" element={<Home allCategories={allCategories} searchName={searchName} setTotal={setTotal} isLoggedIn={isLoggedIn} cartId={cartId} userId={userId} searchProducts={searchProducts} />} />
                        {
                            allCategories.map((category) => {
                                return <Route key={category.name} path={'/products/' + category.name} element={< CategoryPage isLoggedIn={isLoggedIn} setTotal={setTotal} category={category} />}></Route>
                            })
                        }


                        <Route path="/sign-up" element={<><div className='container'><SignUpForm /></div></>} />
                        <Route path="/sign-in" element={<><div className='container'>
                            <SignInForm cartIdSetter={setCartId} tokenSetter={setToken} userIdSetter={setUserId} isLoggedInSetter={setIsLoggedIn} />
                        </div></>} />
                        <Route path="/logout" element={<><div className='container'><Logout cartId={cartId} token={token} isLoggedInSetter={setIsLoggedIn} /></div></>} />
                        <Route path="/cart" element={
                            <>

                                <div >
                                    <Cart setTotal={setTotal} total={total} />
                                </div>
                                <div className='fixed'>
                                    <Btn />
                                </div>
                            </>
                        } />
                        <Route path="/product/:productId" element={<><ProductPage isLoggedIn={isLoggedIn} setTotal={setTotal} /></>} />

                        <Route path="/checkout" element={<><Checkout /></>} />
                        <Route path="/admin" element={
                            <>
                                {/* className='container' */}
                                <div >
                                    <Admin setDelPrdId={setDelPrdId} updateTable={updateTable} setbackDropOpen={setbackDropOpen} />
                                </div>
                                <Backdrop
                                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                    open={backDropOpen}
                                    onClick={() => setbackDropOpen(false)}

                                >
                                    <Paper sx={{ pt: 1, pb: 1 }}  >
                                        {/* sx={{ width: '100' }} */}
                                        <Grid sx={{ width: 230 }} rowGap={1} spacing={1} justifyContent="center" container>
                                            <Grid item xs={8}><Typography variant='h6' >delete product</Typography> </Grid>
                                            <Grid item xs={5}><Button variant="outlined" >cancel</Button></Grid>
                                            <Grid item xs={4}><Button onClick={deleteProduct} variant="contained">ok</Button></Grid>
                                        </Grid>
                                    </Paper>
                                </Backdrop>
                            </>} />
                    </Route>
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

{/* <Routes>
<Route element={<><Header setSearchName={setSearchName} setSearchProducts={setSearchProducts} total={total} /></>} >
    <Route path="/" element={<Home allCategories={allCategories} searchName={searchName} setTotal={setTotal} isLoggedIn={isLoggedIn} cartId={cartId} userId={userId} searchProducts={searchProducts} />} />
    {
        allCategories.map((category) => {
            return <Route key={category.name} path={'/products/' + category.name} element={< CategoryPage setTotal={setTotal} category={category} />}></Route>
        })
    }
</Route>

<Route path="/sign-up" element={<><Header setSearchProducts={setSearchProducts} /><div className='container'><SignUpForm /></div></>} />
<Route path="/sign-in" element={<><Header setSearchProducts={setSearchProducts} /><div className='container'>
    {/* setIsAdmin={setIsAdmin} */}
//     <SignInForm cartIdSetter={setCartId} tokenSetter={setToken} userIdSetter={setUserId} isLoggedInSetter={setIsLoggedIn} />
// </div></>} />
// {/* setIsAdmin={setIsAdmin} */}
// <Route path="/logout" element={<><Header setSearchName={setSearchName} setSearchProducts={setSearchProducts} total={total} /><div className='container'><Logout cartId={cartId} token={token} isLoggedInSetter={setIsLoggedIn} /></div></>} />
// <Route path="/cart" element={
//     <>
//         <Header setSearchName={setSearchName} total={total} />
//         <div >
//             <Cart setTotal={setTotal} total={total} />
//         </div>
//         <div className='fixed'>
//             <Btn />
//         </div>
//     </>
// } />
// <Route path="/product/:productId" element={<><Header setSearchName={setSearchName} setSearchProducts={setSearchProducts} total={total} /><ProductPage setTotal={setTotal} /></>} />

// <Route path="/checkout" element={<><Header setSearchName={setSearchName} setSearchProducts={setSearchProducts} total={total} /><Checkout /></>} />
// <Route path="/admin" element={
//     <>
//         <Header setSearchName={setSearchName} setSearchProducts={setSearchProducts} total={total} />
//         <div className='container'>
//             <Admin setDelPrdId={setDelPrdId} updateTable={updateTable} setbackDropOpen={setbackDropOpen} />
//         </div>
//         <Backdrop
//             sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
//             open={backDropOpen}
//             onClick={() => setbackDropOpen(false)}

//         >
//             <Paper sx={{ pt: 1, pb: 1 }}  >
//                 {/* sx={{ width: '100' }} */}
//                 <Grid sx={{ width: 230 }} rowGap={1} spacing={1} justifyContent="center" container>
//                     <Grid item xs={8}><Typography variant='h6' >delete product</Typography> </Grid>
//                     <Grid item xs={5}><Button variant="outlined" >cancel</Button></Grid>
//                     <Grid item xs={4}><Button onClick={deleteProduct} variant="contained">ok</Button></Grid>
//                 </Grid>
//             </Paper>
//         </Backdrop>
//     </>} />

// </Routes >
