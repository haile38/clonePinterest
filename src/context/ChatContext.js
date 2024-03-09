import { createContext, useContext, useEffect } from "react";
import { MessageContext } from "./MessageContext";
import { ConversationContext } from "./ConversationContext";
import { AccountLoginContext } from "./AccountLoginContext";
import { StompContext } from "./StompContext";
const ChatContext = createContext();
function ChatProvider({ children }) {
    const { messageFetchApi, countMessage, reloadFlag, stompIdList, loadRoom } = useContext(MessageContext);
    const { conversationFetchApi } = useContext(ConversationContext);
    const { userId } = useContext(AccountLoginContext);
    const { stompClient } = useContext(StompContext);
    useEffect(() => {
        if(userId !== 0) {
            fetch();   
        }
    }, [userId]);

    useEffect(() => {
        if(reloadFlag.state) {
            fetch();
            reloadFlag.setState(false);
            stompIdList.current.forEach((id) => {
                stompClient.unsubscribe(id);
            });
        }
    }, [reloadFlag.state]);

    const fetch = async () => {
        await conversationFetchApi();
        messageFetchApi();
        countMessage();
    }
    return (<ChatContext.Provider value={''}>{children}</ChatContext.Provider>);
}

export {ChatProvider, ChatContext};