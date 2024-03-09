import { createContext, useContext, useEffect, useState } from 'react';
import { AccountLoginContext } from './AccountLoginContext';
import * as userServices from '../services/userServices';

const AccountOtherContext = createContext();

function AccountOtherProvider({ children }) {
    const [accountOther, setAccountOther] = useState(false);
    const { userId } = useContext(AccountLoginContext); //tài khoản đang login

    useEffect(() => {}, []);

    const handleAccount = () => {
        const fetchApi = async () => {
            const pathname = window.location.pathname;

            const pathRegex = /^\/([a-zA-Z0-9_-]+)$/; // Regex cho '/:username'

            const isUsernamePath = pathRegex.test(pathname);

            //nếu là path '/:username'
            if (isUsernamePath) {
                const username = pathname.split('/')[1];

                const userAccess = await userServices.getUserByUsername(username); //tài khoản truy cập
                if (userAccess.id === userId) {
                    setAccountOther(false);
                } else {
                    setAccountOther(true);
                }
            }
        };

        fetchApi();
    };

    return (
        <AccountOtherContext.Provider value={{ accountOther, handleAccount }}>{children}</AccountOtherContext.Provider>
    );
}

export { AccountOtherContext, AccountOtherProvider };
