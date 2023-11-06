import { NavLink } from "react-router-dom";
import Profile from "./profile";
import Subscription from "./subscription";
import DeviceHistory from "./deviceHistory";
import General from "./general";
import React, { useEffect, useRef, useState } from "react";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { getScrolledCoords, scrollToTop } from "src/common/utils";
import { COUNTLY_PARTNER_NAME, COUNTLY_PLATFORM } from "src/common/constants";
import { endSettingsViewEvent, startSettingsViewEvent } from "src/common/countly.service";

export default function Settings({ focusKey: focusKeyParam }: FocusabelComponentProps) {
  const [currentSelection, setCurrentSelection] = React.useState("general");
  const settingsEvents = useRef({
    key: "settingsView",
    count: 1,
    segmentation: {
      turnOffPrivacyEnabled: "no",
      turnOffPrivacyDisabled: "no",
      deleteSessionDataClicked: "no",
      deleteSessionDataConfirmClicked: "no",
      logOutClicked: "no",
      logOutConfirmClicked: "no",
      subscriptionViewed: "no",
      deviceHistoryViewed: "no",
      logoutFromAllClicked: "no",
      channel: COUNTLY_PLATFORM,
      partner: COUNTLY_PARTNER_NAME,
    },
  });
  const profileClick = () => setCurrentSelection("profile");
  const subscriptionClick = () => setCurrentSelection("subscriptions");
  const deviceHistoryClick = () => setCurrentSelection("deviceHistory");
  const GeneralClick = () => setCurrentSelection("general");

  const { focusKey, setFocus, focusSelf } = useFocusable({
    focusable: true,
    focusKey: focusKeyParam,
  });
  useEffect(() => {
    startSettingsViewEvent();
    return () => {
      endSettingsViewEvent(settingsEvents.current);
    };
  }, []);
  useEffect(() => {
    switch (currentSelection) {
      case "subscriptions":
        settingsEvents.current.segmentation.subscriptionViewed = "yes";
        break;
      case "deviceHistory":
        settingsEvents.current.segmentation.deviceHistoryViewed = "yes";
        break;
    }
  }, [currentSelection]);
  useEffect(() => {
    setFocus("go-to-general");
  }, [focusSelf]);
  //const [settingsFocus, setSettingsFocus] = useState(0);

  const logCountlyEvent = (action: string) => {
    console.log("action : ", action);
    switch (action) {
      case "logout_click":
        settingsEvents.current.segmentation.logOutClicked = "yes";
        break;
      case "logout_confirm_click":
        settingsEvents.current.segmentation.logOutConfirmClicked = "yes";
        break;
      case "delete_session_data_clicked":
        settingsEvents.current.segmentation.deleteSessionDataClicked = "yes";
        break;
      case "delete_session_data_confirm_clicked":
        settingsEvents.current.segmentation.deleteSessionDataConfirmClicked = "yes";
        break;
      case "turn_on_search_privacy":
        settingsEvents.current.segmentation.turnOffPrivacyEnabled = "yes";
        break;
      case "turn_off_search_privacy":
        settingsEvents.current.segmentation.turnOffPrivacyDisabled = "yes";
        break;
      case "logout_from_all_clicked":
        settingsEvents.current.segmentation.logoutFromAllClicked = "yes";
        break;
      default:
        break;
    }
  };
  const renderSelection = () => {
    switch (currentSelection) {
      case "general":
        return <General focusKey="General" logCountlyEvent={logCountlyEvent} />;

      case "profile":
        return <Profile focusKey="Profile" logCountlyEvent={logCountlyEvent} />;

      case "subscriptions":
        return <Subscription focusKey="Subscriptions" logCountlyEvent={logCountlyEvent} />;

      case "deviceHistory":
        return <DeviceHistory focusKey="DeviceHistory" logCountlyEvent={logCountlyEvent} />;
    }
  };

  return (
    <FocusContext.Provider value={focusKeyParam}>
      <div className="row mainContainer">
        <div className="col-md-3">
          <h1 className="mainHeading">Settings</h1>
          <div className="settingsNavigation mt-4">
            <FocusableParagraph focusKeyParam="go-to-general" onClick={GeneralClick} currentSelection={currentSelection}>
              <NavLink
                to=""
                className={"text-decoration-none text-initial setting-menu" + (currentSelection === "general" ? " current" : "")}
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
                className={"text-decoration-none text-initial setting-menu" + (currentSelection === "profile" ? " current" : "")}
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
                className={"text-decoration-none text-initial setting-menu" + (currentSelection === "subscriptions" ? " current" : "")}
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
                className={"text-decoration-none text-initial setting-menu" + (currentSelection === "deviceHistory" ? " current" : "")}
                onClick={deviceHistoryClick}
              >
                Device History
              </NavLink>
            </FocusableParagraph>
          </div>
        </div>
        <div className="col-md-9 borderLeft">{renderSelection()}</div>
      </div>
    </FocusContext.Provider>
  );
}

const FocusableParagraph = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {
      scrollToTop();
    },
    onEnterPress: () => {
      props.onClick();
    },
    onArrowPress: (direction, keyProps, details) => {
      if (direction === "down" && props.focusKeyParam === "go-to-device-history") {
        return false;
      } else if (direction === "right") {
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
      style={{ borderRadius: "0.5rem", padding: "5px", margin: "10px 0px 10px 0px" }}
      className={focused ? "focusedElement" : ""}
      onClick={props.onClick}
    >
      {props.children}
    </p>
  );
};