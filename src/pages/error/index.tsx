import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import errorIcon from "../../assets/images/icon-error.svg";
import sucessIcon from "../../assets/images/icon-verified.svg";
import waitQueueIcon from "../../assets/images/icon-waitQueae.svg";
import groupIcon from "../../assets/images/icon-group.svg";
import { useEffect } from "react";
export default function ErrorPopUp(props: any) {
  const { setFocus, focusKey, focusSelf } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    preferredChildFocusKey: "btn-ok-popup",
    isFocusBoundary: true,
  });

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);
  const getIcon = () => {
    switch (props.icon) {
      case "wait-queue":
        return waitQueueIcon;
      case "success":
        return sucessIcon;
      case "group":
        return groupIcon;
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
              <img src={getIcon()} className="img-fluid" alt="" />
              <p
                className="font500 text-white mt-4"
                style={{ fontSize: "20px" }}
              >
                {props.title}
              </p>
              <p
                className="font500"
                style={{ fontSize: "16px", color: "#959595" }}
                dangerouslySetInnerHTML={{ __html: props.message }}
              ></p>
              <div className="d-grid mt-4" data-bs-dismiss="modal">
                <FocusableButton
                  focusKeyParam="btn-ok-popup"
                  onClick={props.onOkClick}
                >
                  OK
                </FocusableButton>
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
    <button
      ref={ref}
      className={
        "btn gradientBtn btn-lg border-0" + (focused ? " focusedElement" : "")
      }
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
