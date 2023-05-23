import { Fab } from "@mui/material";
import { Link } from "react-router-dom";

export function Btn() {
    return <>
        <Fab className="fixed" variant="extended" color="primary">
            <Link style={{ color: 'white', textDecoration: 'none' }} to='/checkout'>Checkout</Link>
        </Fab>
    </>
}