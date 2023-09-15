import InvoiceImg from '../../../assets/images/setting/Invoice.svg';
import MessageImg from '../../../assets/images/setting/Message.svg';
import NewsImg from '../../../assets/images/setting/News.svg';
import FileImg from '../../../assets/images/setting/File.svg';
import PrivacyImg from '../../../assets/images/setting/Privacy.svg';
import piechartImg from '../../../assets/images/setting/Pie_Chart.svg';
import deleteImg from '../../../assets/images/setting/Delete.svg';
import logoutImg from '../../../assets/images/setting/Logout.svg';
import arrow from '../../../assets/images/setting/Vector 67.svg';
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { CurrentFocusContext, SessionContext, UserProfileContext } from "src/App";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { getProfile, logout, setUserSearchPrivacy } from "src/common/services";
import { SESSION_TOKEN_LOCAL_STORAGE } from "src/common/constants";
import { useNavigate } from "react-router-dom";
import ErrorPopUp from "src/pages/error";
import FAQS from "./faqs";
import Privacy from './privacy';
import TermsAndCondition from './termsAndCondition';
import Support from './support';

export default function General({ focusKey: focusKeyParam }: FocusabelComponentProps) {
  const { focusSelf, focusKey, setFocus } = useFocusable({
    focusable: true,
    trackChildren: true,
    focusKey: focusKeyParam,
  });
  const currentFocusContext = useContext(CurrentFocusContext);
  const sessionContext = useContext(SessionContext);
  const userContext = useContext(UserProfileContext);
  const [webViewData, setWebViewData] = useState<{ data: string; show: boolean }>({ data: "", show: false });
  const navigate = useNavigate();
  const [popUp, setPopUp] = useState<ErrorPopupPorps>({
    show: false,
    message: "",
    title: "",
    returnFocusTo: "",
    buttons: [],
    focusKeyParam: "modal-popup",
    icon: "",
  });
  useEffect(() => {
    setTimeout(() => {
      setFocus("card-faq");
    }, 200);
  }, [setFocus]);
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
    if (currentFocusContext.focusKey) {
      setFocus(currentFocusContext.focusKey);
    } else if (returnFocusTo) {
      setFocus(returnFocusTo);
    } else {
      setFocus("card-faq");
    }
  };
  const setIframeContent = async (url: string) => {
    try {
      let html = (await axios.get(url)).data as string;
      html = html
        .replace(/src=".\//g, 'src="https://oneplay.in/')
        .replace(/href=".\//g, 'href="https://oneplay.in/')
        .replace(/src="assets\//g, 'src="https://oneplay.in/assets/')
        .replace(
          "</body>",
          "<script type='text/javascript'>document.addEventListener('keydown', function (e) { console.log('iframe : ' + e.keyCode); if (e.keyCode === 10009) { var RemoteReturnClickEvent = new CustomEvent('RemoteReturnClicked'); window.parent.dispatchEvent(RemoteReturnClickEvent) } });</script></body>"
        );
      setWebViewData({ data: html, show: true });
    } catch (error: any) {
      setPopUp({
        show: true,
        message: error?.message ?? "Something went wrong",
        title: "Error!",
        returnFocusTo: "card-faq",
        buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
        focusKeyParam: "modal-popup",
        icon: "error",
      });
    }
  };
  useEffect(() => {
    if (webViewData.show) {
      var s = document.getElementById("general-iframe");
      //@ts-ignore
      s?.contentDocument.write(webViewData.data);
      s?.focus();
    }
  }, [webViewData]);
  useEffect(() => {
    const onRemoteReturnClicked = (event: any) => {
      console.log("remote return clicked");
      if (webViewData.show) {
        setWebViewData({ data: "", show: false });
      } else if (popUp.show) {
        hidePopup();
      } else {
        window.history.go(-1);
      }
    };
    window.addEventListener("RemoteReturnClicked", onRemoteReturnClicked);
    return () => {
      window.removeEventListener("RemoteReturnClicked", onRemoteReturnClicked);
    };
  }, [popUp, hidePopup]);
  const onPrivacyChanged = (event: any) => {
    console.log("onPrivacyChanged : ", event);
  };
  const doLogout = async () => {
    const logoutResp = await logout(sessionContext.sessionToken);
    console.log("logout resp : ", logoutResp);
    if (!logoutResp.success) {
      /* Swal.fire({
        title: "Error!",
        text: logoutResp.message,
        icon: "error",
        confirmButtonText: "OK",
      }); */
      setPopUp({
        show: true,
        message: logoutResp.message ?? "",
        title: "Error!",
        returnFocusTo: "card-faq",
        buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
        focusKeyParam: "modal-popup-confirm-exit",
        icon: "error",
      });
      return;
    }

    localStorage.removeItem(SESSION_TOKEN_LOCAL_STORAGE);
    userContext.setUserProfile(null);
    sessionContext.setSessionToken(null);
    navigate("/");
  };
  const logoutClick = () => {
    setPopUp({
      show: true,
      message: "Are you sure, you want to logout?",
      title: "Logout",
      returnFocusTo: "card-logout",
      buttons: [
        { text: "Cancel", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup },
        { text: "Yes", className: "btn grayGradientBtn btn-lg border-0 mt-3", focusKey: "btn-cancel-popup", onClick: doLogout },
      ],
      focusKeyParam: "modal-popup-confirm-logout",
      icon: "logout",
    });
  };
  const toggleUserSearchPrivacy = async () => {
    const resp = await setUserSearchPrivacy(sessionContext.sessionToken, !userContext.userProfile.search_privacy);
    if (resp.success) {
      const profileResp = await getProfile(sessionContext.sessionToken);
      if (!profileResp.success) {
        setPopUp({
          show: true,
          message: profileResp.message ?? "",
          title: "Error!",
          returnFocusTo: "card-user-privacy",
          buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
          focusKeyParam: "modal-popup-confirm-exit",
          icon: "error",
        });
      } else {
        userContext.setUserProfile(profileResp.profile);
      }
    } else {
      setPopUp({
        show: true,
        message: resp.message ?? "",
        title: "Error!",
        returnFocusTo: "card-user-privacy",
        buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
        focusKeyParam: "modal-popup-confirm-exit",
        icon: "error",
      });
    }
  };
  return (
    <FocusContext.Provider value={focusKeyParam}>
      <Support />
      <TermsAndCondition />
      <Privacy/>
      <FAQS />
      <div className="row ps-5">
        <div className="col-lg-10">
          <div className="row">
            <FocusableCard
              focusKeyParam="card-faq"
              setCurrentFocusContext={currentFocusContext.setFocusKey}
              onClick={() => setIframeContent("https://www.oneplay.in/FAQs.html")}
            >
              <div className="row height151">
                <div className="col">
                  <img src={InvoiceImg} className="img-fluid" alt="" />
                  <p className="font20Text mt-2 mb-0">Frequently Asked Questions</p>
                </div>
              </div>
            </FocusableCard>

            <FocusableCard
              focusKeyParam="card-support"
              setCurrentFocusContext={currentFocusContext.setFocusKey}
              onClick={() => setIframeContent("https://www.oneplay.in/contact.html")}
            >
              <div className="row height151">
                <div className="col">
                  <img src={MessageImg} className="img-fluid" alt="" />
                  <p className="font20Text mt-2 mb-0">Support</p>
                </div>
              </div>
            </FocusableCard>

            <FocusableCard
              focusKeyParam="card-tnc"
              setCurrentFocusContext={currentFocusContext.setFocusKey}
              onClick={() => setIframeContent("https://www.oneplay.in/tnc.html")}
            >
              <div className="row height151">
                <div className="col">
                  <img src={NewsImg} className="img-fluid" alt="" />
                  <p className="font20Text mt-2 mb-0">Terms & Conditions</p>
                </div>
              </div>
            </FocusableCard>

            <FocusableCard
              focusKeyParam="card-privacy"
              setCurrentFocusContext={currentFocusContext.setFocusKey}
              onClick={() => setIframeContent("https://www.oneplay.in/privacy.html")}
            >
              <div className="row height151">
                <div className="col">
                  <img src={FileImg} className="img-fluid" alt="" />
                  <p className="font20Text mt-2 mb-0">Privacy Policy</p>
                </div>
              </div>
            </FocusableCard>

            <FocusableCard
              focusKeyParam="card-user-privacy"
              setCurrentFocusContext={currentFocusContext.setFocusKey}
              onClick={toggleUserSearchPrivacy}
            >
              <div className="row height151">
                <div className="col">
                  <img src={PrivacyImg} className="img-fluid" alt="" />
                  <p className="font20Text mt-2 mb-0">Privacy</p>
                </div>
                <div className="col-auto mt-3">
                  <div className="form-check form-switch mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={userContext?.userProfile?.search_privacy ?? false}
                      onChange={onPrivacyChanged}
                    />
                  </div>
                </div>
              </div>
            </FocusableCard>

            <FocusableCard
              focusKeyParam="card-session-data"
              setCurrentFocusContext={currentFocusContext.setFocusKey}
              onClick={() => {
                console.log("clear session data");
              }}
            >
              <div className="row height151">
                <div className="col">
                  <img src={piechartImg} className="img-fluid" alt="" />
                  <p className="font20Text mt-2 mb-0">Session Data</p>
                </div>
                <div className="col-auto mt-2">
                  <img src={deleteImg} className="img-fluid mt-4" width="20px" alt="" />
                </div>
              </div>
            </FocusableCard>
            <FocusableCard focusKeyParam="card-logout" setCurrentFocusContext={currentFocusContext.setFocusKey} onClick={logoutClick}>
              <img src={logoutImg} className="img-fluid" alt="" />
              <p className="font20Text mt-2 mb-0">Log out</p>
            </FocusableCard>
          </div>
          <div className="row mt-5">
            <div className="col-md-7 mt-5">
              <div className="row gamesDescription Customborder">
                <div className="col">
                  Visit <span className="gradientText">www.oneplay.in</span> for more information.
                </div>
                <div className="col-auto">
                  <img src={arrow} className="img-fluid" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {webViewData.show && (
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, zIndex: "100000", background: "black" }}>
          <iframe className="general-iframe" id="general-iframe" title="IFRAME"></iframe>
        </div>
      )}
      {popUp.show && <ErrorPopUp {...popUp} />}
    </FocusContext.Provider>
  );
}

const FocusableCard = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {
      props.setCurrentFocusContext(props.focusKeyParam);
    },
    onEnterPress: () => {
      props.onClick();
    },
    onArrowPress: (direction, aprops, details) => {
      if (["card-faq", "card-logout", "card-privacy"].includes(props.focusKeyParam)) {
        if (direction === "left") {
          setFocus("go-to-general");
          return false;
        }
      }
      return true;
    },
  });
  return (
    <div className="col-md-4 mt-4" ref={ref}>
      <div className={"card border-0 cardBG" + (focused ? " focusedElement" : "")}>
        <div className="card-body p-4">{props.children}</div>
      </div>
    </div>
  );
};