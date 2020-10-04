import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {getMonth, getYearMonths} from "../../utils/date";

import './TabularCalendar.css';

const today = new Date();

const months = getYearMonths(today.getFullYear());

export default function TabularCalendar(props){
    const [period,setPeriod] = useState({
        month: getMonth(today.getMonth(), today.getFullYear()),
        year: today.getFullYear()
    });

    console.log(period);

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

    return (
        <div id="tabular-calendar-container">
            <div className="select-month-btn" onClick={handlePrevClick}>Précédent</div>
            <div className="select-month-btn" onClick={handleNextClick}>Suivant</div>
        </div>
    );
}

TabularCalendar.propTypes = {
    users: PropTypes.array.isRequired
};

