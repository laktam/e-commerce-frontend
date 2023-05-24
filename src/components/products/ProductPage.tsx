import { Button, CardMedia, Pagination, Paper, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../const";
import ProdImg from '../../img/000.png'
import { ProductDB } from "../../types";
import Grid from '@mui/material/Grid';


export function ProductPage() {
    let { productId } = useParams();
    const [product, setProduct] = useState<ProductDB>()
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(1)

    useEffect(() => {
        //we need to get image count for pagination

        axios.get(BASE_URL + 'product/' + productId,
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }).then((response) => {
                setProduct(response.data)
            }).catch(
                (err) => {
                    console.log(err)
                }
            )
    }, [])

    const handleChange = () => {

    }

    return <>
        <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} md={5}>
                <Paper sx={{ m: 1, p: 1 }}>
                    <Stack spacing={2} alignItems="center">
                        <CardMedia
                            component="img"
                            height=""
                            src={ProdImg}
                        />
                        <Pagination sx={{ textAlign: 'center' }} count={4} color="primary" page={page} onChange={handleChange} />
                    </Stack>
                </Paper>
            </Grid>
            <Grid container item xs={12} md={7} spacing={5}>
                <Grid item xs={6}>
                    <Typography variant="h4">{product?.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h4">{product?.price} $</Typography>
                </Grid>
                <Grid item xs={12}>
                    counter to how much you want to add to cart
                    <Button size="medium" color="primary" variant="contained">
                        Add to cart
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1" color="text.secondary">
                        {product?.description}
                    </Typography>
                </Grid>
            </Grid>

        </Grid>

    </>
}