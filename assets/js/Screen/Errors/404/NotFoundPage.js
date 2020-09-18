import React, {useEffect, useState} from "react";
import './NotFoundPage.css';

export default function NotFoundPage(props){
    let windowHeight = window.innerHeight;
    const [height,setHeight] = useState(windowHeight);

    useEffect(() => {
        let windowHeight = window.innerHeight;
        let header = document.getElementById("header");
        setHeight(windowHeight - header.offsetHeight - 1);
    },[])

    return(
        <div className="not-found-container" style={{height:height + 'px'}}>
            <div className="not-found-subcontainer">
                <div className="not-found-404">404</div>
                <div className="not-found-text">We can not find the page you're looking for :(</div>
            </div>
        </div>
    );
}