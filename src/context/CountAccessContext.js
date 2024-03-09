import { createContext, useContext, useState } from 'react';

const CountAccessContext = createContext();

function CountAccessProvider({ children }) {
    // Lấy giá trị từ local storage khi component được render
    const initialData = JSON.parse(localStorage.getItem('countData')) || {
        counter: 0,
        currentMonth: new Date().getMonth() + 1,
    };
    const [countData, setCountData] = useState(initialData);

    const updateCounter = (counter, currentMonth) => {
        const newData = { counter, currentMonth };
        setCountData(newData);
        localStorage.setItem('countData', JSON.stringify(newData));
    };

    return <CountAccessContext.Provider value={{ countData, updateCounter }}>{children}</CountAccessContext.Provider>;
}
function useCountAccess() {
    const context = useContext(CountAccessContext);
    if (!context) {
        throw new Error('useCountAccess must be used within a CountAccessProvider');
    }
    return context;
}
export { CountAccessContext, useCountAccess, CountAccessProvider };
