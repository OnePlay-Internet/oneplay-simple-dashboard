import brandLogo from "../../../assets/images/oneplayLogo.svg";
import Games from "../../../assets/images/games/Rectangle 210.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FocusTrackContext, SessionContext, UserProfileContext } from "src/App";
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
import { getCoords } from "src/common/utils";
export default function AllGames({
  focusKey: focusKeyParam,
}: FocusabelComponentProps) {
  const sessionContext = useContext(SessionContext);
  const focusTrackContext = useContext(FocusTrackContext);
  const [allGames, setAllGames] = useState<{ [key: string]: any }[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [haveMoreGames, setHaveMoreGames] = useState(true);
  const navigate = useNavigate();
  const { focusSelf, focusKey, setFocus } = useFocusable({
    trackChildren: true,
    focusKey: focusKeyParam,
  });
  useEffect(() => {
    setFocusToFirstGame();
  }, [focusTrackContext]);
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
    const allGamesResp = await getAllGames(
      sessionContext.sessionToken,
      currentPage,
      GAME_FETCH_LIMIT
    );
    if (!allGamesResp.success) {
      Swal.fire({
        title: "Error!",
        text: allGamesResp.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
    if (allGamesResp.games && allGamesResp.games.length) {
      if (currentPage > 0) {
        setAllGames((prevGames) => {
          return allGamesResp.games
            ? [...prevGames, ...allGamesResp.games]
            : prevGames;
        });
      } else {
        setAllGames(allGamesResp.games);
      }
      setCurrentPage((prev) => prev + 1);
    } else {
      setHaveMoreGames(false);
    }
  };
  const loadNextGames = async () => {
    if (currentPage > 0 && sessionContext.sessionToken) {
      console.log("calling loadmore from loadNextGames");
      loadMoreGames();
    }
  };
  return (
    <FocusContext.Provider value={focusKey}>
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
        <div className="row mainContainer">
          {allGames?.map((game) => renderSingleGame(game))}
        </div>
      </InfiniteScroll>
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
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    trackChildren: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {
      props.goToDetail();
    },
    onFocus: () => {
      scrollToElement(ref.current, 100);
    },
    onArrowPress: (direction, keyProps, detils) => {
      if (direction === "left" && getCoords(ref.current).left < 100) {
        setFocus("sidebar-search");
        return false;
      }
      return true;
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
          src={props.game.poster_image ?? "/img/placeholder_265x352.svg"} // use normal <img> attributes as props
          width={265}
          height={352}
          className="img-fluid rounded w-100"
          placeholder={
            <img
              alt={props.game.title}
              src="/img/placeholder_265x352.svg"
              className="img-fluid rounded w-100"
            />
          }
        />

        <h5 className="mt-3 mb-1 text-white">{props.game.title}</h5>
        <p className="textOffWhite">{props.game.genre_mappings.join(", ")}</p>
      </NavLink>
    </FocusableGameWrapperStyled>
  );
};

