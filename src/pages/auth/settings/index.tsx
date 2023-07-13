import { NavLink } from "react-router-dom";
import Profile from "./profile";
import Subscription from "./subscription";
import React, { useEffect } from "react";
import styled from "styled-components";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";

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
  useEffect(() => {
    setFocus("go-to-profile");
  }, [setFocus]);
  return (
    <FocusContext.Provider value={focusKey}>
      <div className="row mainContainer">
        <div className="col-md-2 pt-5">
          <h1 className="mainHeading">Settings</h1>
          <div className="settingsNavigation mt-4">
            <FocusableParagraph
              focusKeyParam="go-to-profile"
              onClick={profileClick}
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
            <Subscription focusKey="Subscription" />
          ) : (
            <Profile focusKey="Profile" />
          )}
        </div>
      </div>
    </FocusContext.Provider>
  );
}

const FocusableParaStyled = styled.p<FocusableItemProps>`
  border-radius: 0.5rem;
  padding: 5px;
  box-shadow: ${({ focused }) =>
    focused ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" : "none"};
`;
const FocusableParagraph = (props: any) => {
  const { ref, focused } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {
      props.onClick();
    },
  });
  return (
    <FocusableParaStyled ref={ref} focused={focused} onClick={props.onClick}>
      {props.children}
    </FocusableParaStyled>
  );
};