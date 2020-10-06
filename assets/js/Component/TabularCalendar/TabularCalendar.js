import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {getDaysOfMonth, getMonth, isItAWeekEndDay, WEEK_DAYS} from "../../utils/date";

import './TabularCalendar.css';
import {adjustTabularEventBackgroundColor, checkHolidayForCellColor} from "../../utils/holidayFormat";
import {SessionContext} from "../Context/session";
import {PERIOD_TYPE_ALL_DAY, PERIOD_TYPE_MORNING} from "../../utils/holidaysTypes";

const today = new Date();

export default function TabularCalendar(props){
    const userInfos = useContext(SessionContext);
    const [period,setPeriod] = useState({
        month: getMonth(today.getMonth(), today.getFullYear()),
        year: today.getFullYear()
    });

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

    const daysOfMonth = getDaysOfMonth(period.month.index + 1, period.year, period.month.days);

    return (
        <div id="tabular-calendar-container">
            <div className="tabular-calendar-container-header">
                <div className="current-month">{period.month.label} {period.year}</div>
                <div className="select-month-btn" onClick={handlePrevClick}>Précédent</div>
                <div className="select-month-btn" onClick={handleNextClick}>Suivant</div>
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
                                            return (
                                                <td title={userInfos.isAdmin ? eventResult.title : ''} className="event-cell" style={{background:eventResult.bgColor}} key={index}/>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

TabularCalendar.propTypes = {
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool
};

