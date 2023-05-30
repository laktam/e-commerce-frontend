import { Alert, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Snackbar, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BASE_URL } from "../../const";
import { Category, ProductDB } from "../../types";
import { log } from "console";

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
    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState<Category[]>([])
    const aRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        //get names of categories
        axios.get(BASE_URL + 'product/categories',

        ).then(
            (response) => {
                setCategories(response.data);
            }
        ).catch(
            (err) => console.log(err)
        )

        if (props.product !== undefined) {
            setPrice(props.product.price)
            setDescription(props.product.description)
            setName(props.product.name)
            setQuantity(props.product.quantity)
            setCategory(props.product.category.name)
        }
    }, [])

    const handleCatergoryChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value as string);
    }


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
        data.append('category', category)
        // data.append('product', JSON.stringify(product))

        try {
            console.log(data)

            if (props.product !== undefined) {
                //if we are editing

                const product = {
                    id: props.product.id,
                    name: name,
                    price: price,
                    description: description,
                    quantity: quantity,
                }
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
            setCategory('')

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

                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel id="select-category">Category</InputLabel>
                        <Select
                            labelId="simple-select-label"
                            id="simple-select"
                            value={category}
                            label="Category"
                            onChange={handleCatergoryChange}
                        >
                            {/* get categories */}
                            {categories.map(
                                (category) => {
                                    return <MenuItem key={category.name} value={category.name}>{category.name}</MenuItem>
                                }
                            )}
                        </Select>
                    </FormControl>
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