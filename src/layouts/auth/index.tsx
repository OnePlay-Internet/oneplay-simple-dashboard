import { createContext, useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/sidebar.css";
import brandLogo from "../../assets/images/oneplayLogo.svg";
import defaultUser from "../../assets/images/user/defaultUser.svg";
import { GameStatusDTO, getAnyActiveSessionStatus, logout } from "src/common/services";

import { SESSION_TOKEN_LOCAL_STORAGE } from "src/common/constants";
import { CurrentFocusContext, SessionContext, UserProfileContext } from "src/App";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { getScrolledCoords } from "src/common/utils";
import ErrorPopUp from "src/pages/error";
import { ReactComponent as IconSearch } from "../../assets/images/icon-search.svg";
import { ReactComponent as IconHome } from "../../assets/images/icon-home.svg";
import { ReactComponent as IconController } from "../../assets/images/icon-controller.svg";
import { ReactComponent as IconSettings } from "../../assets/images/icon-settings.svg";
import { ReactComponent as IconLogout } from "../../assets/images/icon-logout.svg";
import { ReactComponent as IconGameStatusOff } from "../../assets/images/icon-game-status-off.svg";
import { ReactComponent as IconGameStatusLive } from "../../assets/images/icon-game-status-live.svg";
import { addMenuClickedEvent } from "src/common/countly.service";

export const StatusPopupContext = createContext<boolean>(false);

export default function AuthLayout({ focusKey: focusKeyParam }: FocusabelComponentProps) {
  const navigate = useNavigate();
  const sessionContext = useContext(SessionContext);
  const userContext = useContext(UserProfileContext);
  const currentFocusContext = useContext(CurrentFocusContext);
  const [hasFocus, setHasFocus] = useState(false);
  const { pathname } = useLocation();
  const [activeGameSessionStatus, setActiveGameSessionStatus] = useState<GameStatusDTO>({
    is_user_connected: false,
    is_running: false,
    game_id: null,
    game_name: null,
    session_id: null,
    success: false,
  });
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
          setFocus("sidebar-game-status");
        } else {
          setFocus("sidebar-settings");
        }
      }
    },
  });
  /* const btnLogoutClick = async () => {
    const logoutResp = await logout(sessionContext.sessionToken);
    console.log("logout resp : ", logoutResp);
    if (!logoutResp.success) {
    
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
  }; */

  const hidePopup = () => {
    setPopUp((prev) => {
      setFocus(prev.returnFocusTo);
      return {
        show: false,
        message: "",
        title: "",
        returnFocusTo: "",
        buttons: [],
        focusKeyParam: "modal-popup",
        icon: "",
      };
    });
  };

  useEffect(() => {
    const getActiveSessionStatus = async () => {
      const [userId, sessionId] = atob(sessionContext.sessionToken).split(":");
      if (userId && sessionId) {
        const activeSessionStatusResp = await getAnyActiveSessionStatus(userId, sessionId);
        /* if (!activeSessionStatusResp.success) {
          
        } */
        setActiveGameSessionStatus(activeSessionStatusResp);
      }
    };
    const gameStatusCheckInterval = setInterval(getActiveSessionStatus, 5 * 1000);
    return () => {
      clearInterval(gameStatusCheckInterval);
    };
  }, [sessionContext.sessionToken]);
  const onGameStatusClicked = () => {
    if (activeGameSessionStatus.success && activeGameSessionStatus.game_id) {
      let source = "homePage";
      switch (pathname) {
        case "/all-games":
          source = "gamesPage";
          break;
        case "/search":
          source = "searchPage";
          break;
        case "/settings":
          source = "settingsPage";
          break;
        default:
          break;
      }
      navigate(`/games-detail/${activeGameSessionStatus.game_id}?source=${source}&trigger=gameStatus`);
    } else {
      setPopUp({
        show: true,
        message: "No game is running.",
        title: "",
        returnFocusTo: "Sidebar",
        buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
        focusKeyParam: "modal-popup-confirm-exit",
        icon: "success",
      });
    }
  };
  useEffect(() => {
    const onRemoteReturnClicked = (event: any) => {
      console.log("auth index check if status popup is visible : ", popUp.show);
      if (popUp.show) {
        event.stopPropagation();
        hidePopup();
      }
    };
    window.addEventListener("RemoteReturnClicked", onRemoteReturnClicked);
    return () => {
      window.removeEventListener("RemoteReturnClicked", onRemoteReturnClicked);
    };
  }, [popUp, hidePopup]);

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
                <p style={{ textAlign: "left" }}>
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
                    setCurrentFocusContext={currentFocusContext.setFocusKey}
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
                    setCurrentFocusContext={currentFocusContext.setFocusKey}
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
                    setCurrentFocusContext={currentFocusContext.setFocusKey}
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
                    focusKeyParam="sidebar-game-status"
                    onClick={onGameStatusClicked}
                    to="/"
                    setCurrentFocusContext={currentFocusContext.setFocusKey}
                  >
                    {activeGameSessionStatus.success && activeGameSessionStatus.game_id ? (
                      <IconGameStatusLive className="sidebar-icon" />
                    ) : (
                      <IconGameStatusOff className="sidebar-icon" />
                    )}

                    {hasFocus ? <span className="sidebar-text">Status</span> : ""}
                  </FocusableLink>
                </p>
                <p>
                  <FocusableLink
                    focusKeyParam="sidebar-settings"
                    to="/settings"
                    setCurrentFocusContext={currentFocusContext.setFocusKey}
                    /*  onClick={() => {
                      navigate("/settings");
                    }} */
                  >
                    {/* <img src={iconSettings} className="sidebar-icon" alt="settings-icon" /> */}
                    <IconSettings className="sidebar-icon" />
                    {hasFocus ? <span className="sidebar-text">Settings</span> : ""}
                  </FocusableLink>
                </p>
                {/*    <p>
                  <FocusableLink
                    focusKeyParam="sidebar-logout"
                    onClick={btnLogoutClick}
                    to="/"
                    setCurrentFocusContext={currentFocusContext.setFocusKey}
                  >
                 
                    <IconLogout className="sidebar-icon" />
                    {hasFocus ? <span className="sidebar-text">Logout</span> : ""}
                  </FocusableLink>
                </p> */}
              </div>
            </div>
            {popUp.show && <ErrorPopUp {...popUp} />}
          </FocusContext.Provider>
          <div className="col">
            <div className="text-end px-3 pt-3 fixed-top" style={{ backgroundColor: "#151617" }}>
              <img src={brandLogo} className="img-fluid" alt="" />
            </div>
            <StatusPopupContext.Provider value={popUp.show}>
              <Outlet />
            </StatusPopupContext.Provider>
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
    onFocus: () => {
      props.setCurrentFocusContext(props.focusKeyParam);
    },
    onEnterPress: () => {
      switch (props.focusKeyParam) {
        case "sidebar-home":
          addMenuClickedEvent("home");
          break;
        case "sidebar-search":
          addMenuClickedEvent("search");
          break;
        case "sidebar-allGames":
          addMenuClickedEvent("games");
          break;
        case "sidebar-game-status":
          addMenuClickedEvent("status");
          break;
        case "sidebar-settings":
          addMenuClickedEvent("settings");
          break;
      }
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
      if (
        direction === "right" ||
        direction === "left" ||
        (props.focusKeyParam === "sidebar-settings" && direction === "down") ||
        (props.focusKeyParam === "sidebar-home" && direction === "up")
      ) {
        console.log("inside on sidebar arrow : ", pathname);
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
