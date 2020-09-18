import React from "react";
import './myLoader.css';
import {TableCell, TableRow} from "semantic-ui-react";

export default function MyLoader(props){
    let display = '';
    let style = {};
    let size = 'my-loader-normal';
    if(props.size !== undefined){
        switch (props.size) {
            case 'small':
                size = 'my-loader-small';
                break;
            case 'big' :
                size = 'my-loader-big';
                break;
            default:
                size = 'my-loader-normal';
                break;
        }
    }
    if(props.block !== undefined){
        display = 'd-block';
    }
    if(props.style !== undefined){
        style = props.style;
    }
    if (props.fit) {
        return (
            <div className={"my-loading-fit my-loading-screen " + display} style={style}>
                <div className={"my-loader " + size}/>
            </div>
        );
    } else if (props.fitTable){
        let number = props.fitTable
        if(number < 0){
            number = 1;
        }
        let rows = [];
        for(let i = 0; i < (number/2)-1; i++){
            rows.push(<TableCell key={i}/>);
        }
        return (
            <TableRow className={"my-loading-fit my-loading-screen" + display} style={style}>
                {rows}
                <TableCell className="loading-cell">Chargement ...</TableCell>
            </TableRow>
        );
    }else {
        return (
            <div className={"my-loading-container my-loading-screen " + display} style={style}>
                <div className={"my-loader " + size}/>
            </div>
        );
    }
}