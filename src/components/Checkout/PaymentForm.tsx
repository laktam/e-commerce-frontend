import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Dispatch, SetStateAction } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { Alert, InputAdornment } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { AccountCircle } from '@mui/icons-material';

type Props = {
    setName: Dispatch<SetStateAction<string>>;
    setCardNumber: Dispatch<SetStateAction<string>>;
    setExpirationDate: Dispatch<SetStateAction<string | undefined>>;
    setCvv: Dispatch<SetStateAction<string>>;
    setSaveData: Dispatch<SetStateAction<boolean>>;
    cardErr: boolean;

}
export default function PaymentForm(props: Props) {
    // const [date, setDate] = React.useState<Dayjs | null>(dayjs('2022-04-17'));

    const handlDateChange = (value: Dayjs | null) => {
        console.log(value?.format('YYYY-MM-DD'))
        props.setExpirationDate(value?.format('YYYY-MM-DD'))
    }


    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Payment method
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle /> 
                                </InputAdornment>
                            ),
                        }}
                        required
                        id="cardName"
                        label="Name on card"
                        fullWidth
                        autoComplete="cc-name"
                        variant="standard"
                        onChange={e => { props.setName(e.target.value) }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CreditCardIcon />
                                </InputAdornment>
                            ),
                        }}
                        required
                        id="cardNumber"
                        label="Card number"
                        // fullWidth
                        autoComplete="cc-number"
                        variant="standard"
                        onChange={e => { props.setCardNumber(e.target.value) }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        id="cvv"
                        label="CVV"
                        helperText="Last three digits on signature strip"
                        fullWidth
                        autoComplete="cc-csc"
                        variant="standard"
                        onChange={e => { props.setCvv(e.target.value) }}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    {/* <TextField
                        required
                        id="expDate"
                        label="Expiry date"
                        fullWidth
                        autoComplete="cc-exp"
                        variant="standard"
                        onChange={e => { props.setExpirationDate(e.target.value) }}
                    /> */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        {/* <DateField
                            label="Expiry date"
                            format="YYYY-MM-DD"
                            onChange={handlDateChange}
                            variant='standard'
                        /> */}
                        <DatePicker
                            label="Expiry date"
                            format="YYYY-MM-DD"
                            onChange={handlDateChange}
                        />
                    </LocalizationProvider>
                    {/* <DateField label="Basic date field" /> */}

                </Grid>

                <Grid item xs={12}>
                    <FormControlLabel
                        control={<Checkbox color="secondary" name="saveCard" value="yes" />}
                        label="Remember credit card details for next time"
                    />
                </Grid>
                <Grid item xs={12}>{props.cardErr && <Alert severity="error" sx={{ mt: 2 }}>wrong card info</Alert>}</Grid>

            </Grid>
        </React.Fragment>
    );
}