import { useContext, useEffect, useRef, useState } from "react";
import { getProfile, login } from "../../common/services";
import { SessionContext, UserProfileContext } from "src/App";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { SESSION_TOKEN_LOCAL_STORAGE } from "src/common/constants";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";

export default function Login({
  focusKey: focusKeyParam,
}: FocusabelComponentProps) {
  const sessionContext = useContext(SessionContext);
  const userContext = useContext(UserProfileContext);
  const navigate = useNavigate();
  const { setFocus, focusKey } = useFocusable({
    focusable: true,
    focusKey: focusKeyParam,
  });

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const delayedFocus = setTimeout(() => {
      setFocus("input-username");
    }, 100);
    return () => {
      clearTimeout(delayedFocus);
    };
  }, []);

  useEffect(() => {
    if (sessionContext.sessionToken) {
      navigate("/home");
    }
  }, [sessionContext, navigate]);
  const onLoginButtonClick = async () => {
    if (!userId || !password) {
      Swal.fire({
        title: "Error!",
        text: "Please enter username and password field",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    const loginResponse = await login(userId, password, "tv");
    if (!loginResponse.success) {
      Swal.fire({
        title: "Error!",
        text: loginResponse.message,
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    if (loginResponse.sessionToken) {
      const profileResp = await getProfile(loginResponse.sessionToken);
      if (!profileResp.success) {
        Swal.fire({
          title: "Error!",
          text: profileResp.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        userContext.setUserProfile(profileResp.profile);
      }
      localStorage.setItem(
        SESSION_TOKEN_LOCAL_STORAGE,
        loginResponse.sessionToken
      );
      sessionContext.setSessionToken(loginResponse.sessionToken);
    }
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <div className="container-fluid bg">
        <div className="row justify-content-center align-items-center vh-100">
          <div className="col-md-6 col-lg-3">
            <div className="card bg-dark">
              <div className="card-body text-white p-4">
                <h3 className="fw-bold text-center">
                  <u>Login</u>
                </h3>
                <label className="mt-3">Email / Phone</label>
                <FocusableInput
                  type="text"
                  className="form-control"
                  defaultValue={userId}
                  value={userId}
                  onChange={setUserId}
                  focusKeyParam="input-username"
                />
                <label className="mt-3">Password</label>

                <FocusableInput
                  type="password"
                  className="form-control"
                  defaultValue={password}
                  focusKeyParam="input-password"
                  value={password}
                  onChange={setPassword}
                />
                <div className="d-grid mt-4">
                  <FocusableButton
                    onClick={onLoginButtonClick}
                    focusKeyParam="btn-login"
                  >
                    Login
                  </FocusableButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
}

const FocusableInput = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {
      ref.current.focus();
    },
    onArrowPress: (direction, keyProps, details) => {
      console.log(
        "direction : ",
        direction,
        " focus key : ",
        props.focusKeyParam
      );
      switch (direction) {
        case "up":
          if (props.focusKeyParam === "input-username") {
            console.log("set focus to : btn login");
            setFocus("btn-login");
          } else if (props.focusKeyParam === "input-password") {
            setFocus("input-username");
          }
          return false;
        case "down":
          if (props.focusKeyParam === "input-username") {
            console.log("set focus to : password");
            setFocus("input-password");
          } else if (props.focusKeyParam === "input-password") {
            setFocus("btn-login");
          }
          return false;
        default:
          return true;
      }
    },
  });

  return (
    <input
      type={props.type}
      ref={ref}
      className={"form-control" + (focused ? " focusedBlueElement" : "")}
      onChange={(e: any) => {
        props.onChange(e.target.value);
      }}
      value={props.value}
    />
  );
};

const FocusableButton = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {
      ref.current.focus();
    },
    onEnterPress: () => {
      props.onClick();
    },
    onArrowPress: (direction, keyProps, details) => {
      if (direction === "up") {
        setFocus("input-password");
        return false;
      } else if (direction === "down") {
        setFocus("input-username");
        return false;
      }
      return true;
    },
  });
  return (
    <button
      ref={ref}
      className={"btn btnGradient" + (focused ? " focusedElement" : "")}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
