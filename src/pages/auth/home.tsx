import { useContext, useEffect, useRef, useState } from "react";
import {
  customFeedGames,
  getPersonalizedFeed,
  getUsersWishlist,
} from "src/common/services";
import { CurrentFocusContext, SessionContext } from "src/App";
import ErrorPopUp from "../error";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";
import { getCoords, getScrolledCoords, railScrollTo, scrollToElement, scrollToTop } from "src/common/utils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { StatusPopupContext } from "src/layouts/auth";
import store from '../../assets/images/store/store.svg'
import '../../assets/css/home.css'
export default function Home({ focusKey: focusKeyParam }: FocusabelComponentProps) {
  const [personalizedFeeds, setPersonalizedFeeds] = useState<any[]>([]);
  const [customGames, setCustomGames] = useState<any[]>([]);
  const [firstHeaderFocusKey, setFirstHeaderFocusKey] = useState("");
  const [wishlistGames, setWishlistGames] = useState<any[]>([]);
  const sessionContext = useContext(SessionContext);
  const currentFocusContext = useContext(CurrentFocusContext);
  const statusPopupContext = useContext(StatusPopupContext);
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("For You");

  const [popUp, setPopUp] = useState<ErrorPopupPorps>({
    show: false,
    message: "",
    title: "",
    returnFocusTo: "",
    buttons: [],
    focusKeyParam: "modal-popup",
    icon: "",
  });
  const [tabs, setTabs] = useState([
    { text: "For You", focusKeyParam: "tab-for-you", body: { is_free: true } },
    {
      text: "Free To Play",
      focusKeyParam: "tab-free-to-play",
      body: { is_free: "true", order_by: "release_date:desc" },
    },
    {
      text: "Action",
      focusKeyParam: "tab-action",
      body: { genres: "Action", order_by: "release_date:desc" },
    },
    {
      text: "Adventure",
      focusKeyParam: "tab-adventure",
      body: { genres: "Adventure", order_by: "release_date:desc" },
    },
    {
      text: "Casual",
      focusKeyParam: "tab-casual",
      body: {
        genres: "Casual",
        order_by: "release_date:desc",
      },
    },
    {
      text: "RPG",
      focusKeyParam: "tab-rpg",
      body: {
        genres: "RPG",
        order_by: "release_date:desc",
      },
    },
    {
      text: "Racing",
      focusKeyParam: "tab-racing",
      body: {
        genres: "Racing",
        order_by: "release_date:desc",
      },
    },
  ]);
  const { setFocus, focusKey, focusSelf } = useFocusable({
    focusable: true,
    focusKey: focusKeyParam,
    preferredChildFocusKey: "tab-for-you",
  });
  const hidePopup = () => {
    setPopUp((prev) => {
      if (currentFocusContext.focusKey) {
        setFocus(currentFocusContext.focusKey);
      } else if (prev.returnFocusTo) {
        setFocus(prev.returnFocusTo);
      } else {
        setFocus("home_header_slider");
      }
      return { show: false, message: "", title: "", returnFocusTo: "", buttons: [], focusKeyParam: "modal-popup", icon: "" };
    });
  };
  useEffect(() => {
    if (firstHeaderFocusKey) {
      setFocus("home_header_slider");
      // setFocus("tab-for-you");
    } else {
      setFocus("tab-for-you");
      //focusSelf();
    }
  }, [firstHeaderFocusKey]);
  const renderHeaderSlider = () => {
    const headerIndex = personalizedFeeds.findIndex((feed: any) => feed.type === "header" && feed.results.length);
    if (headerIndex >= 0) {
      return (
        <FocusableHeaderSlider
          className="row pt-5"
          focusKeyParam="home_header_slider"
          games={personalizedFeeds.at(headerIndex)}
          goToDetail={navigate}
          setCurrentFocusContext={currentFocusContext.setFocusKey}
        />
      );
    }
    return null;
  };
  const renderRails = () => {
    if (personalizedFeeds) {
      return personalizedFeeds
        .filter((feed) => feed.type === "rail")
        .map((feed, index, feeds) => renderSingleRail(feed, feeds.length - 1 === index));
    }
  };
  const renderSingeGameForRail = (game: any, feedId: string, isFirst: boolean, isLast: boolean, isLastFeed: boolean) => {
    return (
      <FocusableRailGameWrapper
        key={`rail_${feedId}_${game.oplay_id}`}
        game={game}
        goToDetail={navigate}
        focusKeyParam={`rail_${feedId}_${game.oplay_id}`}
        setCurrentFocusContext={currentFocusContext.setFocusKey}
        isFirst={isFirst}
        isLast={isLast}
        allowDownArrow={!isLastFeed}
      />
    );
  };
  const renderSingleRail = (feed: any, isLastFeed: boolean) => {
    return (
      <div className="col-12" key={`feed_${feed.feed_id}`}>
        <p className="rail-heading">{feed.title}</p>

        <div className="scrolltab">
          {feed.results.map((game: any, index: number) =>
            renderSingeGameForRail(game, feed.feed_id, index === 0, index === feed.results.length - 1, isLastFeed)
          )}
        </div>
      </div>
    );
  };
  const renderWishlist = () => {
    return (
      <div className="col-12" key={`feed_wishlist`}>
        <p className="rail-heading">My Library</p>

        <div className="scrolltab">
          {wishlistGames.map((game: any, index: number) =>
            renderSingeGameForRail(
              game,
              "feed_wishlist",
              index === 0,
              index === wishlistGames.length - 1,
              currentTab === "For You" ? false : true
            )
          )}
        </div>
      </div>
    );
  };
  useEffect(() => {
    console.log("wish list refresh ----- ");
    if (sessionContext.sessionToken) {
      (async () => {
        const wishlistsResp: any = await getUsersWishlist(sessionContext.sessionToken);
        if (!wishlistsResp.success) {
          setPopUp({
            show: true,
            message: wishlistsResp.message ?? "",
            title: "Error!",
            returnFocusTo: "home_header_slider",
            buttons: [
              {
                text: "OK",
                className: "btn gradientBtn btn-lg border-0 mt-3",
                focusKey: "btn-cancel-popup",
                onClick: hidePopup,
              },
            ],
            focusKeyParam: "modal-popup-error",
            icon: "error",
          });
          return;
        }
        const body = {
          content_ids: wishlistsResp.wishlist,
        };
        const wishlistGamesResp = await customFeedGames(sessionContext.sessionToken, body, 0, wishlistsResp.wishlist.length);
        if (!wishlistGamesResp.success) {
          setPopUp({
            show: true,
            message: wishlistGamesResp.message ?? "",
            title: wishlistGamesResp.message ?? "",
            returnFocusTo: "home_header_slider",
            buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
            focusKeyParam: "modal-popup-error",
            icon: "error",
          });
          return;
        }
        if (wishlistGamesResp.games) {
          if (wishlistGamesResp.games && wishlistGamesResp.games.length) {
            setWishlistGames(wishlistGamesResp.games);
          } else {
            if (!wishlistGamesResp.games?.length) {
              setWishlistGames([]);
            }
          }
        }
      })();
    }
  }, [sessionContext.sessionToken]);
  useEffect(() => {
    const onRemoteReturnClicked = (event: any) => {
      console.log("home on remote return clicked ");
      if (statusPopupContext) return;
      if (popUp.show) {
        hidePopup();
      } else {
        setPopUp({
          show: true,
          message: "Are you sure you want to exit oneplay app?",
          title: "Exit OnePlay?",
          returnFocusTo: "home_header_slider",
          buttons: [
            {
              text: "Cancel",
              className: "btn gradientBtn btn-lg border-0",
              focusKey: "btn-ok-popup",
              onClick: hidePopup,
            },
            {
              text: "Exit",
              className: "btn grayGradientBtn btn-lg border-0 mt-3",
              focusKey: "btn-cancel-popup",
              onClick: () => {
                hidePopup();
                //@ts-ignore
                tizen.application.getCurrentApplication().exit();
              },
            },
          ],
          focusKeyParam: "modal-popup-confirm-exit",
          icon: "error",
        });
      }
    };
    window.addEventListener("RemoteReturnClicked", onRemoteReturnClicked);
    return () => {
      window.removeEventListener("RemoteReturnClicked", onRemoteReturnClicked);
    };
  }, [popUp, hidePopup, statusPopupContext]);
  useEffect(() => {
    if (sessionContext.sessionToken) {
      (async () => {
        if (currentTab === "For You") {
          const personlizedFeesResp = await getPersonalizedFeed(sessionContext.sessionToken);
          if (!personlizedFeesResp.success) {
            setPopUp({
              show: true,
              message: personlizedFeesResp.message ?? "",
              title: "Error!",
              returnFocusTo: "home_header_slider",
              buttons: [
                {
                  text: "OK",
                  className: "btn gradientBtn btn-lg border-0 mt-3",
                  focusKey: "btn-cancel-popup",
                  onClick: hidePopup,
                },
              ],
              focusKeyParam: "modal-popup-error",
              icon: "error",
            });
            return;
          }
          setPersonalizedFeeds(personlizedFeesResp.feeds ?? []);

          const headerIndex = personlizedFeesResp.feeds?.findIndex((feed: any) => feed.type === "header") ?? -1;
          console.log("heder index : ", headerIndex);
          if (headerIndex >= 0) {
            const headerFeed: any = personlizedFeesResp.feeds?.at(headerIndex);
            if (headerFeed?.results.length) {
              const k = headerFeed?.results?.[0].oplay_id ?? "";
              console.log("k : ", k);
              setFirstHeaderFocusKey(`header_game_${k}`);
            } else {
              setFocus("tab-for-you");
            }
          }
        } else {
          const body: any = {};
          switch (currentTab) {
            case "Free To Play":
              body.is_free = "true";
              body.order_by = "release_date:desc";
              break;
            default:
              body.genres = currentTab;
              body.order_by = "release_date:desc";
              break;
          }

          const customGamesResp = await customFeedGames(sessionContext.sessionToken, body, 0, 12);
          if (!customGamesResp.success) {
            setPopUp({
              show: true,
              message: customGamesResp.message ?? "",
              title: "Error!",
              returnFocusTo: "home_header_slider",
              buttons: [
                {
                  text: "Ok",
                  className: "btn gradientBtn btn-lg border-0 mt-3",
                  focusKey: "btn-cancel-popup",
                  onClick: hidePopup,
                },
              ],
              focusKeyParam: "modal-popup-error",
              icon: "error",
            });
            return;
          }
          if (customGamesResp.games) {
            if (customGamesResp.games && customGamesResp.games.length) {
              setCustomGames(customGamesResp.games);
            } else {
              if (!customGamesResp.games?.length) {
                setCustomGames([]);
              }
            }
          }
        }
      })();
    }
  }, [sessionContext.sessionToken, currentTab]);

  const onTabButtonCliced = (selectedTab: string) => {
    setCurrentTab(selectedTab);
  };
  const renderCustomResut = () => {
    return (
      <div className="col-12" key={`current_tab_${currentTab}`}>
        <p className="rail-heading">{currentTab}</p>
        <div className="scrolltab">
          {customGames.map((game: any, index: number) =>
            renderSingeGameForRail(game, `current_tab_${currentTab}`, index === 0, index === customGames.length - 1, false)
          )}
        </div>
      </div>
    );
  };
  return (
    <FocusContext.Provider value={focusKey}>
      {renderHeaderSlider()}
      <div className="container-fluid homeMainContainer" style={{ paddingLeft: "6rem" }}>
        <div className="row justify-content-center pt-4">
          <div className="col-auto">
            <div className="row justify-content-center scrolltab">
              {tabs.map((tab) => (
                <div className="col-auto tabOptions" key={tab.focusKeyParam}>
                  <FocusableTabButton
                    focusKeyParam={tab.focusKeyParam}
                    tab={tab.text}
                    onClick={onTabButtonCliced}
                    currentTab={currentTab}
                    setCurrentFocusContext={currentFocusContext.setFocusKey}
                  >
                    {tab.text}
                  </FocusableTabButton>
                </div>
              ))}
            </div>
          </div>
        </div>
        {currentTab === "For You" ? renderWishlist() : null}
        {currentTab === "For You" ? renderRails() : renderCustomResut()}
        {currentTab !== "For You" ? renderWishlist() : null}
      </div>

      {popUp.show && <ErrorPopUp {...popUp} />}
    </FocusContext.Provider>
  );
}

const FocusableTabButton = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {
      //scrollToElement(ref.current, 100);
      props.setCurrentFocusContext(props.focusKeyParam);
      scrollToTop();
    },
    onEnterPress: () => {
      props.onClick(props.tab);
    },
    onArrowPress: (direction, keyProps, detils) => {
      if (props.focusKeyParam === "tab-for-you" && direction === "left") {
        setFocus("Sidebar", { pos: getScrolledCoords(ref.current) });
        return false;
      }
      return true;
    },
  });
  return (
    <div
      className={"col-auto tabOptions" + (focused ? " focusedElement" : "")}
      ref={ref}
      style={{ borderRadius: "60px" }}
      onClick={() => {
        props.onClick(props.tab);
      }}
    >
      <a href="#" className={"card bgColor text-decoration-none mutedColor" + (props.tab === props.currentTab ? " activeBG" : "")}>
        <div className={"customBtnPadding bgColor mutedColor" + (props.tab === props.currentTab ? "text-white" : "")}>{props.children}</div>
      </a>
    </div>
  );
};
const FocusableRailGameWrapper = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {
      props.setCurrentFocusContext(props.focusKeyParam);
      scrollToElement(ref.current, 120);
      railScrollTo(ref.current);
    },
    onEnterPress: () => {
      props.goToDetail(`/games-detail/${props.game.oplay_id}?source=homePage&trigger=card`);
    },
    onArrowPress: (direction, keyProps, detils) => {
      //if (direction === "left" && getCoords(ref.current).left + ref.current.offsetLeft < 220) {
      if (direction === "left" && props.isFirst) {
        setFocus("Sidebar", { pos: getScrolledCoords(ref.current) });
        return false;
      } else if (direction === "right" && props.isLast) {
        console.log("last game in rail");
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
      className="fixedWidth tabOptions"
      style={{
        padding: "7px",
        verticalAlign: "top",
        cursor: "pointer",
      }}
      onClick={() => {
        props.goToDetail(`/games-detail/${props.game.oplay_id}?source=homePage&trigger=card`);
      }}
    >
      <img
        src={props.game.text_background_image ?? "/img/default_bg.webp"}
        className={"img-fluid rounded coverImg" + (focused ? " focusedElement" : "")}
        alt={props.game.title ?? "game_" + props.game.oplay_id}
      />
      {props.game.is_free === "true" && props.game.status !== "coming_soon" ? (
        <span className="freeTag px-2 free tagText">FREE ON <img src={store} className='freeOnStoreIcon'/></span>
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
      <h5 className="GamesTitle mb-1 text-white single-line-text">{props.game.title}</h5>
      <p className="textOffWhite single-line-text">{props.game.genre_mappings.join(", ")}</p>
    </div>
  );
};

const FocusableHeaderSlider = (props: any) => {
  const sliderRef = useRef<any>(null);
  var sliderSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    centerMode: true,
    autoplay: true,
    slidesToShow: 1,
    autoplaySpeed: 5000,
    variableWidth: true,
    className: "home-header-slider",
  };
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {
      //scrollToElement(ref.current, 100);
      props.setCurrentFocusContext(props.focusKeyParam);
      scrollToTop();
    },
    onEnterPress: () => {
      const headerSlider = document.querySelector("#home-header-slider");
      if (headerSlider) {
        const currentGame = headerSlider.getElementsByClassName("slick-center");
        for (let index = 0; index < currentGame.length; index++) {
          const ariaHidden = currentGame[index].getAttribute("aria-hidden");
          //console.log("ariaHidden : ", ariaHidden);
          if (ariaHidden != null && ariaHidden === "false") {
            const gId = currentGame[index].querySelector("[data-gameid]")?.getAttribute("data-gameid");
            if (gId) {
              props.goToDetail(`/games-detail/${gId}?source=homePage&trigger=banner`);
            }
          }
        }
      }
    },
    onArrowPress: (direction, keyProps, detils) => {
      switch (direction) {
        case "left":
          sliderRef.current.slickPrev();
          break;
        case "right":
          sliderRef.current.slickNext();
          break;
        case "up":
          setFocus("Sidebar", { pos: getCoords(ref.current) });
          break;
        case "down":
          setFocus("tab-for-you");
          break;
      }
      return false;
    },
  });
  const renderSingleSlide = (game: any) => {
    return (
      <div
        key={`header_slide_game_${game.oplay_id}`}
        className="col-auto"
        style={{ borderRadius: "6px" }}
        data-gameid={game.oplay_id}
        onClick={() => {
          props.goToDetail(`/games-detail/${game.oplay_id}?source=homePage&trigger=banner`);
        }}
      >
        <div className="card border-0 transparentBg">
          <img src={game.background_image} className="card-img height50vh rounded" alt="..." />
          <div
            className="card-img-overlay"
            style={{
              background: "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 58.85%, rgba(0, 0, 0, 0.52) 79.17%, rgba(0, 0, 0, 0.80) 100%)",
            }}
          >
            <div className="row height45vh align-items-center">
              <div className="col">
                <img src={game.text_logo} className="img-fluid text-logo" alt="..." />
              </div>
            </div>
          </div>
          {/*   <div className="card-img-overlay header-game-playnow-overlay">
            <div className="row height45vh align-items-end">
              <div className="col-auto width20"></div>
              <div className="col-auto width70 ps-4">
                <button className="btn text-white gradientBtn border-0 br90 px-4 btn-md fw400">Play Now</button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    );
  };
  return (
    <div className={"col-lg-12" + (focused ? " slick-focused" : "")} ref={ref} id="home-header-slider" style={{ marginTop: "4rem" }}>
      <div className="card border-0 transparentBg">
        <div className="row">
          <Slider {...sliderSettings} ref={sliderRef}>
            {props.games.results.map((game: any) => renderSingleSlide(game))}
          </Slider>
        </div>
      </div>
    </div>
  );
};