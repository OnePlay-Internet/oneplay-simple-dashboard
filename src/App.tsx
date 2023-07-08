import React, { createContext, useEffect, useState } from "react";
import "./App.css";
import Routes from "./routes";
import { getProfile } from "./common/services";
import Swal from "sweetalert2";
import { SESSION_TOKEN_LOCAL_STORAGE } from "./common/constants";

import { useDispatch } from "react-redux";
import {
  remoteEnterClicked,
  remoteNextClicked,
  remotePrevClicked,
} from "./remoteSlice";

export const SessionContext = createContext<{
  sessionToken: string;
  setSessionToken: any;
}>({
  sessionToken: "",
  setSessionToken: () => {},
});
export const UserProfileContext = createContext<{
  userProfile: any;
  setUserProfile: any;
}>({
  userProfile: null,
  setUserProfile: () => {},
});
function App() {
  const [sessionToken, setSessionToken] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);
  const sessionContextValue = { sessionToken, setSessionToken };
  const userProfileContextValue = { userProfile, setUserProfile };
  const dispatch = useDispatch();
  const platformOnLoad = (handler: any) => {
    if (!handler) return;

    if (handler.initFn) {
      handler.initFn();
    }

    if (handler.onKeydownListener) {
      document.addEventListener("keydown", handler.onKeydownListener);
    }
    if (handler.buttonsToRegister) {
      handler.buttonsToRegister.forEach((button: any) => {
        //@ts-ignore
        tizen.tvinputdevice.registerKey(button);
      });
    }
  };
  var tvKey = {
    KEY_0: 48,
    KEY_1: 49,
    KEY_2: 50,
    KEY_3: 51,
    KEY_4: 52,
    KEY_5: 53,
    KEY_6: 54,
    KEY_7: 55,
    KEY_8: 56,
    KEY_9: 57,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    KEY_ENTER: 13,
    KEY_REMOTE_ENTER: 32,
    KEY_RETURN: 10009,
    KEY_GREEN: 404,
    KEY_YELLOW: 405,
    KEY_BLUE: 406,
    KEY_RED: 403,
    KEY_PLAY: 415,
    KEY_PAUSE: 19,
    KEY_PLAYPAUSE: 10252,
    KEY_STOP: 413,
    KEY_VOLUME_UP: 447,
    KEY_VOLUME_DOWN: 448,
    KEY_VOLUME_MUTE: 449,
    KEY_CHANNEL_UP: 427,
    KEY_CHANNEL_DOWN: 428,
    KEY_CHANNEL_LIST: 10073,
    KEY_KEYBOARD_DONE: 65376,
  };
  const remoteControllerHandler = (e: any) => {
    console.log("key pressed : ", e.keyCode);
    switch (e.keyCode) {
      case tvKey.KEY_ENTER:
      case tvKey.KEY_REMOTE_ENTER:
        // alert("remote ok button clicked");
        dispatch(remoteEnterClicked());
        break;
      case tvKey.KEY_DOWN:
      case tvKey.KEY_RIGHT:
      case tvKey.KEY_KEYBOARD_DONE:
        dispatch(remoteNextClicked());
        break;
      case tvKey.KEY_UP:
      case tvKey.KEY_LEFT:
        dispatch(remotePrevClicked());
        break;
    }
  };

  useEffect(() => {
    var handler = {
      initRemoteController: true,
      buttonsToRegister: [
        // https://developer.samsung.com/tv/develop/guides/user-interaction/keyboardime
        "ColorF0Red", // F1
        "ColorF1Green", // F2
        "ColorF2Yellow", // F3
        "ColorF3Blue", // F4
        // Not working...
        //'SmartHub',      // F5
        "Source", // F6
        "ChannelList", // F7
        "VolumeMute", // F8
        "VolumeDown", // F9
        "VolumeUp", // F10
        "ChannelDown", // F11
        "ChannelUp", // F12
      ],
      onKeydownListener: remoteControllerHandler,
    };
    platformOnLoad(handler);
    const savedToken = localStorage.getItem(SESSION_TOKEN_LOCAL_STORAGE);
    if (savedToken) {
      (async () => {
        const profileResp = await getProfile(savedToken);
        if (!profileResp.success) {
          localStorage.removeItem(SESSION_TOKEN_LOCAL_STORAGE);
          Swal.fire({
            title: "Error!",
            text: profileResp.message ?? "",
            icon: "error",
            confirmButtonText: "OK",
          });
        } else {
          setUserProfile(profileResp.profile);
          setSessionToken(savedToken);
        }
      })();
    }
  }, []);
  return (
    // <div className="App">
    //   <div className="container">
    //     <div className="row justify-content-center">
    //       <div className='col-md-6'>
    //         <h1>Hello</h1>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <SessionContext.Provider value={sessionContextValue}>
      <UserProfileContext.Provider value={userProfileContextValue}>
        <Routes />
      </UserProfileContext.Provider>
    </SessionContext.Provider>
  );
}

export default App;
