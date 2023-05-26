import { DataGrid, GridApi, GridColDef, GridValueGetterParams, useGridApiContext } from '@mui/x-data-grid';
import axios from 'axios';
import { BASE_URL } from '../../const';
import { useEffect, useState } from 'react';
import { ProductDB } from '../../types';
import { Alert, Backdrop, Box, Button, Drawer, Grid, LinearProgress, Paper, Snackbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdminAddProduct } from './AdminAddProduct';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';

type Props = {
    setbackDropOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setDelPrdId: React.Dispatch<React.SetStateAction<number>>;
    updateTable: boolean;
}


export function Admin(props: Props) {
    const [open, setOpen] = useState(false)//succes snackbar
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [prods, setProds] = useState<ProductDB[]>([])
    const [product, setProduct] = useState<ProductDB>()


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
                const onClick = async (e: any) => {
                    e.stopPropagation(); // don't select this row after clicking
                    console.log(params.id);
                    // const api: GridApi = params.api;

                    //getting product 
                    try {
                        const response = await axios.get(BASE_URL + 'product/' + params.id
                            , {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                }
                            })
                        console.log(response.data)
                        setProduct(response.data)
                    } catch (error) {
                        console.log(error);
                    }
                    // console.log(api.getRow(params.id))
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
                    // const api: GridApi = params.api;
                    // api.getRow(params.id)
                    props.setDelPrdId(Number(params.id))
                    props.setbackDropOpen(true)

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
        , [drawerOpen, props.updateTable]
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

    const addProduct = () => {
        setProduct(undefined)
        setDrawerOpen(true)
    }

    return <>
        <Box sx={{ width: '100%' }}>
            {
                prods.length == 0 ?
                    // <Box sx={{ width: '100%' }}>
                    <LinearProgress sx={{ width: '100%' }} />
                    :
                    <>
                        <Button sx={{ m: 2 }} variant="contained" onClick={addProduct} >add product</Button>
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
                        <Drawer
                            PaperProps={{
                                sx: {
                                    width: '45%',
                                    height: '100%',
                                    padding: '2'

                                }
                            }}
                            anchor='left'
                            open={drawerOpen}
                            onClose={toggleDrawer(false)}
                        >
                            <Box sx={{ p: 2, width: '100%', mt: 5 }}>
                                <AdminAddProduct setOpen={setOpen} setDrawerOpen={setDrawerOpen} product={product} />
                            </Box>
                        </Drawer>
                        <Snackbar
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                            open={open}
                            autoHideDuration={3000}
                            onClose={() => setOpen(false)}
                            message="Product Added"
                        >
                            <Alert icon={false} severity="success" ><DoneOutlineIcon color="success" />Done</Alert>
                        </Snackbar>

                    </>
            }
        </Box>
    </>
}