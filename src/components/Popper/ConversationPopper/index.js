import { useState, useContext } from 'react';
import ConversationMenu from './ConversationMenu';
import MessageBox from './MessageBox';
import classNames from 'classnames/bind';
import styles from './ConversationPopper.module.scss';
import { ConversationContext } from '../../../context/ConversationContext';
import { ThemeContext } from '../../../context/ThemeContext';
import { MessageContext } from '../../../context/MessageContext';
import SearchMenu from './SearchMenu';

const cx = classNames.bind(styles);
function ConversationPopper() {
    const { theme } = useContext(ThemeContext);
    const { conversationList, listLoading } = useContext(ConversationContext);
    const { setAllSeen } = useContext(MessageContext);
    const [messageIsShown, setMessageIsShown] = useState(false);
    const [ isSearching, setIsSearching ] = useState(false);
    const [currentInfor, setCurrentInfor] = useState({});
    const [loading, setLoading] = useState(true);

    const changeConversation = (chatWith = {}, searching = false, conversation_id = 0) => {
        if (messageIsShown) {
            setMessageIsShown(false);
            setIsSearching(false);
            setCurrentInfor({});
        } else {
            if(searching) {
                setIsSearching(searching);
            }
            else if(Object.keys(chatWith).length > 0){
                if(!listLoading) {
                    conversationList.current.forEach((conv) => {
                    if (conv.user.id === chatWith.id) {
                            setCurrentInfor({
                                conversation_id: conv.conversation.id,
                                name: chatWith.fullname,
                                avatar: chatWith.avatar,
                                messages: conv.messages,
                            });
                        }
                        if(conv.conversation.id === conversation_id) {
                            setAllSeen(conversation_id);
                        }
                    });
                    setTimeout(() => {
                        setMessageIsShown(true);
                    }, 500);
                }
            }
            else {
                setMessageIsShown(false);
                setIsSearching(false);
            }
        }
        setLoading(false);
    };

    return (
        <div className={cx('wrapper-conversation-popper', theme === 'dark' ? 'dark' : '')}>
            {!messageIsShown ? (
                isSearching ?
                    <SearchMenu handleChange={changeConversation} />
                :
                    <ConversationMenu handleChange={changeConversation} conversationList={conversationList.current} />
            ) : (
                <MessageBox
                    handleChange={changeConversation}
                    chatWith={currentInfor}
                />
            )}
        </div>
    );
}

export default ConversationPopper;
