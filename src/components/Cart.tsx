import axios from "axios"
import { useEffect, useState } from "react"
import { BASE_URL } from "../const"
import { OrderDB } from "../types"
import { Order } from "./products/Order"
import { Fab, Grid } from "@mui/material"
import { Link } from "react-router-dom"


type Props = {
    setTotal: React.Dispatch<React.SetStateAction<number>>;
    total: number
}

export function Cart(props: Props) {
    const [cartOrders, setCartOrders] = useState<OrderDB[]>([])
    useEffect(() => {
        axios.get(BASE_URL + 'cart/all/' + localStorage.getItem('cartId')
            , {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then((response) => {
                setCartOrders(response.data)
            }).catch(
                (err) => {
                    console.log(err)
                }
            )
        //to init total on firt cart load
        props.setTotal(Number(localStorage.getItem('total')))
        // [props.total] to update the products list when total change 
    }, [props.total])//props.total to update the order listing on the cart on evey change (when remove order is clicked)

    return <>
        <Grid container spacing={2} alignItems="flex-start" sx={{ pr: 2 }}>
            {cartOrders.map(
                (order, index) => {
                    // quantity={prod.quantity}
                    // return <Product setTotal={props.setTotal} inCart={true} key={index} img={""} name={prod.name} price={prod.price} description={""} prodId={prod.id}  />
                    return <Grid key={index} item xs={12} sm={4} md={3} lg={2}>
                        <Order setTotal={props.setTotal} img={""} description={""} order={order} />
                    </Grid>
                }
            )}

            {/* <Fab className="fixed" variant="extended" color="primary">
                <Link style={{color: 'white', textDecoration: 'none'}} to='/checkout'>Checkout</Link>     
            </Fab> */}
        </Grid>
    </>
}