import { NavLink } from "react-router-dom";
import Profile from "./profile";
import Subscription from "./subscription";
import React from "react";

export default function Settings() {
    const [showResults, setShowResults] = React.useState(false)
    const profileClick = () => setShowResults(false)
    const subscriptionClick = () => setShowResults(true)

    return(
        <>
            <div className="row">
                <div className="col-md-2 pt-5">
                    <h1 className="mainHeading">Settings</h1>
                    <div className="settingsNavigation mt-4">
                        <p><NavLink to="" className="text-decoration-none text-initial" onClick={profileClick}> Profile</NavLink></p>
                        {/* <p><NavLink to="" className="text-decoration-none text-initial"> Login & Security</NavLink></p> */}
                        <p><NavLink to="" className="text-decoration-none text-initial" onClick={subscriptionClick}> Subscription</NavLink></p>
                        {/* <p><NavLink to="" className="text-decoration-none text-initial"> Device History</NavLink></p> */}
                    </div>
                </div>
                <div className="col-md-10 borderLeft">
                    { showResults ? <Subscription /> : <Profile /> }
                </div>
            </div>
        </>
    );
}