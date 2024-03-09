import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as Popup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';
import classNames from 'classnames/bind';
import { useContext, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { MessageContext } from '../../context/MessageContext';
import styles from './Popper.module.scss';

const cx = classNames.bind(styles);

const grey = {
    50: '#f6f8fa',
    100: '#eaeef2',
    200: '#d0d7de',
    300: '#afb8c1',
    400: '#8c959f',
    500: '#6e7781',
    600: '#57606a',
    700: '#424a53',
    800: '#32383f',
    900: '#24292f',
};

const PopupBody = styled('div')(
    ({ theme }) => `
        width: max-content;
        background-color: ${theme === 'dark' ? '#292929' : grey[50]};
        border-radius: 8px;
        border: 1px solid ${theme === 'dark' ? grey[700] : grey[200]};
        box-shadow: ${theme === 'dark' ? `0px 4px 8px rgb(0 0 0 / 0.7)` : `0px 4px 8px rgb(0 0 0 / 0.1)`};
        padding: 1rem;
        font-size: 1.5rem;
        font-family: 'IBM Plex Sans', sans-serif;
        font-weight: 500;
        opacity: 1;
        margin: 0.25rem 0;    
        z-index: 20;
    `,
);

function Popper({ idPopper, contentTitle, title, body, className, left = '0', placement = 'bottom', news }) {
    const { theme } = useContext(ThemeContext);
    const [anchor, setAnchor] = useState(null);
    const [open, setOpen] = useState(false);
    let { messageCount } = useContext(MessageContext);

    const handleClick = (event) => {
        setAnchor(anchor ? null : event.currentTarget);
        setOpen(!open);
        messageCount.setState(0);
    };

    // const open = Boolean(anchor);
    const id = open ? `${idPopper}` : null;

    const handleClickAway = () => {
        setOpen(false);
        setAnchor(null);
    };

    const offset = { top: 10, left: 200 };
    return (
        <div className={className}>
            <span aria-describedby={id} onClick={handleClick}>
                {contentTitle}
                {title}
            </span>
            {open ? (
                <Popup
                    style={{ left: left, zIndex: '30' }}
                    id={id}
                    open={open}
                    anchor={anchor}
                    className={cx('wrapper-popper')}
                    placement={placement}
                    offset={offset}
                >
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <PopupBody
                            theme={theme}
                            style={{
                                marginLeft:
                                    id.split('selectBoard')[1] === '1' || parseInt(id.split('selectBoard')[1]) % 6 === 0
                                        ? '190px'
                                        : '0.25rem',
                            }}
                        >
                            {body}
                        </PopupBody>
                    </ClickAwayListener>
                </Popup>
            ) : null}
        </div>
    );
}
export default Popper;
