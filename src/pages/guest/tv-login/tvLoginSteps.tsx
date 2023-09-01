import { useContext, useEffect, useState } from "react";
import brandLogo from "../../../assets/images/oneplayLogo.svg";
import { getProfile, getQRCode, getQrSession } from "src/common/services";
import { SessionContext, UserProfileContext } from "src/App";
import { QR_URL, SESSION_TOKEN_LOCAL_STORAGE } from "src/common/constants";
import ErrorPopUp from "src/pages/error";
import QRCode from "react-qr-code";
import LoaderPopup from "src/pages/loader";
export default function TvLogin() {
  const [qrData, setQrData] = useState({ code: "", token: "" });
  const [showLoading, setShowLoading] = useState(true);
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

  useEffect(() => {
    let qrRefreshInterval: NodeJS.Timer;
    setShowLoading(true);
    (async () => {
      fetchQRCode();
      qrRefreshInterval = setInterval(fetchQRCode, 3 * 60 * 1000);
    })();
    return () => {
      if (qrRefreshInterval) {
        clearInterval(qrRefreshInterval);
      }
    };
  }, []);

  useEffect(() => {
    let qrInterval: NodeJS.Timer;
    if (qrData.code && qrData.token) {
      qrInterval = setInterval(getQRSession, 3 * 1000);
    }
    return () => {
      if (qrInterval) {
        clearInterval(qrInterval);
      }
    };
  }, [qrData]);
  const fetchQRCode = async () => {
    const qrcode = await getQRCode();
    setShowLoading(false);
    if (qrcode.success && qrcode.code && qrcode.token) {
      setQrData({ code: qrcode.code, token: qrcode.token });
    }
  };
  const getQRSession = async () => {
    const qrSessionResponse = await getQrSession(qrData.code, qrData.token);
    if (!qrSessionResponse.success) {
      setPopUp({
        show: true,
        message: qrSessionResponse.message ?? "",
        title: "Error!",
        returnFocusTo: "btn-login",
        buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
        focusKeyParam: "modal-popup-confirm-exit",
        icon: "error",
      });
      return;
    }
    if (qrSessionResponse.sessionToken) {
      const profileResp = await getProfile(qrSessionResponse.sessionToken);
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
          focusKeyParam: "modal-popup-confirm-exit",
          icon: "error",
        });
      } else {
        userContext.setUserProfile(profileResp.profile);
      }
      localStorage.setItem(SESSION_TOKEN_LOCAL_STORAGE, qrSessionResponse.sessionToken);
      sessionContext.setSessionToken(qrSessionResponse.sessionToken);
    }
  };

  const hidePopup = () => {
    // const returnFocusTo = popUp.returnFocusTo;
    setPopUp({
      show: false,
      message: "",
      title: "",
      returnFocusTo: "",
      buttons: [],
      focusKeyParam: "modal-popup",
      icon: "",
    });
    //setFocus(returnFocusTo);
  };
  return (
    <>
      <div className="container-fluid backgroundBg">
        <div className="pt-4 position-fixed end-0">
          <img src={brandLogo} className="img-fluid pe-3" alt="" />
        </div>
        <div className="container">
          <div className="row justify-content-center middleAlign">
            {qrData.code && (
              <div className="col-lg-9 pt-5">
                <div className="row">
                  <div className="col-lg-9">
                    <h2 className="price">Follow these steps on your computer or mobile device</h2>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-9 mt-4">
                    <div className="row mt-5">
                      <div className="col-auto">
                        <div className="countStep">1</div>
                      </div>
                      <div className="col">
                        <p className="font20Text mb-0">Scan the QR code with your Phone's camera or go to:</p>
                        <h3 className="heading">{QR_URL}</h3>
                      </div>
                    </div>
                    <div className="row mt-5">
                      <div className="col-auto">
                        <div className="countStep">2</div>
                      </div>
                      <div className="col">
                        <p className="font20Text mb-0">Enter sign-in code:</p>
                        <h3 className="heading">{qrData.code}</h3>
                      </div>
                    </div>
                    <div className="row mt-5">
                      <div className="col-auto">
                        <div className="countStep">3</div>
                      </div>
                      <div className="col align-self-center">
                        <p className="font20Text mb-0">Sign in to Oneplay. Your TV will be ready to watch!</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 mt-4">
                    <div className="mt-5">
                      {qrData.code && (
                        <div style={{ padding: "10px", backgroundColor: "white", display: "inline-block" }}>
                          <QRCode value={`https://www.${QR_URL}?code=${qrData.code}`} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showLoading ? <LoaderPopup focusKeyParam="Loader" /> : null}
      {popUp.show && <ErrorPopUp {...popUp} />}
    </>
  );
}
