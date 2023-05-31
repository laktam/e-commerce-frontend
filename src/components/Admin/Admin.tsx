import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import { BASE_URL } from '../../const';
import { useEffect, useState } from 'react';
import { ProductDB } from '../../types';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer, LinearProgress, Snackbar, TextField } from '@mui/material';
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
    const [isReady, setIsReady] = useState(false)
    const [prods, setProds] = useState<ProductDB[]>([])
    const [product, setProduct] = useState<ProductDB>()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [categoryName, setCategoryName] = useState('')

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
                    setIsReady(true)
                    console.log(response.data);
                }
            ).catch((err) => {
                setIsReady(true)
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
    const openDialog = () => {
        setDialogOpen(true)
    }
    const handleClose = () => {
        setDialogOpen(false)
    }
    const addCategory = () => {
        axios.post(BASE_URL + 'product/addCategory',
            {
                categoryName: categoryName
            }
            ,
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }
        ).then(
            (response) => {
                setCategoryName('')
                setDialogOpen(false)
                setOpen(true)
            }
        ).catch(
            (err) => console.log(err)
        )
    }

    return <>
        <Dialog open={dialogOpen} onClose={handleClose}>
            <DialogTitle>Add Category</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    enter category name
                </DialogContentText>
                <TextField
                    autoFocus
                    value={categoryName}
                    onChange={(e) => { setCategoryName(e.target.value) }}
                    margin="dense"
                    id="name"
                    label="category"
                    type="text"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={addCategory}>Add</Button>
            </DialogActions>
        </Dialog>


        <Box sx={{ width: '100%' }}>
            {
                !isReady ?
                    // <Box sx={{ width: '100%' }}>
                    <LinearProgress sx={{ width: '100%' }} />
                    :
                    <>
                        <Button sx={{ mt: 5, mb: 2 }} variant="contained" onClick={addProduct} >add product</Button>
                        <Button sx={{ mt: 5, mb: 2, ml: 2 }} variant="contained" onClick={openDialog} >add category</Button>
                        <DataGrid
                            sx={{}}
                            rows={prods}
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
                            autoHideDuration={2000}
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