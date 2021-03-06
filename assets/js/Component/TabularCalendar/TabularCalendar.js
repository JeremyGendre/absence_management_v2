import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {
    getDaysOfMonth,
    getMonth,
} from "../../utils/date";
import './TabularCalendar.css';
import {SessionContext} from "../Context/session";
import {
    checkHolidayForCellColor,
    adjustTabularEventTitle,
    adjustTabularEventBackgroundColor
} from "./functions";

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
            posX : (window.Event) ? e.pageX : e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft),
            posY :(window.Event) ? e.pageY : e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop)
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
                            {props.data.map((dataInfos, index) => {
                                let eventResult = {bgColor:'transparent', title:''};
                                const currentMonth = getCurrentMonth();
                                return (
                                    <tr key={index} className="tabular-calendar-user">
                                        <td className="tabular-user-name-cell">{dataInfos.userName}</td>
                                        {daysOfMonth.map((dayOfWeek, index) => {
                                            eventResult = checkHolidayForCellColor(dataInfos.events, new Date(period.year + '-' + currentMonth + '-' + (index + 1)));
                                            eventResult.bgColor = adjustTabularEventBackgroundColor(eventResult,dayOfWeek, index + 1, currentMonth, props.fixedHolidays);
                                            eventResult.title = adjustTabularEventTitle(eventResult, userInfos.isAdmin);
                                            const element = (eventResult.title !== '') ?
                                                <td data-title={eventResult.title} onMouseMove={cellMouseMove}
                                                    onMouseEnter={cellEnter} onMouseLeave={cellLeave}
                                                    className="event-cell" style={{padding:'1px'}} key={index}>
                                                    <div style={{background:eventResult.bgColor, width:'100%', height:'100%'}}/>
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
    loading: PropTypes.bool,
    fixedHolidays: PropTypes.array
};

