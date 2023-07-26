import { useNavigate, useRoutes } from "react-router-dom";
import AuthLayout from "../layouts/auth";
import GuestLayout from "../layouts/guest";
import Login from "../pages/guest/login";
import AllGames from "../pages/auth/games/allGames";
import GamesDetail from "../pages/auth/games/gamesDetail";
import { useContext, useEffect } from "react";
import { SessionContext } from "src/App";

import SearchGames from "../pages/auth/search";
import Settings from "src/pages/auth/settings";
import Home from "src/pages/auth/home";

export default function Router() {
  const sessionContext = useContext(SessionContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionContext.sessionToken) {
      navigate("/");
    }
  }, [sessionContext.sessionToken, navigate]);
  return useRoutes([
    {
      element: <GuestLayout />,
      children: [{ path: "/", element: <Login focusKey="Login" /> }],
    },
    {
      element: <AuthLayout focusKey="Sidebar" />,
      children: [
        { path: "/home", element: <Home /> },
        { path: "/settings", element: <Settings focusKey="settings" /> },
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
