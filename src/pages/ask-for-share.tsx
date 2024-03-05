import React from "react";
import { createUseStyles } from "react-jss";
import io from "socket.io-client";
import QRCode from "react-qr-code";
import PolarisLogo from "../assets/polaris-logo.png";

const socket = io(process.env.REACT_APP_WS_SERVER as string);
const host = process.env.REACT_APP_DEEPLINK_HOST as string;
const backendShareEndpoint = process.env.REACT_APP_BACKEND_ISSUER_SHARE_ENDPOINT as string;
const clientId = process.env.REACT_APP_CLIENT_ID as string;

const AskForSharePage = () => {
    const classes = useStyles();
    const [qrValue, setQRValue] = React.useState('');
    const [name, setName] = React.useState('');
    const [step, setStep] = React.useState(1);

    React.useEffect(() => {
        socket.on('connect', () => {
            console.log("server connected.");
        });
        
        const url = new URL(host);
        url.searchParams.append('redirect_uri', backendShareEndpoint + '/ask-for-share');
        url.searchParams.append('title', 'Polaris');
        url.searchParams.append('description', 'Polaris - medical certificate');
        url.searchParams.append('claims', 'name');
        url.searchParams.append('client_id', clientId);
        url.searchParams.append('state', socket.id);
        const newQRValue = url.toString();
        setQRValue(newQRValue);
        console.log(newQRValue);
        socket.on('disconnect', () => { });

        socket.on('shared-identity-ask-client', (args) => {
            setName(args);
            setStep(2);
            console.log("name: " + name);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('shared-identity-ask-client');
        };
    }, []);

    return (
        <div className={classes.container}>
            <div className={classes.columnLeft}>
                <img className={classes.logo} src={PolarisLogo} alt="logo de Polaris" />
            </div>
            <div className={classes.columnRigth}>
                {
                    step === 1 ?
                    <h5>Hi Dr.</h5>
                    :
                    <h1>Hi Dr. {name},</h1>
                }
                {
                    step === 1 &&
                    <h1>Share your "Name" Verifiable Credential</h1>
                }
                <div className={classes.content}>
                    We value your work at Polaris. To be able to access external systems, you will sometimes be requested to authenticate as a doctor.
                    <br />
                    {
                        step === 1 ?
                        <div>
                            <h3>Please scan the QR code below to share your digital identity and your Names with us, so that we can verify your information.</h3>
                            <label> 
                                <input type="checkbox" name="check_vp" id="check_vp" value="check_vp" />Check to verify VP sealed
                            </label>        
                        </div>
                        :
                        <h3>Thank you, your verifiable credential is OK and verified! Developer note: From here you can do anything.</h3>
                    }
                </div>
                <div className={classes.qr}>
                    {
                        step === 2 &&
                        <span style={{ fontSize: '3rem', color: '#21C0AC' }}><i className="fa fa-check-circle" aria-hidden="true"></i></span>
                    }
                    <br />
                    <QRCode value={qrValue} fgColor={step === 1 ? '##21C0AC' : '#FFFFFF'} />
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
        color: '#1A215D',
        backgroundColor: '#eee8aa'
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

export default AskForSharePage;