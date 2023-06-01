import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../const";
import { OrderDB, UserDB } from "../../types";





export function OrderData() {
    const [users, setUsers] = useState<UserDB[]>([])



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
                        return order.product.name +' x'+ order.quantity + ' '
                    })
                } catch (error) {
                    console.log(error);
                }

            },
            editable: false,
            sortable: false,
            width: 300,

        },
    ];



    return <>
        <DataGrid
            getRowHeight={() => 'auto'}
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
    </>
}