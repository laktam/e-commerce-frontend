import { Grid, Typography } from "@mui/material"
import { Product } from "./Product"
import { useEffect } from "react"
import axios from "axios"
import { BASE_URL } from "../../const"
import { Category } from "../../types"


type Props = {
    category: Category;
    setTotal: any;
}

export function CategoryPage(props: Props) {

    return <>
        <Grid item xs={12}>
            {/* variant="h3" */}
            <Typography sx={{ typography: { xs: 'h4', md: 'h3' } }} align="center" gutterBottom> {props.category.name}</Typography>
        </Grid>
        {/* sx={{ typography: { xs: 'subtitle2', sm: 'h6', md: 'h5' } } */}
        <Grid container >
            <Grid item xs></Grid>
            <Grid container item xs={9}  spacing={2} alignItems="flex-start">
                {props.category.products.reverse().map(
                    (prod, index) => {
                        return <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                            <Product setTotal={props.setTotal} inCart={false} key={index} img={""} description={""} product={prod} />
                        </Grid>
                    }
                )}
            </Grid>
            <Grid item xs></Grid>
        </Grid>

    </>
}