import { useEffect, useState } from "react";
import '../styles/Home.css'
import { Product } from "./products/Product";
import { Category, ProductDB } from "../types";
import axios from "axios";
import { BASE_URL } from "../const";
import { Container, Divider, Grid, List, ListItem, Stack, Toolbar, Typography } from "@mui/material";
import NoResults from '../img/noresults.png'
import { useNavigate } from "react-router-dom";
import AnchorLink from "react-anchor-link-smooth-scroll";


type Props = {
    userId: number;
    cartId: number;
    isLoggedIn: boolean;
    setTotal: any;
    searchProducts: ProductDB[] | undefined;
    searchName: string
}



export function Home(props: Props) {

    const [isLoggedIn, setIsLoggedIn] = useState<string | null>('')
    const [isEmpty, setIsEmpty] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])//contain search products
    const [allCategories, setAllCategories] = useState<Category[]>([])//contain ll products
    const [stackDisplay, setStackDisplay] = useState<'none' | 'inline'>('inline')
    const navigate = useNavigate()

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('isLoggedIn'))

        setIsEmpty(false)
        axios.get(BASE_URL + 'product/categories/').then(
            (response) => {
                setAllCategories(response.data)
                setCategories(response.data)

            }
        ).catch((err) => {
            console.log(err)
        })
    }, [])

    useEffect(
        () => {
            navigate('/')
            console.log(`In Home search : ${props.searchName}`)
            if (props.searchName.length == 0) {
                setStackDisplay('inline')
                setCategories(allCategories)
                setIsEmpty(false)
            } else {
                setStackDisplay('none')
                let results: ProductDB[] = []
                for (let cat of allCategories) {
                    results = results.concat(
                        cat.products.filter((prod) => prod.name.toLowerCase().includes(props.searchName.toLowerCase()))
                    )
                }
                const resultCats = [{
                    id: 0,
                    name: '',
                    products: results,
                }]
                console.log(resultCats);

                setCategories(resultCats)
                // const result = allProds.filter((prod) => prod.name.toLowerCase().includes(props.searchName.toLowerCase()))
                // setProds(result)
                if (resultCats[0].products.length == 0) {
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
                    allCategories.map((category) => (//return ??????????
                        <AnchorLink key={category.id} href={'#' + category.name} onClick={
                            () => {
                                setCategories(allCategories)
                            }

                        }>
                            <ListItem key={category.name} disablePadding>
                                {/* <ListItemText primary={category.name} /> */}
                                <Typography sx={{ typography: { xs: 'subtitle2', sm: 'h6', md: 'h5' } }}>{category.name}</Typography>
                            </ListItem>
                            <Divider />
                        </AnchorLink>

                    )
                    )
                }
            </List>

        </div >
    );


    return <>

        {isLoggedIn === 'true' && !isEmpty ?
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
                                return <div key={category.id} style={{ width: '100%' }} id={category.name}>
                                    <Grid item xs={12}>
                                        {/* variant="h3" */}
                                        <Typography sx={{ typography: { xs: 'h4', md: 'h3' } }} align="center" gutterBottom> {category.name}</Typography>
                                    </Grid>
                                    <Grid container spacing={2} alignItems="flex-start" sx={{ pl: 5, pr: 10 }}>
                                        {category.products.reverse().slice(0, 4).map(
                                            (prod, index) => {
                                                return <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                                                    <Product setTotal={props.setTotal} inCart={false} key={index} img={""} description={""} product={prod} />
                                                </Grid>
                                            }
                                        )}
                                    </Grid>
                                </div>
                            }
                        )
                    }
                </Grid>

            </Grid>
            :
            //isLoggedIn = False
            <div>
                <Container maxWidth={"sm"} sx={{ mt: 10 }}>
                    <img src={NoResults} />
                </Container>
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