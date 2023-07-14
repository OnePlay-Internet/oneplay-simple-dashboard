import React, { createContext, useEffect, useState } from "react";
import "./App.css";
import Routes from "./routes";
import { getProfile } from "./common/services";
import Swal from "sweetalert2";
import { SESSION_TOKEN_LOCAL_STORAGE } from "./common/constants";
import { init, setKeyMap } from "@noriginmedia/norigin-spatial-navigation";

export const SessionContext = createContext<{
  sessionToken: string;
  setSessionToken: any;
}>({
  sessionToken: "",
  setSessionToken: () => {},
});

export const FocusTrackContext = createContext<{
  focusCount: number;
  setFocusCount: any;
}>({
  focusCount: 0,
  setFocusCount: () => {},
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
  down: [40, 65376],
  enter: [32, 13],
  remoteBack: 10009,
});
function App() {
  const [sessionToken, setSessionToken] = useState("");

  const [userProfile, setUserProfile] = useState<any>(null);
  const sessionContextValue = { sessionToken, setSessionToken };
  const [focusCount, setFocusCount] = useState(0);
  const focusContextValue = { focusCount, setFocusCount };
  const userProfileContextValue = { userProfile, setUserProfile };
  useEffect(() => {
    const savedToken = localStorage.getItem(SESSION_TOKEN_LOCAL_STORAGE);
    if (savedToken) {
      (async () => {
        const profileResp = await getProfile(savedToken);
        if (!profileResp.success) {
          localStorage.removeItem(SESSION_TOKEN_LOCAL_STORAGE);
          Swal.fire({
            title: "Error!",
            text: profileResp.message,
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
        <FocusTrackContext.Provider value={focusContextValue}>
          <Routes />
        </FocusTrackContext.Provider>
      </UserProfileContext.Provider>
    </SessionContext.Provider>
  );
}

export default App;
