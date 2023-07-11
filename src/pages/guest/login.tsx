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

import { styled } from "styled-components";

export default function Login({
  focusKey: focusKeyParam,
}: FocusabelComponentProps) {
  const sessionContext = useContext(SessionContext);
  const userContext = useContext(UserProfileContext);
  const navigate = useNavigate();
  const { focusSelf, focusKey } = useFocusable({
    focusable: true,
  });
  const [userInputId, SetuserInputId] = useState("");
  const [userInputPwd, SetuserInputPwd] = useState("");

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  useEffect(() => {
    if (sessionContext.sessionToken) {
      navigate("/all-games");
    }
  }, [sessionContext, navigate]);
  const onLoginButtonClick = async () => {
    if (!userInputId || !userInputPwd) {
      Swal.fire({
        title: "Error!",
        text: "Please enter username and password field",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    const loginResponse = await login(userInputId, userInputPwd, "tv");
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
                  defaultValue={userInputId}
                  value={SetuserInputId}
                />
                <label className="mt-3">Password</label>

                <FocusableInput
                  type="password"
                  className="form-control"
                  defaultValue={userInputPwd}
                  value={SetuserInputPwd}
                />
                <div className="d-grid mt-4">
                  <FocusableButton onClick={onLoginButtonClick}>
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

const FocusableInputStyled = styled.input<FocusableItemProps>`
  background-color: white;
  border-color: #86b7fe;
  border-style: solid;
  border-width: ${({ focused }) => (focused ? "6px" : 0)};
  box-shadow: ${({ focused }) =>
    focused ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" : "none"};
`;
const FocusableButtonStyled = styled.button<FocusableItemProps>`
  box-shadow: ${({ focused }) =>
    focused ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" : "none"};
`;
const FocusableInput = (props: any) => {
  const { ref, focused } = useFocusable({
    focusable: true,
    onEnterPress: () => {
      ref.current.focus();
    },
  });
  const [inputValue, setInputValue] = useState(props.defaultValue);
  useEffect(() => {
    props.value(inputValue);
  }, [inputValue]);
  return (
    <FocusableInputStyled
      type={props.type}
      ref={ref}
      focused={focused}
      className="form-control"
      onChange={(e: any) => {
        setInputValue(e.target.value);
      }}
      value={inputValue}
    />
  );
};

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
      className="btn btnGradient"
      onClick={props.onClick}
    >
      {props.children}
    </FocusableButtonStyled>
  );
};
