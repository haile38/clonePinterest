import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Button from '../Button';
import { useNavigate } from 'react-router';
import classNames from 'classnames';
import styles from './DialogConfirmLogin.module.scss';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const cx = classNames.bind(classNames);

function DialogConfirmLogin({ open, setOpen }) {
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Dialog
            className={cx(theme === 'dark' ? 'dark' : '')}
            fullWidth={true}
            maxWidth="xs"
            open={open}
            onClose={handleClose}
        >
            <DialogTitle sx={{ marginTop: '10px', fontSize: '20px', fontWeight: '700', textAlign: 'center' }}>
                Bạn chưa đăng nhập. Tham gia DATH để bước vào thế giới sáng tạo.
            </DialogTitle>
            <form
                onSubmit={() => {
                    navigate('/login');
                }}
            >
                <DialogActions sx={{ marginBottom: '10px' }}>
                    <div>
                        <Button style={{ fontSize: '14px' }} red type="submit">
                            Đăng nhập
                        </Button>
                    </div>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default DialogConfirmLogin;
