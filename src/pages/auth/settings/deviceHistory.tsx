import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { SessionContext } from "src/App";
import { SESSION_TOKEN_LOCAL_STORAGE, SHOW_GAME_SETTINGS_CHECKED } from "src/common/constants";
import { getUsersSessions, sessionLogout } from "src/common/services";
import { scrollToElement, scrollToTop, timeAgo } from "src/common/utils";
import { StatusPopupContext } from "src/layouts/auth";
import ErrorPopUp from "src/pages/error";

export default function DeviceHistory({ focusKey: focusKeyParam, logCountlyEvent }: FocusabelComponentProps) {
  const navigate = useNavigate();
  const sessionContext = useContext(SessionContext);
  const [sessions, setSessions] = useState<any[]>([]);
  const statusPopupContext = useContext(StatusPopupContext);
  const [popUp, setPopUp] = useState<ErrorPopupPorps>({
    show: false,
    message: "",
    title: "",
    returnFocusTo: "",
    buttons: [],
    focusKeyParam: "modal-popup",
    icon: "",
  });
  const { focusSelf, focusKey, setFocus, focused } = useFocusable({
    focusable: true,
    focusKey: focusKeyParam,
    preferredChildFocusKey: "btn-logout-form-all",
  }); /* 
  useEffect(() => {
    focusSelf();
  }, [focusSelf]);*/
  useEffect(() => {
    if (focused) {
      if (sessions && sessions.length) {
        setFocus("btn-logout-0");
      } else {
        setFocus("btn-logout-form-all");
      }
    }
  }, [focused]);
  useEffect(() => {
    if (sessions && sessions.length) {
      setFocus("btn-logout-0");
    }
  }, [sessions]);
  const getSessions = async () => {
    if (sessionContext.sessionToken) {
      const sessionsResp: any = await getUsersSessions(sessionContext.sessionToken);
      if (!sessionsResp.success) {
        /*  Swal.fire({
          title: "Error!",
          text: sessionsResp.message,
          icon: "error",
          confirmButtonText: "OK",
        }); */
        localStorage.removeItem(SESSION_TOKEN_LOCAL_STORAGE);
        localStorage.removeItem(SHOW_GAME_SETTINGS_CHECKED);
        sessionContext.setSessionToken(null);

        navigate("/");
        return;
      }
      setSessions(sessionsResp.sessions);
    }
  };
  useEffect(() => {
    getSessions();
  }, [sessionContext.sessionToken]);
  const renderSingleSessionRow = (session: any, index: number) => {
    const [userid, token] = atob(sessionContext.sessionToken).split(":");

    const isActive = session.key === `user:${userid}:session:${token}`;
    return (
      <tr key={session.key}>
        <td className="py-3 px-0">
          <p className="mb-2">{session.device_info.app}</p>
          <p className="gamesDescription mb-0">{session.device_info.device}</p>
        </td>
        <td className="py-3 px-0">
          <p className="mb-2">{session.location_info.city}</p>
          <p className="gamesDescription mb-0">{session.location_info.country}</p>
        </td>
        <td className="py-3 px-0">
          <p className={"mb-0" + (isActive ? " gradientText" : "")}>{isActive ? "Active Now" : timeAgo(session.timestamp)}</p>
        </td>
        <td className="py-3 px-0">
          <FocusableSapn
            focusKeyParam={`btn-logout-${index}`}
            onClick={() => {
              onSingleLogout(session.key);
            }}
            classes="gradientText"
          >
            Log out
          </FocusableSapn>
        </td>
      </tr>
    );
  };
  const onLogoutFromAllDevice = async () => {
    logCountlyEvent("logout_from_all_clicked");
    const [userid, token] = atob(sessionContext.sessionToken).split(":");
    for await (const session of sessions) {
      const isActive = session.key === `user:${userid}:session:${token}`;
      if (!isActive) {
        await sessionLogout(session.key, sessionContext.sessionToken);
      }
    }
    await sessionLogout(`user:${userid}:session:${token}`, sessionContext.sessionToken);
    localStorage.removeItem(SESSION_TOKEN_LOCAL_STORAGE);
    localStorage.removeItem(SHOW_GAME_SETTINGS_CHECKED);
    sessionContext.setSessionToken(null);
    navigate("/");
  };
  const onSingleLogout = async (sessionKey: string) => {
    const logoutResp = await sessionLogout(sessionKey, sessionContext.sessionToken);
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
        returnFocusTo: "btn-logout-form-all",
        buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
        focusKeyParam: "modal-popup",
        icon: "error",
      });
      return;
    }
    getSessions();
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
  useEffect(() => {
    const onRemoteReturnClicked = (event: any) => {
      if (statusPopupContext) return;
      if (popUp.show) {
        hidePopup();
      } else {
        window.history.go(-1);
      }
    };
    window.addEventListener("RemoteReturnClicked", onRemoteReturnClicked);
    return () => {
      window.removeEventListener("RemoteReturnClicked", onRemoteReturnClicked);
    };
  }, [popUp, hidePopup, statusPopupContext]);
  return (
    <FocusContext.Provider value={focusKeyParam}>
      <div className="row ps-4">
        <div className="col-lg-10 col-md-10">
          <div className="row">
            <div className="col">
              <p className="GamesTitle mt-4">Device Hostory</p>
            </div>
            <div className="col-auto">
              <FocusableButton focusKeyParam="btn-logout-form-all" onClick={onLogoutFromAllDevice} classes="btn gradientBtn">
                Logout from all devices
              </FocusableButton>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-dark align-middle customTable table-lg">
              <thead>
                <tr>
                  <th className="py-3 px-0">Device</th>
                  <th className="py-3 px-0">Location</th>
                  <th className="py-3 px-0">Activity</th>
                  <th className="py-3 px-0">Status</th>
                </tr>
              </thead>
              <tbody>{sessions && sessions.map((session, index) => renderSingleSessionRow(session, index))}</tbody>
            </table>
          </div>
        </div>
      </div>
      {popUp.show && <ErrorPopUp {...popUp} />}
    </FocusContext.Provider>
  );
}

const FocusableSapn = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {
      //scrollToElement(ref.current, 300);
      ref.current.parentElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    },
    onEnterPress: () => {
      props.onClick();
    },
    onArrowPress: (direction, keyProps, details) => {
      switch (direction) {
        case "right":
        case "left":
          setFocus("go-to-device-history");
          return false;
        default:
          return true;
      }
    },
  });
  return (
    <span
      ref={ref}
      className={props.classes + (focused ? " focusedElement" : "")}
      onClick={props.onClick}
      style={{ padding: "8px", borderRadius: "10px" }}
    >
      {props.children}
    </span>
  );
};

const FocusableButton = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {
      props.onClick();
    },
    onFocus: () => {
      //scrollToElement(ref.current, 200);
      scrollToTop();
    },
    onArrowPress: (direction, keyProps, details) => {
      console.log("all logout direction : ", direction);
      switch (direction) {
        case "right":
        case "left":
        case "up":
          setFocus("go-to-device-history");
          return false;
      }
      return true;
    },
  });
  return (
    <button ref={ref} className={props.classes + (focused ? " focusedElement" : "")} onClick={props.onClick}>
      {props.children}
    </button>
  );
};
