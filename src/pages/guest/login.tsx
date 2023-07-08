import { useContext, useEffect, useRef, useState } from "react";
import { getProfile, login } from "../../common/services";
import { SessionContext, UserProfileContext } from "src/App";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { SESSION_TOKEN_LOCAL_STORAGE } from "src/common/constants";
import SpatialNavigation, { Focusable } from "react-js-spatial-navigation";
import { useSelector } from "react-redux";

export default function Login() {
  const sessionContext = useContext(SessionContext);
  const userContext = useContext(UserProfileContext);
  const navigate = useNavigate();
  const inputId: any = useRef(null);
  const inputPassword: any = useRef(null);
  const buttonLoginRef: any = useRef(null);
  const [currentFocus, setCurrentFocus] = useState<string>("");
  const remoteEnterClicked = useSelector(
    (state: any) => state.remote.enterCliked
  );
  const remoteNextClicked = useSelector(
    (state: any) => state.remote.nextClicked
  );
  const remotePrevClicked = useSelector(
    (state: any) => state.remote.prevClicked
  );
  useEffect(() => {
    console.log("login enter clicked : ", currentFocus);
    switch (currentFocus) {
      case "input-user-id":
        inputId.current.focus();
        break;
      case "input-password":
        inputPassword.current.focus();
        break;
      case "btn-login":
        break;
    }
  }, [remoteEnterClicked]);
  useEffect(() => {
    console.log("login next clicked : ", currentFocus);
    switch (currentFocus) {
      case "input-user-id":
        inputPassword.current.focus();
        setCurrentFocus("input-password");
        break;
      case "input-password":
        buttonLoginRef.current.focus();
        setCurrentFocus("btn-login");
        break;
      case "btn-login":
        inputId.current.focus();
        setCurrentFocus("input-user-id");
        break;
      default:
        inputId.current.focus();
        setCurrentFocus("input-user-id");
        break;
    }
  }, [remoteNextClicked]);
  useEffect(() => {
    console.log("login prev clicked : ", currentFocus);
    switch (currentFocus) {
      case "input-user-id":
        buttonLoginRef.current.focus();
        setCurrentFocus("btn-login");
        break;
      case "input-password":
        inputId.current.focus();
        setCurrentFocus("input-user-id");
        break;
      case "btn-login":
        inputPassword.current.focus();
        setCurrentFocus("input-password");
        break;
      default:
        inputId.current.focus();
        setCurrentFocus("input-user-id");
        break;
    }
  }, [remotePrevClicked]);
  useEffect(() => {
    if (sessionContext.sessionToken) {
      navigate("/all-games");
    }
  }, [sessionContext, navigate]);
  const onLoginButtonClick = async () => {
    const userId = inputId?.current?.value;
    const pwd = inputPassword?.current?.value;
    if (!userId || !pwd) {
      Swal.fire({
        title: "Error!",
        text: "Validation failed",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    const loginResponse = await login(userId, pwd, "tv");
    if (!loginResponse.success) {
      Swal.fire({
        title: "Error!",
        text: loginResponse.message ?? "",
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
          text: profileResp.message ?? "",
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
    <>
      <div className="container-fluid bg">
        <div className="row justify-content-center align-items-center vh-100">
          <div className="col-md-6 col-lg-3">
            <div className="card bg-dark">
              <div className="card-body text-white p-4">
                <SpatialNavigation>
                  <h3 className="fw-bold text-center">
                    <u>Login</u>
                  </h3>

                  <Focusable
                    onFocus={() => {
                      setCurrentFocus("input-user-id");
                    }}
                    onClickEnter={() => {
                      alert("input user id clicked");
                    }}
                  >
                    <label className="mt-3">Email / Phone</label>
                    <input type="text" ref={inputId} className="form-control" />
                  </Focusable>
                  <Focusable
                    onFocus={() => {
                      setCurrentFocus("input-password");
                    }}
                    onClickEnter={() => {
                      alert("input password clicked");
                    }}
                  >
                    <label className="mt-3">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      ref={inputPassword}
                    />
                  </Focusable>
                  <div className="d-grid mt-4">
                    <Focusable
                      className="btn btnGradient"
                      onFocus={() => {
                        setCurrentFocus("btn-login");
                      }}
                    >
                      <button
                        id="btn-login"
                        className="btn"
                        onClick={onLoginButtonClick}
                        ref={buttonLoginRef}
                      >
                        Login
                      </button>
                    </Focusable>
                  </div>
                </SpatialNavigation>
                <p style={{ color: "white" }}>
                  Current focus element : {currentFocus}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
