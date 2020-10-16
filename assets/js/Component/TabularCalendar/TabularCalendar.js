import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {
    displayDate,
    getDaysOfMonth,
    getMonth,
    isDateBetween, isItAWeekEndDay,
    isSameDay
} from "../../utils/date";
import './TabularCalendar.css';
import {SessionContext} from "../Context/session";
import {PERIOD_TYPE_ALL_DAY, PERIOD_TYPE_MORNING} from "../../utils/holidaysTypes";

/**
 * Gives the usefull informations concerning a day event (for the tabular calendar mainly)
 * @param events
 * @param date
 * @returns {{periodType: *, bgColor: *, halfDay: *, start: *, end: *, title: *}|{periodType, bgColor: *, halfDay, start: *, end: *, title: *}|{periodType: *, bgColor: string, halfDay: boolean, start: null, end: null, title: string}}
 */
function checkHolidayForCellColor(events, date){
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
function adjustTabularEventBackgroundColor(eventResult,dayOfWeek)
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
function adjustTabularEventTitle(eventResult, isAdmin)
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
    return title
}

const today = new Date();

const defaultTooltip = {
    text: '',
    posX : 0,
    posY: 0
};

export default function TabularCalendar(props){
    const userInfos = useContext(SessionContext);
    const [period,setPeriod] = useState({
        month: getMonth(today.getMonth(), today.getFullYear()),
        year: today.getFullYear()
    });
    const [tooltip,setTooltip] = useState(defaultTooltip);

    function handleNextClick(){
        let newYear = period.year;
        let newMonth = getMonth(period.month.index + 1, newYear);
        if(newMonth === null){
            newYear++;
            newMonth = getMonth(0, newYear);
        }
        setPeriod({
            month: newMonth,
            year: newYear
        });
    }

    function getCurrentMonth(){
        return period.month.index + 1;
    }

    function handlePrevClick(){
        let newYear = period.year;
        let newMonth = getMonth(period.month.index - 1, newYear);
        if(newMonth === null){
            newYear--;
            newMonth = getMonth(11, newYear);
        }
        setPeriod({
            month: newMonth,
            year: newYear
        });
    }

    function cellEnter(e){
        const element = e.currentTarget;
        const elementText = element.getAttribute('data-title');
        if(elementText !== ''){
            setTooltip({...tooltip,text : elementText});
        }
    }

    function cellLeave(){
        setTooltip(defaultTooltip);
    }

    function cellMouseMove(e){
        setTooltip({
            ...tooltip,
            posX : (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft),
            posY :(window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop)
        });
    }

    const daysOfMonth = getDaysOfMonth(period.month.index + 1, period.year, period.month.days);

    return (
        <div id="tabular-calendar-container">
            <div className="tabular-calendar-container-header">
                <div className="current-month">{period.month.label} {period.year}</div>
                <div className="select-month-btn" onClick={handlePrevClick}>
                    {props.prevButton ?? <div className="default-select-month-btn">Précédent</div>}
                </div>
                <div className="select-month-btn" onClick={handleNextClick}>
                    {props.nextButton ?? <div className="default-select-month-btn">Suivant</div>}
                </div>
            </div>
            <div className="tabular-calendar">
                {props.loading ? (
                    <div className="text-center loading-text">Chargement ...</div>
                ) : (
                    <table className="tabular-calendar-table">
                        <thead>
                            <tr className="tabular-header">
                                <th/>
                                {daysOfMonth.map((dayOfWeek,index) => {
                                    return (
                                        <th key={index}>
                                            {(index + 1) < 10 ? ('0' + (index + 1)) : (index + 1) }
                                        </th>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {props.data.map((dataInfos,index) => {
                                let eventResult = {bgColor:'transparent',title:''};
                                return (
                                    <tr key={index} className="tabular-calendar-user">
                                        <td className="tabular-user-name-cell">{dataInfos.userName}</td>
                                        {daysOfMonth.map((dayOfWeek,index) => {
                                            eventResult = checkHolidayForCellColor(dataInfos.events,new Date(period.year + '-' + getCurrentMonth() + '-' + (index + 1) ));
                                            eventResult.bgColor = adjustTabularEventBackgroundColor(eventResult,dayOfWeek);
                                            eventResult.title = adjustTabularEventTitle(eventResult, userInfos.isAdmin);
                                            const element = (eventResult.title !== '') ?
                                                <td data-title={eventResult.title} onMouseMove={cellMouseMove}
                                                    onMouseEnter={cellEnter} onMouseLeave={cellLeave}
                                                    className="event-cell" style={{padding:'1px'}} key={index}>
                                                    <div style={{background:eventResult.bgColor,width:'100%',height:'100%'}}/>
                                                </td>
                                                :
                                                <td className="event-cell" style={{background:eventResult.bgColor}} key={index}/>;
                                            return (element);
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>
            { tooltip.text !== '' && <div className="tooltip-event" style={{top: tooltip.posY + 'px', left: (tooltip.posX+20) + 'px'}}>{tooltip.text}</div> }
        </div>
    );
}

TabularCalendar.propTypes = {
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool
};

