import { NavLink } from "react-router-dom";
import Profile from "./profile";
import Subscription from "./subscription";
import React, { useContext, useEffect, useState } from "react";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { FocusTrackContext } from "src/App";

export default function Settings({
  focusKey: focusKeyParam,
}: FocusabelComponentProps) {
  const [showResults, setShowResults] = React.useState(false);
  const profileClick = () => setShowResults(false);
  const subscriptionClick = () => setShowResults(true);
  const { focusSelf, focusKey, setFocus } = useFocusable({
    trackChildren: true,
    focusKey: focusKeyParam,
  });
  const focusTrackContext = useContext(FocusTrackContext);
  useEffect(() => {
    setFocus("go-to-profile");
  }, [setFocus, focusTrackContext]);

  const [settingsFocus, setSettingsFocus] = useState(0);
  return (
    <FocusContext.Provider value={focusKey}>
      <div className="row mainContainer">
        <div className="col-md-2 pt-5">
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
                  (showResults ? "" : " current")
                }
                onClick={profileClick}
              >
                Profile
              </NavLink>
            </FocusableParagraph>
            {/* <p><NavLink to="" className="text-decoration-none text-initial"> Login & Security</NavLink></p> */}
            <FocusableParagraph
              focusKeyParam="go-to-subscription"
              onClick={subscriptionClick}
              setParentFocus={setSettingsFocus}
            >
              <NavLink
                to=""
                className={
                  "text-decoration-none text-initial setting-menu" +
                  (showResults ? " current" : "")
                }
                onClick={subscriptionClick}
              >
                Subscription
              </NavLink>
            </FocusableParagraph>
            {/* <p><NavLink to="" className="text-decoration-none text-initial"> Device History</NavLink></p> */}
          </div>
        </div>
        <div className="col-md-10 borderLeft">
          {showResults ? (
            <Subscription focusKey="Subscription" parentFocus={settingsFocus} />
          ) : (
            <Profile focusKey="Profile" parentFocus={settingsFocus} />
          )}
        </div>
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