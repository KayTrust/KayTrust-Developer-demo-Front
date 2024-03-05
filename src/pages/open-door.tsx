import React from "react";
import { createUseStyles } from "react-jss";
import io from "socket.io-client";
import QRCode from "react-qr-code";
import NTTDATALogo from "../assets/NTTDATA-logo.png";

const socket = io(process.env.REACT_APP_WS_SERVER as string);
const host = process.env.REACT_APP_DEEPLINK_HOST as string;
const backendShareEndpoint = process.env.REACT_APP_BACKEND_ISSUER_SHARE_ENDPOINT as string;
const clientId = process.env.REACT_APP_CLIENT_ID as string;

const OpenDoorPage = () => {
    const classes = useStyles();
    const [qrValue, setQRValue] = React.useState('');
    const [name, setName] = React.useState('');
    const [verified, setVerified] = React.useState(false);
    const [step, setStep] = React.useState(1);

    React.useEffect(() => {
        socket.on('connect', () => {
            const url = new URL(host);
            url.searchParams.append('redirect_uri', backendShareEndpoint + '/open-door');
            url.searchParams.append('title', 'Open Door');
            url.searchParams.append('description', 'Open Door with employee VC');
            url.searchParams.append('claims', 'name');
            url.searchParams.append('client_id', clientId);
            url.searchParams.append('state', socket.id);
            const newQRValue = url.toString();
            setQRValue(newQRValue);
        });

        socket.on('disconnect', () => { });

        socket.on('shared-identity-opendoor-client', (args) => {
            setName(args.name);
            setVerified(args.verified);
            setStep(2);
            if(args.verified){
                fetch('http://192.168.1.39/')
                .then(data => {
                    console.log("Abre puerta");
                })
                .catch(err => console.log(err))
            }
            console.log("name: "+ args.name);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('shared-identity-opendoor-client');
        };
    }, []);


    return (
        <div className={classes.container}>
            <div className={classes.columnLeft}>
                <img className={classes.logo} src={NTTDATALogo} alt="logo de NTT DATA"/>
            </div>
            <div className={classes.columnRigth}>
                {
                    step === 1 ?
                    <h5>Hi NTT DATA Employee,</h5>
                    :
                    <h1>Hi {name},</h1>
                }
                {
                    step === 1 &&
                    <h1>Share your "ID Employee" Verifiable Credential to open the door</h1>
                }
                <div className={classes.content}>
                    We value your work at NTT DATA. To be able to access this door, you will sometimes be requested to authenticate as a NTT DATA employee.
                    <br/>
                    {
                        step === 1 ?
                        <h3>Please scan the QR code below to share your digital identity and your ID Employee with us, so that we can verify your information.</h3>
                        :
                        verified === true ? 
                            <h3>Thank you, your verifiable credential is OK and verified! Opening the Door!</h3>
                            :
                            <h3>The doors will not open!</h3>
                    }
                </div>
                <div className={classes.qr}>
                    {
                        step === 2 && verified === true &&
                        <span style={{fontSize: '6rem', color: '#21C0AC'}}>
                            <i className="fa fa-check-circle" aria-hidden="true"></i>
                        </span>
                     }
                     {
                        step === 2 && verified === false &&
                        <span style={{fontSize: '6rem', color: '#FF0000'}}><i className="fa fa-minus-circle" aria-hidden="true"></i></span>
                     }
                    <br/>
                    <QRCode value={qrValue} fgColor={step === 1 ? '##21C0AC' : '#FFFFFF'}/>
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

export default OpenDoorPage;