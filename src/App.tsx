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
  const navigate = useNavigate();
  useEffect(() => {
    const savedToken = localStorage.getItem(SESSION_TOKEN_LOCAL_STORAGE);
    if (savedToken) {
      (async () => {
        const profileResp = await getProfile(savedToken);
        if (!profileResp.success) {
          setShowLoading(false);
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
          setShowLoading(false);
        }
      })();
    } else {
      setShowLoading(false);
    }
  }, []);
  useEffect(() => {
    const searchQuery = new URLSearchParams(search);
    const redirectTo = searchQuery.get("redirect");
    if (!sessionToken) {
      if (pathname.replace("/index.html", "") === "") {
        if (redirectTo) {
          navigate(`/?redirect=${redirectTo}`);
        } else {
          navigate("/");
        }
      } else {
        navigate(`/?redirect=${pathname}`);
      }
    } else if (redirectTo) {
      navigate(redirectTo);
    } else {
      navigate("/home");
    }
  }, [sessionToken]);
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);
  useEffect(() => {
    console.log("App.tsx show loading : ", showLoading);
  }, [showLoading]);
  const renderMainContent = () => {
    if (showLoading) {
      return <LoaderPopup focusKeyParam="Loader" />;
    } else {
      return <Routes />;
    }
  };
  return (
    <SessionContext.Provider value={sessionContextValue}>
      <UserProfileContext.Provider value={userProfileContextValue}>
        {renderMainContent()}
      </UserProfileContext.Provider>
    </SessionContext.Provider>
  );
}

export default App;
