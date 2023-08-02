import { useContext, useEffect, useRef, useState } from "react";
import {
  customFeedGames,
  getPersonalizedFeed,
  getUsersWishlist,
} from "src/common/services";
import { SessionContext } from "src/App";
import ErrorPopUp from "../error";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";
import {
  getCoords,
  getScrolledCoords,
  railScrollTo,
  scrollToElement,
  scrollToTop,
} from "src/common/utils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export default function Home({
  focusKey: focusKeyParam,
}: FocusabelComponentProps) {
  const [popUp, setPopUp] = useState({ show: false, message: "", title: "" });
  const [personalizedFeeds, setPersonalizedFeeds] = useState<any[]>([]);
  const [customGames, setCustomGames] = useState<any[]>([]);
  const [firstHeaderFocusKey, setFirstHeaderFocusKey] = useState("");
  const [wishlistGames, setWishlistGames] = useState<any[]>([]);
  const sessionContext = useContext(SessionContext);
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("For You");
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
    onFocus: (componentLayout, extraProps, focusDetails) => {
      console.log("home focus received");
      if (focusDetails && focusDetails.pos) {
        console.log(focusDetails.pos);
      }
    },
  });
  const onPopupOkClick = () => {
    setPopUp({ show: false, message: "", title: "" });
    //setFocus("home_header_slider");
    setFocus("tab-for-you");
  };
  useEffect(() => {
    if (firstHeaderFocusKey) {
      //setFocus("home_header_slider");
      setFocus("tab-for-you");
    } else {
      focusSelf();
    }
  }, [firstHeaderFocusKey]);
  const renderHeaderSlider = () => {
    const headerIndex = personalizedFeeds.findIndex(
      (feed: any) => feed.type === "header"
    );
    console.log("header index : ", headerIndex);
    if (headerIndex >= 0) {
      return (
        <FocusableHeaderSlider
          className="row pt-5"
          focusKeyParam="home_header_slider"
          games={personalizedFeeds.at(headerIndex)}
          goToDetail={navigate}
        />
      );
    }
    return null;
  };
  const renderRails = () => {
    if (personalizedFeeds) {
      return personalizedFeeds
        .filter((feed) => feed.type === "rail")
        .map((feed) => renderSingleRail(feed));
    }
  };
  const renderSingeGameForRail = (game: any, feedId: string) => {
    return (
      <FocusableRailGameWrapper
        key={`rail_${feedId}_${game.oplay_id}`}
        game={game}
        goToDetail={navigate}
        focusKeyParam={`rail_${feedId}_${game.oplay_id}`}
      />
    );
  };
  const renderSingleRail = (feed: any) => {
    return (
      <div className="row pt-4" key={`feed_${feed.feed_id}`}>
        <div className="col-12">
          <p className="rail-heading">{feed.title}</p>
        </div>
        <div className="row scrolltab">
          {feed.results.map((game: any) =>
            renderSingeGameForRail(game, feed.feed_id)
          )}
        </div>
      </div>
    );
  };
  const renderWishlist = () => {
    return (
      <div className="row pt-4" key={`feed_wishlist`}>
        <div className="col-12">
          <p className="rail-heading">My Library</p>
        </div>
        <div className="row scrolltab">
          {wishlistGames.map((game: any) =>
            renderSingeGameForRail(game, "feed_wishlist")
          )}
        </div>
      </div>
    );
  };
  useEffect(() => {
    if (sessionContext.sessionToken) {
      (async () => {
        const wishlistsResp: any = await getUsersWishlist(
          sessionContext.sessionToken
        );
        if (!wishlistsResp.success) {
          setPopUp({
            show: true,
            message: wishlistsResp.message ?? "",
            title: "Error!",
          });
          return;
        }
        const body = {
          content_ids: wishlistsResp.wishlist,
        };
        const wishlistGamesResp = await customFeedGames(
          sessionContext.sessionToken,
          body,
          0,
          wishlistsResp.wishlist.length
        );
        if (!wishlistGamesResp.success) {
          setPopUp({
            show: true,
            message: wishlistsResp.message ?? "",
            title: "Error!",
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
  }, [sessionContext]);

  useEffect(() => {
    if (sessionContext.sessionToken) {
      (async () => {
        if (currentTab === "For You") {
          const personlizedFeesResp = await getPersonalizedFeed(
            sessionContext.sessionToken
          );
          if (!personlizedFeesResp.success) {
            setPopUp({
              show: true,
              message: personlizedFeesResp.message ?? "",
              title: "Error!",
            });
            return;
          }
          setPersonalizedFeeds(personlizedFeesResp.feeds ?? []);

          const headerIndex =
            personlizedFeesResp.feeds?.findIndex(
              (feed: any) => feed.type === "header"
            ) ?? -1;
          if (headerIndex >= 0) {
            const headerFeed: any = personlizedFeesResp.feeds?.at(headerIndex);
            const k = headerFeed?.results?.[0].oplay_id ?? "";
            console.log("k : ", k);
            setFirstHeaderFocusKey(`header_game_${k}`);
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

          const customGamesResp = await customFeedGames(
            sessionContext.sessionToken,
            body,
            0,
            12
          );
          if (!customGamesResp.success) {
            setPopUp({
              show: true,
              message: customGamesResp.message ?? "",
              title: "Error!",
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
  }, [sessionContext, currentTab]);

  const onTabButtonCliced = (selectedTab: string) => {
    setCurrentTab(selectedTab);
  };
  const renderCustomResut = () => {
    return (
      <div className="row pt-4" key={`current_tab_${currentTab}`}>
        <div className="col-12">
          <p className="rail-heading">{currentTab}</p>
        </div>
        <div className="row scrolltab">
          {customGames.map((game: any) =>
            renderSingeGameForRail(game, `current_tab_${currentTab}`)
          )}
        </div>
      </div>
    );
  };
  return (
    <FocusContext.Provider value={focusKey}>
      {
        //renderHeaderSlider()
      }
      <div
        className="container-fluid homeMainContainer"
        style={{ paddingLeft: "6rem" }}
      >
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
                  >
                    {tab.text}
                  </FocusableTabButton>
                </div>
              ))}

              {/*   <div className="col-auto tabOptions">
                <FocusableTabButton
                  focusKeyParam="tab-free-to-play"
                  tab="Free To Play"
                  onClick={onTabButtonCliced}
                  currentTab={currentTab}
                >
                  Free To Play
                </FocusableTabButton>
              </div>
              <div className="col-auto tabOptions">
                <FocusableTabButton
                  focusKeyParam="tab-action"
                  tab="Action"
                  onClick={onTabButtonCliced}
                  currentTab={currentTab}
                >
                  Action
                </FocusableTabButton>
              </div>
              <div className="col-auto tabOptions">
                <FocusableTabButton
                  focusKeyParam="tab-Adventure"
                  tab="Adventure"
                  onClick={onTabButtonCliced}
                  currentTab={currentTab}
                >
                  Adventure
                </FocusableTabButton>
              </div>
              <div className="col-auto tabOptions">
                <FocusableTabButton
                  focusKeyParam="tab-casual"
                  tab="Casual"
                  onClick={onTabButtonCliced}
                  currentTab={currentTab}
                >
                  Casual
                </FocusableTabButton>
              </div>
              <div className="col-auto tabOptions">
                <FocusableTabButton
                  focusKeyParam="tab-rpg"
                  tab="RPG"
                  onClick={onTabButtonCliced}
                  currentTab={currentTab}
                >
                  RPG
                </FocusableTabButton>
              </div>
              <div className="col-auto tabOptions">
                <FocusableTabButton
                  focusKeyParam="tab-racing"
                  tab="Racing"
                  onClick={onTabButtonCliced}
                  currentTab={currentTab}
                >
                  Racing
                </FocusableTabButton>
              </div> */}
            </div>
          </div>
        </div>
        {currentTab === "For You" ? renderWishlist() : null}
        {currentTab === "For You" ? renderRails() : renderCustomResut()}
        {currentTab !== "For You" ? renderWishlist() : null}
      </div>

      {popUp.show && (
        <ErrorPopUp
          focusKeyParam="modal-popup"
          title={popUp.title}
          message={popUp.message}
          onOkClick={onPopupOkClick}
        />
      )}
    </FocusContext.Provider>
  );
}

const FocusableTabButton = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {
      //scrollToElement(ref.current, 100);
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
      <a
        href="#"
        className={
          "card bgColor text-decoration-none mutedColor" +
          (props.tab === props.currentTab ? " activeBG" : "")
        }
      >
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
      scrollToElement(ref.current, 120);
      railScrollTo(ref.current);
    },
    onEnterPress: () => {
      props.goToDetail(`/games-detail/${props.game.oplay_id}`);
    },
    onArrowPress: (direction, keyProps, detils) => {
      if (
        direction === "left" &&
        getCoords(ref.current).left + ref.current.offsetLeft < 170
      ) {
        setFocus("Sidebar", { pos: getScrolledCoords(ref.current) });
        return false;
      }
      return true;
    },
  });
  return (
    <div
      ref={ref}
      className={"fixedWidth tabOptions" + (focused ? " focusedElement" : "")}
      style={{
        padding: "10px",
        borderRadius: "10px",
        verticalAlign: "top",
      }}
    >
      <img
        src={props.game.text_background_image ?? "/img/default_bg.webp"}
        className="img-fluid rounded coverImg"
        alt={props.game.title ?? "game_" + props.game.oplay_id}
      />
      <h5 className="mt-3 mb-1 text-white">{props.game.title}</h5>
      <p className="textOffWhite">{props.game.genre_mappings.join(", ")}</p>
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
      scrollToTop();
    },
    onEnterPress: () => {
      const headerSlider = document.querySelector("#home-header-slider");
      if (headerSlider) {
        const currentGame = headerSlider.getElementsByClassName("slick-center");
        for (let index = 0; index < currentGame.length; index++) {
          const ariaHidden = currentGame[index].getAttribute("aria-hidden");
          console.log("ariaHidden : ", ariaHidden);
          if (ariaHidden != null && ariaHidden === "false") {
            const gId = currentGame[index]
              .querySelector("[data-gameid]")
              ?.getAttribute("data-gameid");
            if (gId) {
              props.goToDetail(`/games-detail/${gId}`);
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
          //setFocus("Sidebar");
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
      >
        <div className="card border-0 transparentBg">
          <img
            src={game.background_image}
            className="card-img height50vh rounded"
            alt="..."
          />
          <div
            className="card-img-overlay"
            style={{
              background:
                "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 58.85%, rgba(0, 0, 0, 0.52) 79.17%, rgba(0, 0, 0, 0.80) 100%)",
            }}
          >
            <div className="row height45vh align-items-center">
              <div className="col">
                <img
                  src={game.text_logo}
                  className="img-fluid text-logo"
                  alt="..."
                />
              </div>
            </div>
          </div>
          <div className="card-img-overlay header-game-playnow-overlay">
            <div className="row height45vh align-items-end">
              <div className="col-auto width20"></div>
              <div className="col-auto width70 ps-4">
                <button className="btn text-white gradientBtn border-0 br90 px-4 btn-md fw400">
                  Play Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div
      className={"col-lg-12" + (focused ? " slick-focused" : "")}
      ref={ref}
      id="home-header-slider"
      style={{ marginTop: "4rem" }}
    >
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