import React, {useContext} from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import '../css/app.css';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import NotFoundPage from "./Screen/Errors/404/NotFoundPage";
import NotAuthorizedPage from "./Screen/Errors/403/NotAuthorizedPage";
import Header from "./Component/Header/Header";
import AdminScreen from "./Screen/AdminScreen/AdminScreen";
import ColleaguesCalendarScreen from "./Screen/ColleaguesCalendarScreen/ColleaguesCalendarScreen";
import HolidayListScreen from "./Screen/HolidayListScreen/HolidayListScreen";
import NewHolidaysRequestScreen from "./Screen/NewHolidaysRequestScreen/NewHolidaysRequestScreen";
import PersonnalCalendarScreen from "./Screen/PersonnalCalendarScreen/PersonnalCalendarScreen";
import ProfileScreen from "./Screen/ProfileScreen/ProfileScreen";
import ServiceCalendarScreen from "./Screen/ServiceCalendarScreen/ServiceCalendarScreen";
import ApplicationSession, {SessionContext} from "./Component/Context/session";
import TabularCalendarScreen from "./Screen/TabularCalendarScreen/TabularCalendarScreen";
import MyLoader from "./Component/MyLoader/MyLoader";
import Theme from "./Component/Context/Theme";

function App() {
    const user = useContext(SessionContext);
    return (
        <>
            {user.user === null ? (
                <MyLoader/>
            ) : (
                <Router>
                    <Header/>
                    <div className="my-app-container">
                        <Switch>
                            <Route exact path="/profile"><ProfileScreen/></Route>
                            <Route exact path="/holidays/list"><HolidayListScreen/></Route>
                            <Route exact path="/holidays/new"><NewHolidaysRequestScreen/></Route>
                            <Route exact path="/calendar/personnal"><PersonnalCalendarScreen/></Route>
                            <Route exact path="/calendar/service"><ServiceCalendarScreen/></Route>
                            <Route exact path="/calendar/colleagues"><ColleaguesCalendarScreen/></Route>
                            <Route exact path="/calendar/tabular"><TabularCalendarScreen/></Route>
                            <Route exact path="/admin"><AdminScreen/></Route>
                            <Route path="/404" component={NotFoundPage} />
                            <Route path="/403" component={NotAuthorizedPage} />
                            <Route path="/"><PersonnalCalendarScreen/></Route>
                            <Redirect to="/404" />
                        </Switch>
                    </div>
                </Router>
            )}
        </>
    );
}

ReactDOM.render(
    <React.StrictMode>
        <ApplicationSession>
            <Theme>
                <App/>
            </Theme>
        </ApplicationSession>
    </React.StrictMode>,
    document.getElementById('app')
);