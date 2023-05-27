import { useEffect, useState } from "react";
import '../styles/Home.css'
import { Product } from "./products/Product";
import { ProductDB } from "../types";
import axios from "axios";
import { BASE_URL } from "../const";
import { Grid } from "@mui/material";

type Props = {
    userId: number;
    cartId: number;
    isLoggedIn: boolean;
    setTotal: any
}



export function Home(props: Props) {

    const [prods, setProds] = useState<ProductDB[]>([])
    const [isLoggedIn, setIsLoggedIn] = useState<string | null>('')



    useEffect(() => {


        setIsLoggedIn(localStorage.getItem('isLoggedIn'))
        console.log('i fire once');
        axios.get(BASE_URL + 'product/all/').then(
            (response) => {
                setProds(response.data.reverse())
                console.log(response.data);
            }
        ).catch((err) => {
            console.log(err)
        })
    }, [])
    return <>
        {isLoggedIn === 'true' ?
            <Grid container spacing={2} alignItems="flex-start" sx={{ pr: 10, pl: 10 }}>
                {prods.map(
                    (prod, index) => {
                        return <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                            <Product setTotal={props.setTotal} inCart={false} key={index} img={""} description={""} product={prod} />
                        </Grid>
                    }
                )}
            </Grid>
            :
            //isLoggedIn = False
            <div>

            </div>
        }

        {/* <div className='footer'>footer</div> */}
    </>



}
{/* <h2>user id : {userId}</h2>
                <h2>cart id : {cartId}</h2> */}
{/* <Product img={""} name={''} price={0} description={""} /> */ }
