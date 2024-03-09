import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ConversationContext } from './ConversationContext';
import { StompContext } from './StompContext';
import * as participantsService from '../services/participantServices';
import { AccountLoginContext } from './AccountLoginContext';
import * as messageServices from '../services/messageServices';
const MessageContext = createContext({});

function MessageProvider({ children }) {
    const { stompClient } = useContext(StompContext);
    const { userId } = useContext(AccountLoginContext);
    let { conversationList } = useContext(ConversationContext);
    const [conversationJoined, setConversationJoined] = useState([]);
    const [messageCount, setMessageCount] = useState(0);
    const [newMessage, setNewMessage] = useState({});
    const [reloadFlag, setReloadFlag] = useState(false);
    let stompIdList = useRef([]);
    useEffect(() => {
        if(userId !== 0) {
            setTimeout(() => {
                joinReloadRoom();
            },1500);
        }
        return () => {
            stompIdList.current.forEach((item) => {
                stompClient.unsubscribe(item);
            })
            stompIdList.current = [];
        }
    }, [userId]);

    useEffect(() => {
        if(conversationJoined.length > 0) {
            loadRoom();
        }
    }, [conversationJoined]);

    useEffect(() => {
        if(Object.keys(newMessage).length > 0) {
            countMessage();
        }
    }, [newMessage]);
    
    const fetchApi = async () => {
        var convJoined = await participantsService.getConversationJoinedByUserId(userId);
        let temp = [];
        convJoined.forEach((element) => {
            temp.push(element.conversation.id);
        });
        setConversationJoined([...temp]);
    }

    const loadRoom = () => {
        conversationJoined.forEach((conversation_id) => {
            let stompObject = stompClient.subscribe(
                `/room/conversation_id/${conversation_id}`,
                function (message) {
                    updateMessages(JSON.parse(message.body));
                },
            );
            stompIdList.current = [...stompIdList.current, stompObject.id];
        });
    };

    const joinReloadRoom = () => {
        const reloadStompObject = stompClient.subscribe(
            '/room/reload', 
            (response) => {
                console.log(JSON.parse(response.body));
                setReloadFlag(JSON.parse(response.body));
            }
        );
        stompIdList.current = [...stompIdList.current, reloadStompObject.id];
    }

    const countMessage = () => {
        let count = 0;
        conversationList.current.forEach((item) => {
            if(item.messages && item.messages.length > 0) {
                item.messages.forEach((message) => {
                    if (!message.seen && message.user.id !== userId) {
                        count++;
                    }
                });
            }
        });
        setMessageCount(count);
    };

    const updateMessages = (message) => {
        conversationList.current.forEach((item) => {
            if(item.conversation.id === message.conversation.id) {
                item.messages = [...item.messages, {...message}];
                if(message.content !== '') {
                    item.lastAction = 'text';
                } 
                else if(message.pin !== null) {
                    item.lastAction = 'pin';
                }
                else if(message.sharedUser !== null) {
                    item.lastAction = 'user';
                }
                else {
                    item.lastAction = 'heart';
                }
            }
        });
        setNewMessage(message);
    };

    const setAllSeen = async (conversation_id) => {
        conversationList.current.forEach((item, convIndex) => {
            if(item.conversation.id === conversation_id) {
                item.messages.forEach(async (message, messageIndex) => {
                    if(message.seen === false && message.user.id !== userId) {
                        message.seen = true;
                        const res = await messageServices.update(message);
                    }
                })
            }
        });
    };

    return <MessageContext.Provider value={{
                messageCount: {state: messageCount, setState: setMessageCount}, 
                stompIdList: stompIdList, 
                reloadFlag: {state: reloadFlag, setState: setReloadFlag}, 
                newMessage: newMessage,
                loadRoom: loadRoom,
                countMessage: countMessage, 
                messageFetchApi: fetchApi, 
                setAllSeen: setAllSeen,
            }}>
                {children}
            </MessageContext.Provider>;
}

export { MessageProvider, MessageContext };
