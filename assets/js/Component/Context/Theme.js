import React, {useState, createContext, useEffect} from "react";
import {getCookie, setCookie} from "../../utils/cookies";

const THEME_COLORS = [
    {
        name : "--header-background-color",
        light : "#005973",
        dark : "#333435"
    },
    {
        name : "--title-color",
        light : "#005973",
        dark : "#e2e2e2"
    },
    {
        name : "--text-color",
        light : "#232323",
        dark : "#e2e2e2"
    },
    {
        name : "--hover-color",
        light : "#0088B0",
        dark : "#0088B0"
    },
    {
        name : "--error-color",
        light : "#D02121",
        dark : "#D02121"
    },
    {
        name : "--admin-color",
        light : "#F1634F",
        dark : "#F1634F"
    },
    {
        name : "--background-color",
        light : "#EEEEEE",
        dark : "#232425"
    },
    {
        name : "--shadow-color",
        light : "grey",
        dark : "#0c0c0c"
    },
    {
        name : "--loader-color",
        light : "#005973",
        dark : "#e2e2e2"
    },
    {
        name : "--header-list-background-color",
        light : "#d2d2d2",
        dark : "#263c44"
    },
    {
        name : "--tabular-calendar-btn-bg-color",
        light : "#005973",
        dark : "#4a4a4a"
    },
    {
        name : "--tabular-calendar-btn-color",
        light : "#EEEEEE",
        dark : "#bdbdbd"
    },
    {
        name : "--tabular-calendar-btn-hover-bg-color",
        light : "#0088B0",
        dark : "#404040"
    },
    {
        name : "--tabular-calendar-week-end-color",
        light : "grey",
        dark : "#0c0c0c"
    },
];

export function setupThemeColors(theme){
    THEME_COLORS.forEach(element => {
        document.documentElement.style.setProperty(element.name,(theme === THEME_VALUES.dark ? element.dark : element.light));
    });
}

function storeThemeInCookie(theme){
    setCookie("theme",theme,30);
}

export const THEME_VALUES = {
    light : 'light',
    dark : 'dark'
};

const actualThemeCookie = getCookie('theme');

const defaultThemeContext = {
    value : actualThemeCookie !== '' ? actualThemeCookie : THEME_VALUES.light
};

export const ThemeContext = createContext(defaultThemeContext);

export default function Theme(props){
    const [theme, setTheme] = useState(actualThemeCookie !== '' ? actualThemeCookie : THEME_VALUES.light);

    useEffect(() => {
        setupThemeColors(theme);
        storeThemeInCookie(theme);
    },[theme]);

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