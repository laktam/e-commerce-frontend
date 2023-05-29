import { useEffect, useState } from "react";
import '../styles/Home.css'
import { Product } from "./products/Product";
import { Category, ProductDB } from "../types";
import axios from "axios";
import { BASE_URL } from "../const";
import { Container, Divider, Drawer, Grid, List, ListItem, ListItemButton, ListItemText, Stack, Toolbar, Typography } from "@mui/material";
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

    const [prods, setProds] = useState<ProductDB[]>([])
    const [allProds, setAllProds] = useState<ProductDB[]>([])
    const [isLoggedIn, setIsLoggedIn] = useState<string | null>('')
    const [isEmpty, setIsEmpty] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('isLoggedIn'))

        setIsEmpty(false)
        axios.get(BASE_URL + 'product/categories/').then(
            (response) => {
                setCategories(response.data)
                console.log('categories ***********************');
                console.log(response.data);
                setIsEmpty(false)
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
                setProds(allProds)
            } else {
                const result = allProds.filter((prod) => prod.name.toLowerCase().includes(props.searchName.toLowerCase()))
                setProds(result)
                if (result.length == 0) {
                    setIsEmpty(true)
                } else {
                    setIsEmpty(false)
                }
            }
        }
        , [props.searchName]
    )


    const drawerItems = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {
                    categories.map((category) => (//return ??????????
                        <AnchorLink href={'#' + category.name} >
                            <ListItem key={category.name} disablePadding>
                                <ListItemText primary={category.name} />
                            </ListItem>
                            <Divider />
                        </AnchorLink>

                    )
                    )
                    // ['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    //   <ListItem key={text} disablePadding>
                    //       <ListItemText primary={text} />
                    //   </ListItem>
                    // ))
                }
            </List>
            <Divider />
            {/* <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List> */}
        </div >
    );


    return <>
        {/* <Drawer
            variant="permanent"
            sx={{
                // display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 100 },
            }}
            open
        >
            {drawerItems}
        </Drawer> */}


        {isLoggedIn === 'true' && !isEmpty ?
            <Grid container spacing={0}>
                <Grid item xs={1}>
                    <Stack spacing={0}>
                        {drawerItems}
                    </Stack>
                </Grid>
                <Grid item xs={11}>
                    {
                        categories.map(
                            (category) => {
                                return <div style={{ width: '100%' }} id={category.name}>
                                    <Grid item xs={12}>
                                        <Typography align="center" variant="h3" gutterBottom> {category.name}</Typography>
                                    </Grid>
                                    <Grid container spacing={2} alignItems="flex-start" sx={{ pr: 10, pl: 10 }}>

                                        {category.products.map(
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
                {/* {prods.map(
                    (prod, index) => {
                        return <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                            <Product setTotal={props.setTotal} inCart={false} key={index} img={""} description={""} product={prod} />
                        </Grid>
                    }
                )} */}
            </Grid>
            :
            //isLoggedIn = False
            <div>
                <Container maxWidth={"sm"} sx={{ mt: 5 }}>
                    <img src={NoResults} />
                </Container>
            </div>
        }

        {/* <div className='footer'>footer</div> */}
    </>



}
{/* <h2>user id : {userId}</h2>
                <h2>cart id : {cartId}</h2> */}
{/* <Product img={""} name={''} price={0} description={""} /> */ }
