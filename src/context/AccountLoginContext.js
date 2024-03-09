import { createContext, useEffect, useState } from 'react';

const AccountLoginContext = createContext();

function AccountLoginProvider({ children }) {
    // Hàm để lấy giá trị từ localStorage
    const getLocalStorageWithExpiration = (key) => {
        const data = localStorage.getItem(key);
        if (!data) {
            return null;
        }

        const parsedData = JSON.parse(data);
        const currentTime = new Date().getTime();

        if (currentTime > parsedData.expirationTime) {
            // Nếu thời gian hiện tại vượt quá thời gian hết hạn, xóa khỏi localStorage
            localStorage.removeItem(key);
            return null;
        }

        return parsedData.value;
    };

    const [userId, setUserId] = useState(() => {
        const initialData = getLocalStorageWithExpiration('userLogin');
        return initialData ? initialData.id : 0;
    });
    const [permission, setPermission] = useState(() => {
        const initialData = getLocalStorageWithExpiration('userLogin');
        return initialData ? initialData.permission : null;
    });

    useEffect(() => {
        const getUserLogin = async () => {
            const userlogin = await getLocalStorageWithExpiration('userLogin');
            setUserId(userlogin ? userlogin.id : 0);
            setPermission(userlogin && userlogin.permission);
        };
        getUserLogin();
    }, [userId]);

    return <AccountLoginContext.Provider value={{ userId, permission }}> {children} </AccountLoginContext.Provider>;
}

export { AccountLoginContext, AccountLoginProvider };
