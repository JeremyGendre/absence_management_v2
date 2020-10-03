import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {getYearMonthsDaysNumber} from "../../utils/date";

import './TabularCalendar.css';

const today = new Date();

const months = getYearMonthsDaysNumber(today.getFullYear());

export default function TabularCalendar(props){
    const [month,setMonth] = useState(today.getMonth());

    console.log(month);

    function handleNextClick(){
        setMonth(month + 1);
    }

    function handlePrevClick(){
        setMonth(month - 1);
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

