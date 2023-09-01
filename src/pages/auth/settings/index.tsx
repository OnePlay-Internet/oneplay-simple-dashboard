import { NavLink } from "react-router-dom";
import Profile from "./profile";
import Subscription from "./subscription";
import DeviceHistory from "./deviceHistory";
import General from "./general";
import React, { useContext, useEffect, useState } from "react";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { getScrolledCoords } from "src/common/utils";

export default function Settings({
  focusKey: focusKeyParam,
}: FocusabelComponentProps) {
  const [currentSelection, setCurrentSelection] = React.useState("profile");
  const profileClick = () => setCurrentSelection("profile");
  const subscriptionClick = () => setCurrentSelection("subscriptions");
  const deviceHistoryClick = () => setCurrentSelection("deviceHistory");
  const GeneralClick = () => setCurrentSelection("general");
  const { focusKey, setFocus, focusSelf } = useFocusable({
    focusable: true,
    focusKey: focusKeyParam,
  });
  /*  
  useEffect(() => {
    setFocus("go-to-profile");
  }, [setFocus]); */
  useEffect(() => {
    setFocus("go-to-profile");
  }, [focusSelf]);
  //const [settingsFocus, setSettingsFocus] = useState(0);
  const renderSelection = () => {
    switch (currentSelection) {
      case "general":
        return <General />;
        
      case "profile":
        return <Profile focusKey="Profile" />;

      case "subscriptions":
        return <Subscription focusKey="Subscriptions" />;

      case "deviceHistory":
        return <DeviceHistory focusKey="DeviceHistory" />;
    }
  };
  return (
    <FocusContext.Provider value={focusKeyParam}>
      <div className="row mainContainer">
        <div className="col-md-2">
          <h1 className="mainHeading">Settings</h1>
          <div className="settingsNavigation mt-4">
            <FocusableParagraph
              focusKeyParam="go-to-general"
              onClick={GeneralClick}
              currentSelection={currentSelection}
            >
              <NavLink
                to=""
                className={"text-decoration-none text-initial setting-menu" + (currentSelection === "General" ? " current" : "")}
              >
                General
              </NavLink>
            </FocusableParagraph>
          
            <FocusableParagraph
              focusKeyParam="go-to-profile"
              onClick={profileClick}
              currentSelection={currentSelection}
              // setParentFocus={setSettingsFocus}
            >
              <NavLink
                to=""
                className={
                  "text-decoration-none text-initial setting-menu" +
                  (currentSelection === "profile" ? " current" : "")
                }
                onClick={profileClick}
              >
                Profile
              </NavLink>
            </FocusableParagraph>
            <FocusableParagraph
              focusKeyParam="go-to-subscription"
              onClick={subscriptionClick}
              currentSelection={currentSelection}
              // setParentFocus={setSettingsFocus}
            >
              <NavLink
                to=""
                className={
                  "text-decoration-none text-initial setting-menu" +
                  (currentSelection === "subscriptions" ? " current" : "")
                }
                onClick={subscriptionClick}
              >
                Subscription
              </NavLink>
            </FocusableParagraph>
            <FocusableParagraph
              focusKeyParam="go-to-device-history"
              onClick={deviceHistoryClick}
              currentSelection={currentSelection}
              //setParentFocus={setSettingsFocus}
            >
              <NavLink
                to=""
                className={
                  "text-decoration-none text-initial setting-menu" +
                  (currentSelection === "deviceHistory" ? " current" : "")
                }
                onClick={deviceHistoryClick}
              >
                Device History
              </NavLink>
            </FocusableParagraph>
          </div>
        </div>
        <div className="col-md-10 borderLeft">{renderSelection()}</div>
      </div>
    </FocusContext.Provider>
  );
}

const FocusableParagraph = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {
      props.onClick();
    },
    onArrowPress: (direction, keyProps, details) => {
      if (direction === "right") {
        console.log(
          "settings arrow : %s, %s",
          direction,
          props.currentSelection
        );
        switch (props.currentSelection) {
          case "general":
            setFocus("General");
            return false;
          case "profile":
            setFocus("Profile");
            return false;
          case "subscriptions":
            setFocus("Subscriptions");
            return false;
          case "deviceHistory":
            console.log("inside device history");
            setFocus("DeviceHistory");
            return false;
        }
      } else if (direction === "left") {
        setFocus("Sidebar", getScrolledCoords(ref.current));
        return false;
      }
      return true;
    },
  });
  return (
    <p
      ref={ref}
      style={{ borderRadius: "0.5rem", padding: "5px", margin: '10px 0px 10px 0px' }}
      className={focused ? "focusedElement" : ""}
      onClick={props.onClick}
    >
      {props.children}
    </p>
  );
};