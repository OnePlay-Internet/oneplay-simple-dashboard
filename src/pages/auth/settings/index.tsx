import { NavLink } from "react-router-dom";
import Profile from "./profile";
import Subscription from "./subscription";
import DeviceHistory from "./deviceHistory";
import React, { useContext, useEffect, useState } from "react";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { FocusTrackContext } from "src/App";

export default function Settings({
  focusKey: focusKeyParam,
}: FocusabelComponentProps) {
  const [currentSelection, setCurrentSelection] = React.useState("profile");
  const profileClick = () => setCurrentSelection("profile");
  const subscriptionClick = () => setCurrentSelection("subscriptions");
  const deviceHistoryClick = () => setCurrentSelection("deviceHistory");
  const { focusKey, setFocus } = useFocusable({
    trackChildren: true,
    focusKey: focusKeyParam,
  });
  const focusTrackContext = useContext(FocusTrackContext);
  useEffect(() => {
    setFocus("go-to-profile");
  }, [setFocus, focusTrackContext]);

  const [settingsFocus, setSettingsFocus] = useState(0);
  const renderSelection = () => {
    switch (currentSelection) {
      case "profile":
        return <Profile focusKey="Profile" parentFocus={settingsFocus} />;

      case "subscriptions":
        return (
          <Subscription focusKey="Subscriptions" parentFocus={settingsFocus} />
        );

      case "deviceHistory":
        return (
          <DeviceHistory focusKey="DeviceHistory" parentFocus={settingsFocus} />
        );
    }
  };
  return (
    <FocusContext.Provider value={focusKey}>
      <div className="row mainContainer">
        <div className="col-md-2">
          <h1 className="mainHeading">Settings</h1>
          <div className="settingsNavigation mt-4">
            <FocusableParagraph
              focusKeyParam="go-to-profile"
              onClick={profileClick}
              setParentFocus={setSettingsFocus}
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
              setParentFocus={setSettingsFocus}
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
              setParentFocus={setSettingsFocus}
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
      switch (direction) {
        case "right":
          props.setParentFocus((prev: number) => {
            return prev + 1;
          });
          break;
        case "left":
          setFocus("sidebar-search");
          break;
        default:
          return true;
      }
      if (direction === "right") {
        return false;
      }
      return true;
    },
  });
  return (
    <p
      ref={ref}
      style={{ borderRadius: "0.5rem", padding: "5px" }}
      className={focused ? "focusedElement" : ""}
      onClick={props.onClick}
    >
      {props.children}
    </p>
  );
};