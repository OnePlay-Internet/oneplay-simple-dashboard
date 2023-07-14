import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import styled from "styled-components";
import { customFeedGames, searchGame } from "src/common/services";
import { GAME_FETCH_LIMIT } from "src/common/constants";
import { FocusTrackContext, SessionContext } from "src/App";
import debounce from "lodash.debounce";
import { NavLink, useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getCoords, scrollToElement, scrollToTop } from "src/common/utils";
import InfiniteScroll from "react-infinite-scroller";
export default function SearchGames({
  focusKey: focusKeyParam,
}: FocusabelComponentProps) {
  const navigate = useNavigate();
  const sessionContext = useContext(SessionContext);
  const focusTrackContext = useContext(FocusTrackContext);
  const [showLoading, setShowLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [haveMoreGames, setHaveMoreGames] = useState(true);
  const { focusSelf, focusKey, setFocus } = useFocusable({
    focusable: true,
    focusKey: focusKeyParam,
  });
  useEffect(() => {
    loadMoreGames("", 0);
    setFocus("game_search");
  }, [setFocus]);
  useEffect(() => {
    setFocus("game_search");
  }, [focusTrackContext]);
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
        goToDetail={() => navigate(`/games-detail/${game.oplay_id}`)}
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
              >
                Call of Duty
              </FocusableElement>
              <br />
              <FocusableElement
                onClick={() => {
                  setSearchQuery("Action");
                  debouncedSearchRequest("Action");
                }}
              >
                Action
              </FocusableElement>
              <br />
              <FocusableElement
                onClick={() => {
                  setSearchQuery("Ubisoft");
                  debouncedSearchRequest("Ubisoft");
                }}
              >
                Ubisoft
              </FocusableElement>
              <br />
              <FocusableElement
                onClick={() => {
                  setSearchQuery("steam");
                  debouncedSearchRequest("steam");
                }}
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
            loader={
              <div className="loader" key={0}>
                Loading ...
              </div>
            }
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
      {/* showLoading ? (
        <div style={{ display: "flex" }} className="my-modal">
          <div className="my-modal-content">
            <div className="my-loader"></div>
            <div className="my-modal-text">Loading...</div>
          </div>
        </div>
      ) : null */}
    </FocusContext.Provider>
  );
}

const FocusableInputStyled = styled.input<FocusableItemProps>``;

const FocusableInput = (props: any) => {
  const { ref, focused } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {
      scrollToElement(ref.current, 100);
    },
    onEnterPress: () => {
      ref.current.focus();
    },
    /* onArrowPress: (direction, props, details) => {
    if (focused && (direction === "right" || direction === "left")) {
        return false;
      }
      return true;
    }, */
  });

  return (
    <FocusableInputStyled
      type={props.type}
      ref={ref}
      focused={focused}
      className={
        "form-control inputControl" + (focused ? " focusedSearch" : "")
      }
      onChange={props.onChange}
      value={props.value}
      placeholder={props.placeholder}
    />
  );
};

const FocusableGameWrapperStyled = styled.div<FocusableItemProps>`
  border: 1px solid transperent;
  border-radius: 10px;
  padding-top: 10px;
  box-shadow: ${({ focused }) =>
    focused ? "0 0 0 0.15rem rgba(13, 110, 253, 0.2)" : "none"};
`;

const FocusableElementStyled = styled.button<FocusableItemProps>`
  background: none;
  border: none;
  border-radius: 0.5rem;
  margin-bottom: 8px;
`;

const FocusableElement = (props: any) => {
  const { ref, focused } = useFocusable({
    focusable: true,
    onFocus: () => {
      scrollToTop();
    },
    onEnterPress: () => {
      props.onClick();
    },
    /* onArrowPress: (direction, props, details) => {
    if (focused && (direction === "right" || direction === "left")) {
        return false;
      }
      return true;
    }, */
  });

  return (
    <FocusableElementStyled
      ref={ref}
      focused={focused}
      className={"suggestionResult " + (focused ? " focusedElement" : "")}
      onClick={() => {
        props.onClick();
      }}
    >
      {props.children}
    </FocusableElementStyled>
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
      scrollToElement(ref.current, 100);
    },
    onArrowPress: (direction, keyProps, detils) => {
      if (direction === "left" && getCoords(ref.current).left < 100) {
        setFocus("search");
        return false;
      }
      return true;
    },
  });

  return (
    <FocusableGameWrapperStyled
      ref={ref}
      focused={focused}
      className="col-md-4 mt-4"
      style={{ padding: "10px" }}
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

        <p className="GamesTitle mb-0 mt-3">{props.game.title}</p>
        <p className="gamesDescription">
          {props.game.genre_mappings.join(", ")}
        </p>
      </NavLink>
    </FocusableGameWrapperStyled>
  );
};
