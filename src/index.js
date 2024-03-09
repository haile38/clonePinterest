import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GlobalStyles from './components/GlobalStyles';
import { AccountLoginProvider } from './context/AccountLoginContext';
import { AccountOtherProvider } from './context/AccountOtherContext';
import { ConversationProvider } from './context/ConversationContext';
import { CountAccessProvider } from './context/CountAccessContext';
import { MessageProvider } from './context/MessageContext';
import { NotificationProvider } from './context/NotificationContext';
import { StompProvider } from './context/StompContext';
import { ThemeProvider } from './context/ThemeContext';
import reportWebVitals from './reportWebVitals';
import { ChatProvider } from './context/ChatContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    <ThemeProvider>
        <GlobalStyles>
            <StompProvider>
                <AccountLoginProvider>
                    <AccountOtherProvider>
                        <CountAccessProvider>
                                <ConversationProvider>
                                    <MessageProvider>
                                        <ChatProvider>
                                            <NotificationProvider>
                                                <App />
                                            </NotificationProvider>
                                        </ChatProvider>
                                    </MessageProvider>
                                </ConversationProvider>
                        </CountAccessProvider>
                    </AccountOtherProvider>
                </AccountLoginProvider>
            </StompProvider>
        </GlobalStyles>
    </ThemeProvider>,
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
