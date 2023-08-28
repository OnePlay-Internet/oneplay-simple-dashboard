import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { customFeedGames, searchGame } from "src/common/services";
import { GAME_FETCH_LIMIT } from "src/common/constants";
import { SessionContext } from "src/App";
import debounce from "lodash.debounce";
import { NavLink, useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  getCoords,
  getScrolledCoords,
  scrollToElement,
  scrollToTop,
} from "src/common/utils";
import InfiniteScroll from "react-infinite-scroller";
import LoaderPopup from "src/pages/loader";
import ErrorPopUp from "src/pages/error";
export default function SearchGames({
  focusKey: focusKeyParam,
}: FocusabelComponentProps) {
  const navigate = useNavigate();
  const sessionContext = useContext(SessionContext);
  const [showLoading, setShowLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [haveMoreGames, setHaveMoreGames] = useState(true);
  const [popUp, setPopUp] = useState({
    show: false,
    message: "",
    title: "",
    returnFocusTo: "",
  });
  const { focusKey, setFocus } = useFocusable({
    focusable: true,
    focusKey: focusKeyParam,
  });
  useEffect(() => {
    loadMoreGames("", 0);
    setFocus("game_search");
  }, [setFocus]);
  /* useEffect(() => {
    if (currentPage === 1) {
      setFocusToFirstGame();
      //setFocus("game_" + allGames.at(0)?.oplay_id);
    }
  }, [currentPage]);
  const setFocusToFirstGame = () => {
    if (searchResult && searchResult.length) {
      setTimeout(() => {
        setFocus("search_game_" + searchResult.at(0)?.oplay_id);
      }, 10);
    }
  }; */
  const sendSearchRequest = useCallback(async (value: string) => {
    loadMoreGames(value, 0);
  }, []);

  const debouncedSearchRequest = useMemo(() => {
    setCurrentPage(0);
    return debounce(sendSearchRequest, 400);
  }, [sendSearchRequest]);

  const onSearchValueChange = (e: any) => {
    const value = e.target.value;
    setSearchQuery((prev) => {
      return value;
    });
    debouncedSearchRequest(value);
  };

  const renderSingleGame = (game: any) => {
    return (
      <FocusableGameWrapper
        game={game}
        key={game.oplay_id}
        focusKeyParam={`search_game_${game.oplay_id}`}
        goToDetail={() => {
          navigate(`/games-detail/${game.oplay_id}`);
        }}
      />
    );
  };

  const loadNextGames = async () => {
    if (currentPage > 0 && sessionContext.sessionToken) {
      loadMoreGames(searchQuery, currentPage);
      //sendSearchRequest(searchQuery);
    }
  };
  const loadMoreGames = async (value: string, page: number) => {
    console.log(
      "calling loadmore from loadNextGames current page: ",
      page,
      " : search : ",
      value
    );
    if (showLoading) return;
    console.log("loading more games...");
    if (value) {
      setShowLoading(true);
      const searchResp = await searchGame(
        sessionContext.sessionToken,
        value,
        page,
        GAME_FETCH_LIMIT
      );
      setShowLoading(false);
      if (!searchResp.success) {
        setPopUp({
          show: true,
          message: searchResp.message ?? "",
          title: "Error!",
          returnFocusTo: "game_search",
        });
        return;
      }
      if (searchResp.games && searchResp.games.length) {
        if (page > 0) {
          setSearchResult((prevGames) => {
            return searchResp.games
              ? [...prevGames, ...searchResp.games]
              : prevGames;
          });
        } else {
          setSearchResult(searchResp.games);
        }
        setCurrentPage((prev) => page + 1);
        setHaveMoreGames(true);
      } else {
        if (page === 0 && !searchResp.games?.length) {
          setSearchResult([]);
        }
        setHaveMoreGames(false);
      }
    } else {
      setShowLoading(true);
      const customGamesResp = await customFeedGames(
        sessionContext.sessionToken,
        { order_by: "release_date:desc" },
        page,
        GAME_FETCH_LIMIT
      );
      setShowLoading(false);
       if (!customGamesResp.success) {
         setPopUp({
           show: true,
           message: customGamesResp.message ?? "",
           title: "Error!",
           returnFocusTo: "game_search",
         });
         return;
       }
      if (customGamesResp.games) {
        if (customGamesResp.games && customGamesResp.games.length) {
          if (page > 0) {
            setSearchResult((prevGames) => {
              return customGamesResp.games
                ? [...prevGames, ...customGamesResp.games]
                : prevGames;
            });
          } else {
            setSearchResult(customGamesResp.games);
          }
          setCurrentPage((prev) => page + 1);
          setHaveMoreGames(true);
        } else {
          if (page === 0 && !customGamesResp.games?.length) {
            setSearchResult([]);
          }
          setHaveMoreGames(false);
        }
      }
    }
  };
  const onPopupOkClick = () => {
    const returnFocusTo = popUp.returnFocusTo;
    setPopUp({ show: false, message: "", title: "", returnFocusTo: "" });
    setFocus(returnFocusTo);
  };
  return (
    <FocusContext.Provider value={focusKey}>
      <div className="row mainContainer">
        <div className="col-md-3">
          <FocusableInput
            type="search"
            placeholder="Search"
            value={searchQuery}
            focusKeyParam="game_search"
            onChange={onSearchValueChange}
            onEnter={searchGame}
          />
          <p className="smallText mt-5">search suggestions</p>
          <div className="row">
            <div className="col-12">
              <FocusableElement
                onClick={() => {
                  setSearchQuery("Call of duty");
                  debouncedSearchRequest("Call of duty");
                }}
                focusKeyParam="search_suggetion_1"
              >
                Call of Duty
              </FocusableElement>
              <br />
              <FocusableElement
                onClick={() => {
                  setSearchQuery("Action");
                  debouncedSearchRequest("Action");
                }}
                focusKeyParam="search_suggetion_2"
              >
                Action
              </FocusableElement>
              <br />
              <FocusableElement
                onClick={() => {
                  setSearchQuery("Ubisoft");
                  debouncedSearchRequest("Ubisoft");
                }}
                focusKeyParam="search_suggetion_3"
              >
                Ubisoft
              </FocusableElement>
              <br />
              <FocusableElement
                onClick={() => {
                  setSearchQuery("steam");
                  debouncedSearchRequest("steam");
                }}
                focusKeyParam="search_suggetion_4"
              >
                Steam
              </FocusableElement>
            </div>
          </div>
        </div>
        <div className="col-md-9" style={{ paddingTop: "10px" }}>
          <p className="heading">
            {searchQuery ? `Search Result` : "All Games"}
          </p>

          <InfiniteScroll
            pageStart={0}
            hasMore={haveMoreGames}
            loadMore={loadNextGames}
          >
            <div className="row">
              {searchResult?.map((game) => renderSingleGame(game))}
            </div>
          </InfiniteScroll>
          {searchQuery && !searchResult?.length ? (
            <p className="GamesTitle mb-0 mt-3">
              No game found for "{searchQuery}"
            </p>
          ) : null}
        </div>
      </div>
      {showLoading ? <LoaderPopup focusKeyParam="Loader" /> : null}
      {popUp.show && (
        <ErrorPopUp
          title={popUp.title}
          message={popUp.message}
          onOkClick={onPopupOkClick}
          focusKeyParam="modal-popup"
        />
      )}
    </FocusContext.Provider>
  );
}

const FocusableInput = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {
      scrollToElement(ref.current, 100);
    },
    onEnterPress: () => {
      ref.current.focus();
    },
    /* onBlur: () => {
      ref.current.blur();
    }, */
    onArrowPress: (direction, keyProps, detils) => {
      if (direction === "down") {
        setFocus("search_suggetion_1");
        return false;
      }
      if (direction === "left") {
        setFocus("Sidebar", getScrolledCoords(ref.current));
        return false;
      }
      ref.current.blur();
      return true;
    },
  });

  return (
    <input
      type={props.type}
      ref={ref}
      className={
        "form-control gameSearchInputControl" +
        (focused ? " focusedSearch" : "")
      }
      onChange={props.onChange}
      value={props.value}
      placeholder={props.placeholder}
    />
  );
};

const FocusableElement = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {
      scrollToTop();
      ref.current.focus();
    },
    onEnterPress: () => {
      props.onClick();
    },
    onArrowPress: (direction, keyProps, detils) => {
      if (direction === "left") {
        setFocus("Sidebar", getScrolledCoords(ref.current));
        return false;
      }
      return true;
    },
  });

  return (
    <button
      ref={ref}
      style={{
        background: "none",
        border: "none",
        borderRadius: "0.5rem",
        marginBottom: "8px",
      }}
      className={"suggestionResult " + (focused ? " focusedElement" : "")}
      onClick={() => {
        props.onClick();
      }}
    >
      {props.children}
    </button>
  );
};

const FocusableGameWrapper = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    trackChildren: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {
      props.goToDetail();
    },
    onFocus: () => {
      //scrollToElement(ref.current, 100);
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    },
    /* onArrowPress: (direction, keyProps, detils) => {
      if (direction === "left" && getCoords(ref.current).left < 100) {
        setFocus("search");
        return false;
      }
      return true;
    }, */
  });

  return (
    <div
      ref={ref}
      className={"col-md-3 mt-3" + (focused ? " focusedElement" : "")}
      style={{ padding: "10px", borderRadius: "10px", position: "relative" }}
    >
      <NavLink
        to={`/games-detail/${props.game.oplay_id}`}
        className="text-decoration-none text-initial"
      >
        <LazyLoadImage
          alt={props.game.title}
          loading="lazy"
          src={
            props.game.text_background_image ?? "/img/placeholder_336x189.svg"
          } // use normal <img> attributes as props
          width={336}
          height={189}
          className="img-fluid rounded"
          placeholder={
            <img
              alt={props.game.title}
              src="/img/placeholder_336x189.svg"
              className="img-fluid rounded"
            />
          }
        />
        {props.game.is_free === "true" &&
        props.game.status !== "coming_soon" ? (
          <span className="freeTag px-x free tagText">FREE</span>
        ) : null}
        {props.game.status === "coming_soon" ? (
          <span className="redGradient free px-2 tagText">COMING SOON</span>
        ) : null}
        {props.game.status === "maintenance" ? (
          <div className="text-center" style={{ height: 0 }}>
            <span className="orangeGradientBg px-2 bottomTag tagText">
              MAINTENANCE
            </span>
          </div>
        ) : null}
        {props.game.status === "updating" ? (
          <div className="text-center" style={{ height: 0 }}>
            <span className="updatingGradient px-2 bottomTag tagText">
              UPDATING
            </span>
          </div>
        ) : null}
        {props.game.status === "not_optimized" ? (
          <div className="text-center" style={{ height: 0 }}>
            <span className="darkredGradient px-2 bottomTag tagText">
              NOT OPTIMIZED
            </span>
          </div>
        ) : null}
        <p className="GamesTitle mb-0 mt-3">{props.game.title}</p>
        <p className="gamesDescription">
          {props.game.genre_mappings.join(", ")}
        </p>
      </NavLink>
    </div>
  );
};
