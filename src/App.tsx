import React, { createContext, useEffect, useState } from "react";
import "./App.css";
import Routes from "./routes";
import { getProfile } from "./common/services";
import Swal from "sweetalert2";
import { SESSION_TOKEN_LOCAL_STORAGE } from "./common/constants";

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
  useEffect(() => {
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
