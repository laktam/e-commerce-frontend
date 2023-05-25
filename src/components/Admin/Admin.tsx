import { DataGrid, GridApi, GridColDef, GridValueGetterParams, useGridApiContext } from '@mui/x-data-grid';
import axios from 'axios';
import { BASE_URL } from '../../const';
import { useEffect, useState } from 'react';
import { ProductDB } from '../../types';
import { Box, Button, Drawer, LinearProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdminAddProduct } from './AdminAddProduct';




export function Admin() {

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [prods, setProds] = useState<ProductDB[]>([])
    const [editProdId, setEditProdId] = useState(0)


    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'name',
            headerName: 'Product name',
            width: 150,
            editable: false,
        },
        {
            field: 'price',
            headerName: 'Price',
            type: 'number',
            width: 150,
            editable: false,
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            type: 'number',
            width: 110,
            editable: false,
        },
        {
            field: 'description',
            headerName: 'Description',
            //   description: 'This column has a value getter and is not sortable.',
            editable: false,
            sortable: false,
            width: 160,
            //   valueGetter: (params: GridValueGetterParams) =>
            //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
        {
            field: "action",
            headerName: "Edit",
            sortable: false,
            renderCell: (params) => {
                const onClick = (e: any) => {
                    e.stopPropagation(); // don't select this row after clicking
                    console.log(params.id);
                    const api: GridApi = params.api;

                    console.log(api.getRow(params.id))
                    setEditProdId(Number(params.id))
                    setDrawerOpen(true)
                };

                return <Button onClick={onClick}><EditIcon /></Button>;
            }
        },
        {
            field: "delete",
            headerName: "Delete",
            sortable: false,
            renderCell: (params) => {
                const onClick = (e: any) => {
                    e.stopPropagation(); // don't select this row after clicking
                    console.log(params.id);
                    const api: GridApi = params.api;
                    api.getRow(params.id)
                };

                return <Button onClick={onClick}><DeleteIcon color='error' /></Button>;
            }
        },
    ];




    useEffect(
        () => {
            axios.get(BASE_URL + 'product/all/').then(
                (response) => {
                    setProds(response.data)
                    console.log(response.data);
                }
            ).catch((err) => {
                console.log(err)
            })
        }
        , []
    )

    const toggleDrawer =
        (open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setDrawerOpen(open);
            };


    return <>
        <Box sx={{ maxHeight: 1000, width: '100%' }}>
            {
                prods.length == 0 ?
                    // <Box sx={{ width: '100%' }}>
                    <LinearProgress sx={{ width: '100%' }} />
                    :
                    <DataGrid
                        sx={{}}
                        rows={prods}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                },
                            },
                        }}
                        pageSizeOptions={[10]}
                        // checkboxSelection
                        disableRowSelectionOnClick
                    />
            }

        </Box>
        <Drawer
            anchor='left'
            open={drawerOpen}
            onClose={toggleDrawer(false)}
        >
            <AdminAddProduct />
        </Drawer>
    </>
}