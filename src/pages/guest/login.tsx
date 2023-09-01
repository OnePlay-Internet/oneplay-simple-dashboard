import { useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { getProfile, login } from "../../common/services";
import { SessionContext, UserProfileContext } from "src/App";
import { useLocation, useNavigate } from "react-router-dom";
import { SESSION_TOKEN_LOCAL_STORAGE } from "src/common/constants";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import ErrorPopUp from "../error";

export default function Login({
  focusKey: focusKeyParam,
}: FocusabelComponentProps) {
  const sessionContext = useContext(SessionContext);
  const userContext = useContext(UserProfileContext);
 const [popUp, setPopUp] = useState<ErrorPopupPorps>({
   show: false,
   message: "",
   title: "",
   returnFocusTo: "",
   buttons: [],
   focusKeyParam: "modal-popup",
   icon: "",
 });
 const navigate = useNavigate();
 const { search } = useLocation();

 const searchQuery = useMemo(() => new URLSearchParams(search), [search]);
 const { setFocus, focusKey } = useFocusable({
   focusable: true,
   focusKey: focusKeyParam,
 });

 const [userId, setUserId] = useState<string>("");
 const [password, setPassword] = useState<string>("");

 useEffect(() => {
   const delayedFocus = setTimeout(() => {
     setFocus("input-username");
   }, 300);
   return () => {
     clearTimeout(delayedFocus);
   };
 }, []);

 useEffect(() => {
   if (sessionContext.sessionToken) {
     let redirectTo = searchQuery.get("redirect") ?? "";
     redirectTo = redirectTo?.replace("/index.html/", "");
     console.log("redirect : ", redirectTo);
     if (!redirectTo) {
       console.log("redirect to /home");
       navigate("/home");
       return;
     }
     console.log("redirect to : %s", redirectTo);
     navigate(redirectTo);
   }
 }, [sessionContext, navigate]);
 const onLoginButtonClick = async () => {
   const errors: { [key: string]: string } = {};
   let validEmail = false,
     validPhone = false;
   if (!userId) {
     errors.userId = "Username is required";
   } else if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(userId)) {
     validEmail = true;
   } else if (/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/i.test(userId)) {
     validPhone = true;
   }

   if (!errors.userId && !validEmail && !validPhone) {
     errors.userId = "Invalid username";
   }

   if (!password) {
     errors.password = "Password is required";
   } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,64}$/i.test(password)) {
     errors.password = "Invalid password";
   }

   if (errors.userId || errors.password) {
     let err = errors.userId ? errors.userId : "";
     if (errors.password) {
       err += err.length ? "<br />" + errors.password : errors.password;
     }
     setPopUp({
       show: true,
       message: err,
       title: "Error!",
       returnFocusTo: "btn-login",
       buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
       focusKeyParam: "modal-popup",
       icon: "error",
     });
     return;
   }
   const loginResponse = await login(userId, password, "tv");
   if (!loginResponse.success) {
     setPopUp({
       show: true,
       message: loginResponse.message ?? "",
       title: "Error!",
       returnFocusTo: "btn-login",
       buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
       focusKeyParam: "modal-popup",
       icon: "error",
     });
     return;
   }
   if (loginResponse.sessionToken) {
     const profileResp = await getProfile(loginResponse.sessionToken);
     if (!profileResp.success) {
       //   Swal.fire({
       //   title: "Error!",
       //   text: profileResp.message,
       //   icon: "error",
       //   confirmButtonText: "OK",
       // });
       setPopUp({
         show: true,
         message: profileResp.message ?? "",
         title: "Error!",
         returnFocusTo: "btn-login",
         buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
         focusKeyParam: "modal-popup",
         icon: "error",
       });
     } else {
       userContext.setUserProfile(profileResp.profile);
     }
     localStorage.setItem(SESSION_TOKEN_LOCAL_STORAGE, loginResponse.sessionToken);
     sessionContext.setSessionToken(loginResponse.sessionToken);
   }
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
                 <FocusableButton onClick={onLoginButtonClick} focusKeyParam="btn-login">
                   Login
                 </FocusableButton>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
     {popUp.show && <ErrorPopUp {...popUp} />}
   </FocusContext.Provider>
 );
}

const FocusableInput = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {
      if (ref.current) {
        ref.current.focus();
      }
    },
    onArrowPress: (direction, keyProps, details) => {
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
      if (ref.current) {
        ref.current.focus();
      }
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
