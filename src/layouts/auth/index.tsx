import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/sidebar.css";
import brandLogo from "../../assets/images/oneplayLogo.svg";
import defaultUser from "../../assets/images/user/defaultUser.svg";
import { logout } from "src/common/services";
import Swal from "sweetalert2";
import { SESSION_TOKEN_LOCAL_STORAGE } from "src/common/constants";
import { SessionContext, UserProfileContext } from "src/App";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { getScrolledCoords } from "src/common/utils";

export default function AuthLayout({
  focusKey: focusKeyParam,
}: FocusabelComponentProps) {
  const navigate = useNavigate();
  const sessionContext = useContext(SessionContext);
  const userContext = useContext(UserProfileContext);
  const [hasFocus, setHasFocus] = useState(false);
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
    if (!logoutResp.success) {
      Swal.fire({
        title: "Error!",
        text: logoutResp.message,
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    localStorage.removeItem(SESSION_TOKEN_LOCAL_STORAGE);
    userContext.setUserProfile(null);
    sessionContext.setSessionToken(null);
  };
  return (
    <>
      <div className="container-fluid p-0">
        <div className="row">
          <FocusContext.Provider value={focusKey}>
            <div
              className="mt-4 sidebar text-center"
              /* style={{ width: hasFocus ? "120px" : "80px" }} */
            >
              <div
                className="p-3"
                style={{
                  position: "fixed",
                  width: "140px",
                  top: "0",
                  left: "0",
                  zIndex: "1031",
                  height: "100vh",
                  background:
                    "linear-gradient(270deg, rgba(0, 0, 0, 0.00) 0%, #000 100%)",
                }}
              >
                <p className="mb-4" style={{ textAlign: "left" }}>
                  <img
                    className="rounded-circle"
                    width="48"
                    height="48"
                    src={
                      userContext.userProfile &&
                      userContext.userProfile.profile_image
                        ? userContext.userProfile.profile_image
                        : defaultUser
                    }
                    alt={
                      userContext.userProfile
                        ? userContext.userProfile.first_name
                        : ""
                    }
                  />
                </p>
                <p>
                  <FocusableLink
                    focusKeyParam="sidebar-home"
                    to="/home"
                    /*  onClick={() => {
                      navigate("/home");
                    }} */
                  >
                    <i className="fa-solid fa-house"></i>
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
                    <i className="fa-sharp fa-solid fa-magnifying-glass"></i>
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
                    <i className="fa-solid fa-gamepad"></i>
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
                    <i className="fa-solid fa-gear"></i>
                  </FocusableLink>
                </p>
                <p>
                  <FocusableLink
                    focusKeyParam="sidebar-logout"
                    onClick={btnLogoutClick}
                    to="/"
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  </FocusableLink>
                </p>
              </div>
            </div>
          </FocusContext.Provider>
          <div className="col">
            <div
              className="text-end px-3 pt-3 fixed-top"
              style={{ backgroundColor: "#151617" }}
            >
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
    if (
      pathname === props.to ||
      (props.to === "/all-games" && pathname.startsWith("/games-detail"))
    ) {
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
      if (
        direction === "right" ||
        (props.focusKeyParam === "sidebar-logout" && direction === "down")
      ) {
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
      className={
        "text-decoration-none text-initial" +
        (focused ? " focusedElement" : "") +
        (isActive ? " active" : "")
      }
      ref={ref}
      to={props.to}
      onClick={props.onClick}
    >
      {props.children}
    </NavLink>
  );
};
