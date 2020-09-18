export function displayDate(date){
    if(!(date instanceof Date)){
        return false;
    }
    return getRealDay(date) + '/' + getRealMonth(date) + '/' + date.getFullYear();
}

export function displayEnglishDate(date){
    if(!(date instanceof Date)){
        return false;
    }
    return date.getFullYear() + '-' + getRealMonth(date) + '-' + getRealDay(date);
}

export function displayDateForCalendar(date){
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

export function isSameDay(date1, date2){
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

export function isDatePassed(date){
    if(!(date instanceof Date)){
        try{
            date = new Date(date);
        }catch(e){
            return false;
        }
    }
    return date.getTime() < (new Date()).getTime();
}

export function getTimeBetweenTwoDates(date1,date2){
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

function getRealNumberForTime(number){
    if(number < 0){
        return '00';
    }
    if(number < 10){
        number = '0' + number;
    }
    return number;
}

function getRealMonth(date){
    if(!(date instanceof Date)){
        return '00';
    }
    let month = date.getMonth() + 1;
    if(month < 10){
        month = '0' + month;
    }
    return month;
}

function getRealDay(date){
    if(!(date instanceof Date)){
        return '00';
    }
    let day = date.getDate();
    if(day < 10){
        day = '0' + day;
    }
    return day;
}
