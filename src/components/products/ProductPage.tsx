import { Button, CardMedia, Pagination, Paper, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../const";
import ProdImg from '../../img/000.png'
import { ProductDB } from "../../types";
import Grid from '@mui/material/Grid';
import { Buffer } from 'buffer';

type Props ={
    setTotal: React.Dispatch<React.SetStateAction<number>>
}

export function ProductPage(props : Props) {
    let { productId } = useParams();
    const [product, setProduct] = useState<ProductDB>()
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(1)
    const [images, setImages] = useState<string[]>([])
    const [qtt, setQtt] = useState(0)




    const addProduct = async () => {
        //cart/addProduct will decrement qtt
        //test if product exist as an order 
        // if so increment order qtt and decrement product qtt


        //else add prodcut as order 
        // and increment order qtt and decrement product qtt




        try {
            const response = await axios.put(BASE_URL + 'cart/addProduct',
                {
                    cartId: Number(localStorage.getItem('cartId')),
                    productId: product?.id
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            )

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


    useEffect(() => {
        axios.get(BASE_URL + 'product/' + productId,
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }).then((response) => {
                setProduct(response.data)
                const imgs = []
                for (let image of response.data.images) {
                    imgs.push(Buffer.from(image.content).toString('base64'))
                }
                console.log(imgs);

                setImages(imgs)
                setQtt(response.data.quantity)


            }).catch(
                (err) => {
                    console.log(err)
                }
            )



    }, [])

    const handleChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setPage(page)
    }

    return <>
    {/* columns={16} */}
        <Grid container spacing={2} alignItems="flex-start" >
            <Grid item xs={12}  md={6} lg={5}>
                <Paper sx={{ m: 1, p: 1 }}>
                    <Stack spacing={2} alignItems="center">
                        <CardMedia
                            component="img"
                            height="450"
                            src={`data:image/jpeg;base64,${images[page - 1]}`}
                        />
                        <Pagination sx={{ textAlign: 'center' }} count={images.length} color="primary" page={page} onChange={handleChange} />
                    </Stack>
                </Paper>
            </Grid>
            <Grid container item xs={12} md={6} lg={7} spacing={5} sx={{ mt: 3 }}>
                <Grid item xs={6}>
                    <Typography variant="h4">{product?.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h4">{product?.price} $</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button size="medium" color="primary" variant="contained" onClick={addProduct} disabled={qtt <= 0}>
                        Add to cart
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 1 }}>
                        <Typography variant="body1" color="text.secondary">
                            {product?.description}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

        </Grid>

    </>
}