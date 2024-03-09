import PropTypes from 'prop-types';
import styles from './ConversationMenu.module.scss';
import classNames from 'classnames/bind';
import Image from '../../../Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faHeart, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../../../context/ThemeContext';
import { AccountLoginContext } from '../../../../context/AccountLoginContext';

const cx = classNames.bind(styles);
function ConversationCard({ handleChange, isSeen, item }) {
    const { userId } = useContext(AccountLoginContext);
    const { theme } = useContext(ThemeContext);
    const [deleteBtnIsShown, setDeleteBtnIsShown] = useState(false);
    const [redMarkShown, setRedMarkShown] = useState(!isSeen);
    const haveMessage = item.messages.length > 0 ? true : false;
    const messageIsSeen = isSeen === false ? 'unSeen' : '';
    const isMyMessage = item.messages.at(-1).user.id === userId;
    const showButton = (isShown) => {
        setDeleteBtnIsShown(isShown);
        if (isSeen === false) {
            setRedMarkShown(!isShown);
        }
    };
    return (
        <div
            className={cx('wrapper-conversation-card', theme === 'dark' ? 'dark' : '')}
            onMouseEnter={() => showButton(true)}
            onMouseLeave={() => showButton(false)}
            onClick={() => handleChange(item.user, false, item.conversation.id)}
        >
            <Image
                src={item.user.avatar && `data:image/jpeg;base64,${item.user.avatar}`}
                className={cx('conversation-avatar')}
            ></Image>
            <div className={cx('wrapper-conversation')}>
                <h3 className={cx('sender-name', messageIsSeen)}>{item.user.username}</h3>
                {haveMessage &&
                    (item.messages.at(-1).content !== '' ? (
                        <h3 className={cx('lastMessage', theme === 'dark' ? 'dark' : '', messageIsSeen)}>
                            {isMyMessage ? 'Bạn: ' + item.messages.at(-1).content : item.messages.at(-1).content}
                        </h3>
                    ) : item.messages.at(-1).pin !== null ? (
                        <h3 className={cx('lastMessage', theme === 'dark' ? 'dark' : '', messageIsSeen)}>
                            {isMyMessage ? 'Bạn đã gửi 1 pin' : 'Đã gửi 1 pin'}
                        </h3>
                    ) : item.messages.at(-1).sharedUser === null ? (
                        <h3 className={cx('lastMessage', theme === 'dark' ? 'dark' : '', messageIsSeen)}>
                            {isMyMessage ? 'Bạn: ' : ''}
                            <FontAwesomeIcon icon={faHeart} />
                        </h3>
                    ) : (
                        <h3 className={cx('lastMessage', theme === 'dark' ? 'dark' : '', messageIsSeen)}>
                            {isMyMessage ? 'Bạn đã gửi 1 user' : 'Đã gửi 1 user'}
                        </h3>
                    ))}
            </div>
            {haveMessage &&
                (item.messages.at(-1).pin !== null ? (
                    <Image
                        className={cx('pin-image')}
                        src={item.messages.at(-1).pin && `data:image/jpeg;base64,${item.messages.at(-1).pin.image}`}
                        alt={'no image'}
                    />
                ) : (
                    ''
                ))}
            <div className={cx('wrapper-button')}>
                {deleteBtnIsShown && (
                    <button className={cx('delete-conversation-button', 'float-icon', theme === 'dark' ? 'dark' : '')}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                )}
                {redMarkShown && (
                    <button className={cx('unseen-red-mark', 'float-icon', theme === 'dark' ? 'dark' : '')}>
                        <FontAwesomeIcon icon={faCircle} />
                    </button>
                )}
            </div>
        </div>
    );
}

ConversationCard.prototype = {
    avatar: PropTypes.string,
    senderName: PropTypes.string,
    lastAction: PropTypes.string,
    isSeen: PropTypes.bool,
};

export default ConversationCard;
