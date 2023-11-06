import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import errorIcon from "../../assets/images/icon-error.svg";
import sucessIcon from "../../assets/images/icon-verified.svg";
import waitQueueIcon from "../../assets/images/icon-waitQueae.svg";
import groupIcon from "../../assets/images/icon-group.svg";
import noWifiIcon from "../../assets/images/icon-no-network.svg";
import logoutIcon from "../../assets/images/setting/Logout.svg";
import rechargeIcon from "../../assets/images/icon-recharge-subscription.svg";
import gamingIssueIcon from "../../assets/images/icon-gaming-issue.svg";
import timeLimitIcon from "../../assets/images/icon-time-limit.svg";
import { useEffect } from "react";
export default function ErrorPopUp({ focusKeyParam, title, icon, message, buttons, returnFocusTo, show }: ErrorPopupPorps) {
  const { setFocus, focusKey, focusSelf } = useFocusable({
    focusable: true,
    focusKey: focusKeyParam,
    preferredChildFocusKey: "btn-ok-popup",
    isFocusBoundary: true,
  });

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);
  const getIcon = () => {
    switch (icon) {
      case "queue":
        return waitQueueIcon;
      case "success":
        return sucessIcon;
      case "group":
        return groupIcon;
      case "no-wifi":
        return noWifiIcon;
      case "logout":
        return logoutIcon;
      case "recharge":
        return rechargeIcon;
      case "time-limit":
        return timeLimitIcon;
      case "gaming-issue":
        return gamingIssueIcon;
      case "error":
      default:
        return errorIcon;
    }
  };
  return (
    <FocusContext.Provider value={focusKey}>
      <div
        className="modal fade show"
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
        style={{ display: "block", opacity: 1, backgroundColor: "#00000099" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ backgroundColor: "#212123" }}>
            <div className="modal-body text-center p-5">
              <img src={getIcon()} className="img-fluid" alt="" height="96" width="96" />
              <p className="font500 text-white mt-4" style={{ fontSize: "20px" }}>
                {title}
              </p>
              <p className="font500" style={{ fontSize: "16px", color: "#959595" }} dangerouslySetInnerHTML={{ __html: message }}></p>
              <div className="d-grid mt-4" data-bs-dismiss="modal">
                {buttons.map((button, index) => {
                  return (
                    <FocusableButton
                      key={`modal-button-${index}`}
                      focusKeyParam={button.focusKey}
                      onClick={button.onClick}
                      //className="btn gradientBtn btn-lg border-0"
                      className={button.className}
                    >
                      {button.text}
                    </FocusableButton>
                  );
                })}

                {/*  props.showCancel && (
                  <FocusableButton
                    focusKeyParam="btn-cancel-popup"
                    onClick={props.onCancelClick}
                    className="btn grayGradientBtn btn-lg border-0 mt-3"
                  >
                    Cancel
                  </FocusableButton>
                ) */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
}

const FocusableButton = (props: any) => {
  const { ref, focused } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {
      props.onClick();
    },
    /*  onArrowPress: (direction, keyProps, details) => {
      return false;
    }, */
  });
  return (
    <button ref={ref} className={props.className + (focused ? " focusedElement" : "")} onClick={props.onClick}>
      {props.children}
    </button>
  );
};
