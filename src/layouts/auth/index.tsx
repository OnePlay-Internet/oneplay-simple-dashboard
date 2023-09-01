import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/sidebar.css";
import brandLogo from "../../assets/images/oneplayLogo.svg";
import defaultUser from "../../assets/images/user/defaultUser.svg";
import { logout } from "src/common/services";

import { SESSION_TOKEN_LOCAL_STORAGE } from "src/common/constants";
import { SessionContext, UserProfileContext } from "src/App";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { getScrolledCoords } from "src/common/utils";
import ErrorPopUp from "src/pages/error";
import { ReactComponent as IconSearch } from "../../assets/images/icon-search.svg";
import { ReactComponent as IconHome } from "../../assets/images/icon-home.svg";
import { ReactComponent as IconController } from "../../assets/images/icon-controller.svg";
import { ReactComponent as IconSettings } from "../../assets/images/icon-settings.svg";
import { ReactComponent as IconLogout } from "../../assets/images/icon-logout.svg";
export default function AuthLayout({ focusKey: focusKeyParam }: FocusabelComponentProps) {
  const navigate = useNavigate();
  const sessionContext = useContext(SessionContext);
  const userContext = useContext(UserProfileContext);
  const [hasFocus, setHasFocus] = useState(false);
  const [popUp, setPopUp] = useState<ErrorPopupPorps>({
    show: false,
    message: "",
    title: "",
    returnFocusTo: "",
    buttons: [],
    focusKeyParam: "modal-popup",
    icon: "",
  });
  const { focusSelf, focusKey, setFocus } = useFocusable({
    focusable: true,
    focusKey: focusKeyParam,
    preferredChildFocusKey: "sidebar-home",
    onBlur: () => {
      setHasFocus(false);
    },
    onFocus: (componentLayout, extraProps, focusDetails) => {
      setHasFocus(true);
      if (focusDetails && focusDetails.pos) {
        if (focusDetails.pos.top <= 100) {
          setFocus("sidebar-home");
        } else if (focusDetails.pos.top <= 144) {
          setFocus("sidebar-search");
        } else if (focusDetails.pos.top <= 192) {
          setFocus("sidebar-allGames");
        } else if (focusDetails.pos.top <= 240) {
          setFocus("sidebar-settings");
        } else {
          setFocus("sidebar-logout");
        }
      }
    },
  });
  const btnLogoutClick = async () => {
    const logoutResp = await logout(sessionContext.sessionToken);
    console.log("logout resp : ", logoutResp);
    if (!logoutResp.success) {
      /* Swal.fire({
        title: "Error!",
        text: logoutResp.message,
        icon: "error",
        confirmButtonText: "OK",
      }); */
      setPopUp({
        show: true,
        message: logoutResp.message ?? "",
        title: "Error!",
        returnFocusTo: "sidebar-logout",
        buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
        focusKeyParam: "modal-popup-confirm-exit",
        icon: "error",
      });
      return;
    }

    localStorage.removeItem(SESSION_TOKEN_LOCAL_STORAGE);
    userContext.setUserProfile(null);
    sessionContext.setSessionToken(null);
    navigate("/");
  };

  const hidePopup = () => {
    const returnFocusTo = popUp.returnFocusTo;
    setPopUp({
      show: false,
      message: "",
      title: "",
      returnFocusTo: "",
      buttons: [],
      focusKeyParam: "modal-popup",
      icon: "",
    });
    setFocus(returnFocusTo);
  };
  return (
    <>
      <div className="container-fluid p-0">
        <div className="row">
          <FocusContext.Provider value={focusKey}>
            <div
              className={hasFocus ? "mt-4 sidebar focused text-center" : "mt-4 sidebar collapsed text-center"}
              /* style={{ width: hasFocus ? "120px" : "80px" }} */
            >
              <div
                className="sidebar-items-wrapper"
                style={{
                  width: hasFocus ? "50%" : "120px",
                }}
              >
                <p style={{ textAlign: "left", marginBottom: "32px" }}>
                  <a href="#">
                    <img
                      className="rounded-circle sidebar-icon"
                      width="48"
                      height="48"
                      src={
                        userContext.userProfile && userContext.userProfile.profile_image
                          ? userContext.userProfile.profile_image
                          : defaultUser
                      }
                      alt={userContext.userProfile ? userContext.userProfile.first_name : ""}
                      style={{ marginLeft: "-0.5rem", height: "52px" }}
                    />
                    {hasFocus ? (
                      <span className="sidebar-text username-text">
                        {userContext.userProfile ? userContext.userProfile.first_name + " " + userContext.userProfile.last_name : ""}
                      </span>
                    ) : (
                      ""
                    )}
                  </a>
                </p>

                <p>
                  <FocusableLink
                    focusKeyParam="sidebar-home"
                    to="/home"
                    /*  onClick={() => {
                      navigate("/home");
                    }} */
                  >
                    {/* <img src={iconHome} className="sidebar-icon" alt="home-icon" /> */}
                    <IconHome className="sidebar-icon" />
                    {hasFocus ? <span className="sidebar-text">Home</span> : ""}
                  </FocusableLink>
                </p>

                <p>
                  <FocusableLink
                    focusKeyParam="sidebar-search"
                    to="/search"
                    /*  onClick={() => {
                      navigate("/search");
                    }} */
                  >
                    {/* <img src={iconSearch} className="sidebar-icon" alt="search-icon" /> */}
                    <IconSearch className="sidebar-icon" />
                    {hasFocus ? <span className="sidebar-text">Search</span> : ""}
                  </FocusableLink>
                </p>

                <p>
                  <FocusableLink
                    focusKeyParam="sidebar-allGames"
                    to="/all-games"
                    /*  onClick={() => {
                      navigate("/all-games");
                    }} */
                  >
                    {/*     <img src={iconController} className="sidebar-icon" alt="controller-icon" /> */}
                    <IconController className="sidebar-icon" />
                    {hasFocus ? <span className="sidebar-text">Games</span> : ""}
                  </FocusableLink>
                </p>

                <p>
                  <FocusableLink
                    focusKeyParam="sidebar-settings"
                    to="/settings"
                    /*  onClick={() => {
                      navigate("/settings");
                    }} */
                  >
                    {/* <img src={iconSettings} className="sidebar-icon" alt="settings-icon" /> */}
                    <IconSettings className="sidebar-icon" />
                    {hasFocus ? <span className="sidebar-text">Settings</span> : ""}
                  </FocusableLink>
                </p>
                <p>
                  <FocusableLink focusKeyParam="sidebar-logout" onClick={btnLogoutClick} to="/">
                    {/* <img src={iconLogout} alt="logout-icon" className="sidebar-icon" /> */}
                    <IconLogout className="sidebar-icon" />
                    {hasFocus ? <span className="sidebar-text">Logout</span> : ""}
                  </FocusableLink>
                </p>
              </div>
            </div>
            {popUp.show && <ErrorPopUp {...popUp} />}
          </FocusContext.Provider>
          <div className="col">
            <div className="text-end px-3 pt-3 fixed-top" style={{ backgroundColor: "#151617" }}>
              <img src={brandLogo} className="img-fluid" alt="" />
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

const FocusableLink = (props: any) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    if (props.onClick) {
      setIsActive(false);
      return;
    }
    if (pathname === props.to || (props.to === "/all-games" && pathname.startsWith("/games-detail"))) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [pathname]);
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {
      if (props.onClick) {
        props.onClick();
        return;
      }
      if (props.to) {
        navigate(props.to);
        return;
      }
    },
    onArrowPress: (direction, keyProps, details) => {
      if (direction === "right" || (props.focusKeyParam === "sidebar-logout" && direction === "down")) {
        console.log("sidebar pathname : ", pathname);
        switch (pathname) {
          case "/home":
            setFocus("Home", { pos: getScrolledCoords(ref.current) });
            return false;
          case "/all-games":
            setFocus("AllGames", { pos: getScrolledCoords(ref.current) });
            return false;

          case "/search":
            setFocus("SearchGames", { pos: getScrolledCoords(ref.current) });
            return false;
          case "/settings":
            setFocus("Settings", { pos: getScrolledCoords(ref.current) });
            return false;
          default:
            if (pathname.startsWith("/games-detail")) {
              setFocus("GameDetail", { pos: getScrolledCoords(ref.current) });
              return false;
            }
            return true;
        }
      }
      return true;
    },
  });

  return (
    <NavLink
      className={"text-decoration-none text-initial" + (focused ? " focused-sidebar-item" : "") + (isActive ? " active" : "")}
      ref={ref}
      to={props.to}
      onClick={props.onClick}
    >
      {props.children}
    </NavLink>
  );
};
