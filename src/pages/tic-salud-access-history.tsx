import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import TicSaludLogo from "../assets/tic-logo.png";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_WS_SERVER as string);
const access_history = process.env.REACT_APP_BACKEND_ACCESS_HISTORY_ENDPOINT as string;

type HistoryEntry = [string, string]

const TicSaludAccessHistoryPage = () => {
    const classes = useStyles();
    const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);

    React.useEffect(() => {
        fetch(access_history)
            .then((res) => res.json())
            .then(setHistoryEntries)
            .catch((err) => console.log(err));

        console.log(process.env.REACT_APP_WS_SERVER);

        socket.on('access-history-client', () => {
            fetch(access_history)
                .then((res) => res.json())
                .then(setHistoryEntries)
                .catch((err) => console.log(err));
        });

        return () => {
            socket.off('access-history-client');
        };
    }, []);

    return (
        <div className={classes.container}>
            <div className={classes.columnLeft}>
                <img className={classes.logo} src={TicSaludLogo} />
            </div>
            <div className={classes.columnRigth}>
                <h5>
                    Welcome
                </h5>
                <h1>
                    Tic Salud Clinic History
                </h1>
                <div className={classes.content}>
                    Hello Peter Smith! These are the last accesses to your medical history:
                </div>
                <div className={classes.table}>
                    <div className={classes.tableHeader}>
                        <div className={classes.headerItem}>Name</div>
                        <div className={classes.headerItem}>Date</div>
                    </div>
                    <div className="table-content">
                        {historyEntries
                            .map((vS, i) => (
                                <div className={classes.tableRow} key={i.toString()}>
                                    {vS.map((v, i) => <div key={i.toString()} className={classes.tableData}>{v}</div>)}
                                </div>
                            ))}
                    </div>
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
    },
    table: {
        width: '100%',
        border: '1px solid #EEEEEE',
        marginTop: '48px',
    },
    tableHeader: {
        display: 'flex',
        width: '100%',
        background: '#1A215D',
        padding: '18px 0px',
    },
    tableRow: {
        display: 'flex',
        width: '100%',
        padding: '18px 0px',
        '&:nth-of-type(odd)': {
            background: '#EEEEEE',
        },
    },
    headerItem: {
        flex: '1 1 20%',
        textAlign: 'center',
        textTransform: 'uppercase',
        color: 'white',
        textDecoration: 'none',
        position: 'relative',
        display: 'inline-block',
        paddingLeft: '24px',
        paddingRight: '24px',
    },
    tableData: {
        flex: '1 1 20%',
        textAlign: 'center',
    },
});


export default TicSaludAccessHistoryPage;