import styles from './MessageCard.module.scss';
import className from 'classnames/bind';
import Image from '../../../../Image';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import * as pinServices from '../../../../../services/pinServices';
import { ThemeContext } from '../../../../../context/ThemeContext';
import { useContext } from 'react';

const cx = className.bind(styles);

function UserMessage({ message, messageOwner }) {
    const { theme } = useContext(ThemeContext);
    const avatar = message.user.avatar;
    const sharedUserId = message.sharedUser.id;
    const sharedUserName = message.sharedUser.username;
    const sharedUserFullName = message.sharedUser.fullname;
    const sharedUserAvatar = message.sharedUser.avatar;
    const haveImage = messageOwner === 'my-message' ? false : true;
    let url = 'http://localhost:3000/' + sharedUserName;
    url = url.length > 30 ? url.slice(0, 30) + '...' : url;
    const [pinList, setPinList] = useState([]);
    const fetch = async () => {
        let temp = await pinServices.getAllPins();
        temp = temp.filter((e) => e.user.id === sharedUserId);
        setPinList(temp.slice(-2));
    };
    fetch();
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
            <div className={cx('message-content')}>
                {haveImage ? (
                    <div className={cx('message-name')}>{message.user.fullname}</div>
                ) : (
                    <div className={cx('message-name')}>You</div>
                )}
                <div className={cx('message-body', theme === 'dark' ? 'dark' : '')}>
                    <NavLink className={(nav) => cx('menu-item')} to={`/${sharedUserName}`}>
                        <div className={cx('user-message-body', theme === 'dark' ? 'dark' : '')}>
                            <Image
                                src={sharedUserAvatar && `data:image/jpeg;base64,${sharedUserAvatar}`}
                                alt={sharedUserName}
                                className={cx('sharedUser-avatar')}
                            ></Image>
                            <div className={cx('user-message-fullname')}>{sharedUserFullName}</div>
                            <div className={cx('user-message-username')}>{'@' + sharedUserName}</div>
                            <div className={cx('user-message-url')}>{url}</div>
                        </div>
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default UserMessage;
