import React from 'react';
import PropTypes from 'prop-types';

export default function TabularCalendar(props){

    const today = new Date();
    console.log(today,today.getDate(),today.getDay());

    return (
        <div>
            ouais
        </div>
    );
}

TabularCalendar.propTypes = {
    users: PropTypes.array.isRequired
};

