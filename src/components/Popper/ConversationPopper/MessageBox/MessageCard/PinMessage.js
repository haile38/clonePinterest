import styles from './MessageCard.module.scss';
import className from 'classnames/bind';
import Image from '../../../../Image';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../../../../../context/ThemeContext';
import { AccountLoginContext } from '../../../../../context/AccountLoginContext';
const cx = className.bind(styles);

function PinMessage({ message, messageOwner }) {
    const { theme } = useContext(ThemeContext);
    let title = '*no title';
    const haveImage = messageOwner === 'my-message' ? false : true;
    const avatar = message.user.avatar;
    const fullname = message.user.fullname;
    const pinDescription = message.pin.description;
    const pinImage = message.pin.image;
    if (message.pin.title !== null) {
        title = message.pin.title.length > 20 ? message.pin.title.slice(0, 20) + '...' : message.pin.title;
    }
    return (
        <div className={cx(messageOwner)}>
            {haveImage ? (
                <Image
                    src={avatar && `data:image/jpeg;base64,${avatar}`}
                    alt="no"
                    className={cx('sender-avatar')}
                ></Image>
            ) : (
                ''
            )}
            <div className={cx('message-content', 'pin-message-content')}>
                {haveImage ? (
                    <div className={cx('message-name')}>{fullname}</div>
                ) : (
                    <div className={cx('message-name')}>You</div>
                )}
                <div className={cx('message-body', theme === 'dark' ? 'dark' : '')}>
                    <NavLink className={(nav) => cx('menu-item')} to={`/pin/${message.pin.id}`}>
                        <div style={{ textAlign: 'right', minWidth: 'auto' }} className={cx('pin-message-body')}>
                            <Image
                                className={cx('pin-message-image')}
                                src={message.pin && `data:image/jpeg;base64,${pinImage}`}
                                alt={pinDescription}
                            />
                            <div className={cx('pin-message-title', theme === 'dark' ? 'dark' : '')}>{title}</div>
                        </div>
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default PinMessage;
