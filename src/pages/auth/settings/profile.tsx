import { useContext, useEffect, useState } from "react";
import defaultUser from "../../../assets/images/user/defaultUser.svg";
import { SessionContext, UserProfileContext } from "src/App";
import { getProfile, updateProfile } from "src/common/services";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { SESSION_TOKEN_LOCAL_STORAGE } from "src/common/constants";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import styled from "styled-components";

export default function Profile({
  focusKey: focusKeyParam,
}: FocusabelComponentProps) {
  const navigate = useNavigate();
  const sessionContext = useContext(SessionContext);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const { focusSelf, focusKey, setFocus } = useFocusable({
    trackChildren: true,
    focusKey: focusKeyParam,
  });
  useEffect(() => {
    setFocus("username");
  }, [setFocus]);
  useEffect(() => {
    if (!sessionContext || !sessionContext.sessionToken) {
      return;
    }
    (async () => {
      const profileResp: any = await getProfile(sessionContext.sessionToken);
      if (!profileResp.success) {
        Swal.fire({
          title: "Error!",
          text: profileResp.message,
          icon: "error",
          confirmButtonText: "OK",
        });
        localStorage.removeItem(SESSION_TOKEN_LOCAL_STORAGE);
        sessionContext.setSessionToken(null);
        navigate("/");
        return;
      }
      setUserProfile(profileResp?.profile);
      setUsername(profileResp?.profile.username);
      setFullName(
        profileResp?.profile.first_name + " " + profileResp?.profile.last_name
      );
      setBio(profileResp?.profile.bio);
    })();
  }, [sessionContext]);

  const updateUserProfile = async () => {
    if (!username.length || !fullName.length) {
      Swal.fire({
        title: "Error!",
        text: "Invalid profile data.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    const updateData = {
      username: username,
      first_name: fullName.split(/ (.*)/s).at(0) ?? "",
      last_name: fullName.split(/ (.*)/s).at(1) ?? "",
      bio: bio,
    };
    const updateResp: any = await updateProfile(
      sessionContext.sessionToken,
      updateData
    );
    setUserProfile(updateResp?.profile);
    setUsername(updateResp?.profile.username);
    setFullName(
      updateResp?.profile.first_name + " " + updateResp?.profile.last_name
    );
    setBio(updateResp?.profile.bio);
    console.log(updateResp);
  };
  return (
    <FocusContext.Provider value={focusKey}>
      <div className="row">
        <div className="col-lg-6 col-md-9 ps-4">
          <p className="GamesTitle">Profile Settings</p>

          <div className="row mt-2">
            <div className="col-auto">
              <input type="file" className="d-none" id="editProfile" />
              <label htmlFor="editProfile" className="d-flex mb-0">
                <div className="card transparentBg cursorPointer profile-image">
                  <img
                    className="card-img rounded-circle"
                    width="48px"
                    height="48px"
                    src={userProfile?.profile_image ?? defaultUser}
                    alt=""
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
              />
            </div>
            <div className="col-12 mt-5 text-end">
              <FocusableButton onClick={updateUserProfile}>
                Save changes
              </FocusableButton>
            </div>
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
}

const FocusableInputStyled = styled.input<FocusableItemProps>`
  box-shadow: ${({ focused }) =>
    focused ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" : "none"};
`;

const FocusableInput = (props: any) => {
  const { ref, focused } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {
      ref.current.focus();
    },
    /* onArrowPress: (direction, props, details) => {
    if (focused && (direction === "right" || direction === "left")) {
        return false;
      }
      return true;
    }, */
  });
  return (
    <FocusableInputStyled
      type={props.type}
      ref={ref}
      focused={focused}
      className="form-control form-control-lg inputType mt-2"
      onChange={props.onChange}
      value={props.value}
      placeholder={props.placeholder}
    />
  );
};

const FocusableTextAreaStyled = styled.textarea<FocusableItemProps>`
  box-shadow: ${({ focused }) =>
    focused ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" : "none"};
`;

const FocusableTextArea = (props: any) => {
  const { ref, focused } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {
      ref.current.focus();
    },
    /* onArrowPress: (direction, props, details) => {
    if (focused && (direction === "right" || direction === "left")) {
        return false;
      }
      return true;
    }, */
  });
  return (
    <FocusableTextAreaStyled
      ref={ref}
      focused={focused}
      className="form-control form-control-lg inputType mt-2"
      onChange={props.onChange}
      value={props.value}
      placeholder={props.placeholder}
    />
  );
};
const FocusableButtonStyled = styled.button<FocusableItemProps>`
  box-shadow: ${({ focused }) =>
    focused ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" : "none"};
`;
const FocusableButton = (props: any) => {
  const { ref, focused } = useFocusable({
    focusable: true,
    onEnterPress: () => {
      props.onClick();
    },
  });
  return (
    <FocusableButtonStyled
      ref={ref}
      focused={focused}
      className="btn btn-lg btnGarident border-0"
      onClick={props.onClick}
    >
      {props.children}
    </FocusableButtonStyled>
  );
};
