import { useEffect, useState } from "react";
import '../styles/Home.css'
import { Product } from "./products/Product";
import { ProductDB } from "../types";
import axios from "axios";
import { BASE_URL } from "../const";
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

        axios.get(BASE_URL + 'product/all/').then(
            (response) => {
                setProds(response.data)
                console.log(response.data);

            }
        ).catch((err) => {
            console.log(err)
        })
    }, [])
    return <>

        {/* props.isLoggedIn  */}
        {/* <Header /> */}
        {isLoggedIn === 'true' ?
            <div>

                {prods.map(
                    (prod, index) => {
                        // quantity={prod.quantity}
                        // return <Product setTotal={props.setTotal} inCart={false} key={index} img={""} name={prod.name} price={prod.price} description={""} prodId={prod.id}  />
                        return <Product setTotal={props.setTotal} inCart={false} key={index} img={""} description={""} product={prod} />
                    }
                )}
            </div>
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
