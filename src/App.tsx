import React, {
  createContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import "./App.css";
import Routes from "./routes";
import { getProfile } from "./common/services";
import Swal from "sweetalert2";
import { SESSION_TOKEN_LOCAL_STORAGE } from "./common/constants";
import { init, setKeyMap } from "@noriginmedia/norigin-spatial-navigation";
import { useLocation } from "react-router-dom";

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
  down: 40, //[40, 65376],
  enter: [32, 13],
});
function App() {
  const [sessionToken, setSessionToken] = useState("");

  const [userProfile, setUserProfile] = useState<any>(null);
  const sessionContextValue = { sessionToken, setSessionToken };
  const [focusCount, setFocusCount] = useState(0);
  const focusContextValue = { focusCount, setFocusCount };
  const userProfileContextValue = { userProfile, setUserProfile };
  const { pathname } = useLocation();
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
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);
  return (
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
