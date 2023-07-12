import brandLogo from "../../../assets/images/oneplayLogo.svg";
import Games from "../../../assets/images/games/Rectangle 210.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { SessionContext, UserProfileContext } from "src/App";
import { getAllGames, logout } from "../../../common/services";
import Swal from "sweetalert2";
import {
  GAME_FETCH_LIMIT,
  SESSION_TOKEN_LOCAL_STORAGE,
} from "src/common/constants";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { styled } from "styled-components";
import InfiniteScroll from "react-infinite-scroller";
import { LazyLoadImage } from "react-lazy-load-image-component";
export default function AllGames({
  focusKey: focusKeyParam,
}: FocusabelComponentProps) {
  const sessionContext = useContext(SessionContext);
  const userContext = useContext(UserProfileContext);
  const [allGames, setAllGames] = useState<{ [key: string]: any }[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [haveMoreGames, setHaveMoreGames] = useState(true);
  const { focusSelf, focusKey, setFocus } = useFocusable({
    focusable: true,
  });
  const navigate = useNavigate();
  useEffect(() => {
    focusSelf();
  }, [focusSelf]);
  useEffect(() => {
    if (sessionContext.sessionToken) {
      loadMoreGames();
    }
  }, [sessionContext]);

  useEffect(() => {
    if (currentPage === 1) {
      setFocusToFirstGame();
      //setFocus("game_" + allGames.at(0)?.oplay_id);
    }
  }, [currentPage]);
  const setFocusToFirstGame = () => {
    if (allGames && allGames.length) {
      console.log("setting foucs to first game");
      setTimeout(() => {
        setFocus("game_" + allGames.at(0)?.oplay_id);
      }, 10);
    }
  };
  const renderSingleGame = (game: any) => {
    return (
      <FocusableGameWrapper
        game={game}
        key={game.oplay_id}
        focusKeyParam={`game_${game.oplay_id}`}
        goToDetail={() => navigate(`/games-detail/${game.oplay_id}`)}
      />
    );
  };
  const loadMoreGames = async () => {
    console.log("load more...", currentPage);
    const allGames = await getAllGames(
      sessionContext.sessionToken,
      currentPage,
      GAME_FETCH_LIMIT
    );
    if (!allGames.success) {
      Swal.fire({
        title: "Error!",
        text: allGames.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
    if (allGames.games && allGames.games.length) {
      setCurrentPage((prev) => {
        return prev + 1;
      });
      setAllGames((prevGames) => {
        return allGames.games ? [...prevGames, ...allGames.games] : prevGames;
      });
    } else {
      setHaveMoreGames(false);
    }
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
  const loadNextGames = async () => {
    if (currentPage > 0 && sessionContext.sessionToken) {
      //loadMoreGames();
    }
  };
  return (
    <FocusContext.Provider value={focusKey}>
      {/* <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
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
                <FocusableLogout
                  href="#"
                  className="nav-link "
                  onClick={btnLogoutClick}
                  setFocusToFirstGame={setFocusToFirstGame}
                >
                  Logout
                </FocusableLogout>
              </li>
            </ul>
          </div>
        </div>
      </nav> */}
      <InfiniteScroll
        pageStart={0}
        hasMore={haveMoreGames}
        loadMore={loadNextGames}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
      >
        <div className="row" style={{ padding: "60px 18px" }}>
          {allGames?.map((game) => renderSingleGame(game))}
        </div>
      </InfiniteScroll>
      {/*      {allGames?.length ? (
        <div className="container-fluid bg-dark pb-4">
          <div className="row">
            {allGames?.map((game) => renderSingleGame(game))}
          </div>
        </div>
      ) : null} */}
    </FocusContext.Provider>
  );
}

const scrollToElement = (element: any, offSet: number = 45) => {
  let elementPosition = element.getBoundingClientRect().top;
  var offsetPosition = elementPosition + window.scrollY - offSet;
  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};
const FocusableGameWrapperStyled = styled.div<FocusableItemProps>`
  border: 1px solid transperent;
  border-radius: 10px;
  box-shadow: ${({ focused }) =>
    focused ? "0 0 0 0.15rem rgba(13, 110, 253, 0.2)" : "none"};
`;

const FocusableGameWrapper = (props: any) => {
  const { ref, focused } = useFocusable({
    focusable: true,
    autoRestoreFocus: true,
    saveLastFocusedChild: true,
    trackChildren: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {
      props.goToDetail();
    },
    onFocus: () => {
      scrollToElement(ref.current, 100);
    },
  });

  return (
    <FocusableGameWrapperStyled
      ref={ref}
      focused={focused}
      className="col-md-3 col-lg-2 col-sm-6 col-5 mt-3"
      style={{ paddingTop: "10px" }}
    >
      <NavLink
        to={`/games-detail/${props.game.oplay_id}`}
        className="text-decoration-none text-initial"
      >
        <LazyLoadImage
          alt={props.game.title}
          loading="lazy"
          src={props.game.poster_image} // use normal <img> attributes as props
          width={265}
          height={352}
          className="img-fluid rounded w-100"
        />
        <h5 className="mt-3 mb-1 text-white">{props.game.title}</h5>
        <p className="textOffWhite">{props.game.genre_mappings.join(", ")}</p>
      </NavLink>
    </FocusableGameWrapperStyled>
  );
};

const FocusableLogoutStyled = styled.a<FocusableItemProps>`
  box-shadow: ${({ focused }) =>
    focused ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" : "none"};
`;

const FocusableLogout = (props: any) => {
  const { ref, focused } = useFocusable({
    focusable: true,
    onEnterPress: () => {
      props.onClick();
    },
    onFocus: () => {
      // ref.current.scrollIntoView({ behavior: "smooth" });
      scrollToElement(ref.current, 45);
    },
    onBlur: () => {
      props.setFocusToFirstGame();
    },
  });
  return (
    <FocusableLogoutStyled
      ref={ref}
      focused={focused}
      href="#"
      className="nav-link "
      onClick={props.onClick}
    >
      {props.children}
    </FocusableLogoutStyled>
  );
};
