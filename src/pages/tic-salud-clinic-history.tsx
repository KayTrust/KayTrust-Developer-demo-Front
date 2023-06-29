import React from "react";
import { createUseStyles } from "react-jss";
import io from 'socket.io-client';
import QRCode from "react-qr-code";
import TicSaludLogo from "../assets/tic-logo.png";
import PepeProfile from "../assets/pepe.jpeg";

const socket = io(process.env.REACT_APP_WS_SERVER as string);
const host = process.env.REACT_APP_DEEPLINK_HOST as string;
const backendShareEndpoint = process.env.REACT_APP_BACKEND_VERIFIER_SHARE_ENDPOINT as string;
const clientId = process.env.REACT_APP_CLIENT_ID as string;

const TicSaludClinicHistoryPage = () => {
    const classes = useStyles();
    const [qrValue, setQRValue] = React.useState('');
    const [step, setStep] = React.useState(1);
    const [credentialState, setCredentialState] = React.useState<string>('');

    React.useEffect(() => {
        socket.on('connect', () => {
            const url = new URL(host);
            url.searchParams.append('redirect_uri', backendShareEndpoint);
            url.searchParams.append('title', 'Tic Salut Social');
            url.searchParams.append('description', 'Tic Salut Social - Clinic history');
            url.searchParams.append('claims', 'name,organization,role,speciality');
            url.searchParams.append('client_id', clientId);
            url.searchParams.append('state', socket.id);
            const newQRValue = url.toString();
            setQRValue(newQRValue);
        });

        socket.on('disconnect', () => { });

        socket.on('shared-credential-client', (args) => {
            const credential = args[0];
            if (credential) {
                var names = credential.credentialSubject?.name;
                if (typeof names === 'object') names = names.givenName + names.familyName;
                setCredentialState(names);
                setStep(2);
            } else setStep(3);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('shared-credential-client');
        };
    }, []);

    return (
        <div className={classes.container}>
            <div className={classes.columnLeft}>
                <img className={classes.logo} src={TicSaludLogo}/>
            </div>
            <div className={classes.columnRigth}>
            <h5>Welcome {credentialState}</h5>
            <h1>Peter Smith's medical history</h1>
            {
                step === 1 &&
                <div>
                    <div className={classes.content}>
                        You have requested access to patient Peter Smith's medical history. Please authenticate by scanning the QR below with your identity wallet.
                    </div>
                    <div className={classes.qr}>
                        <br/>
                        <QRCode value={qrValue}/>
                    </div>
                </div>
            }
            {
                step === 2 &&
                <div className={classes.historyContainer}>
                    <div className={classes.columnLeft}>
                        <img className={classes.profileImg} src={PepeProfile}/>
                    </div>
                    <div className={classes.columnRigth}>
                        <div className={classes.gridContainer}>
                            <div className={classes.gridItemField}>Campo 1:</div>
                            <div className={classes.gridItemValue}>Valor 1</div>
                            <div className={classes.gridItemField}>Campo 2:</div>
                            <div className={classes.gridItemValue}>Valor 2</div>
                            <div className={classes.gridItemField}>Campo 3:</div>
                            <div className={classes.gridItemValue}>Valor 3</div>
                            <div className={classes.gridItemField}>Campo 4:</div>
                            <div className={classes.gridItemValue}>Valor 4</div>
                            <div className={classes.gridItemField}>Campo 5:</div>
                            <div className={classes.gridItemValue}>Valor 5</div>
                        </div>
                    </div>
                </div>
            }
            {
                step === 3 &&
                <div>
                    <div className={classes.contentError}>
                        You not have access to patient Peter Smith's medical history.
                    </div>
                </div>
            }
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
    contentError: {
        color: '#e85353'
    },
    qr: {
        display: 'flex',
        marginTop: '3rem',
        alignItems: 'center',
        flexDirection: 'column',
        color: '#767676'
    },
    historyContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    profileImg: {
        width: '200px',
        height: 'auto'
    },
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: '7rem auto',
        backgroundColor: '#f1f1f1',
        padding: '1.5rem',
        color: '#767676'
    },
    gridItemField: {
        fontWeight: 700,
        paddingBottom: '2rem'
    },
    gridItemValue: {
        paddingBottom: '2rem'
    }
});


export default TicSaludClinicHistoryPage;