import React from "react";
import { createUseStyles } from "react-jss";
import io from "socket.io-client";
import QRCode from "react-qr-code";
const socket = io(process.env.REACT_APP_WS_SERVER as string);
const host = process.env.REACT_APP_DEEPLINK_HOST as string;
const backendShareEndpoint = process.env.REACT_APP_BACKEND_ISSUER_SHARE_ENDPOINT as string;
const backendDownloadEndpoint = process.env.REACT_APP_BACKEND_DOWNLOAD_ENDPOINT as string;
const clientId = process.env.REACT_APP_CLIENT_ID as string;

const ProviderPage = () => {
    const classes = useStyles();
    const [qrValue, setQRValue] = React.useState('');
    const [step, setStep] = React.useState(1);
    const [subject_did, setSubject] = React.useState('');
    const [claims_form, setClaims] = React.useState('');
    const [type_form, setType] = React.useState('');
    const [urlValue, setUrl] = React.useState('');
    
    React.useEffect(() => {
        const url = new URL(host + 'share');

        socket.on('connect', () => {
            console.log("server connected to " + process.env.REACT_APP_WS_SERVER as string + ".");
            console.log("Socket ID: " + socket.id);
            url.searchParams.append('redirect_uri', backendShareEndpoint + '/provider-step1');
            url.searchParams.append('title', 'Generar VC customizada desde provider');
            url.searchParams.append('description', 'Emitir una credencial desde el provider con datos custom para pruebas de visualización');
            //Si no llegan claims a solicitar mandas tu DID para saber quien erer.
            //url.searchParams.append('claims', 'name');
            url.searchParams.append('client_id', clientId);
            url.searchParams.append('state', socket.id);
            const newQRValue = url.toString();
            console.log("redirect_uri", backendShareEndpoint + '/provider-step1');
            console.log("QR-CODE", newQRValue);
            setQRValue(newQRValue);
            setUrl(newQRValue)
        });

        
        

        socket.on('disconnect', () => { });

        socket.on('shared-identity-provider-client', (args) => {
            console.log("Receiving shared-identity-provider-client");
            setSubject(args);
            setStep(2);
        });

        socket.on('shared-identity-provider-2-client', (args) => {
            const url = new URL(backendDownloadEndpoint);
            url.searchParams.append('fileName', args);
            url.searchParams.append('state', socket.id);
            const newQRValue = url.toString();
            setQRValue(newQRValue);
            setStep(3);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('shared-identity-provider-client');
            socket.off('shared-identity-provider-2-client');
        };
    }, []);

    return (
        <div className={classes.container}>
            <div className={classes.columnLeft}>
                Your Bank client LOGO
            </div>
            <div className={classes.columnRigth}>
                <h5>Hello dear client,</h5>
                <h1>Issuance of a VC with claims customized to your DID using KayTrust Provider</h1>
                <div className={classes.content}>
                    {
                        step === 1 &&
                        <span>
                            Please authenticate with your Digital Identity.
                            <br />
                            <h3>Please scan the QR code below to share your digital identity with us, so that we can issue your Veriable Credential.</h3>
                            {/* <a href={urlValue}>click your QR code</a> */}
                        </span>
                    }
                    {
                        step === 2 &&
                        <span>
                            <h3>We receive your digital identity {subject_did}, please fill in the following fields to issue your credential.</h3>
                            <form onSubmit={event => {
                                const bloque = document.getElementById('mensaje') as HTMLInputElement | null;
                                if (bloque != null) {
                                    bloque.style.display = 'block';
                                }
                                fetch(backendShareEndpoint + '/provider-step2?claims=' + claims_form + '&type=' + type_form + '&sub=' + subject_did + '&state=' + socket.id, { mode: 'cors' });
                                event.preventDefault();
                            }}>
                                <label htmlFor="claims">
                                    Claims - example: &#123;"name":"Jay Jay Mirandis", "salt":"1983446",
                                    "email":"torotori@japan.mail.com",
                                    "overseaBank":"did:ev:bmM8apgHQD8cPbwNsMSJKqkYRCDYhkK55uxR9", "HikkyUser":"osoblack"&#125;:
                                </label>
                                <textarea name="claims" id="claims" rows={5} cols={50} value={claims_form} onChange={(event) => {
                                    setClaims(event.target.value);
                                }} />
                                <label htmlFor="type">Credential Type - example: NameCredential,AccountCredential :</label>
                                <input type="text" name="type" id="type" placeholder='NameCredential,AccountCredential' onChange={(event) => {
                                    setType(event.target.value);
                                }} />
                                <input type="submit" value="Submit" />
                            </form>
                            <div id="mensaje" style={{ display: 'none' }}>
                                ...Generating verifiable credential, please wait a few seconds...
                            </div>
                        </span>
                    }
                    {
                        step === 3 &&
                        <span><br />Credential ready and send to your wallet, refresh the credentials view by pulling down the screen...</span>
                    }
                </div>
                <div className={classes.qr}>
                    {
                        step === 1 &&
                        <span><br /><QRCode value={qrValue} fgColor='#000' /></span>
                    }
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
        backgroundColor: '#ffc0cb'
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

export default ProviderPage;