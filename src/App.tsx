import React, { createContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import Routes from "./routes";
import { getProfile } from "./common/services";
import {
  API_BASE_URL,
  CHECK_FREE_SUBSCRIPTION,
  MOONLIGHT_UID,
  NETWORK_CHECK_URL,
  SESSION_TOKEN_LOCAL_STORAGE,
  SHOW_GAME_SETTINGS_CHECKED,
} from "./common/constants";
import { init, setKeyMap, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useLocation, useNavigate } from "react-router-dom";
import LoaderPopup from "./pages/loader";
import { HttpStatusCode } from "axios";
import ErrorPopUp from "./pages/error";
import { initCountly, initCountlyUser } from "./common/countly.service";
import { handleWASMPromiseMessage, sendMessageToWASM } from "./pages/auth/game-play/messages.moonlight";
export const SessionContext = createContext<{
  sessionToken: string;
  setSessionToken: any;
}>({
  sessionToken: "",
  setSessionToken: () => {},
});
export const NetworkStatusContext = createContext<boolean>(true);
export const VideoElementContext = createContext<HTMLVideoElement | null>(null);
export const PairingCertContext = createContext<{ cert: string; privateKey: string }>({ cert: "", privateKey: "" });
export const CurrentFocusContext = createContext<{
  focusKey: string;
  setFocusKey: Function;
}>({
  focusKey: "",
  setFocusKey: () => {},
});
export const UserProfileContext = createContext<{
  userProfile: any;
  setUserProfile: any;
}>({
  userProfile: null,
  setUserProfile: () => {},
});

init();
// Optional
setKeyMap({
  left: 37,
  up: 38,
  right: 39,
  down: 40, //[40, 65376],
  enter: [32, 13],
});
function App() {
  const [networkStatus, setNetworkStatus] = useState<boolean>(true);
  const [sessionToken, setSessionToken] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [focusKey, setFocusKey] = useState<string>("");
  const sessionContextValue = { sessionToken, setSessionToken };
  const userProfileContextValue = { userProfile, setUserProfile };
  const CurrentFocusContextValue = { focusKey, setFocusKey };
  const [showLoading, setShowLoading] = useState(true);
  const [showWASMModuleLoading, setshowWASMModuleLoading] = useState(true);
  const { pathname, search } = useLocation();
  const [goTo, setGoTo] = useState<string>("");
  const [reloadingNetwork, setReloadingNetwork] = useState<boolean>(false);
  const videoElement = useRef<HTMLVideoElement>(null);
  const pairingCert = useRef({ cert: "", privateKey: "" });
  const [networkStatusPopup, setNetworkStatusPopUp] = useState<ErrorPopupPorps>({
    show: false,
    message: "",
    title: "",
    returnFocusTo: "",
    buttons: [],
    focusKeyParam: "modal-no-internet-popup",
    icon: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (navigate) {
      //@ts-ignore
      window.reactNavigate = navigate;
    }
  }, [navigate]);
  const { setFocus } = useFocusable();
  useEffect(() => {
    console.log("app on load");
    const savedToken = localStorage.getItem(SESSION_TOKEN_LOCAL_STORAGE);
    console.log("saved token : ", savedToken);
    if (savedToken) {
      setShowLoading(true);
      (async () => {
        const profileResp = await getProfile(savedToken);
        console.log(profileResp.profile);
        if (!profileResp.success) {
          setShowLoading(false);
          localStorage.removeItem(SESSION_TOKEN_LOCAL_STORAGE);
          localStorage.removeItem(SHOW_GAME_SETTINGS_CHECKED);
          localStorage.removeItem(CHECK_FREE_SUBSCRIPTION);
        } else {
          setUserProfile(profileResp.profile);
          setSessionToken(savedToken);
          setShowLoading(false);
        }
      })();
    } else {
      setShowLoading(false);
      console.log("app navigate to /");
      navigate("/");
    }

    const onlineStatusCheckInterval = setInterval(async () => {
      if (reloadingNetwork) {
        console.log("reloading network .... ");
        return;
      }
      /* try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 5 * 1000);
        const internetStatusResponse = await fetch(NETWORK_CHECK_URL, {
          signal: controller.signal,
        });
        clearTimeout(id);
        if (!internetStatusResponse || internetStatusResponse.status !== HttpStatusCode.Ok) {
          setNetworkStatus(false);
        } else {
          setNetworkStatus(true);
        }
      } catch (error) {
        setNetworkStatus(false);
      } */
    }, 10 * 1000);
    return () => {
      clearInterval(onlineStatusCheckInterval);
    };
  }, []);
  const [videoElementState, setVideoElementState] = useState<HTMLVideoElement | null>(null);

  const reloadNetwork = async () => {
    console.log("inside reload network");
    setShowLoading(true);
    setReloadingNetwork(true);
    setNetworkStatusPopUp((prev) => {
      return { show: false, message: "", title: "", returnFocusTo: "", buttons: [], focusKeyParam: "modal-popup-no-internet", icon: "" };
    });

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 5 * 1000);
      const internetStatusResponse = await fetch(NETWORK_CHECK_URL, {
        signal: controller.signal,
      });
      clearTimeout(id);
      if (!internetStatusResponse || internetStatusResponse.status !== HttpStatusCode.Ok) {
        setReloadingNetwork(false);
        setShowLoading(false);
        setNetworkStatus(false);
        showNetworkErrorPopup();
      } else {
        setReloadingNetwork(false);
        setShowLoading(false);
        setNetworkStatus(true);
      }
    } catch (error) {
      setReloadingNetwork(false);
      setShowLoading(false);
      setNetworkStatus(false);
      showNetworkErrorPopup();
    }
  };

  const hideNetworkErrorPopup = () => {
    setNetworkStatusPopUp((prev) => {
      return { show: false, message: "", title: "", returnFocusTo: "", buttons: [], focusKeyParam: "modal-popup-no-internet", icon: "" };
    });
    setFocus(focusKey);
  };
  const showNetworkErrorPopup = () => {
    setNetworkStatusPopUp({
      show: true,
      message: "You are not connected to internet. Please connect to the internet and try again.",
      title: "NO INTERNET CONNECTION",
      returnFocusTo: "",
      buttons: [
        {
          text: "Refresh",
          className: "btn gradientBtn btn-lg border-0",
          focusKey: "btn-ok-popup",
          onClick: () => {
            hideNetworkErrorPopup();
            reloadNetwork();
          },
        },
        {
          text: "Exit OnePlay App",
          className: "btn grayGradientBtn btn-lg border-0 mt-3",
          focusKey: "btn-cancel-popup",
          onClick: () => {
            //@ts-ignore
            tizen.application.getCurrentApplication().exit();
          },
        },
      ],
      focusKeyParam: "modal-popup-no-internet",
      icon: "no-wifi",
    });
  };
  useEffect(() => {
    console.log("network status : ", networkStatus);
    if (networkStatus) {
      hideNetworkErrorPopup();
    } else {
      showNetworkErrorPopup();
    }
  }, [networkStatus]);
  /*  useEffect(() => {
    console.log("focus changes to : ", focusKey);
  }, [focusKey]); */

  useEffect(() => {
    const onRemoteReturnClicked = (event: any) => {
      if (networkStatusPopup.show) {
        event.stopPropagation();
        hideNetworkErrorPopup();
      }
    };
    window.addEventListener("RemoteReturnClicked", onRemoteReturnClicked);
    return () => {
      window.removeEventListener("RemoteReturnClicked", onRemoteReturnClicked);
    };
  }, [networkStatusPopup, hideNetworkErrorPopup]);
  /*useEffect(() => {
     console.log("app path name : ", pathname);
    const searchQuery = new URLSearchParams(search);
    const redirectTo = searchQuery.get("redirect");
    console.log("app redirect to : ", redirectTo);
    const savedToken = localStorage.getItem(SESSION_TOKEN_LOCAL_STORAGE);
    if (!sessionToken && savedToken && pathname === "/index.html/") {
      setShowLoading(true);
      (async () => {
        const profileResp = await getProfile(savedToken);
        if (!profileResp.success) {
          setShowLoading(false);
          localStorage.removeItem(SESSION_TOKEN_LOCAL_STORAGE);
        } else {
          setUserProfile(profileResp.profile);
          setSessionToken(savedToken);
          if (redirectTo) {
            navigate(redirectTo);
          } else {
            navigate("/home");
          }
        }
      })();
    } else if (!sessionToken) {
      setShowLoading(false);
      navigate("/");
    } 

    const searchQuery = new URLSearchParams(search);
    const redirectTo = searchQuery.get("redirect");
    if (pathname === "/index.html/" && redirectTo && goTo !== "-") {
      console.log("set go to : ", redirectTo);
      setGoTo(redirectTo);
    }
  }, [pathname]);*/

  useEffect(() => {
    if (sessionToken) {
      setShowLoading(false);
      if (goTo) {
        setGoTo("-");
        navigate(goTo + "?back=/home");
      } else {
        navigate("/home");
      }
    }

    /* else {
      console.log("app useEffect sessionToken navigate to /");
      navigate("/");
    } */
  }, [sessionToken]);
  /* useEffect(() => {
    const searchQuery = new URLSearchParams(search);
    const redirectTo = searchQuery.get("redirect");
    console.log("app redirect to : ", redirectTo);
    if (sessionToken) {
      setShowLoading(false);
      console.log("app session token path name : ", pathname);

      if (pathname.replace("/index.html", "") === "") {
        if (redirectTo) {
          navigate(`/?redirect=${redirectTo}`);
        }
      }
    } else {
      navigate("/");
    }
  }, [sessionToken]); */
  useLayoutEffect(() => {
    const searchQuery = new URLSearchParams(search);
    const redirectTo = searchQuery.get("redirect");
    if (pathname === "/index.html/" && redirectTo && goTo !== "-") {
      console.log("set go to : ", redirectTo);
      setGoTo(redirectTo);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  useEffect(() => {
    if (userProfile) {
      initCountly();
      initCountlyUser(userProfile);
    }

    return () => {};
  }, [userProfile]);
  useEffect(() => {
    if (!videoElement.current) {
      return;
    }
    setVideoElementState(videoElement.current);
    createWASMModule();
  }, []);

  const createWASMModule = async () => {
    //@ts-ignore
    window.handlePromiseMessage = handleWASMPromiseMessage;
    console.log("createWASMModule.....");
    //@ts-ignore
    window.Module = {
      onRuntimeInitialized: async () => {
        console.log("WASM runtime initialized");
        try {
          //@ts-ignore
          const pCert = await sendMessageToWASM("makeCert", []);
          if (pCert && pCert.cert && pCert.privateKey) {
            console.log("cert created : ", pCert);
            pairingCert.current = { cert: pCert.cert, privateKey: pCert.privateKey };
            const httpInitresponse = await sendMessageToWASM("httpInit", [pCert.cert, pCert.privateKey, MOONLIGHT_UID]);
            console.log("http init : ", httpInitresponse);
            setshowWASMModuleLoading(false);
          }
        } catch (error) {
          console.log("error onRuntimeInitialized : ", error);
        }

        //updateStatus("RUNNING");

        // if ("moduleDidLoad" as keyof typeof window) {
        //   window.moduleDidLoad();
        // }
      },
      onAbort: () => {
        console.warn("abort called");
      },
      onExit: (status: string) => {
        console.log("onExit called status: " + status);
      },
    }; // Module
    const moonlightWasmScript = document.createElement("script");
    moonlightWasmScript.src = "/moonlight-wasm.js";
    document.body.appendChild(moonlightWasmScript);
  };
  return (
    <SessionContext.Provider value={sessionContextValue}>
      <UserProfileContext.Provider value={userProfileContextValue}>
        <CurrentFocusContext.Provider value={CurrentFocusContextValue}>
          <NetworkStatusContext.Provider value={networkStatus}>
            <PairingCertContext.Provider value={pairingCert.current}>
              <video
                id="nacl_module"
                autoPlay
                tabIndex={-1}
                ref={videoElement}
                style={{ display: "none", position: "absolute", top: 0, left: 0 }}
              ></video>
              <VideoElementContext.Provider value={videoElementState}>
                {networkStatus && !showWASMModuleLoading && <Routes />}
                {(showLoading || showWASMModuleLoading) && <LoaderPopup focusKeyParam="Loader" />}
                {networkStatusPopup.show && <ErrorPopUp {...networkStatusPopup} />}
              </VideoElementContext.Provider>
            </PairingCertContext.Provider>
          </NetworkStatusContext.Provider>
        </CurrentFocusContext.Provider>
      </UserProfileContext.Provider>
    </SessionContext.Provider>
  );
}

export default App;
