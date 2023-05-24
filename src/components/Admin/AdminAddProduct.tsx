import { Button, Grid, Paper, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../../const";

export function AdminAddProduct() {
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const [quantity, setQuantity] = useState(0)
    const [images, setImages] = useState<FileList | null>(null)


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setImages(e.target.files)
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let id = 0;
        //create product 
        // try {
            // const product = {
            //     name: name,
            //     price: price,
            //     description: description,
            //     quantity: quantity,

            // }
        //     //this should return product id so i can  update it later adding images
        //     const res = await axios.post(BASE_URL + 'product/create'
        //         , product
        //         ,
        //         {
        //             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        //         });
        //     id = res.data
        // } catch (error) {
        //     console.log(error)
        // }
        //then add image



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
                        onChange={e => setName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField label="images" variant="outlined" type="file" onChange={handleFileChange}
                        inputProps={{
                            multiple: true
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="price"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        onChange={e => setPrice(Number(e.target.value))}
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
                        onChange={e => setQuantity(Number(e.target.value))}
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
                    />
                </Grid>
                <Grid item xs></Grid>
                <Grid item xs={4}>
                    <Button variant="outlined" type="submit" size="medium">add product</Button>
                </Grid>
                <Grid item xs></Grid>

            </Grid>
        </form>

    </Paper>
}