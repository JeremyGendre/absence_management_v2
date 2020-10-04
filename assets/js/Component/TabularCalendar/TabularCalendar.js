import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {getDaysOfMonth, getMonth, WEEK_DAYS} from "../../utils/date";

import './TabularCalendar.css';

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
                <table className="tabular-calendar-table">
                    <thead>
                        <tr>
                            <th/>
                            {daysOfMonth.map((day,index) => {
                                return (
                                    <th key={index}>
                                        {index + 1}
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>tg</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

TabularCalendar.propTypes = {
    users: PropTypes.array.isRequired
};

