import {  Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Skeleton, Snackbar, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../const";
import { OrderDB } from "../../types";
import { Link } from "react-router-dom";


type Props = {
    img: string;
    name?: string;
    price?: number;
    description: string;
    prodId?: number;
    setTotal: any;
    order: OrderDB;
}
export function Order(props: Props) {
    const [qtt, setQtt] = useState(0)
    const [image, setImage] = useState('')


    useEffect(
        () => {
            //init order 
            setQtt(props.order.quantity)
            setImage(props.order.product.images[0].content)
            // setImage(Buffer.from(props.order.product.images[0].content).toString('base64'))
        }
        , //<-------------|
    )



    const removeFromCart = () => {
        axios.delete(BASE_URL + 'cart/delOrder/' + localStorage.getItem('cartId') + '/' + props.order.id
            , {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }
        ).then(
            (response) => {

                //this also change total in UI
                console.log(response.data);
                setQtt(response.data)
                getTotal()
            }
        ).catch(
            (err) => {
                console.log(err);
            }
        )  
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

    return <Card sx={{ display: "inline-block", width: '100%', m: 1 }}>
        {/* href={"/product/"+ props.product.id}  */}
        <Link to={"/product/" + props.order.product.id} style={{ textDecoration: 'none' }}>
            <CardActionArea >
                {image === ''
                    ?
                    <Skeleton animation="wave" variant="rounded" height={200} width={'100%'} sx={{ mb: 1.5 }} />
                    :
                    <CardMedia
                        component="img"
                        height="200"
                        src={`data:image/jpeg;base64,${image}`}
                    // alt="green iguana"
                    />
                }

                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {props.order.product.name}
                    </Typography>

                </CardContent>
            </CardActionArea>
        </Link>
        <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button size="small" color="primary" onClick={removeFromCart}>
                Remove
            </Button>
            {/* <Snackbar
                open={open}
                // onClose={handleClose}
                message={message}
                autoHideDuration={2000}
                onClose={() => {
                    setOpen(false)
                }}
            >
                <Alert severity="success">{message}</Alert>
            </Snackbar> */}

            <Typography color={'green'} >x {qtt}</Typography>
            <Typography color={'red'} >{props.order.product.price} $</Typography>

        </CardActions>
    </Card>
    // </Box>
}


