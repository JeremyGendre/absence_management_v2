import {displayDate, getTimeBetweenTwoDates, isDateBetween, isItAWeekEndDay, isSameDay} from "./date";
import {PERIOD_TYPE_ALL_DAY, PERIOD_TYPE_MORNING} from "./holidaysTypes";

export function convertListToAdminListFormat(holidays){
    let result = [];
    holidays.map(holiday => {
        result.push(convertOneToAdminListFormat(holiday));
    });
    return result;
}

export function convertOneToAdminListFormat(holiday){
    let newStartDate = new Date(holiday.start_date.date);
    let newEndDate = new Date(holiday.end_date.date);
    return {
        key: holiday.id,
        person: holiday.user.display_name,
        service: holiday.user.service.name,
        start: displayDate(newStartDate),
        end: displayDate(newEndDate),
        duration: getTimeBetweenTwoDates(newStartDate,newEndDate)
    };
}

/**
 * Gives the usefull informations concerning a day event (for the tabular calendar mainly)
 * @param events
 * @param date
 * @returns {{bgColor: *, halfDay: boolean, title: *}|{bgColor: string, halfDay: boolean, title: string}}
 */
export function checkHolidayForCellColor(events, date){
    let defaultResult = {bgColor : 'transparent',title:'',halfDay : false, periodType: PERIOD_TYPE_ALL_DAY};
    for(let i = 0; i < events.length; i++){
        const startDate = new Date(events[i].start);
        const endDate = new Date(events[i].end);
        if(isSameDay(startDate,endDate) && isSameDay(date,startDate)){
            return {
                bgColor : events[i].backgroundColor,
                title : events[i].title,
                halfDay : events[i].halfDay,
                periodType : events[i].periodType
            };
        } else if(isDateBetween(date,startDate,endDate)){
            return {
                ...defaultResult,
                bgColor : events[i].backgroundColor,
                title : events[i].title,
            };
        }
    }
    return defaultResult;
}

/**
 * Return the correct value (which will be displayed) for a given event of the tabular calendar
 * @param eventResult
 * @param dayOfWeek
 * @returns {string}
 */
export function adjustTabularEventBackgroundColor(eventResult,dayOfWeek)
{
    let backgroundColor = eventResult.bgColor;
    if(isItAWeekEndDay(dayOfWeek)){
        backgroundColor = 'grey';
    }else if(eventResult.halfDay === true){
        if(eventResult.periodType === PERIOD_TYPE_MORNING){
            backgroundColor = "linear-gradient(140deg, "+ backgroundColor +" 50%, rgba(255,255,255,0) 50%)";
        } else {
            backgroundColor = "linear-gradient(140deg, rgba(255,255,255,0) 50%, "+ backgroundColor +" 50%)";
        }
    }
    return backgroundColor;
}