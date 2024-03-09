import { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '../Button';
import classNames from 'classnames/bind';
import styles from './Alert.module.scss';
import * as userSavePinServices from '../../services/userSavePinServices';
import * as pinServices from '../../services/pinServices';
import * as boardServices from '../../services/boardServices';
import * as userServices from '../../services/userServices';

const cx = classNames.bind(styles);

export default function ActionAlerts({ content, action, id, severity }) {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpen(false);
        }, 2500); // Đóng sau 2.5 giây

        return () => {
            clearTimeout(timer);
        };
    }, []);

    if (!open) {
        return null;
    }

    return (
        <Stack className={cx('wrapper')} sx={{ width: '25%' }} spacing={2}>
            <Alert
                // variant="filled"
                severity={severity}
                sx={{ fontSize: '16px', fontWeight: '600', textAlign: 'center', justifyContent: 'center' }}
                action={
                    action ? (
                        <Button red small>
                            {action}
                        </Button>
                    ) : null
                }
            >
                {content}
            </Alert>
        </Stack>
    );
}
