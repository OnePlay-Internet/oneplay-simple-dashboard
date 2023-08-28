import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import AuthLayout from "../layouts/auth";
import GuestLayout from "../layouts/guest";
import Login from "../pages/guest/login";
import AllGames from "../pages/auth/games/allGames";
import GamesDetail from "../pages/auth/games/gamesDetail";
import { useContext, useEffect, useState } from "react";
import { SessionContext, UserProfileContext } from "src/App";

import SearchGames from "../pages/auth/search";
import Settings from "src/pages/auth/settings";
import Home from "src/pages/auth/home";
import ErrorPopUp from "src/pages/error";

import TvLogin from "src/pages/guest/tv-login/tvLoginSteps";
import TvFirstTimeUser from "src/pages/guest/tv-login/tvFirstTimeUser";

export default function Router() {
  const sessionContext = useContext(SessionContext);
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  /*  useEffect(() => {
     const searchQuery = new URLSearchParams(search);
     const redirectTo = searchQuery.get("redirect");
     if (!sessionContext.sessionToken) {
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
   }, [sessionContext.sessionToken]); */

  return useRoutes([
    {
      element: <GuestLayout />,
      children: [
        // { path: "/create", element: <TvFirstTimeUser /> },
        // { path: "/tv", element: <TvLogin /> },
        { path: "/", element: <Login focusKey="Login" /> }
      ],
    },
    {
      element: <AuthLayout focusKey="Sidebar" />,
      children: [
        { path: "/home", element: <Home focusKey="Home" /> },
        { path: "/settings", element: <Settings focusKey="Settings" /> },
        { path: "/all-games", element: <AllGames focusKey="AllGames" /> },
        {
          path: "/games-detail/:id",
          element: <GamesDetail focusKey="GameDetail" />,
        },
        { path: "/search", element: <SearchGames focusKey="SearchGames" /> },
      ],
    },
  ]);
}
