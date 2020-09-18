import React, {useEffect, useState} from "react";
import './NotAuthorizedPage.css';

export default function NotAuthorizedPage(props){
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
                <div className="not-found-403">403</div>
                <div className="not-found-text">You do not have access to this page :(</div>
            </div>
        </div>
    );
}
