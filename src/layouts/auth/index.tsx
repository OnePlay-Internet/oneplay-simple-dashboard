import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/sidebar.css";
import brandLogo from "../../assets/images/oneplayLogo.svg";
import defaultUser from "../../assets/images/user/defaultUser.svg";
import { logout } from "src/common/services";
import Swal from "sweetalert2";
import { SESSION_TOKEN_LOCAL_STORAGE } from "src/common/constants";
import { FocusTrackContext, SessionContext, UserProfileContext } from "src/App";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";

export default function AuthLayout({
  focusKey: focusKeyParam,
}: FocusabelComponentProps) {
  const navigate = useNavigate();
  const sessionContext = useContext(SessionContext);
  const userContext = useContext(UserProfileContext);
  const focusTrackContext = useContext<any>(FocusTrackContext);
  const { focusSelf, focusKey } = useFocusable({
    focusKey: focusKeyParam,
    preferredChildFocusKey: "home",
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
      <div className="container-fluid p-0" style={{ overflowX: 'hidden', height: '100vh' }}>
        <div className="row">
          <FocusContext.Provider value={focusKey}>
            <div className="mt-4 sidebar text-center">
              <div
                className="p-3"
                style={{
                  position: "fixed",
                  top: "0",
                  left: "0",
                  zIndex: "1031",
                  height: '100vh',
                  background: 'linear-gradient(270deg, rgba(0, 0, 0, 0.00) 0%, #000 100%)'
                }}
              >
                <p className="mb-4">
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
                    focusKeyParam="sidebar-search"
                    to="/search"
                    onClick={() => {
                      navigate("/search");
                    }}
                    focusTrackContext={focusTrackContext}
                  >
                    <i className="fa-sharp fa-solid fa-magnifying-glass"></i>
                  </FocusableLink>
                </p>
                <p>
                  <FocusableLink
                    focusKeyParam="sidebar-home"
                    to="/home"
                    onClick={() => {
                      navigate("/home");
                    }}
                    focusTrackContext={focusTrackContext}
                  >
                    <i className="fa-solid fa-house"></i>
                  </FocusableLink>
                </p>
                <p>
                  <FocusableLink
                    focusKeyParam="sidebar-allGames"
                    to="/all-games"
                    onClick={() => {
                      navigate("/all-games");
                    }}
                    focusTrackContext={focusTrackContext}
                  >
                    <i className="fa-solid fa-gamepad"></i>
                  </FocusableLink>
                </p>

                <p>
                  <FocusableLink
                    focusKeyParam="sidebar-settings"
                    to="/settings"
                    onClick={() => {
                      navigate("/settings");
                    }}
                    focusTrackContext={focusTrackContext}
                  >
                    <i className="fa-solid fa-gear"></i>
                  </FocusableLink>
                </p>
                <p>
                  <FocusableLink
                    focusKeyParam="sidebar-logout"
                    onClick={btnLogoutClick}
                    focusTrackContext={focusTrackContext}
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
    if (
      pathname === props.to ||
      (pathname.startsWith("/games-detail") && props.to === "/all-games")
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [pathname]);
  const { ref, focused } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {
      if (props.to) {
        navigate(props.to);

        return;
      }
      if (props.onClick) {
        props.onClick();
        return;
      }
    },
    onArrowPress: (direction, keyProps, details) => {
      if (direction === "right") {
        props.focusTrackContext.setFocusCount((prev: number) => {
          return prev + 1;
        });
        return false;
      }
      return true;
    },
  });

  return (
    <a
      className={
        "text-decoration-none text-initial" +
        (focused ? " focusedElement" : "") +
        (isActive ? " active" : "")
      }
      ref={ref}
      href="#"
      onClick={props.onClick}
    >
      {props.children}
    </a>
  );
};
