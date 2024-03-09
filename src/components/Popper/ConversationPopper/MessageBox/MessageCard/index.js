import styles from './MessageCard.module.scss';
import className from 'classnames/bind';
import TextMessage from './TextMessage';
import HeartMessage from './HeartMessage';
import PinMessage from './PinMessage';
import { useContext } from 'react';
import { AccountLoginContext } from '../../../../../context/AccountLoginContext';
import UserMessage from './UserMessage';

const cx = className.bind(styles);

function MessageCard({ message }) {
    const { userId } = useContext(AccountLoginContext);
    const isPinMessage = message.pin !== null ? true : false;
    const isTextMessage = message.content !== '' ? true : false;
    const isShareUserMessage = message.sharedUser !== null ? true : false;
    const messageOwner = message.user.id === userId ? 'my-message' : 'friend-message';
    return (
        <div className={cx('wrapper-message-card')}>
            {
                isTextMessage ?
                    <TextMessage message={message} messageOwner={messageOwner}></TextMessage>
                :
                    isPinMessage ?
                        <PinMessage message={message} messageOwner={messageOwner}></PinMessage>
                    :
                        isShareUserMessage ?
                            <UserMessage message={message} messageOwner={messageOwner}></UserMessage>
                        :
                            <HeartMessage message={message} messageOwner={messageOwner}></HeartMessage>
            }
        </div>
    );
}

export default MessageCard;
