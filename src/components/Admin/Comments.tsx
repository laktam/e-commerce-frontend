import { useEffect, useState } from "react"
import { Comment } from "../../types"
import { BASE_URL } from "../../const"
import axios from "axios"
import { DataGrid, GridColDef, GridEventListener, GridRowHeightParams } from "@mui/x-data-grid"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"


export function Comments() {
    const [comments, setComments] = useState<Comment[]>([])
    const [dialogComment, setDialogComment] = useState<Comment>()
    const [openCommentDialog, setOpenCommentDialog] = useState(false)
    const [productName, setProductName] = useState('')

    useEffect(
        () => {
            axios.get(`${process.env.REACT_APP_BASE_URL}/product/all/comments`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }).then(
                    (response) => {
                        console.log(response.data);
                        setComments(response.data)
                    }
                ).catch(
                    (err) => console.log(err)
                )
        }, []
    )

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },

        {
            field: 'product',
            headerName: 'Product',
            width: 200,
            editable: false,
            valueGetter: ({ row }) => {
                const comment = comments.filter((comment) => {
                    return comment.id == row.id
                })
                try {
                    return comment[0].product.name
                } catch (error) {
                    console.log(error);
                }

            }
        },
        {
            field: 'username',
            headerName: 'User',
            //   description: 'This column has a value getter and is not sortable.',
            editable: false,
            sortable: false,
            width: 150,

        },
        {
            field: 'content',
            headerName: 'Comment',
            //   description: 'This column has a value getter and is not sortable.',
            editable: false,
            sortable: false,
            //  width: 500,
            flex: 1,

        },
    ];


    const handleEvent: GridEventListener<'cellClick'> = (
        params,  // GridCellParams<any>
        event,   // MuiEvent<React.MouseEvent<HTMLElement>>
        details, // GridCallbackDetails
    ) => {
        if (params.field === 'content') {
            setDialogComment(params.row)
            setProductName(params.row.product)
            setOpenCommentDialog(true)
        }
    }

    return <>
        <DataGrid
            onCellClick={handleEvent}
            // getRowHeight={({ id }: GridRowHeightParams) => {
            //     for (let comment of comments)
            //         if (comment.id === id && comment.content.length < 1000) {
            //             console.log(52);

            //             return 52
            //         } else {
            //             console.log('auto');
            //             return comment.content.length * 10
            //         }

            // }}
            rows={comments}
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
            open={openCommentDialog}
            onClose={() => setOpenCommentDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {dialogComment?.username + ' on ' + dialogComment?.product.name} 
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {dialogComment?.content}
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