import {PERIOD_TYPE_ALL_DAY, PERIOD_TYPE_MORNING} from "../../utils/holidaysTypes";
import {displayDate, isDateBetween, isItAWeekEndDay, isSameDay} from "../../utils/date";

/**
 * Gives the usefull informations concerning a day event (for the tabular calendar mainly)
 * @param events
 * @param date
 * @returns {{periodType: *, bgColor: *, halfDay: *, start: *, end: *, title: *}|{periodType, bgColor: *, halfDay, start: *, end: *, title: *}|{periodType: *, bgColor: string, halfDay: boolean, start: null, end: null, title: string}}
 */
export function checkHolidayForCellColor(events, date){
    let defaultResult = {bgColor : 'transparent',title:'',halfDay : false, periodType: PERIOD_TYPE_ALL_DAY, end: null, start: null};
    for(let i = 0; i < events.length; i++){
        const startDate = new Date(events[i].start);
        const endDate = new Date(events[i].end);
        if(isSameDay(startDate,endDate) && isSameDay(date,startDate)){
            return {
                bgColor : events[i].backgroundColor,
                title : events[i].title,
                halfDay : events[i].halfDay,
                periodType : events[i].periodType,
                end: endDate,
                start: startDate
            };
        } else if(isDateBetween(date,startDate,endDate)){
            return {
                ...defaultResult,
                bgColor : events[i].backgroundColor,
                title : events[i].title,
                end: endDate,
                start: startDate
            };
        }
    }
    return defaultResult;
}

/**
 * Return the correct backgroundColor (which will be displayed) for a given event of the tabular calendar
 * @param eventResult
 * @param dayOfWeek
 * @returns {string|string}
 */
export function adjustTabularEventBackgroundColor(eventResult,dayOfWeek)
{
    let backgroundColor = eventResult.bgColor;
    if(isItAWeekEndDay(dayOfWeek)){
        backgroundColor = 'var(--tabular-calendar-week-end-color)';
    }else if(eventResult.halfDay === true){
        if(eventResult.periodType === PERIOD_TYPE_MORNING){
            backgroundColor = "linear-gradient(140deg, "+ backgroundColor +" 50%, rgba(255,255,255,0) 50%)";
        } else {
            backgroundColor = "linear-gradient(140deg, rgba(255,255,255,0) 50%, "+ backgroundColor +" 50%)";
        }
    }
    return backgroundColor;
}

/**
 * Return the correct title (which will be displayed) for a given event of the tabular calendar
 * @param eventResult
 * @param isAdmin
 * @returns {string}
 */
export function adjustTabularEventTitle(eventResult, isAdmin)
{
    let title = eventResult.title;
    if(eventResult.start !== null && eventResult.end !== null){
        if(title === '' || isAdmin !== true){
            if(isSameDay(eventResult.start,eventResult.end)){
                title = "Le " + displayDate(eventResult.start);
            }else{
                title = "Du " + displayDate(eventResult.start) + " au " + displayDate(eventResult.end);
            }
        }
    }
    return title;
}