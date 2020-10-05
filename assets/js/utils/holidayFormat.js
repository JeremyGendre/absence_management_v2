import {displayDate, getTimeBetweenTwoDates, isDateBetween} from "./date";

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

export function checkHolidayForCellColor(events, date){
    for(let i = 0; i < events.length; i++){
        let startDate = new Date(events[i].start);
        let endDate = new Date(events[i].end);
        if(isDateBetween(date,startDate,endDate)){
            return events[i].backgroundColor;
        }
    }
    return 'transparent';
}