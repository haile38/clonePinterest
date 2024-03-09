import { LinkedIcon, SearchIcon } from '../../Icons';
import classNames from 'classnames/bind';
import styles from './SharePopper.module.scss';
import { useContext, useEffect, useState } from 'react';
import * as participantServices from '../../../services/participantServices';
import * as userServices from '../../../services/userServices';
import { AccountLoginContext } from '../../../context/AccountLoginContext';
import { CircularProgress } from '@mui/material';
import { StompContext } from '../../../context/StompContext';
import { ConversationContext } from '../../../context/ConversationContext';
import ShareResult from './ShareResult';

const cx = classNames.bind(styles);

function SharePopper({ user_id, pin_id }) {
    const { userId } = useContext(AccountLoginContext);
    const [listUser, setListUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const { stompClient } = useContext(StompContext);
    const { conversationList } = useContext(ConversationContext);
    const [copyTitle, setCopyTitle] = useState('Sao chép liên kết');

    useEffect(() => {
        const fetchApi = async () => {
            if (listUser.length === 0) {
                let result = await participantServices.getFriendChattingWith(userId);
                result = result.map((item) => {
                    return item.user;
                });
                // result = result.filter((item) => item.permission === null && item.id !== parseInt(userId));
                setListUser(result);
                setLoading(false);
            }
        };
        if (userId !== 0) {
            fetchApi();
            loginToChat();
        } else {
            setLoading(false);
        }

        return () => {
            logoutToChat();
        };
    }, [userId]);

    const loginToChat = () => {
        const conv = conversationList.current.map((e) => e.conversation);
        conv.forEach((item, index) => {
            setTimeout(() => {
                stompClient.send(`/app/login`, {}, item.id);
            }, index * 500);
        });
    };

    const logoutToChat = () => {
        const conv = conversationList.current.map((e) => e.conversation);
        conv.forEach((item, index) => {
            setTimeout(() => {
                stompClient.send(`/app/unsubscribe`, {}, item.id);
            }, index * 500);
        });
    };

    const share = (e) => {
        const isPinShare = pin_id !== undefined ? true : false;
        const senderId = parseInt(e.target.getAttribute('value'));
        const conv = conversationList.current.find((conv) => conv.user.id === senderId);
        let tempList = [];
        conversationList.current.forEach((item) => {
            tempList = [...tempList, ...item.messages];
        });
        tempList.sort((a, b) => a.id - b.id);
        let messageID = tempList.at(-1).id + 1;
        if (isPinShare) {
            stompClient.send(
                `/app/chat/conversation_id/${conv.conversation.id}`,
                {},
                JSON.stringify({
                    id: messageID,
                    user_id: userId,
                    conversation_id: conv.conversation.id,
                    content: '',
                    pin_id: pin_id,
                    sharedUserId: -1,
                }),
            );
        } else {
            stompClient.send(
                `/app/chat/conversation_id/${conv.conversation.id}`,
                {},
                JSON.stringify({
                    id: messageID,
                    user_id: userId,
                    conversation_id: conv.conversation.id,
                    content: '',
                    pin_id: -1,
                    sharedUserId: user_id,
                }),
            );
        }
    };

    const handleCopy = async () => {
        const isPinShare = pin_id !== undefined ? true : false;
        if (isPinShare) {
            navigator.clipboard.writeText('http://localhost:3000/pin/' + pin_id);
        } else {
            const user = await userServices.getUserById(parseInt(user_id));
            navigator.clipboard.writeText('http://localhost:3000/' + user.username);
        }
        setCopyTitle('Đã sao chép liên kết');
        setTimeout(() => {
            setCopyTitle('Sao chép liên kết');
        }, 5000);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>Chia sẻ với bạn bè</div>
            <div
                className={cx('option-share-container')}
                style={{ justifyContent: listUser.length !== 0 ? '' : 'center' }}
            >
                {loading && <CircularProgress />}
                {listUser.map((user, index) => {
                    return <ShareResult key={index} user={user} handleSelect={share}></ShareResult>;
                })}
                <div className={cx('copy-link-option')} onClick={handleCopy}>
                    <LinkedIcon className={cx('grey-button')} />
                    <span>{copyTitle}</span>
                </div>
            </div>
        </div>
    );
}

export default SharePopper;
