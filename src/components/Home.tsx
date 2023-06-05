import { useEffect, useState } from "react";
import { Product } from "./products/Product";
import { Category, ProductDB } from "../types";
import axios from "axios";
import { BASE_URL } from "../const";
import { Button, Container, Divider, Grid, List, ListItem, Stack, Toolbar, Typography } from "@mui/material";
import NoResults from '../img/noresults.png'
import { Link, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import AnchorLink from "react-anchor-link-smooth-scroll";


type Props = {
    userId: number;
    cartId: number;
    isLoggedIn: boolean;
    setTotal: any;
    searchProducts: ProductDB[] | undefined;
    searchName: string;
    allCategories: Category[];
    // setAllCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}



export function Home(props: Props) {

    const [isLoggedIn, setIsLoggedIn] = useState<string | null>('')
    const [searching, setSearching] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false) 
    const [categories, setCategories] = useState<Category[]>([])
    const [searchProducts, setSearchProducts] = useState<ProductDB[]>([])
    // const [allCategories, setAllCategories] = useState<Category[]>([])//contain ll products
    const [stackDisplay, setStackDisplay] = useState<'none' | 'inline'>('inline')
    const navigate = useNavigate()

    useEffect(() => {
        console.log('*********************************************************8');

        setIsLoggedIn(localStorage.getItem('isLoggedIn'))
        setCategories(props.allCategories)
        setIsEmpty(false)

    }, [props.allCategories])// ?????????????????????????????????????????????????????????????????????????????????/no [] to update on every refresh

    useEffect(
        () => {
            navigate('/')
            console.log(`In Home search : ${props.searchName}`)
            if (props.searchName.length == 0) {
                setStackDisplay('inline')
                setCategories(props.allCategories)
                setIsEmpty(false)
                setSearching(false)
            } else {
                setIsEmpty(false)
                setSearching(true)
                setStackDisplay('none')
                let results: ProductDB[] = []
                for (let cat of props.allCategories) {
                    results = results.concat(
                        cat.products.filter((prod) => prod.name.toLowerCase().includes(props.searchName.toLowerCase()))
                    )
                }
                // const resultCats = [{
                //     id: 0,
                //     name: '',
                //     products: results,
                // }]
                console.log(results);

                setSearchProducts(results)
                // const result = allProds.filter((prod) => prod.name.toLowerCase().includes(props.searchName.toLowerCase()))
                // setProds(result)
                // resultCats[0].products
                if (results.length == 0) {
                    setIsEmpty(true)
                } else {
                    setIsEmpty(false)
                }
            }
        }
        , [props.searchName]
    )

    // React.MouseEvent<HTMLAnchorElement>
    const sideBarItems = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {
                    props.allCategories.map((category) => (//return ??????????
                        category.products.length > 0 ?
                            <AnchorLink key={category.id} href={'#' + category.name} onClick={
                                () => {
                                    setCategories(props.allCategories)
                                }

                            }>
                                <ListItem key={category.name} disablePadding>
                                    {/* <ListItemText primary={category.name} /> */}
                                    <Typography sx={{ typography: { xs: 'subtitle2', sm: 'h6', md: 'h5' } }}>{category.name}</Typography>
                                </ListItem>
                                <Divider />
                            </AnchorLink>
                            :
                            <>
                                <ListItem key={category.name} disablePadding>
                                    {/* <Button sx={{ p: 0 }} disabled variant="text"> */}
                                    <Typography color='grey' sx={{ typography: { xs: 'subtitle2', sm: 'h6', md: 'h5' } }}>{category.name}</Typography>
                                    {/* </Button> */}
                                </ListItem>
                                <Divider />
                            </>

                    )
                    )
                }
            </List>

        </div >
    );


    return <>
        <Outlet />
        {!isEmpty && !searching ?
            <Grid container spacing={0}>
                <Grid item xs={1.7} >
                    <Stack spacing={0} sx={{ display: stackDisplay, position: 'sticky', top: 0 }}>
                        {sideBarItems}
                    </Stack>
                </Grid>
                <Grid item xs={10.3} >
                    {
                        categories.map(
                            (category) => {
                                if (category.products.length === 0) {
                                    return
                                } else {


                                    return <div key={category.id} style={{ width: '100%' }} id={category.name}>
                                        <Grid container justifyContent="space-between" alignItems="flex-end" item xs={12}>
                                            {/* variant="h3" */}
                                            <Grid item xs></Grid>
                                            <Grid item xs={9}>
                                                <Typography sx={{ typography: { xs: 'h4', md: 'h3' } }} align="center" > {category.name}</Typography>
                                            </Grid>
                                            <Grid item xs>
                                                <Typography align="right">
                                                    <Button disabled={category.products.length < 5} size="small" variant="text"
                                                        onClick={() => { navigate('products/' + category.name) }}
                                                    >
                                                        see more
                                                        {/* <Link to={'products/' + category.name}>
                                                            see more
                                                        </Link> */}
                                                    </Button>

                                                </Typography>
                                            </Grid>


                                        </Grid>
                                        <Grid container spacing={2} alignItems="flex-start" sx={{ pl: 5, pr: 10 }}>
                                            {category.products.reverse().slice(0, 4).map(
                                                (prod, index) => {
                                                    return <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                                                        <Product isLoggedIn={props.isLoggedIn} setTotal={props.setTotal} inCart={false} key={index} img={""} description={""} product={prod} />
                                                    </Grid>
                                                }
                                            )}
                                        </Grid>
                                    </div>
                                }
                            }
                        )
                    }
                </Grid>

            </Grid>
            :

            <div>
                {!isEmpty && searching ?
                    <>
                        <Grid container spacing={2} alignItems="flex-start" sx={{ pl: 5, pr: 10 }}>
                            {searchProducts.reverse().map(
                                (prod, index) => {
                                    return <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                                        <Product isLoggedIn={props.isLoggedIn} setTotal={props.setTotal} inCart={false} key={index} img={""} description={""} product={prod} />
                                    </Grid>
                                }
                            )}
                        </Grid>



                    </>

                    : <Container maxWidth={"sm"} sx={{ mt: 10 }}>
                        <img src={NoResults} />
                    </Container>
                }

            </div>
        }

        {/* <div className='footer'>footer</div> */}
    </>



    // useEffect(
    //     () => {
    //         navigate('/')
    //         console.log(`In Home search : ${props.searchName}`)
    //         if (props.searchName.length == 0) {
    //             setProds(allProds)
    //             setIsEmpty(false)
    //         } else {
    //             const result = allProds.filter((prod) => prod.name.toLowerCase().includes(props.searchName.toLowerCase()))
    //             setProds(result)
    //             if (result.length == 0) {
    //                 setIsEmpty(true)
    //             } else {
    //                 setIsEmpty(false)
    //             }
    //         }
    //     }
    //     , [props.searchName]
    // )
}
// useEffect(
//     () => {
//         navigate('/')
//         console.log(`In Home search : ${props.searchName}`)
//         console.log(allCategories)
//         if (props.searchName.length == 0) {
//             setCategories(allCategories)
//             setIsEmpty(false)
//         } else {
//             const cats = allCategories.filter(
//                 (category) => {
//                     return category.name == searchCatergory
//                 }
//             )

//             cats[0].products = cats[0].products.filter(
//                 (prd) => prd.name.toLowerCase().includes(props.searchName.toLowerCase())
//             )
//             console.log('****************');
//             console.log(cats);

//             setCategories(cats)
//             // const result = allProds.filter((prod) => prod.name.toLowerCase().includes(props.searchName.toLowerCase()))
//             // setProds(prds)
//             if (cats[0].products.length == 0) {
//                 setIsEmpty(true)
//             } else {
//                 setIsEmpty(false)
//             }
//         }
//     }
//     , [props.searchName]
// )