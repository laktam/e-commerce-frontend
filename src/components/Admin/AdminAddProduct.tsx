import { Alert, Button, Grid, Paper, Snackbar, TextField } from "@mui/material";
import axios from "axios";
import { useRef, useState } from "react";
import { BASE_URL } from "../../const";

export function AdminAddProduct() {
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const [quantity, setQuantity] = useState(0)
    const [images, setImages] = useState<FileList | null>(null)
    const [open, setOpen] = useState(false)


    const aRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImages(e.target.files)
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!images) {
            return;
        }
        const product = {
            name: name,
            price: price,
            description: description,
            quantity: quantity,

        }
        console.log(files)
        const data = new FormData();
        files.forEach((file, i) => {
            data.append(`files`, file);//, file.name
        });
        data.append('product', JSON.stringify(product))

        try {
            console.log(data)
            const res = await axios.post(BASE_URL + 'product/create'
                , data
                ,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
            setOpen(true)

            //reset 
            setName('')
            setPrice(0)
            setDescription('')
            setImages(null)
            setQuantity(0)

            if (aRef.current !== null) {
                aRef.current.value = '';
              }
           




        } catch (error) {
            console.log(error);

        }


    }
    // 👇 files is not an array, but it's iterable, spread to get an array of files
    const files = images ? [...images] : [];

    return <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2} justifyContent="space-around">
                <Grid item xs={6}>
                    <TextField label="name" variant="outlined"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    {/* label="images" */}
                    <TextField variant="outlined" type="file" onChange={handleFileChange}
                        inputProps={{
                            multiple: true
                        }}
                        ref={aRef}
                    // onSubmit={(e) => { e.target.value = null; }}
                    // value={images}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="price"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={price}
                        variant="outlined"
                        onChange={e => setPrice(Number(e.target.value))}
                        required
                    />
                </Grid >
                <Grid item xs={6}>
                    <TextField
                        label="quantity"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        value={quantity}
                        onChange={e => setQuantity(Number(e.target.value))}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="description"
                        multiline
                        //   rows={4}
                        minRows={6}
                        variant="outlined"
                        onChange={e => setDescription(e.target.value)}
                        value={description}
                    />
                </Grid>
                <Grid item xs></Grid>
                <Grid item xs={4}>
                    <Button variant="outlined" type="submit" size="medium">add product</Button>
                </Grid>
                <Grid item xs></Grid>

            </Grid>
        </form>
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={open}
            autoHideDuration={3000}
            onClose={() => setOpen(false)}
            message="Product Added"
        >
            <Alert severity="success">Product added</Alert>
        </Snackbar>
    </Paper>
}