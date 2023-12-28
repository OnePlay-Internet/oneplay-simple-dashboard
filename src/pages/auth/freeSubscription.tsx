import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { CurrentFocusContext, SessionContext, UserProfileContext } from "src/App";
import { activateTizenFreeSubscription, verifyTizenDUID } from "src/common/services";
import { encryptDUID } from "src/common/utils";
import ErrorPopUp from "../error";
import LoaderPopup from "../loader";
import { CHECK_FREE_SUBSCRIPTION } from "src/common/constants";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";

export default function FreeSubscription(props: { [key: string]: any }) {
  const { setFocus } = useFocusable();
  const sessionContext = useContext(SessionContext);
  const userContext = useContext(UserProfileContext);
  const tizenDUID = useRef("");
  const [showLoader, setShowLoader] = useState(false);
  const [popUp, setPopUp] = useState<ErrorPopupPorps>({
    show: false,
    message: "",
    title: "",
    returnFocusTo: "",
    buttons: [],
    focusKeyParam: "modal-popup",
    icon: "",
  });
  const hidePopup = useCallback(() => {
    props.setShowingFreeSubscriptionPopup(false);
    setPopUp({
      show: false,
      message: "",
      title: "",
      returnFocusTo: "",
      buttons: [],
      focusKeyParam: "modal-popup",
      icon: "",
    });
    setFocus("home_header_slider");
  }, [popUp, setFocus]);

  const activateFreeSubscription = useCallback(async () => {
    const token = encryptDUID(userContext.userProfile.user_id + "::" + tizenDUID.current);
    hidePopup();
    setShowLoader(true);
    const resp = await activateTizenFreeSubscription(sessionContext.sessionToken, token);
    setShowLoader(false);
    localStorage.setItem(CHECK_FREE_SUBSCRIPTION, "1");
    if (resp.success) {
      props.setShowingFreeSubscriptionPopup(true);
      setPopUp({
        show: true,
        message: "Your plan is now activated, and you're ready to start your journey!",
        title: "Awesome!",
        returnFocusTo: "home_header_slider",
        buttons: [
          {
            text: "OK",
            className: "btn gradientBtn btn-lg border-0",
            focusKey: "btn-ok-popup",
            onClick: hidePopup,
          },
        ],
        focusKeyParam: "modal-popup",
        icon: "success",
      });
    }
  }, [hidePopup, sessionContext, userContext]);
  useEffect(() => {
    if (!sessionContext.sessionToken || !userContext.userProfile) {
      return;
    }

    const checkFreeSub = async () => {
      const checkForFreeSub = parseInt(localStorage.getItem(CHECK_FREE_SUBSCRIPTION) ?? "0");
      if (!tizenDUID.current || checkForFreeSub) {
        return;
      }
      const token = encryptDUID(userContext.userProfile.user_id + "::" + tizenDUID.current);
      const resp = await verifyTizenDUID(sessionContext.sessionToken, token.toString("base64"));
      if (resp.success) {
        props.setShowingFreeSubscriptionPopup(true);
        setPopUp({
          show: true,
          message: "This offer is applicable on a single device only.",
          title: "Enjoy 1 month of free Gaming!",
          returnFocusTo: "home_header_slider",
          buttons: [
            {
              text: "Activate Now",
              className: "btn gradientBtn btn-lg border-0",
              focusKey: "btn-ok-popup",
              onClick: activateFreeSubscription,
            },
            {
              text: "Cancel",
              className: "btn grayGradientBtn btn-lg border-0 mt-3",
              focusKey: "btn-cancel-popup",
              onClick: () => {
                localStorage.setItem(CHECK_FREE_SUBSCRIPTION, "1");
                hidePopup();
              },
            },
          ],
          focusKeyParam: "modal-popup",
          icon: "recharge",
        });
      } else if (!resp.message) {
        localStorage.setItem(CHECK_FREE_SUBSCRIPTION, "1");
      }
    };
    try {
      //@ts-ignore
      const duid = webapis.productinfo.getDuid();
      if (duid) {
        tizenDUID.current = duid;
      }
    } catch (error) {
      console.log("error fetchig duid : ", error);
    }
    const freeSubTimer = setTimeout(() => {
      checkFreeSub();
    }, 3000);
    return () => {
      clearTimeout(freeSubTimer);
    };
  }, []);
  return (
    <>
      {popUp.show && props.showingFreeSubscriptionPopup && <ErrorPopUp {...popUp} />}
      {showLoader && <LoaderPopup />}
    </>
  );
}
