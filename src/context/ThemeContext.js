import React, { createContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const initialData = localStorage.getItem('theme');
        return initialData || 'light';
    });
        
    useEffect(() => {
        // Lưu giá trị theme vào localStorage khi giá trị thay đổi
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return <ThemeContext.Provider value={{ theme, toggleTheme }}> {children} </ThemeContext.Provider>;
}

export { ThemeContext, ThemeProvider };
