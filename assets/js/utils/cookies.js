/**
 * Create / Update a cookie
 * @param name
 * @param value
 * @param exdays
 */
function setCookie(name, value, exdays) {
    let date, expires;
    exdays = exdays || 1;
    date = new Date();
    date.setTime(date.getTime() + (exdays*24*60*60*1000));
    expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + "; " + expires;
}

/**
 * Get a cookie value
 * @param cookieName
 * @returns {string}
 */
export function getCookie(cookieName) {
    let name = cookieName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/**
 * Delete a cookie
 * @param cookieName
 */
export function deleteCookie(cookieName){
    document.cookie = cookieName+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}