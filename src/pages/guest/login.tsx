import { useContext, useEffect, useRef } from "react";
import { getProfile, login } from "../../common/services";
import { SessionContext, UserProfileContext } from "src/App";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { SESSION_TOKEN_LOCAL_STORAGE } from "src/common/constants";
import SpatialNavigation, { Focusable } from "react-js-spatial-navigation";

export default function Login() {
  const sessionContext = useContext(SessionContext);
  const userContext = useContext(UserProfileContext);
  const navigate = useNavigate();
  const inputId: any = useRef(null);
  const inputPassword: any = useRef(null);
  useEffect(() => {
    if (sessionContext.sessionToken) {
      navigate("/all-games");
    }
  }, [sessionContext, navigate]);
  const onLoginButtonClick = async () => {
    alert("login button clicked");
    const loginResponse = await login(
      inputId?.current?.value,
      inputPassword?.current?.value,
      "tv"
    );
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
    <>
      <div className="container-fluid bg">
        <div className="row justify-content-center align-items-center vh-100">
          <div className="col-md-6 col-lg-3">
            <div className="card bg-dark">
              <div className="card-body text-white p-4">
                <SpatialNavigation>
                  <Focusable
                    onFocus={() => {
                      console.log("header focused");
                    }}
                    onClickEnter={() => {
                      alert("header clicked");
                    }}
                  >
                    <h3 className="fw-bold text-center">
                      <u>Login</u>
                    </h3>
                  </Focusable>
                  <label className="mt-3">Email / Phone</label>
                  <input type="text" ref={inputId} className="form-control" />
                  <label className="mt-3">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    ref={inputPassword}
                  />
                  <div className="d-grid mt-4">
                    <Focusable
                      className="btn btnGradient"
                      onFocus={() => {
                        console.log("button focused");
                      }}
                      onClickEnter={onLoginButtonClick}
                    >
                      <button
                        id="btn-login"
                        className="btn"
                        onClick={onLoginButtonClick}
                      >
                        Login
                      </button>
                    </Focusable>
                  </div>
                </SpatialNavigation>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
