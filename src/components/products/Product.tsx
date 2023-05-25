import { Alert, Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Skeleton, Snackbar, Typography } from "@mui/material";
import ProdImg from '../../img/000.png'
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../const";
import { ProductDB } from "../../types";
import { Buffer } from 'buffer';

import { Link } from "react-router-dom";

type Props = {
    img: string;
    name?: string;
    price?: number;
    description: string;
    prodId?: number;
    inCart: boolean;
    setTotal: any;
    product: ProductDB;
    // quantity: number | string;
}
export function Product(props: Props) {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [qtt, setQtt] = useState(0)
    const [image, setImage] = useState('')
    useEffect(
        () => {
            axios.get(BASE_URL + 'product/quantity/' + props.product.id)
                .then(
                    (response) => {
                        setQtt(response.data)

                    }
                ).catch((err) => {
                    console.log(err)
                })
            // console.log(Buffer.from(props.product.images[0]?.content?.data))
            // console.log(props.product.images[0]?.content)
            setImage(Buffer.from(props.product.images[0]?.content).toString('base64'))

        }

        , []
    )

    const addProduct = async () => {
        try {
            const response = await axios.put(BASE_URL + 'cart/addProduct',
                {
                    cartId: Number(localStorage.getItem('cartId')),
                    productId: props.product.id
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            )
            setMessage('Product added')
            setOpen(true)
            //this also setTotal
            getTotal()

            //decrement qtt
            setQtt(response.data)
        } catch (error) {
            console.log(error);

        }
    }

    const getTotal = () => {
        //also set localstorage total
        axios.get(BASE_URL + 'user/total/' + localStorage.getItem('userId')
            , {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }
        ).then(
            (response) => {
                props.setTotal(response.data)
                localStorage.setItem('total', response.data.toString())
            }
        ).catch(
            (err) => {
                console.log(err);
            }
        )
    }

    return (
        image == '' ?
            <Card sx={{ m: 1 }}>
                <Skeleton animation="wave" variant="rounded" height={250} sx={{ mb: 1.5 }} />
                <Skeleton animation="wave" variant="rounded" height={100} sx={{ mb: 0.5, mr: 1, ml: 1 }} />
                <Skeleton animation="wave" variant="rounded" width={'35%'} height={35} sx={{ mb: 0.5, mr: 1, ml: 1 }} />
            </Card>
            :
            <Card sx={{ display: "inline-block", m: 1, width: '100%' }}>
                <Link to={"/product/" + props.product.id} style={{ textDecoration: 'none' }}>
                    <CardActionArea >
                        <CardMedia
                            component="img"
                            height="300"
                            src={`data:image/jpeg;base64,${image}`}
                        >
                        </CardMedia>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {props.product.name}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ maxHeight: 60, overflow: 'hidden' }}>
                                {props.product.description}
                            </Typography>

                        </CardContent>
                    </CardActionArea>
                </Link>
                <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button size="small" color="primary" onClick={addProduct} disabled={qtt <= 0}>
                        Add to cart
                    </Button>

                    <Snackbar
                        open={open}
                        // onClose={handleClose}
                        message={message}
                        autoHideDuration={500}
                        onClose={() => {
                            setOpen(false)
                        }}
                    >
                        <Alert severity="success">{message}</Alert>
                    </Snackbar>

                    {/* show qtt when prod not in cart */}
                    {!props.inCart && <Typography color={'green'} >
                        {/* {props.quantity} */}
                        {qtt}
                    </Typography>}

                    <Typography color={'red'} >
                        {props.product.price} $
                    </Typography>
                    {/* <Button size="small" >{props.price}</Button> */}
                </CardActions>
            </Card>
    )
    // </Box>
}


// const addProduct = () => {
//     //cart/addProduct will decrement qtt
//     // if (qtt > 0) {
//     axios.put(BASE_URL + 'cart/addProduct',
//         {
//             cartId: Number(localStorage.getItem('cartId')),
//             productId: props.product.id
//         },
//         {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         }
//     ).then(
//         (res) => {
//             setMessage('Product added')
//             setOpen(true)
//             //this also setTotal
//             getTotal()

//             //decrement qtt
//             setQtt(res.data)

//         }
//     ).catch(
//         (err) => {
//             console.log(err);
//         }
//     )
//     // }
// }