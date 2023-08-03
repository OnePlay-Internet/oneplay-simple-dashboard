import React, {
  createContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import "./App.css";
import Routes from "./routes";
import { getProfile } from "./common/services";
import { SESSION_TOKEN_LOCAL_STORAGE } from "./common/constants";
import { init, setKeyMap } from "@noriginmedia/norigin-spatial-navigation";
import { useLocation, useNavigate } from "react-router-dom";
import LoaderPopup from "./pages/loader";
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
  const userProfileContextValue = { userProfile, setUserProfile };
  const [showLoading, setShowLoading] = useState(true);
  const { pathname, search } = useLocation();
  const [goTo, setGoTo] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("app on load");
    const savedToken = localStorage.getItem(SESSION_TOKEN_LOCAL_STORAGE);
    console.log("saved token : ", savedToken);
    if (savedToken) {
      setShowLoading(true);
      (async () => {
        const profileResp = await getProfile(savedToken);
        if (!profileResp.success) {
          setShowLoading(false);
          localStorage.removeItem(SESSION_TOKEN_LOCAL_STORAGE);
        } else {
          setUserProfile(profileResp.profile);
          setSessionToken(savedToken);
          setShowLoading(false);
        }
      })();
    } else {
      setShowLoading(false);
      navigate("/");
    }
  }, []);
  useEffect(() => {
    /*  console.log("app path name : ", pathname);
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
    } */

    const searchQuery = new URLSearchParams(search);
    const redirectTo = searchQuery.get("redirect");
    if (pathname === "/index.html/" && redirectTo && goTo !== "-") {
      console.log("set go to : ", redirectTo);
      setGoTo(redirectTo);
    }
  }, [pathname]);

  useEffect(() => {
    if (sessionToken) {
      setShowLoading(false);
      if (goTo) {
        setGoTo("");
        navigate(goTo);
      } else {
        navigate("/home");
      }
    } else {
      navigate("/");
    }
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
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <SessionContext.Provider value={sessionContextValue}>
      <UserProfileContext.Provider value={userProfileContextValue}>
        {showLoading ? <LoaderPopup focusKeyParam="Loader" /> : <Routes />}
      </UserProfileContext.Provider>
    </SessionContext.Provider>
  );
}

export default App;
