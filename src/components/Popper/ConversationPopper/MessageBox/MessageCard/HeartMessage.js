import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './MessageCard.module.scss';
import className from 'classnames/bind';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Image from '../../../../Image';
import { ThemeContext } from '../../../../../context/ThemeContext';
import { useContext } from 'react';

const cx = className.bind(styles);
function HeartMessage({ message, messageOwner }) {
    const { theme } = useContext(ThemeContext);
    const avatar = message.user.avatar;
    const haveImage = messageOwner === 'my-message' ? false : true;
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
                <div className={cx('message-body', 'heart-message-body', theme === 'dark' ? 'dark' : '')}>
                    <FontAwesomeIcon className={cx('heart-icon')} icon={faHeart} />
                </div>
            </div>
        </div>
    );
}

export default HeartMessage;
