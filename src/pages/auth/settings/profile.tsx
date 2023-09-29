import { useContext, useEffect, useState } from "react";
import defaultUser from "../../../assets/images/user/defaultUser.svg";
import { SessionContext, UserProfileContext } from "src/App";
import { getProfile, updateProfile } from "src/common/services";
import { useNavigate } from "react-router-dom";
import { SESSION_TOKEN_LOCAL_STORAGE } from "src/common/constants";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import LoaderPopup from "src/pages/loader";
import ErrorPopUp from "src/pages/error";
import { StatusPopupContext } from "src/layouts/auth";

export default function Profile({ focusKey: focusKeyParam }: FocusabelComponentProps) {
  const navigate = useNavigate();
  const sessionContext = useContext(SessionContext);
  const [showLoading, setShowLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
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
  const { focusSelf, focusKey, setFocus } = useFocusable({
    focusable: true,
    trackChildren: true,
    focusKey: focusKeyParam,
  });
  useEffect(() => {
    setFocus("username");
  }, [focusSelf]);
  useEffect(() => {
    if (!sessionContext || !sessionContext.sessionToken) {
      return;
    }

    (async () => {
      setShowLoading(true);
      const profileResp: any = await getProfile(sessionContext.sessionToken);
      if (!profileResp.success) {
        /* Swal.fire({
          title: "Error!",
          text: profileResp.message,
          icon: "error",
          confirmButtonText: "OK",
        }); */

        localStorage.removeItem(SESSION_TOKEN_LOCAL_STORAGE);
        sessionContext.setSessionToken(null);
        navigate("/");
        return;
      }
      setUserProfile(profileResp?.profile);
      setUsername(profileResp?.profile.username);
      setFullName(profileResp?.profile.first_name + " " + profileResp?.profile.last_name);
      setBio(profileResp?.profile.bio);
      setShowLoading(false);
    })();
  }, [sessionContext.sessionToken]);
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
  const updateUserProfile = async () => {
    if (!username.length || !fullName.length) {
      /* Swal.fire({
        title: "Error!",
        text: "Invalid profile data.",
        icon: "error",
        confirmButtonText: "OK",
      }); */
      setPopUp({
        show: true,
        message: "Invalid profile data.",
        title: "Error!",
        returnFocusTo: "btn-save-profile",
        buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
        focusKeyParam: "modal-popup",
        icon: "error",
      });
      return;
    }
    setShowLoading(true);
    const updateData = {
      username: username,
      first_name: fullName.split(/ (.*)/s).at(0) ?? "",
      last_name: fullName.split(/ (.*)/s).at(1) ?? "",
      bio: bio,
    };
    const updateResp: any = await updateProfile(sessionContext.sessionToken, updateData);
    setShowLoading(false);
    if (updateResp.success) {
      setUserProfile(updateResp?.profile);
      setUsername(updateResp?.profile.username);
      setFullName(updateResp?.profile.first_name + " " + updateResp?.profile.last_name);
      setBio(updateResp?.profile.bio);
    } else {
      /* Swal.fire({
        title: "Error!",
        text: updateResp.message,
        icon: "error",
        confirmButtonText: "OK",
      }); */
      setPopUp({
        show: true,
        message: updateResp.message ?? "",
        title: "Error!",
        returnFocusTo: "username",
        buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
        focusKeyParam: "modal-popup",
        icon: "error",
      });
      return;
    }
  };
  return (
    <FocusContext.Provider value={focusKeyParam}>
      <div className="row">
        <div className="col-lg-8 col-md-9 ps-4">
          <p className="GamesTitle">Profile Settings</p>

          <div className="row mt-2">
            <div className="col-auto">
              <input type="file" className="d-none" id="editProfile" />
              <label htmlFor="editProfile" className="d-flex mb-0">
                <div className="card transparentBg cursorPointer profile-image">
                  <img
                    className="rounded-circle"
                    width="48"
                    height="48"
                    src={userProfile?.profile_image ?? defaultUser}
                    alt={userProfile?.first_name ?? ""}
                  />
                </div>
              </label>
            </div>
            <div className="col align-self-center ps-0"></div>
            <div className="col-12 mt-4">
              <label className="smallText">Username</label>
              <FocusableInput
                type="text"
                focusKeyParam="username"
                placeholder="username"
                value={username}
                onChange={(e: any) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            <div className="col-12 mt-4">
              <label className="smallText">Full Name</label>
              <FocusableInput
                type="text"
                focusKeyParam="fullname"
                placeholder="Full Name"
                value={fullName}
                onChange={(e: any) => {
                  setFullName(e.target.value);
                }}
              />
            </div>
            <div className="col-12 mt-4">
              <label className="smallText">Bio</label>
              <FocusableTextArea
                placeholder="Write a short bio in under 300 characters"
                value={bio}
                onChange={(e: any) => {
                  setBio(e.target.value);
                }}
                rows="4"
              />
            </div>
            <div className="col-12 mt-5 text-end">
              {/* <FocusableButton onClick={updateUserProfile} focusKeyParam="btn-save-profile">
                Save changes
              </FocusableButton> */}
            </div>
          </div>
        </div>
      </div>
      {popUp.show && <ErrorPopUp {...popUp} />}
      {showLoading ? <LoaderPopup focusKeyParam="Loader" /> : null}
    </FocusContext.Provider>
  );
}

const FocusableInput = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {
      ref.current.focus();
    },
    onBlur: () => {
      ref.current.blur();
    },
    onArrowPress: (direction, props, details) => {
      if (focused && direction === "left") {
        setFocus("go-to-profile");
        return false;
      }
      return true;
    },
  });
  return (
    <input
      type={props.type}
      ref={ref}
      className={"form-control form-control-lg inputType mt-2" + (focused ? " focusedElement" : "")}
      onChange={props.onChange}
      value={props.value}
      disabled={true}
      placeholder={props.placeholder}
    />
  );
};

const FocusableTextArea = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {
      ref.current.focus();
    },
    onBlur: () => {
      ref.current.blur();
    },
    onArrowPress: (direction, props, details) => {
      if (direction === "left") {
        setFocus("go-to-profile");
        return false;
      } else if (direction === "up") {
        setFocus("fullname");
        return false;
      } /*  else if (direction === "down") {
        setFocus("btn-save-profile");
        return false;
      } */
      return false;
    },
  });
  return (
    <textarea
      ref={ref}
      className={"form-control form-control-lg inputType mt-2" + (focused ? " focusedElement" : "")}
      onChange={props.onChange}
      value={props.value}
      disabled={true}
      placeholder={props.placeholder}
      rows={props.rows}
    />
  );
};
const FocusableButton = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {
      props.onClick();
    },
    /* onArrowPress: (direction, props, details) => {
      switch (direction) {
        case "up":
          return true;
        default:
          setFocus("go-to-profile");
          return false;
      }
    }, */
  });
  return (
    <button
      ref={ref}
      className={
        "btn btn-lg btnGarident border-0" + (focused ? " focusedElement" : "")
      }
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
