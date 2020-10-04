import {isDividableBy} from "./functions";

let today = new Date();

const FEBRUARY_INDEX = 1;

export const defaultMonths = [
    {
        index : 0,
        days : 31,
        label: "Janvier"
    },
    {
        index : FEBRUARY_INDEX,
        days : 28,
        label: "Février"
    },
    {
        index : 2,
        days : 31,
        label: "Mars"
    },
    {
        index : 3,
        days : 30,
        label: "Avril"
    },
    {
        index : 4,
        days : 31,
        label: "Mai"
    },
    {
        index : 5,
        days : 30,
        label: "Juin"
    },
    {
        index : 6,
        days : 31,
        label: "Juillet"
    },
    {
        index : 7,
        days : 31,
        label: "Août"
    },
    {
        index : 8,
        days : 30,
        label: "Septembre"
    },
    {
        index : 9,
        days : 31,
        label: "Octobre"
    },
    {
        index : 10,
        days : 30,
        label: "Novembre"
    },
    {
        index : 11,
        days : 31,
        label: "Décembre"
    },
];

/**
 * Gives the month corresponding to the month index from the given year
 * @param year
 * @param index
 */
export function getMonth(index, year = today.getFullYear())
{
    let monthList = getYearMonths(year);
    for(let i = 0; i < monthList.length; i++){
        if(monthList[i].index === index){
            return monthList[i];
        }
    }
    return null;
}

/**
 * Get for each months their number of days for the given year
 * @param year
 * @returns {[]}
 */
export function getYearMonths(year)
{
    let monthList = [];
    defaultMonths.map(month => {
        if(month.index === FEBRUARY_INDEX) {
            monthList.push({
                ...month,
                days:getFebruaryDaysNumber(year)
            });
        }else{
            monthList.push(month);
        }
    });
    return monthList;
}

/**
 * Give february month's number of days for the given year
 * @param actualYear
 * @returns {boolean|number}
 */
export function getFebruaryDaysNumber(actualYear)
{
    if(isBisextileYear(actualYear)){
        return 29;
    }
    return 28;
}

/**
 * Check if the given year is bisextile
 * @param year
 * @returns {boolean}
 */
export function isBisextileYear(year)
{
    if(typeof year !== "number"){
        try{
            year = parseInt(year);
        }catch(e){
            console.error(e);
            return false;
        }
    }
    return (isDividableBy(year,4) && !isDividableBy(year,100)) || isDividableBy(year,400);
}

/**
 * Display a date to the french format
 * @param date
 * @returns {string|boolean}
 */
export function displayDate(date)
{
    if(!(date instanceof Date)){
        return false;
    }
    return getRealDay(date) + '/' + getRealMonth(date) + '/' + date.getFullYear();
}

/**
 * Display a date to the english format
 * @param date
 * @returns {string|boolean}
 */
export function displayEnglishDate(date)
{
    if(!(date instanceof Date)){
        return false;
    }
    return date.getFullYear() + '-' + getRealMonth(date) + '-' + getRealDay(date);
}

/**
 * Convenient format for calendars
 * @param date
 * @returns {string|boolean}
 */
export function displayDateForCalendar(date)
{
    if(!(date instanceof Date)){
        try{
            date = new Date(date);
        }catch(e){
            return false;
        }
    }
    if(date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0 ){
        date.setSeconds(date.getSeconds() + 1);
    }
    return date.getFullYear() + '-' + getRealMonth(date) + '-' + getRealDay(date) + ' '+ getRealNumberForTime(date.getHours()) + ':' + getRealNumberForTime(date.getMinutes()) + ':' + getRealNumberForTime(date.getSeconds());
}

/**
 * Assert if date1 and date2 are the exact same day
 * @param date1
 * @param date2
 * @returns {boolean}
 */
export function isSameDay(date1, date2)
{
    if(!(date1 instanceof Date) || !(date2 instanceof Date)){
        try{
            date1 = new Date(date1);
            date2 = new Date(date2);
        }catch(e){
            return false;
        }
    }
    return displayDate(date1) === displayDate(date2);
}

/**
 * Assert if the date is passed
 * @param date
 * @returns {boolean}
 */
export function isDatePassed(date)
{
    if(!(date instanceof Date)){
        try{
            date = new Date(date);
        }catch(e){
            return false;
        }
    }
    return date.getTime() < (new Date()).getTime();
}

/**
 * Get the time difference between two dates
 * @param date1
 * @param date2
 * @returns {string|boolean}
 */
export function getTimeBetweenTwoDates(date1,date2)
{
    if(!(date1 instanceof Date) || !(date2 instanceof Date)){
        try{
            date1 = new Date(date1);
            date2 = new Date(date2);
        }catch(e){
            return false;
        }
    }
    let time1 = date1.getTime();
    let time2 = date2.getTime();
    return (((time2-time1) / (1000 * 3600 * 24))+1).toFixed(1);
}

/**
 * Get the readable number (with 0)
 * @param number
 * @returns {string}
 */
function getRealNumberForTime(number)
{
    if(number < 0){
        return '00';
    }
    if(number < 10){
        number = '0' + number;
    }
    return number;
}

/**
 * Get the readable number (with 0) for months
 * @param date
 * @returns {string|number}
 */
function getRealMonth(date)
{
    if(!(date instanceof Date)) {
        return '00';
    }
    let month = date.getMonth() + 1;
    if(month < 10){
        month = '0' + month;
    }
    return month;
}

/**
 * Get the readable number (with 0) for days
 * @param date
 * @returns {string|number}
 */
function getRealDay(date)
{
    if(!(date instanceof Date)){
        return '00';
    }
    let day = date.getDate();
    if(day < 10){
        day = '0' + day;
    }
    return day;
}
