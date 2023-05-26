import { Alert, Button, Grid, Paper, Snackbar, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BASE_URL } from "../../const";
import { ProductDB } from "../../types";

type Props = {
    product?: ProductDB;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AdminAddProduct(props: Props) {
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const [quantity, setQuantity] = useState(0)
    const [images, setImages] = useState<FileList | null>(null)


    const aRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (props.product !== undefined) {
            setPrice(props.product.price)
            setDescription(props.product.description)
            setName(props.product.name)
            setQuantity(props.product.quantity)
        }
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImages(e.target.files)
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();



        const product = {
            name: name,
            price: price,
            description: description,
            quantity: quantity,
        }
        const data = new FormData();
        files.forEach((file, i) => {
            data.append(`files`, file);//, file.name
        });
        // data.append('product', JSON.stringify(product))

        try {
            console.log(data)

            if (props.product !== undefined) {
                //if we are editing
                console.log('****************')
                const product = {
                    id: props.product.id,
                    name: name,
                    price: price,
                    description: description,
                    quantity: quantity,
                }
                console.log(props.product)
                data.append('product', JSON.stringify(product))
                const res = await axios.put(BASE_URL + 'product/update/'
                    , data
                    ,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });

            } else {
                //or we are creating a new product
                if (!images) {
                    return;
                }
                data.append('product', JSON.stringify(product))
                const res = await axios.post(BASE_URL + 'product/create'
                    , data
                    ,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
            }

            props.setDrawerOpen(false)
            props.setOpen(true)
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

    return <Paper elevation={3} sx={{ p: 2, width: '100%' }}>
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
                    <Button variant="outlined" type="submit" size="medium">
                        {props.product == undefined ?
                            'Add product'
                            :
                            'Save'
                        }
                    </Button>
                </Grid>
                <Grid item xs></Grid>

            </Grid>
        </form>

    </Paper>
}