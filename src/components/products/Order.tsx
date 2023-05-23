import { Alert, Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Snackbar, Typography } from "@mui/material";
import ProdImg from '../../img/000.png'
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
    // quantity: number | string;
}
export function Order(props: Props) {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [qtt, setQtt] = useState(0)

    useEffect(

        () => {
            //init order 
            setQtt(props.order.quantity)
        }
        ,
    )



    const removeFromCart = () => {

        axios.delete(BASE_URL + 'cart/delOrder/' + localStorage.getItem('cartId') + '/' + props.order.id
            , {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }
        ).then(
            (response) => {

                //this also change total in UI
                getTotal()
                // setQtt(response.data) qtt is set on the useEffect 
                setMessage('product removed')
                // setOpen(true)
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

    return <Card sx={{ display: "inline-block", maxWidth: 300, m: 1 }}>
        {/* href={"/product/"+ props.product.id}  */}
        <Link to={"/product/" + props.order.product.id} style={{ textDecoration: 'none' }}>
            <CardActionArea >
                <CardMedia sx={{maxWidth: 250}}
                    component="img"
                    height=""
                    image={ProdImg}
                // alt="green iguana"
                />
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

            <Typography color={'green'} >{qtt}</Typography>
            <Typography color={'red'} >{props.order.product.price} $</Typography>

        </CardActions>
    </Card>
    // </Box>
}


