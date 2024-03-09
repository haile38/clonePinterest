import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './MessageBox.module.scss';
import { faAngleLeft, faHeart, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import MessageCard from './MessageCard';
import { useState, useLayoutEffect, useContext, useEffect, useRef } from 'react';
import * as messageServices from '../../../../services/messageServices';
import { AccountLoginContext } from '../../../../context/AccountLoginContext';
import { StompContext } from '../../../../context/StompContext';
import { MessageContext } from '../../../../context/MessageContext';
import { ThemeContext } from '../../../../context/ThemeContext';
import { CircularProgress } from '@mui/material';

const cx = classNames.bind(styles);

function MessageBox({ handleChange, chatWith }) {
    const { theme } = useContext(ThemeContext);
    const { stompClient } = useContext(StompContext);
    const { userId } = useContext(AccountLoginContext);
    const { newMessage } = useContext(MessageContext);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(scrollToBottom, [chatWith.messages]);

    // Get lastest message id
    let [lastestMessageId, setLastestMessageId] = useState(0);
    useLayoutEffect(() => {
        const fetchLastestMessageID = async () => {
            const messages = await messageServices.getAllMessage();
            if (messages === null || messages === undefined || messages.length === 0) {
                setLastestMessageId(1);
            } else {
                setLastestMessageId(messages.at(-1).id + 1);
            }
        };
        fetchLastestMessageID();
        loginToChat();

        return () => {
            logoutToChat();
        };
    }, []);

    useEffect(() => {
        console.log(newMessage);
        if (Object.keys(newMessage).length !== 0) {
            if (
                chatWith.conversation_id === newMessage.conversation.id &&
                !chatWith.messages.some((e) => e.id === newMessage.id)
            ) {
                chatWith.messages = [...chatWith.messages, newMessage];
                setCurrentMessage('');
                setIsEntering(false);
                setLastestMessageId((lastestMessageId) => lastestMessageId + 1);
                setSending(false);
            }
        }
    }, [newMessage]);

    const loginToChat = () => {
        stompClient.send(`/app/login`, {}, chatWith.conversation_id);
    };

    const logoutToChat = () => {
        stompClient.send(`/app/unsubscribe`, {}, chatWith.conversation_id);
    };

    // Change chat icon
    const [isEntering, setIsEntering] = useState(false);
    const handleChatting = (e) => {
        if (e.target.value.length >= 1) {
            setIsEntering(true);
            setCurrentMessage(e.target.value);
        } else {
            setIsEntering(false);
            setCurrentMessage('');
        }
    };

    // Add new message
    const [currentMessage, setCurrentMessage] = useState('');
    const sendMessage = () => {
        setSending(true);
        stompClient.send(
            `/app/chat/conversation_id/${chatWith.conversation_id}`,
            {},
            JSON.stringify({
                id: lastestMessageId,
                user_id: userId,
                content: currentMessage,
                conversation_id: chatWith.conversation_id,
                pin_id: -1,
                sharedUserId: -1,
            }),
        );
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
            setIsEntering(false);
        }
    };

    return (
        <div className={cx('wrapper-message')}>
            <div className={cx('message-header', theme === 'dark' ? 'dark' : '')}>
                <div className={cx('wrapper-back-btn')} onClick={() => handleChange()}>
                    <button className={cx('back-btn')}>
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </button>
                </div>
                <h3 className={cx('sender-name', theme === 'dark' ? 'dark' : '')}>{chatWith.name}</h3>
            </div>

            <div className={cx('wrapper-message-list')}>
                <div className={cx('message-list')}>
                    {chatWith.messages && chatWith.messages.length !== 0
                        ? chatWith.messages.map((message) => {
                              return <MessageCard key={message.id} message={message}></MessageCard>;
                          })
                        : ''}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className={cx('message-send-option')}>
                <input
                    className={cx('message-input', theme === 'dark' ? 'dark' : '')}
                    type="text"
                    placeholder="Send a message"
                    onKeyDown={(e) => {
                        handleKeyDown(e);
                    }}
                    onChange={(e) => handleChatting(e)}
                    value={currentMessage}
                ></input>
                <div
                    className={cx('wrapper-send_heart-btn')}
                    onClick={() => {
                        sendMessage();
                    }}
                >
                    <button className={cx('send_heart-btn')}>
                        {sending ? (
                            <CircularProgress style={{ width: '16px', height: '16px' }} />
                        ) : isEntering ? (
                            <FontAwesomeIcon style={{ color: 'red' }} icon={faCircleArrowRight} />
                        ) : (
                            <FontAwesomeIcon icon={faHeart} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MessageBox;
