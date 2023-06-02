import { Avatar, Box, Button, CardMedia, Divider, LinearProgress, ListItem, ListItemAvatar, ListItemText, Pagination, Paper, Rating, Skeleton, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../const";
import { ProductDB } from "../../types";
import Grid from '@mui/material/Grid';
import { Buffer } from 'buffer';


type Props = {
    setTotal: React.Dispatch<React.SetStateAction<number>>
    isLoggedIn: boolean;
}

export function ProductPage(props: Props) {
    let { productId } = useParams();
    const [product, setProduct] = useState<ProductDB>()
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(1)
    const [images, setImages] = useState<string[]>([])
    const [qtt, setQtt] = useState(0)
    const [tabValue, setTabValue] = useState(0)
    const [comment, setComment] = useState('')
    const [update, setUpdate] = useState(false)

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const addProduct = async () => {

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
            // {
            //     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            // }
        ).then((response) => {
            console.log(response.data);

            setProduct(response.data)
            const imgs = []
            console.log(response.data.images)
            for (let image of response.data.images) {
                // imgs.push(Buffer.from(image.content).toString('base64'))
                imgs.push(image.content)

            }
            setImages(imgs)
            setQtt(response.data.quantity)

        }).catch(
            (err) => {
                console.log(err)
            }
        )
    }, [update])

    const handleChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setPage(page)
    }

    const progressStyle = {
        backgroundColor: 'white',
        '& .MuiLinearProgress-bar': {
            backgroundColor: 'gold'
        },
        height: 14,
        borderRadius: 2,
    }

    const parseJwt = (token: any) => {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    }

    const addComment = () => {
        axios.post(BASE_URL + 'product/comment',
            {
                productId: productId,
                comment: comment,
                username: parseJwt(localStorage.getItem('token')).username
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then(
                (response) => {
                    console.log(response.data);
                    setComment('')
                    setUpdate(!update)
                }
            ).catch(
                (err) => {
                    console.log(err);
                }
            )
    }

    return <>
        <Grid container spacing={2} alignItems="flex-start" >
            {/* <Grid item xs={1} md={1}></Grid> */}
            <Grid item xs></Grid>
            <Grid item xs={12} md={5} lg={4}>
                <Paper sx={{ m: 1, p: 1 }}>
                    <Stack spacing={2} alignItems="center">
                        {
                            images.length == 0
                                ?
                                <Skeleton animation="wave" variant="rounded" height={450} width={'100%'} sx={{ mb: 1.5 }} />
                                :
                                <CardMedia
                                    component="img"
                                    // 400
                                    height=""
                                    src={`data:image/webp;base64,${images[page - 1]}`}
                                />
                        }

                        <Pagination sx={{ textAlign: 'center' }} count={images.length} color="primary" page={page} onChange={handleChange} />
                    </Stack>
                </Paper>
            </Grid>
            {/* after image */}
            {/* <Grid item xs={0} md={0} lg={0} ></Grid> */}
            <Grid container item xs={12} md={5} lg={5} spacing={5} sx={{ mt: 3 }}>
                <Grid item xs={6}>
                    <Typography variant="h4">{product?.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h4">{product?.price} $</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button size="large" color="primary" variant="contained" onClick={addProduct} disabled={qtt <= 0 || !props.isLoggedIn}>
                        Add to cart
                    </Button>
                </Grid>
                <Grid item xs={12} >
                    {/* <Paper elevation={2} sx={{ p: 1 }} > */}
                    <Grid container alignItems="center" >
                        <Grid sx={{ mb: 3, mt: 3 }} container item xs={12}>
                            <Grid item xs={4}><Typography color='gray' variant="h5">customer ratings</Typography></Grid>
                            <Grid item xs={4}><Rating name="size-large" defaultValue={4} size="large" /></Grid>
                            <Grid item xs={4}></Grid>
                        </Grid>


                        <Grid item xs={1}></Grid>
                        <Grid item xs={2}><Typography color='gray' variant="h5">5 star</Typography></Grid>
                        <Grid item xs={8}>
                            <LinearProgress sx={progressStyle} variant="determinate" value={60} />
                        </Grid>
                        <Grid item xs={1}></Grid>

                        <Grid item xs={1}></Grid>
                        <Grid item xs={2}><Typography color='gray' variant="h5">4 star</Typography></Grid>
                        <Grid item xs={8}>
                            <LinearProgress sx={progressStyle} variant="determinate" value={5} />
                        </Grid>
                        <Grid item xs={1}></Grid>

                        <Grid item xs={1}></Grid>
                        <Grid item xs={2}><Typography color='gray' variant="h5">3 star</Typography></Grid>
                        <Grid item xs={8}>
                            <LinearProgress sx={progressStyle} variant="determinate" value={15} />
                        </Grid>
                        <Grid item xs={1}></Grid>

                        <Grid item xs={1}></Grid>
                        <Grid item xs={2}><Typography color='gray' variant="h5">2 star</Typography></Grid>
                        <Grid item xs={8}>
                            <LinearProgress sx={progressStyle} variant="determinate" value={0} />
                        </Grid>
                        <Grid item xs={1}></Grid>

                        <Grid item xs={1}></Grid>
                        <Grid item xs={2}><Typography color='gray' variant="h5">1 star</Typography></Grid>
                        <Grid item xs={8}>
                            <LinearProgress sx={progressStyle} variant="determinate" value={0} />
                        </Grid>
                        <Grid item xs={1}></Grid>
                    </Grid>

                    {/* </Paper> */}
                </Grid>
            </Grid>
            <Grid item xs></Grid>

            {/* second part */}
            <Grid item xs={12}>
                <Paper sx={{ p: 1 }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                        <Tab label="description" />
                        <Tab label="shipping information" />
                    </Tabs>

                    <Box sx={{ padding: 2 }}>
                        {tabValue === 0 && (
                            <Box>
                                <Typography variant="body1" color="text.secondary" style={{ whiteSpace: 'pre-line' }}>
                                    {product?.description}
                                </Typography>
                            </Box>
                        )}
                        {tabValue === 1 && (
                            <Box>
                                <Typography>shipping information</Typography>
                            </Box>
                        )}

                    </Box>


                </Paper>

                {/* Comments */}
                {
                    <Paper sx={{ p: 5, mt: 1 }}>
                        {props.isLoggedIn &&
                            <>   <Typography variant="h4" align="center">Comments</Typography>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="comment"
                                    multiline
                                    minRows={2}
                                    fullWidth
                                    value={comment}
                                    onChange={(e) => { setComment(e.target.value) }}
                                />
                                <Button sx={{ mt: 2 }} variant="contained" onClick={addComment}>add comment</Button></>}
                        {
                            product?.comments.map(
                                (comment) => {
                                    // return <>
                                    //     <Avatar>{comment.username.toUpperCase().charAt(0)}</Avatar>
                                    //     <Stack>
                                    //         <Typography variant="subtitle1">{comment.username}</Typography>
                                    //         <Typography variant="body1">{comment.content}</Typography>
                                    //     </Stack>
                                    //     <Divider />
                                    // </>
                                    return <ListItem>
                                        <ListItemAvatar>
                                            <Avatar>{comment.username.toUpperCase().charAt(0)}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={comment.username} secondary={comment.content} />
                                    </ListItem>
                                    // return <Comment>
                                    //     <Comment.Avatar as={Avatar}> <Avatar sx={{ display: 'inline' }} variant="rounded">{comment.username.toUpperCase().charAt(0)}</Avatar></Comment.Avatar>
                                    //     <Comment.Content>
                                    //         <Comment.Author>{comment.username}</Comment.Author>
                                    //         <Comment.Text>{comment.content}</Comment.Text>
                                    //     </Comment.Content>
                                    // </Comment>
                                }
                            )
                        }
                    </Paper>
                }


            </Grid>

        </Grid>

    </>
}