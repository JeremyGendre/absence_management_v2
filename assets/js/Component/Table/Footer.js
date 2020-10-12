import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {Pagination, TableFooter, TableHeaderCell, TableRow} from "semantic-ui-react";
import {THEME_VALUES, ThemeContext} from "../Context/Theme";

export default function Footer(props){
    const theme = useContext(ThemeContext);
    return (
        <TableFooter>
            <TableRow>
                <TableHeaderCell colSpan={8}>
                    <Pagination
                        inverted={theme.value === THEME_VALUES.dark}
                        floated='right'
                        activePage={props.activePage}
                        boundaryRange={1}
                        onPageChange={(e, pagination) => props.Paginate(pagination.activePage)}
                        siblingRange={1}
                        totalPages={props.totalPages}
                        firstItem={null}
                        lastItem={null}
                    />
                </TableHeaderCell>
            </TableRow>
        </TableFooter>
    );
}

Footer.propTypes = {
    activePage:PropTypes.number.isRequired,
    totalPages:PropTypes.number.isRequired,
    Paginate:PropTypes.func.isRequired
};