import { Button, CardMedia, Pagination, Paper, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../const";
import ProdImg from '../../img/000.png'
import { ProductDB } from "../../types";
import Grid from '@mui/material/Grid';
import { Buffer } from 'buffer';


export function ProductPage() {
    let { productId } = useParams();
    const [product, setProduct] = useState<ProductDB>()
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(1)
    const [images, setImages] = useState<string[]>([])

    useEffect(() => {
        //we need to get image count for pagination


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
        <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12}  md={6}>
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
            <Grid container item xs={12} md={6} spacing={5} sx={{ mt: 3 }}>
                <Grid item xs={6}>
                    <Typography variant="h4">{product?.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h4">{product?.price} $</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button size="medium" color="primary" variant="contained">
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