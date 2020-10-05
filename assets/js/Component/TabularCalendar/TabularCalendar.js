import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {getDaysOfMonth, getMonth, isItAWeekEndDay, WEEK_DAYS} from "../../utils/date";

import './TabularCalendar.css';
import {checkHolidayForCellColor} from "../../utils/holidayFormat";

const today = new Date();

export default function TabularCalendar(props){
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
                <div className="select-month-btn" onClick={handlePrevClick}><b>{'<'}</b> Précédent</div>
                <div className="select-month-btn" onClick={handleNextClick}>Suivant <b>{'>'}</b></div>
            </div>
            <div className="tabular-calendar">
                {props.loading ? (
                    <div>Chargement ...</div>
                ) : (
                    <table className="tabular-calendar-table">
                        <thead>
                            <tr>
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
                                let bgColor = 'transparent';
                                return (
                                    <tr key={index}>
                                        <td className="tabular-user-name-cell">{dataInfos.userName}</td>
                                        {daysOfMonth.map((dayOfWeek,index) => {
                                            bgColor = checkHolidayForCellColor(dataInfos.events,new Date(period.year + '-' + getCurrentMonth() + '-' + (index + 1) ));
                                            if(bgColor === 'transparent' && isItAWeekEndDay(dayOfWeek)){
                                                bgColor = 'grey';
                                            }
                                            return (
                                                <th className="event-cell" style={{backgroundColor:bgColor}} key={index}/>
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

