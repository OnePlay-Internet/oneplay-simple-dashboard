import { useEffect, useState } from "react";
import ContactHeroImage from "../../../assets/images/setting/contact/Contact1.png";
import DashboardImage from "../../../assets/images/setting/contact/laptop1.png";
import iconClose from "../../../assets/images/icon-close.svg";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";

export default function Support({ close, focusKey: focusKeyParam }: { close: Function; focusKey: string }) {
  const [zohoFormLoaded, setZohoFormLoaded] = useState<boolean>(false);
  const { focusSelf, focusKey, setFocus } = useFocusable({
    focusable: true,
    trackChildren: true,
    focusKey: focusKeyParam,
    isFocusBoundary: true,
  });
  useEffect(() => {
    setFocus("content-support");
  }, [setFocus]);
  useEffect(() => {
    const zohoScript = document.createElement("script");
    zohoScript.src = "https://desk.zoho.com/portal/api/feedbackwidget/707776000000194129?orgId=773466876&displayType=embeded";
    zohoScript.async = true;
    document.body.appendChild(zohoScript);
    return () => {
      document.body.removeChild(zohoScript);
    };
  }, []);
  useEffect(() => {
    let zohoFormCheckInterval: NodeJS.Timer | null = setInterval(() => {
      const zohoFormLoaded = document.getElementById("feedbNameTxtField");
      if (zohoFormCheckInterval && zohoFormLoaded) {
        setZohoFormLoaded(true);
        clearInterval(zohoFormCheckInterval);
        zohoFormCheckInterval = null;
      }
    }, 100);
    return () => {
      if (zohoFormCheckInterval) {
        clearInterval(zohoFormCheckInterval);
      }
    };
  }, []);
  return (
    <FocusContext.Provider value={focusKeyParam}>
      <div className="settings-popup" tabIndex={-1} style={{ display: "block", opacity: 1, backgroundColor: "#212123" }}>
        <FocusableButton focusKeyParam="btn-close-support" onClick={close}>
          <img src={iconClose} className="img-fluid" alt="" />
        </FocusableButton>
        <FocusableContent focusKeyParam="content-support" zohoFormLoaded={zohoFormLoaded}>
          <div className="container-fluid">
            <div className="container">
              <div className="row px-5 mb-5">
                <div className="col-lg-6 col-md-6 align-self-center pe-lg-5" style={{ textAlign: "left" }}>
                  <h1 className="text-white font50 font800" data-i18n-key="heading1">
                    Your voice matters
                  </h1>
                  <div className="row">
                    <div className="col-lg-9">
                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4" data-i18n-key="subheading1">
                        We are always here to listen. Let’s enhance our community together.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 text-end desktopView">
                  <div className="row justify-content-end negativeMargin">
                    <div className="col-md-10">
                      <img src={ContactHeroImage} className="img-fluid" alt="vector" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid">
            <div className="row">
              <div className="col p-0">
                <hr className="border-bottom customBorderColor" />
              </div>
            </div>
          </div>

          <div className="container pt-5">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-9">
                <div className="row text-center justify-content-center mb-4">
                  <div className="col-12">
                    <h1 className="text-white font50 font800" data-i18n-key="heading2">
                      Need help with OnePlay?
                    </h1>
                  </div>
                  <div className="col-lg-6 col-md-7">
                    <p className="font20Text font500 offWhiteColor mt-4 mb-0">Please provide your information to help us contact you</p>
                  </div>
                </div>
                {/* This code for Loader */}

                {!zohoFormLoaded ? (
                  <div className="row justify-content-center">
                    <div className="col-auto negativeWidthMargin">
                      <div className="formLoader mt-5"></div>
                    </div>
                  </div>
                ) : null}

                <div id="zsfeedbackwidgetdiv"></div>

                <div className="row pt-4 justify-content-center">
                  <div className="col-lg-7 col-md-8">
                    <div className="row">
                      <div className="col align-self-center">
                        <div className="customBorderColor border-bottom"></div>
                      </div>
                      <div className="col-auto align-self-center px-0">
                        <span className="font16 font500 customOffWhite">OR</span>
                      </div>
                      <div className="col align-self-center">
                        <div className="customBorderColor border-bottom"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col text-center mt-5 gradientAnchor">
                    <h3 className="font28 font700 text-white" data-i18n-key="dropemail">
                      Drop us an email
                    </h3>
                    <p className="font20 font500 mb-0">
                      <a href="#" id="emailId" data-i18n-key="emailaddress">
                        support@oneplay.in
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid padding100">
            <div className="row">
              <div className="col p-0">
                <hr className="border-bottom customBorderColor" />
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row px-5 mt-5">
              <div className="col-md-12">
                <div className="card borderRadius30 linearGradient border-0">
                  <div className="card-body text-white pe-lg-0 ps-lg-5">
                    <div className="row">
                      <div className="col-lg-9 ps-lg-4 pt-4 pb-4 align-self-center p-0">
                        <h1 className="font50 font800">Be part of the Revolution by joining Discord channel and stay updated.</h1>
                        <a
                          href="#"
                          className="btn btn-lg align-middle font20Text text-white ps-5 pe-5 font500 removeFocus buttonLinear align-middle borderRadius60 border-top-0 border-start-0 border-end-0 mt-4"
                        >
                          <i className="fa-brands fa-discord me-2 font20 align-middle"></i>Find us on Discord : Oneplay Gaming
                        </a>
                      </div>
                      <div className="col-lg-3 align-self-center p-0">
                        <div className="position-absoulte mr-130">
                          <img src={DashboardImage} className="img-fluid" alt="laptop" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FocusableContent>
      </div>
    </FocusContext.Provider>
  );
}
const FocusableContent = (props: any) => {
  const [currentFormElement, setCurrentFormElement] = useState<number>(-1);
  const formElemnts = [
    "feedbNameTxtField",
    "feedbEmailTxtField",
    "feedbackSubject",
    "feedbackDescription",
    "captchaWord",
    "feedbPopupSbmtBtn",
  ];
  useEffect(() => {
    if (currentFormElement >= 0 && currentFormElement < formElemnts.length) {
      //document.getElementById(formElemnts[currentFormElement])?.focus();
      document.getElementById(formElemnts[currentFormElement])?.classList.add("focusedFormElement");
    }
  }, [currentFormElement]);
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {
      if (currentFormElement >= 0 && currentFormElement < formElemnts.length) {
        if (currentFormElement === formElemnts.length - 1) {
          document.getElementById(formElemnts[currentFormElement])?.click();
        } else {
          document.getElementById(formElemnts[currentFormElement])?.focus();
        }
      }

      /* const formSubmitButton = document.getElementById("feedbPopupSbmtBtn");
       if (formSubmitButton && formSubmitButton === document.activeElement) {
         formSubmitButton.click();
       } */
    },
    onArrowPress: (direction, arrowProps, details) => {
      const zohoForm = document.getElementById("zsfeedbackwidgetdiv");
      if (props.zohoFormLoaded && zohoForm) {
        const visible = checkVisible(zohoForm);
        if (visible) {
          /* zohoForm.scrollIntoView({
            behavior: "smooth",
            block: "center",
          }); */
          let captureEvent = false;
          let cElement = currentFormElement;
          switch (direction) {
            case "right":
            case "down":
              cElement++;
              break;
            case "up":
            case "left":
              cElement--;
              break;
          }
          document.getElementById(formElemnts[currentFormElement])?.classList.remove("focusedFormElement");
          document.getElementById(formElemnts[currentFormElement])?.blur();
          if (cElement >= 0 && cElement < formElemnts.length) {
            document.getElementById(formElemnts[currentFormElement])?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            captureEvent = true;
            setCurrentFormElement(cElement);
          } else {
            captureEvent = false;
            if (cElement >= formElemnts.length) {
              setCurrentFormElement(formElemnts.length);
            } else if (cElement < 0) {
              setCurrentFormElement(-1);
            }
          }
          if (captureEvent) {
            return true;
          }
        }
      }
      if (direction === "left" || direction === "right") {
        setFocus("btn-close-support");
        return true;
      }
      if (ref.current) {
        const currentTop = ref.current.scrollTop;
        if (direction === "up") {
          if (currentTop === 0) {
            setFocus("btn-close-support");
            return true;
          } else {
            ref.current.scrollTop = currentTop - 20;
          }
        } else if (direction === "down") {
          ref.current.scrollTop = currentTop + 20;
        }
      }
      return false;
    },
  });

  const checkVisible = (elm: HTMLElement) => {
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
  };
  return (
    <div ref={ref} className="popup-body text-center p-5">
      {props.children}
    </div>
  );
};
const FocusableButton = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {
      props.onClick();
    },
    onArrowPress: (direction, aprops, details) => {
      setFocus("content-support");
      return false;
    },
  });
  return (
    <button ref={ref} onClick={props.onClick} className={"setting-popup-close" + (focused ? " focusedElement" : "")}>
      <img src={iconClose} className="img-fluid" alt="" />
    </button>
  );
};
