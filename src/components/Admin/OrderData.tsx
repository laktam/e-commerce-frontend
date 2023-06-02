import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../const";
import { OrderDB, ProductDB, UserDB } from "../../types";
import { Dialog, DialogTitle, DialogContent, DialogContentText, Typography } from "@mui/material";





export function OrderData() {
    const [users, setUsers] = useState<UserDB[]>([])
    const [openOrderDialog, setOpenOrderDialog] = useState(false)
    const [user, setUser] = useState<UserDB>()

    useEffect(() => {
        axios.get(BASE_URL + 'user/all/'
            , {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then(
                (response) => {
                    setUsers(response.data)
                    console.log(response.data);
                })
            .catch(
                (err) => { console.log(err) }
            )
        //to init total on firt cart load

    }, [])

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
            editable: false,
        },
        {
            field: 'email',
            headerName: 'Email',
            type: 'number',
            width: 220,
            editable: false,
        },
        {
            field: 'orders',
            headerName: 'Orders',
            //   description: 'This column has a value getter and is not sortable.',
            valueGetter: ({ row }) => {
                const user = users.filter((user) => {
                    return user.id == row.id
                })


                try {
                    return user[0].cart.orders.map((order) => {
                        return order.product.name + ' x' + order.quantity + ' '
                    })
                } catch (error) {
                    console.log(error);
                }

            },
            editable: false,
            sortable: false,
            flex: 1,

        },
    ];

    const handleEvent: GridEventListener<'cellClick'> = (
        params,  // GridCellParams<any>
        event,   // MuiEvent<React.MouseEvent<HTMLElement>>
        details, // GridCallbackDetails
    ) => {
        if (params.field === 'orders') {
            // setDialogComment(params.row)
            // setProductName(params.row.product)
            console.log(params.row);
            setUser(params.row)
            setOpenOrderDialog(true)
        }
    }

    return <>
        <DataGrid
            onCellClick={handleEvent}
            // getRowHeight={() => 'auto'}
            rows={users}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 8,
                    },
                },
            }}
            pageSizeOptions={[8]}
            // checkboxSelection
            disableRowSelectionOnClick
        />

        <Dialog
            open={openOrderDialog}
            onClose={() => setOpenOrderDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {user?.name + ' orders'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                        {user?.cart.orders.map((order) => {
                            return order.product.name + ' x' + order.quantity + '\n '
                        })}
                    </Typography>

                </DialogContentText>
            </DialogContent>
            {/* <DialogActions>
                <Button onClick={handleClose}>Disagree</Button>
                <Button onClick={handleClose} autoFocus>
                    Agree
                </Button>
            </DialogActions> */}
        </Dialog>
    </>
}