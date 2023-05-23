import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import Review from './Review';
import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from '../../const';
import { Card } from '../../types';

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const steps = ['Payment details', 'Review your order'];

// function getStepContent(step: number) {
//   switch (step) {
//     case 0:
//       return <PaymentForm setName={}/>;
//     case 1:
//       return <Review />;
//     default:
//       throw new Error('Unknown step');
//   }
// }

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();



export default function Checkout() {
    //
    const [name, setName] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [expirationDate, setExpirationDate] = useState<string | undefined>('')
    const [cvv, setCvv] = useState('');
    const [saveData, setSaveData] = useState(false)
    const [result, setResult] = useState(false)
    const [cardErr, setCardErr] = useState(false)

    let response: AxiosResponse<any, any>;

    const dataTest = async () => {
        console.log(name);
        console.log(cardNumber);
        console.log(expirationDate);
        console.log(cvv);


        try {
            response = await axios.post(BASE_URL + 'card/check'
                , {
                    name: name,
                    number: cardNumber,
                    expirationDate: expirationDate,
                    cvv: cvv,
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            )

            console.log(response.data);
            setResult(response.data)
            console.log(result)
            setCardErr(!response.data)
            if (response.data) {
                setName('')
                setCvv('')
                setCardNumber('')
                setExpirationDate('')
            }
            return response.data
        } catch (error) {
            console.log(error)
            setResult(false)
            setCardErr(true)
            return false
        }


    }




    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return <PaymentForm cardErr={cardErr} setSaveData={setSaveData} setCvv={setCvv} setExpirationDate={setExpirationDate} setName={setName} setCardNumber={setCardNumber} />;
            case 1:
                return <Review />;
            default:
                throw new Error('Unknown step');
        }
    }


    const [activeStep, setActiveStep] = useState(0);

    const handleNext = async () => {
        console.log(activeStep)
        //validation
        let checkResult = false
        if (activeStep === 0) {
            checkResult = await dataTest()
            console.log(checkResult)
            if (checkResult) {
                setActiveStep(activeStep + 1);
            }
        } else {
            setActiveStep(activeStep + 1);

        }

    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <AppBar
                position="absolute"
                color="default"
                elevation={0}
                sx={{
                    position: 'relative',
                    borderBottom: (t) => `1px solid ${t.palette.divider}`,
                }}
            >

            </AppBar>
            <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                    <Typography component="h1" variant="h4" align="center">
                        Checkout
                    </Typography>
                    <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? (
                        //test information

                        <React.Fragment>
                            <Typography variant="h5" gutterBottom>
                                {result}
                                Thank you for your order.
                            </Typography>
                            <Typography variant="subtitle1">

                                We have emailed your order confirmation, and will
                                send you an update when your order has
                                shipped.
                            </Typography>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {getStepContent(activeStep)}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {activeStep !== 0 && (
                                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                                        Back
                                    </Button>
                                )}
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ mt: 3, ml: 1 }}
                                >
                                    {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                                </Button>
                            </Box>
                        </React.Fragment>
                    )}
                </Paper>
                <Copyright />
            </Container>
        </ThemeProvider>
    );
}