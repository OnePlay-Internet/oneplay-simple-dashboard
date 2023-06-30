import brandLogo from '../../../assets/images/oneplayLogo.svg';
import Games from '../../../assets/images/games/Rectangle 210.svg';
import { NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { SessionContext, UserProfileContext } from "src/App";
import { getAllGames, logout } from "../../../common/services";
import Swal from "sweetalert2";
import { SESSION_TOKEN_LOCAL_STORAGE } from "src/common/constants";
export default function AllGames() {
  const sessionContext = useContext(SessionContext);
  const userContext = useContext(UserProfileContext);
  const [allGames, setAllGames] = useState([]);
  useEffect(() => {
    if (sessionContext.sessionToken) {
      (async () => {
        const allGames = await getAllGames(sessionContext.sessionToken);
        if (!allGames.success) {
          Swal.fire({
            title: "Error!",
            text: allGames.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
        if (allGames.games) {
          setAllGames(allGames.games);
        }
      })();
    }
  }, [sessionContext]);
  const renderSingleGame = (game: any) => {
    return (
      <div
        className="col-md-4 col-lg-3 col-sm-6 col-6 mt-3"
        key={game.oplay_id}
      >
        <NavLink
          to={`/games-detail/${game.oplay_id}`}
          className="text-decoration-none text-initial"
        >
          <img
            src={game.poster_image}
            className="img-fluid rounded w-100"
            alt="games"
          />
          <h5 className="mt-3 mb-1 text-white">{game.title}</h5>
          <p className="textOffWhite">{game.genre_mappings.join(", ")}</p>
        </NavLink>
      </div>
    );
  };
  const btnLogoutClick = async () => {
    const logoutResp = await logout(sessionContext.sessionToken);
    if (!logoutResp.success) {
      Swal.fire({
        title: "Error!",
        text: logoutResp.message,
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    localStorage.removeItem(SESSION_TOKEN_LOCAL_STORAGE);
    userContext.setUserProfile(null);
    sessionContext.setSessionToken(null);
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img src={brandLogo} className="img-fluid" alt="logo" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/all-games" className="nav-link ">
                  All Games
                </NavLink>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link " onClick={btnLogoutClick}>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {allGames?.length ? (
        <div className="container-fluid bg-dark pb-4">
          <div className="row">
            {allGames?.map((game) => renderSingleGame(game))}
          </div>
        </div>
      ) : null}
    </>
  );
}