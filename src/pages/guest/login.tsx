import { useContext, useEffect, useRef } from "react";
import { getProfile, login } from "../../common/services";
import { SessionContext, UserProfileContext } from "src/App";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { SESSION_TOKEN_LOCAL_STORAGE } from "src/common/constants";
import { FocusableElement, FocusableGroup } from "@arrow-navigation/react";
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
                <h3 className="fw-bold text-center">
                  <u>Login</u>
                </h3>
                <FocusableGroup id="form-login">
                  <label className="mt-3">Email / Phone</label>
                  <FocusableElement
                    id="input-username"
                    as="a"
                    className="focus-wrapper"
                  >
                    <input type="text" ref={inputId} className="form-control" />
                  </FocusableElement>
                  <label className="mt-3">Password</label>
                  <FocusableElement
                    id="input-password"
                    as="a"
                    className="focus-wrapper"
                  >
                    <input
                      type="password"
                      className="form-control"
                      ref={inputPassword}
                    />
                  </FocusableElement>
                  <div className="d-grid mt-4">
                    <FocusableElement
                      id="btn-login"
                      className="btn btnGradient"
                      onClick={onLoginButtonClick}
                    >
                      Login
                    </FocusableElement>
                  </div>
                </FocusableGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
