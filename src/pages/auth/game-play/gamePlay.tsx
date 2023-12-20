import React, { useCallback, useContext, useEffect, useState } from "react";
import { PairingCertContext, VideoElementContext } from "src/App";
import { runningOnChrome } from "./utils.moonlight";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NvHTTP } from "./NvHTTP.moonlight";
import { MOONLIGHT_UID } from "src/common/constants";
import LoaderPopup from "src/pages/loader";
import { handleWASMMessages } from "./messages.moonlight";
import "./moonlight.css";
import OnScreenKeyboard from "./onScreenKeyboard.moonlight";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import iconSettings from "../../../assets/images/icon-gameplay-settings.svg";
import iconKeyboard from "../../../assets/images/icon-gameplay-keyboard.svg";
import iconStats from "../../../assets/images/icon-gameplay-stats.svg";
import iconControllerShortcuts from "../../../assets/images/icon-gameplay-controller-shortcuts.svg";
import iconQuit from "../../../assets/images/icon-gameplay-quit.svg";
import ErrorPopUp from "src/pages/error";
import HeartBeatAPI from "./heartBeatAPI/heartBeatAPI";
import iconClose from "../../../assets/images/icon-close.svg";
function GamePlay({ focusKey: focusKeyParam }: { focusKey: string }) {
  const [searchParams] = useSearchParams();
  const videoElement = useContext(VideoElementContext);
  const pairingCert = useContext(PairingCertContext);
  const [gamePlayStarted, setGamePlayStarted] = useState<boolean>(false);
  const [showSettings, setshowSettings] = useState<boolean>(false);
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  const [showControllerShortcuts, setShowControllerShortcuts] = useState<boolean>(false);
  const [mouseMode, setMouseMode] = useState<boolean>(true);
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [showHeartBeatStat, setShowHeartBeatStat] = useState<boolean>(false);
  const [loaderMessage, setLoaderMessage] = useState<string>("Starting game...");
  const navigate = useNavigate();
  const [nvHttp, setNvHttp] = useState<NvHTTP | null>(null);
  const [popUp, setPopUp] = useState<ErrorPopupPorps>({
    show: false,
    message: "",
    title: "",
    returnFocusTo: "",
    buttons: [],
    focusKeyParam: "modal-popup",
    icon: "",
  });
  const { focusSelf, focusKey, setFocus } = useFocusable({
    focusable: true,
    trackChildren: true,
    focusKey: focusKeyParam,
    isFocusBoundary: true,
  });
  const initMoonlightConnection = async () => {
    const serverIp = searchParams.get("server_ip");
    const hostSessionKey = searchParams.get("host_session_key");
    const httpPort = searchParams.get("http_port");
    const httpsPort = searchParams.get("https_port");
    const rtspPort = searchParams.get("rtsp_port");
    const controlPort = searchParams.get("control_port");
    const audioPort = searchParams.get("audio_port");
    const videoPort = searchParams.get("video_port");
    if (!serverIp || !hostSessionKey || !httpPort || !httpsPort || !rtspPort || !controlPort || !audioPort || !videoPort || nvHttp) {
      return;
    }

    const nv = new NvHTTP(serverIp, MOONLIGHT_UID, hostSessionKey, +httpPort, +httpsPort, +rtspPort, +controlPort, +audioPort, +videoPort);
    setLoaderMessage("Started pairing...");
    const hasServerInfo = await nv.refreshServerInfo();
    if (!hasServerInfo) {
      return;
    }
    await nv.setPairKey();
    const paired = await nv.pairServer();
    console.log("server paired : ", paired);
    if (!paired) {
      console.log("could not pair with server");
      return;
    }

    const haveApps = await nv.getAppList();
    if (!haveApps) {
      console.log("could not get applist");
      return;
    }

    const desktopApp = nv.appList.find((app) => app.title === "Desktop");
    if (!desktopApp) {
      console.log("could not find desktop error");
      return;
    }
    setLoaderMessage("Starting " + desktopApp.title + "...");
    const selectedRes = searchParams.get("resolution");
    const gameFps = searchParams.get("game_fps");
    const bitRate = searchParams.get("bitrate_kbps") ?? "20";

    if (!selectedRes || !gameFps) {
      return;
    }

    if (searchParams.get("game_fps")) {
      playGameMode();
      await nv.startGame(desktopApp, gameFps, selectedRes.split("x")[0], selectedRes.split("x")[1], bitRate);
      setShowLoader(false);
    }

    setNvHttp(nv);
  };
  const onRemoteReturnClicked = useCallback(
    (event: any) => {
      if (showSettings) {
        console.log("inside showSettings");
        toggleSettingsDialog();
      } else if (showKeyboard) {
        console.log("inside showKeyboard");
        toggleVirtualKeyboard();
      } else if (showControllerShortcuts) {
        console.log("inside showControllerShortcuts");
        toggleControllerShortcuts();
      } else {
        if (popUp.show) {
          hidePopup();
        } else {
          showConfirmExitStreamPopup();
        }
      }
    },
    [showSettings, showKeyboard, showControllerShortcuts, popUp.show]
  );

  const toggleMouseMode = async () => {
    if (gamePlayStarted && nvHttp) {
      const toggledMouse = await nvHttp.toggleMouseMode();
      if (toggledMouse) {
        setMouseMode((prev) => !prev);
      }
    }
  };
  useEffect(() => {
    if (gamePlayStarted && nvHttp) {
      toggleMouseMode();
    }
  }, [nvHttp, gamePlayStarted]);
  const handleWASMInteractions = useCallback((msg: any) => {
    console.log("%c[messages.moonlight.ts, handleMessage]", "color:gray;", "Message data: ", msg);
    if (msg.indexOf("streamTerminated: ") === 0) {
      setGamePlayStarted(false);
      // if it's a recognized event, notify the appropriate function
      // Release our keep awake request
      if (runningOnChrome()) {
        //@ts-ignore
        chrome.power.releaseKeepAwake();
      }

      // Show a termination snackbar message if the termination was unexpected
      /* var errorCode = parseInt(msg.replace("streamTerminated: ", ""));
    //if (errorCode !== 0) {
    snackbarLogLong("Connection terminated unexpectedly.");
    //}
    stopHeartBeatAPI();
    showStreamTerminatedUndexpectedlyDialog(); */
    } else if (msg === "Connection Established") {
      setGamePlayStarted(true);
      // setGameStartedSuccessfully();
      // startHeartBeatAPI();
      // $("#loadingSpinner").css("display", "none");
      // $("body").css("backgroundColor", "transparent");
      // $("#nacl_module").css("display", "");
      // $("#nacl_module").focus();

      // Keep the display awake while streaming
      if (runningOnChrome()) {
        //@ts-ignore
        chrome.power.requestKeepAwake("display");
      }
    } else if (msg.indexOf("ProgressMsg: ") === 0) {
      //$("#loadingMessage").text(msg.replace("ProgressMsg: ", ""));
      setLoaderMessage(msg.replace("ProgressMsg: ", ""));
    } else if (msg.indexOf("TransientMsg: ") === 0) {
      //snackbarLog(msg.replace("TransientMsg: ", ""));
    } else if (msg.indexOf("DialogMsg: ") === 0) {
      // FIXME: Really use a dialog
      //snackbarLogLong(msg.replace("DialogMsg: ", ""));
    } else if (msg === "displayVideo") {
      //$("#listener").addClass("fullscreen");
    }
  }, []);
  useEffect(() => {
    //@ts-ignore
    window.enableGamepad = false;
    //@ts-ignore
    window.handleMessage = handleWASMInteractions;
    const listenerDiv = document.getElementById("listener");
    if (listenerDiv) {
      listenerDiv.addEventListener("message", handleWASMInteractions, true);
    }
    initMoonlightConnection();
    return () => {
      //@ts-ignore
      window.handleMessage = handleWASMMessages;
      //@ts-ignore
      window.enableGamepad = true;
      makeVideoElementHide();
    };
  }, []);

  const makeVideoElementHide = () => {
    if (!videoElement) {
      return;
    }
    videoElement.style.display = "none";
  };
  const makeVideoElementFullScreen = () => {
    const selectedRes = searchParams.get("resolution");
    if (!videoElement || !selectedRes) {
      return;
    }
    var streamWidth = +selectedRes.split("x")[0]; //$("#selectResolution").data("value").split(":")[0];
    var streamHeight = +selectedRes.split("x")[1]; //$("#selectResolution").data("value").split(":")[1];
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;

    var xRatio = screenWidth / streamWidth;
    var yRatio = screenHeight / streamHeight;

    var zoom = Math.min(xRatio, yRatio);

    //var module = $("#nacl_module")[0];

    videoElement.width = zoom * streamWidth;
    videoElement.height = zoom * streamHeight;
    videoElement.style.paddingTop = (screenHeight - videoElement.height) / 2 + "px";
    videoElement.style.display = "block";
    videoElement.focus();
    videoElement.dispatchEvent(new Event("mousedown"));

    const listener = document.getElementById("listener");
    if (listener) {
      listener.className = "fullscreen";
    }
  };
  const playGameMode = () => {
    if (runningOnChrome()) {
      //@ts-ignore
      chrome.app.window.current().fullscreen();
    }
    makeVideoElementFullScreen();
  };
  const toggleVirtualKeyboard = () => {
    setshowSettings(false);
    setShowKeyboard((prev) => {
      if (prev) {
        //@ts-ignore
        window.enableGamepad = false;
      } else {
        //@ts-ignore
        window.enableGamepad = true;
      }
      return !prev;
    });
  };
  const sendKeyboardClickEvent = async (args: any[]) => {
    // console.log("sendKeyboardClickEvent : ", args);
    await nvHttp?.sendKeyboardClickEvent(args);
  };
  const toggleSettingsDialog = () => {
    setshowSettings((prev) => {
      setShowControllerShortcuts(false);
      if (!prev) {
        setFocus("gameplay-settings-keyboard");
        //@ts-ignore
        window.enableGamepad = true;
      } else {
        //@ts-ignore
        window.enableGamepad = false;
      }
      return !prev;
    });
  };
  const toggleControllerShortcuts = () => {
    setshowSettings(false);
    setShowControllerShortcuts((prev) => {
      if (!prev) {
        //@ts-ignore
        window.enableGamepad = true;
      } else {
        //@ts-ignore
        window.enableGamepad = false;
      }
      return !prev;
    });
  };
  const hidePopup = () => {
    setPopUp((prev) => {
      return {
        show: false,
        message: "",
        title: "",
        returnFocusTo: "",
        buttons: [],
        focusKeyParam: "modal-popup-confirm-stream-exit",
        icon: "",
      };
    });
  };

  const showConfirmExitStreamPopup = () => {
    setshowSettings(false);
    //tizen.application.getCurrentApplication().exit();
    setPopUp({
      show: true,
      message: "Would you like to quit the game?",
      title: "Quit game?",
      returnFocusTo: "gameplay-settings",
      buttons: [
        {
          text: "No",
          className: "btn gradientBtn btn-lg border-0",
          focusKey: "btn-ok-popup",
          onClick: hidePopup,
        },
        {
          text: "Yes",
          className: "btn grayGradientBtn btn-lg border-0 mt-3",
          focusKey: "btn-cancel-popup",
          onClick: () => {
            hidePopup();
            if (videoElement) {
              videoElement.style.display = "none";
            }
            const listener = document.getElementById("listener");
            if (listener) {
              listener.className = "";
            }
            navigate(-1);
          },
        },
      ],
      focusKeyParam: "modal-popup-confirm-stream-exit",
      icon: "error",
    });
  };
  const toggleHeartBeatStats = () => {
    setShowHeartBeatStat((prev) => {
      setshowSettings(false);
      return !prev;
    });
  };

  useEffect(() => {
    window.addEventListener("RemoteReturnClicked", onRemoteReturnClicked);
    window.addEventListener("showGamePlaySettings", toggleSettingsDialog);
    window.addEventListener("showGamePlayVirtualKeyboard", toggleVirtualKeyboard);
    window.addEventListener("gamePlayToggleMouseMode", toggleMouseMode);
    return () => {
      window.removeEventListener("RemoteReturnClicked", onRemoteReturnClicked);
      window.removeEventListener("showGamePlaySettings", toggleSettingsDialog);
      window.removeEventListener("showGamePlayVirtualKeyboard", toggleVirtualKeyboard);
      window.removeEventListener("gamePlayToggleMouseMode", toggleMouseMode);
    };
  }, [onRemoteReturnClicked, toggleSettingsDialog, toggleVirtualKeyboard]);
  return (
    <FocusContext.Provider value={focusKeyParam}>
      <div className="settingsWrapper">
        <FocusableButton
          focusKeyParam="gameplay-settings"
          className="settingsButton"
          onClick={toggleSettingsDialog}
          style={{ height: "60px", width: "60px" }}
        >
          <img src={iconSettings} className="img-fluid" alt="" />
        </FocusableButton>

        {showSettings && (
          <div className="overlayCard">
            <FocusableButton focusKeyParam="btn-close-settings-overlay" className="setting-popup-close" onClick={toggleSettingsDialog}>
              <img src={iconClose} className="img-fluid" alt="" />
            </FocusableButton>
            <h3 className="heading">Settings</h3>
            <div className="dFlex">
              <FocusableButton
                focusKeyParam="gameplay-settings-keyboard"
                className="optionButton settingsButton"
                onClick={toggleVirtualKeyboard}
              >
                <div className="removeBlur">
                  <img src={iconKeyboard} className="img-fluid" alt="" />
                  <p>Show Keyboard</p>
                </div>
              </FocusableButton>
              <FocusableButton className="optionButton settingsButton" onClick={toggleHeartBeatStats}>
                <div className="removeBlur">
                  <img src={iconStats} className="img-fluid" alt="" />
                  <p>
                    Toggle <br />
                    Game Stats
                  </p>
                </div>
              </FocusableButton>
              <FocusableButton className="optionButton settingsButton" onClick={toggleControllerShortcuts}>
                <div className="removeBlur">
                  <img src={iconControllerShortcuts} className="img-fluid" alt="" />
                  <p>Controller Shortucuts</p>
                </div>
              </FocusableButton>
              <FocusableButton className="optionButton removeMargin settingsButton" onClick={showConfirmExitStreamPopup}>
                <div className="removeBlur">
                  <img src={iconQuit} className="img-fluid" alt="" />
                  <p>
                    Quit <br />
                    Stream
                  </p>
                </div>
              </FocusableButton>
            </div>
          </div>
        )}
        {showControllerShortcuts && (
          <div className="overlayCard" style={{ color: "white" }}>
            <FocusableButton
              focusKeyParam="btn-close-controller-shortcut"
              className="setting-popup-close"
              onClick={toggleControllerShortcuts}
            >
              <img src={iconClose} className="img-fluid" alt="" />
            </FocusableButton>
            <h3 className="heading">Controller Shortucuts</h3>
            <div>
              <h5>Settings</h5>
              <div>
                <p>Press SELECT + X to toggle settings menu</p>
              </div>
            </div>
            <div>
              <h5>Toggle Mouse Mode</h5>
              <div>
                <p>Long press START button (more than 2 sec) to start</p>
              </div>
            </div>
            <div>
              <h5>Navigation</h5>
              <div>
                <p>Use left joystick to navigate in different views</p>
              </div>
            </div>
            <div>
              <h5>Select</h5>
              <div>
                <p>Press A to select a particular option</p>
              </div>
            </div>
            <div>
              <h5>Back</h5>
              <div>
                <p>Press B to go back or exit current view</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {nvHttp && (
        <HeartBeatAPI
          bitrate={searchParams.get("bitrate_kbps") ?? "20"}
          nvHttp={nvHttp}
          resolution={searchParams.get("resolution") ?? ""}
          gameFps={searchParams.get("game_fps") ?? ""}
          userId={searchParams.get("user_id") ?? ""}
          gameId={searchParams.get("game_id") ?? ""}
          serverIp={searchParams.get("server_ip") ?? ""}
          clientToken={searchParams.get("client_token") ?? ""}
        />
      )}
      {showKeyboard && (
        <OnScreenKeyboard focusKey="OnScreenKeyboard" toggle={toggleVirtualKeyboard} sendKeyboardClickEvent={sendKeyboardClickEvent} />
      )}
      {showHeartBeatStat && <div id="heart_beat_stats">Stat Log</div>}
      {showLoader ? <LoaderPopup focusKeyParam="Loader" loaderMessage={loaderMessage} /> : null}
      {popUp.show && <ErrorPopUp {...popUp} />}
    </FocusContext.Provider>
  );
}
const FocusableButton = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {},
    onEnterPress: () => {
      props.onClick();
    },
  });
  return (
    <button ref={ref} onClick={props.onClick} className={props.className + " " + (focused ? " focusedElement" : "")} style={props.style}>
      {props.children}
    </button>
  );
};
export default GamePlay;
