import { useNavigate } from "react-router-dom";
import brandLogo from "../../../assets/images/oneplayLogo.svg";
import { REGISTER_URL } from "src/common/constants";
import QRCode from "react-qr-code";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useContext, useEffect, useState } from "react";
import ErrorPopUp from "src/pages/error";
import { CurrentFocusContext } from "src/App";

export default function TvFirstTimeUser({ focusKey: focusKeyParam }: FocusabelComponentProps) {
  const navigate = useNavigate();
  const currentFocusContext = useContext(CurrentFocusContext);
  const { focusKey, setFocus } = useFocusable({
    focusable: true,
    focusKey: focusKeyParam,
    preferredChildFocusKey: "btn-tv-login",
  });

  const [popUp, setPopUp] = useState<ErrorPopupPorps>({
    show: false,
    message: "",
    title: "",
    returnFocusTo: "",
    buttons: [],
    focusKeyParam: "modal-popup",
    icon: "",
  });

  const hidePopup = () => {
    setPopUp((prev) => {
      if (currentFocusContext.focusKey) {
        setFocus(currentFocusContext.focusKey);
      } else if (prev.returnFocusTo) {
        setFocus(prev.returnFocusTo);
      } else {
        setFocus("btn-tv-login");
      }
      return { show: false, message: "", title: "", returnFocusTo: "", buttons: [], focusKeyParam: "modal-popup-confirm-exit", icon: "" };
    });
  };
  const showConfirmExitDialog = () => {
    //tizen.application.getCurrentApplication().exit();
    setPopUp({
      show: true,
      message: "Are you sure you want to exit oneplay app?",
      title: "Exit OnePlay?",
      returnFocusTo: "btn-tv-login",
      buttons: [
        {
          text: "Cancel",
          className: "btn gradientBtn btn-lg border-0",
          focusKey: "btn-ok-popup",
          onClick: hidePopup,
        },
        {
          text: "Exit",
          className: "btn grayGradientBtn btn-lg border-0 mt-3",
          focusKey: "btn-cancel-popup",
          onClick: () => {
            hidePopup();
            //@ts-ignore
            tizen.application.getCurrentApplication().exit();
          },
        },
      ],
      focusKeyParam: "modal-popup-confirm-exit",
      icon: "error",
    });
  };

  useEffect(() => {
    const onRemoteReturnClicked = (event: any) => {
      console.log("remote return clicked : ", popUp);
      if (popUp.show) {
        hidePopup();
      } else {
        showConfirmExitDialog();
      }
    };
    window.addEventListener("RemoteReturnClicked", onRemoteReturnClicked);
    return () => {
      window.removeEventListener("RemoteReturnClicked", onRemoteReturnClicked);
    };
  }, [popUp, hidePopup, showConfirmExitDialog]);
  useEffect(() => {
    const delayedFocus = setTimeout(() => {
      setFocus("btn-tv-login");
    }, 100);
    return () => {
      clearTimeout(delayedFocus);
    };
  }, [setFocus]);
  const goToLoginScreen = () => {
    navigate("/login");
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <div className="container-fluid backgroundBgGradient">
        <div className="pt-4 position-fixed end-0">
          <img src={brandLogo} className="img-fluid pe-3" alt="" />
        </div>
        <div className="container">
          <div className="row middleAlign">
            <div className="col-lg-6 mt-5 text-center">
              <h2 className="price mb-5">Existing User</h2>
              <p className="font20Text mb-0">
                Welcome back, <br />
                Please Login to continue using Onplay Services.
              </p>
              <div className="mt-5">
                <FocusableButton
                  onClick={goToLoginScreen}
                  focusKeyParam="btn-tv-login"
                  setCurrentFocusContext={currentFocusContext.setFocusKey}
                >
                  Log in
                </FocusableButton>
              </div>
            </div>
            <div className="col-lg-6 mt-5 text-center borderLeft2">
              <h2 className="price mb-5">Create a New Account</h2>
              <p className="font20Text mb-0">Scan the QR code with your Phone’s camera or go to:</p>
              <h3 className="heading">{REGISTER_URL}</h3>
              <div className="mt-5">
                <div style={{ padding: "10px", backgroundColor: "white", display: "inline-block" }}>
                  <QRCode value={`https://www.${REGISTER_URL}`} />
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

const FocusableButton = (props: any) => {
  const { ref, focused } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {
      props.setCurrentFocusContext(props.focusKeyParam);
    },
    onEnterPress: () => {
      props.onClick();
    },
    onArrowPress: (direction, keyProps, details) => {
      return false;
    },
  });
  return (
    <button
      ref={ref}
      className={"btn btn-lg px-5 border-0 customLinearGradient customBtn text-white" + (focused ? " focusedElement" : "")}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
