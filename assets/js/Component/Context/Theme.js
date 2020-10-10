import React, {useState, createContext} from "react";


export const THEME_VALUES = {
    light : 'light',
    dark : 'dark'
};

const defaultThemeContext = {
    value : THEME_VALUES.light
};

export const ThemeContext = createContext(defaultThemeContext);

export default function Theme(props){
    const [theme, setTheme] = useState(THEME_VALUES.light);

    function updateTheme(newTheme){
        setTheme(newTheme);
    }

    function toggleTheme(){
        updateTheme((theme === THEME_VALUES.light ? THEME_VALUES.dark : THEME_VALUES.light));
    }

    return (
        <ThemeContext.Provider value={{value : theme,updateTheme,toggleTheme}}>
            {props.children}
        </ThemeContext.Provider>
    );
}