import {displayDate, getTimeBetweenTwoDates} from "./date";

/**
 * @param holidays
 * @returns {[]}
 */
export function convertListToAdminListFormat(holidays){
    let result = [];
    holidays.map(holiday => {
        result.push(convertOneToAdminListFormat(holiday));
    });
    return result;
}

/**
 * @param holiday
 * @returns {{duration: *, person: *, service: *, start: *, end: *, key: *}}
 */
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