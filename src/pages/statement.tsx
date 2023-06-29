import React from "react";
import { createUseStyles } from "react-jss";
import io from "socket.io-client";
import QRCode from "react-qr-code";

const socket = io(process.env.REACT_APP_WS_SERVER as string);
const host = process.env.REACT_APP_DEEPLINK_HOST as string;
const backendShareEndpoint = process.env.REACT_APP_BACKEND_ISSUER_SHARE_ENDPOINT as string;
const backendDownloadEndpoint = process.env.REACT_APP_BACKEND_DOWNLOAD_ENDPOINT as string;
const clientId = process.env.REACT_APP_CLIENT_ID as string;

const StatementPage = () => {
    const classes = useStyles();
    const [qrValue, setQRValue] = React.useState('');
    const [step, setStep] = React.useState(1);

    React.useEffect(() => {
        socket.on('connect', () => {
            const url = new URL(host);
            url.searchParams.append('redirect_uri', backendShareEndpoint + '/statement');
            url.searchParams.append('title', 'Statement');
            url.searchParams.append('description', 'Emisión de una carta notarial');
            //If claims do not arrive to request, your DID will still be sent to know who is.
            //url.searchParams.append('claims', 'name');
            url.searchParams.append('client_id', clientId);
            url.searchParams.append('state', socket.id);
            const newQRValue = url.toString();
            setQRValue(newQRValue);
        });

        socket.on('disconnect', () => { });

        socket.on('shared-identity-client', (args) => {
            const url = new URL(backendDownloadEndpoint);
            url.searchParams.append('fileName', args);
            const newQRValue = url.toString();
            setQRValue(newQRValue);
            setStep(2);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('shared-identity-client');
        };
    }, []);
    
    return (
        <div className={classes.container}>
            <div className={classes.columnLeft}>
                Logo
            </div>
            <div className={classes.columnRigth}>
                <h5>Hola,</h5>
                <h1>Emisión de una carta notarial a tu DID</h1>
                <div className={classes.content}>
                    Por favor autentícate con tu Identidad Digital.
                    <br/>
                    {
                        step === 1 ?
                        <h3>Please scan the QR code below to share your digital identity with us, so that we can issue your carta notarial.</h3>
                        :
                        <h3>Thank you, your verifiable credential is now ready! Please scan the QR code below to add it to your wallet, and you will be all set up.</h3>
                    }
                </div>
                <div className={classes.qr}>
                    {
                        step === 2 &&
                        <span style={{fontSize: '3rem', color: '#21C0AC'}}><i className="fa fa-check-circle" aria-hidden="true"></i></span>
                     }
                    <br/>
                    <QRCode value={qrValue} fgColor={step === 1 ? '#000' : '#21C0AC'}/>
                </div>
            </div>
        </div>
    )
}

const useStyles = createUseStyles({
    container: {
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        justifyContent: 'center',
        color: '#1A215D'
    },
    logo: {
        width: '250px',
        height: 'auto'
    },
    columnLeft: {
        padding: '2rem',
        flex: 1
    },
    columnRigth: {
        padding: '2rem',
        flex: 2
    },
    content: {
        color: '#767676'
    },
    qr: {
        display: 'flex',
        marginTop: '3rem',
        alignItems: 'center',
        flexDirection: 'column',
        color: '#767676'
    }
});

export default StatementPage;