import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CurrentFocusContext, SessionContext } from "src/App";
import { customFeedGames, getAllGames, getTopResults } from "../../../common/services";

import { GAME_FETCH_LIMIT } from "src/common/constants";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import InfiniteScroll from "react-infinite-scroller";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ErrorPopUp from "src/pages/error";
import LoaderPopup from "src/pages/loader";
import { getCoords, getScrolledCoords } from "src/common/utils";
import { StatusPopupContext } from "src/layouts/auth";
export default function AllGames({ focusKey: focusKeyParam }: FocusabelComponentProps) {
  const sessionContext = useContext(SessionContext);
  const currentFocusContext = useContext(CurrentFocusContext);
  const [allGames, setAllGames] = useState<{ [key: string]: any }[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [haveMoreGames, setHaveMoreGames] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const navigate = useNavigate();
  const statusPopupContext = useContext(StatusPopupContext);
  const [popUp, setPopUp] = useState<ErrorPopupPorps>({
    show: false,
    message: "",
    title: "",
    returnFocusTo: "",
    buttons: [],
    focusKeyParam: "modal-popup",
    icon: "",
  });
  const [currentFilterId, setCurrentFilterId] = useState<string>("static_filter_0");
  const [currentFilterTitle, setCurrentFilterTitle] = useState<string>("All Games");
  const [staticFilters, setStaticFilters] = useState<any[]>([
    {
      text: "All Games",
      filterId: "static_filter_0",
      body: { order_by: "release_date:desc" },
    },
    {
      text: "Best of 2021",
      filterId: "static_filter_1",
      body: {
        order_by: "release_date:desc",
        release_date: "2020-12-31T18:30:00.000Z#2021-12-31T18:30:00.000Z",
      },
    },
    {
      text: "Best of 2022",
      filterId: "static_filter_2",
      body: {
        order_by: "release_date:desc",
        release_date: "2021-12-31T18:30:00.000Z#2022-12-31T18:30:00.000Z",
      },
    },
    {
      text: "Free Games",
      filterId: "static_filter_3",
      body: {
        order_by: "release_date:desc",
        is_free: "true",
      },
    },
  ]);
  const [topGenres, setTopGenres] = useState<any[]>([]);
  const [topDevelopers, setTopDevelopers] = useState<any[]>([]);
  const [topStores, setTopStores] = useState<any[]>([]);
  const [topPublishers, setTopPublishers] = useState<any[]>([]);
  const [currentFilter, setCurrentFilter] = useState<{
    [key: string]: string;
  }>({ order_by: "release_date:desc" });
  const { focusSelf, focusKey, setFocus } = useFocusable({
    focusable: true,
    trackChildren: true,
    focusKey: focusKeyParam,
  });
  useEffect(() => {
    if (sessionContext.sessionToken) {
      //   loadMoreGames();

      (async () => {
        const topGenres = await getTopResults(sessionContext.sessionToken, "top_genres", 3);
        if (topGenres.success && topGenres.results) {
          setTopGenres(
            topGenres.results.map((genre, index) => {
              return {
                text: genre,
                filterId: "top_genre_" + index,
                body: {
                  genres: genre,
                  order_by: "release_date:desc",
                },
              };
            })
          );
        }
      })();
      (async () => {
        const topDevelopers = await getTopResults(sessionContext.sessionToken, "top_developers", 3);
        if (topDevelopers.success && topDevelopers.results) {
          setTopDevelopers(
            topDevelopers.results.map((developer, index) => {
              return {
                text: developer,
                filterId: "top_developer_" + index,
                body: {
                  developer: developer,
                  order_by: "release_date:desc",
                },
              };
            })
          );
        }
      })();
      (async () => {
        const topPublishers = await getTopResults(sessionContext.sessionToken, "top_publishers", 3);
        if (topPublishers.success && topPublishers.results) {
          setTopPublishers(
            topPublishers.results.map((publisher, index) => {
              return {
                text: publisher,
                filterId: "top_publisher_" + index,
                body: {
                  publisher: publisher,
                  order_by: "release_date:desc",
                },
              };
            })
          );
        }
      })();
      (async () => {
        const topStores = await getTopResults(sessionContext.sessionToken, "stores", 3);
        if (topStores.success && topStores.results) {
          setTopStores(
            topStores.results.map((store, index) => {
              return {
                text: store.name,
                filterId: "top_stores_" + index,
                body: {
                  order_by: "release_date:desc",
                  stores: store.name,
                },
              };
            })
          );
        }
      })();
    }
  }, [sessionContext.sessionToken]);

  useEffect(() => {
    console.log("current page : ", currentPage);
    if (currentPage === 1) {
      setFocusToFirstGame();
      //setFocus("game_" + allGames.at(0)?.oplay_id);
    }
  }, [currentPage]);
  const setFocusToFirstGame = () => {
    if (allGames && allGames.length) {
      setTimeout(() => {
        setFocus("game_" + allGames[0].oplay_id);
      }, 50);
    }
  };
  const renderSingleGame = (game: any, isFirstRow: boolean, isLastColumn: boolean, isLastRow: boolean) => {
    return (
      <FocusableGameWrapper
        game={game}
        key={game.oplay_id}
        focusKeyParam={`game_${game.oplay_id}`}
        setCurrentFocusContext={currentFocusContext.setFocusKey}
        goToDetail={() => {
          navigate(`/games-detail/${game.oplay_id}`);
        }}
        allowUpArrow={!isFirstRow}
        allowRightArrow={!isLastColumn}
        allowDownArrow={!isLastRow}
      />
    );
  };
  const loadMoreGames = async () => {
    if (showLoading) return;
    console.log("load more...", currentPage);
    setShowLoading(true);
    const allGamesResp = await customFeedGames(sessionContext.sessionToken, currentFilter, currentPage, GAME_FETCH_LIMIT);
    setShowLoading(false);
    if (!allGamesResp.success) {
      /* Swal.fire({
        title: "Error!",
        text: allGamesResp.message,
        icon: "error",
        confirmButtonText: "OK",
      }); */
      setPopUp({
        show: true,
        message: allGamesResp.message ?? "",
        title: "Error!",
        returnFocusTo: "play-now",
        buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
        focusKeyParam: "modal-popup",
        icon: "error",
      });
    }
    if (allGamesResp.games && allGamesResp.games.length) {
      if (currentPage > 0) {
        setAllGames((prevGames) => {
          return allGamesResp.games ? [...prevGames, ...allGamesResp.games] : prevGames;
        });
      } else {
        setAllGames(allGamesResp.games);
      }
      setCurrentPage((prev) => prev + 1);
      if (allGamesResp.games.length < GAME_FETCH_LIMIT) {
        setHaveMoreGames(false);
      }
    } else {
      setHaveMoreGames(false);
    }
  };
  const loadNextGames = async () => {
    console.log("loadNextGames : ", currentPage);
    if (currentPage > 0 && sessionContext.sessionToken) {
      console.log("calling loadmore from loadNextGames");
      loadMoreGames();
    }
  };
  const hidePopup = () => {
    const returnFocusTo = popUp.returnFocusTo;
    setPopUp({
      show: false,
      message: "",
      title: "",
      returnFocusTo: "",
      buttons: [],
      focusKeyParam: "modal-popup",
      icon: "",
    });
    if (currentFocusContext.focusKey) {
      setFocus(currentFocusContext.focusKey);
    } else if (returnFocusTo) {
      setFocus(returnFocusTo);
    } else {
      setFocusToFirstGame();
    }
  };
  useEffect(() => {
    loadMoreGames();
  }, [currentFilterId]);
  const onFilterClicked = (filterTitle: string, filterId: string, body: any) => {
    console.log("filter clicked : ", filterId);
    setCurrentFilterTitle(filterTitle);
    setCurrentFilter(body);
    setAllGames([]);
    setCurrentPage(0);
    setCurrentFilterId(filterId);
  };
  useEffect(() => {
    const onRemoteReturnClicked = (event: any) => {
      if (statusPopupContext) return;
      if (popUp.show) {
        hidePopup();
      } else {
        window.history.go(-1);
      }
    };
    window.addEventListener("RemoteReturnClicked", onRemoteReturnClicked);
    return () => {
      window.removeEventListener("RemoteReturnClicked", onRemoteReturnClicked);
    };
  }, [popUp, hidePopup, statusPopupContext]);
  return (
    <FocusContext.Provider value={focusKey}>
      <InfiniteScroll pageStart={0} hasMore={haveMoreGames} loadMore={loadNextGames}>
        <div className="row mainContainer">
          <div className="col-md-3">
            <h3 className="heading">Games</h3>
            <div className="row mb-2">
              {staticFilters.map((filter) => (
                <FocusableFilterButton
                  key={filter.filterId}
                  focusKeyParam={filter.filterId}
                  text={filter.text}
                  currentFilterID={currentFilterId}
                  body={filter.body}
                  onClick={onFilterClicked}
                  setCurrentFocusContext={currentFocusContext.setFocusKey}
                />
              ))}
            </div>
            <h3 className="heading">Stores</h3>
            <div className="row mb-2">
              {topStores.map((filter) => (
                <FocusableFilterButton
                  key={filter.filterId}
                  focusKeyParam={filter.filterId}
                  text={filter.text}
                  currentFilterID={currentFilterId}
                  body={filter.body}
                  onClick={onFilterClicked}
                  setCurrentFocusContext={currentFocusContext.setFocusKey}
                />
              ))}
            </div>
            <h3 className="heading">Top Genres</h3>
            <div className="row mb-2">
              {topGenres.map((filter) => (
                <FocusableFilterButton
                  key={filter.filterId}
                  focusKeyParam={filter.filterId}
                  text={filter.text}
                  currentFilterID={currentFilterId}
                  body={filter.body}
                  onClick={onFilterClicked}
                  setCurrentFocusContext={currentFocusContext.setFocusKey}
                />
              ))}
            </div>
            <h3 className="heading">Top Developers</h3>
            <div className="row mb-2">
              {topDevelopers.map((filter) => (
                <FocusableFilterButton
                  key={filter.filterId}
                  focusKeyParam={filter.filterId}
                  text={filter.text}
                  currentFilterID={currentFilterId}
                  body={filter.body}
                  onClick={onFilterClicked}
                  setCurrentFocusContext={currentFocusContext.setFocusKey}
                />
              ))}
            </div>
            <h3 className="heading">Top Publishers</h3>
            <div className="row mb-2">
              {topPublishers.map((filter) => (
                <FocusableFilterButton
                  key={filter.filterId}
                  focusKeyParam={filter.filterId}
                  text={filter.text}
                  currentFilterID={currentFilterId}
                  body={filter.body}
                  onClick={onFilterClicked}
                  setCurrentFocusContext={currentFocusContext.setFocusKey}
                />
              ))}
            </div>
          </div>
          <div className="col-md-9">
            <h3 className="heading">{currentFilterTitle}</h3>
            <div className="row">
              {allGames?.map((game, index, games) =>
                renderSingleGame(
                  game,
                  index < 4,
                  (index + 1) % 4 === 0 || index + 1 === games.length,
                  index >= games.length - (games.length % 4 ? games.length % 4 : 4)
                )
              )}
            </div>
          </div>
        </div>
      </InfiniteScroll>
      {showLoading ? <LoaderPopup focusKeyParam="Loader" /> : null}
      {popUp.show && <ErrorPopUp {...popUp} />}
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

const FocusableGameWrapper = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    trackChildren: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {
      props.goToDetail();
    },
    onFocus: () => {
      // scrollToElement(ref.current, 100);
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
      props.setCurrentFocusContext(props.focusKeyParam);
    },
    onArrowPress: (direction, keyProps, detils) => {
      /* if (direction === "left" && getCoords(ref.current).left < 100) {
        setFocus("sidebar-search");
        return false;
      } */
      if (!props.allowUpArrow && direction === "up") {
        return false;
      } else if (!props.allowRightArrow && direction === "right") {
        return false;
      } else if (!props.allowDownArrow && direction === "down") {
        return false;
      }
      return true;
    },
  });

  return (
    <div
      ref={ref}
      className="col-md-4 col-lg-3 col-sm-6 col-6 mt-3"
      style={{ paddingTop: "10px", borderRadius: "10px", position: "relative" }}
    >
      <NavLink to={`/games-detail/${props.game.oplay_id}`} className="text-decoration-none text-initial">
        <LazyLoadImage
          alt={props.game.title}
          loading="lazy"
          src={props.game.text_background_image ?? "/img/placeholder_265x352.svg"} // use normal <img> attributes as props
          className={"rounded w-100 game-poster" + (focused ? " focusedElement" : "")}
          placeholder={<img alt={props.game.title} src="/img/placeholder_265x352.svg" className="img-fluid rounded w-100 game-poster" />}
        />
        {props.game.is_free === "true" && props.game.status !== "coming_soon" ? (
          <span className="freeTag px-x free tagText">FREE</span>
        ) : null}
        {props.game.status === "coming_soon" ? <span className="redGradient free px-2 tagText">COMING SOON</span> : null}
        {props.game.status === "maintenance" ? (
          <div className="text-center" style={{ height: 0 }}>
            <span className="orangeGradientBg px-2 bottomTag tagText">MAINTENANCE</span>
          </div>
        ) : null}
        {props.game.status === "updating" ? (
          <div className="text-center" style={{ height: 0 }}>
            <span className="updatingGradient px-2 bottomTag tagText">UPDATING</span>
          </div>
        ) : null}
        {props.game.status === "not_optimized" ? (
          <div className="text-center" style={{ height: 0 }}>
            <span className="darkredGradient px-2 bottomTag tagText">NOT OPTIMIZED</span>
          </div>
        ) : null}
        <h5 className="mb-1 text-white single-line-text GamesTitle">{props.game.title}</h5>
        <p className="textOffWhite single-line-text">{props.game.genre_mappings.join(", ")}</p>
      </NavLink>
    </div>
  );
};

const FocusableFilterButton = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {
      scrollToElement(ref.current, 300);
      props.setCurrentFocusContext(props.focusKeyParam);
    },
    onEnterPress: () => {
      props.onClick(props.text, props.focusKeyParam, props.body);
    },
    onArrowPress: (direction, keyProps, detils) => {
      if (( direction === "up" && getCoords(ref.current).top < 150 ) || (direction === "left" && getCoords(ref.current).left < 100)) {
        setFocus("Sidebar", getScrolledCoords(ref.current));
        return false;
      } 
      return true;
    },
  });
  return (
    <div
      className={"col-auto pr-0 mt-2 filter-btn" + (focused ? " focusedElement" : "")}
      style={{
        borderRadius: "60px",
        paddingRight: "0",
        paddingLeft: "0",
        marginRight: "12px",
      }}
      ref={ref}
      onClick={() => props.onClick(props.text, props.focusKeyParam, props.body)}
    >
      <a
        href="#"
        className={
          "card bgColorMuted mutedColor border-0 text-decoration-none" + (props.focusKeyParam === props.currentFilterID ? " activeBG" : "")
        }
      >
        <div className={"bgColorMuted customPaddign mutedColor" + (props.focusKeyParam === props.currentFilterID ? " activeBGColor" : "")}>
          {props.text}
        </div>
      </a>
    </div>
  );
};