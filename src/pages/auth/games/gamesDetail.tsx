import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "src/App";
import {
  GameStatusDTO,
  getAnyActiveSessionStatus,
  getClientToken,
  getGameDetails,
  startGame,
  terminateGame,
  getStreamingSessionInfo,
  setPin,
  customFeedGames,
  getSimilarGames,
} from "../../../common/services";
import moment from "moment";
//import Swal from "sweetalert2";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import {
  getCoords,
  getScrolledCoords,
  railScrollTo,
  scrollToElement,
  scrollToTop,
} from "src/common/utils";
import ErrorPopUp from "src/pages/error";
import LoaderPopup from "src/pages/loader";

export default function GamesDetail({
  focusKey: focusKeyParam,
}: FocusabelComponentProps) {
  const sessionContext = useContext(SessionContext);
  let { id } = useParams();
  const navigate = useNavigate();
  const [gameDetails, setGameDetails] = useState<any>(null);
  const [developerGames, setDeveloperGames] = useState<any[]>([]);
  const [genreGames, setGenreGames] = useState<any[]>([]);
  const [similarGames, setSimilarGames] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState("");
  const [playNowButtonText, setPlayNowButtonText] =
    useState<string>("Play Now");
  const [activeSessionStatus, setActiveSessionStatus] = useState<GameStatusDTO>(
    {
      is_user_connected: false,
      is_running: false,
      game_id: null,
      game_name: null,
      session_id: null,
      success: false,
    }
  );
  const [startGameSession, setStartGameSession] = useState<string | null>(null);
  const [gameClientToken, setGameClientToken] = useState<string | null>(null);
  const [clientTokenStartTime, setClientTokenStartTime] = useState<
    number | null
  >(null);
  const [showLoading, setshowLoading] = useState(false);
  const { focusSelf, focusKey, setFocus } = useFocusable({
    focusable: true,
    trackChildren: true,
    focusKey: focusKeyParam,
    isFocusBoundary: false,
    onFocus: (componentLayout, extraProps, focusDetails) => {
      console.log("home focus received");
      if (focusDetails && focusDetails.pos) {
        console.log(focusDetails.pos);
      }
    },
  });
  const [popUp, setPopUp] = useState({
    show: false,
    message: "",
    title: "",
    returnFocusTo: "",
    icon: "",
  });
  useEffect(() => {
    setFocus("play-now");
  }, [activeSessionStatus]);

  useEffect(() => {
    if (startGameSession) {
      setClientTokenStartTime(Date.now());
    }
  }, [startGameSession]);
  useEffect(() => {
    if (startGameSession && clientTokenStartTime) {
      onGetClientToken(startGameSession);
    }
  }, [clientTokenStartTime]);
  useEffect(() => {
    if (sessionContext.sessionToken && id) {
      (async () => {
        const gameResp = await getGameDetails(id, sessionContext.sessionToken);
        if (!gameResp.success) {
          /* Swal.fire({
            title: "Error!",
            text: gameResp.message,
            icon: "error",
            confirmButtonText: "OK",
          }); */
          setPopUp({
            show: true,
            message: gameResp.message ?? "",
            title: "error",
            returnFocusTo: "play-now",
            icon: "",
          });
          //navigate("/all-games");
          return;
        }
        setGameDetails(gameResp.game);
        let sStore = "";
        if (
          gameResp.game &&
          gameResp.game.stores_mappings &&
          gameResp.game.stores_mappings.length
        ) {
          sStore = gameResp.game.stores_mappings.at(0).name;
          if (gameResp.game.preferred_store) {
            sStore = gameResp.game.preferred_store;
          }
          console.log("sStore : ", sStore);
          setSelectedStore(sStore);
        }
      })();
    } else {
      navigate("/all-games");
    }
  }, [sessionContext, id]);

  useEffect(() => {
    (async () => {
      if (gameClientToken) {
        const streamSessionResp = await getStreamingSessionInfo(
          gameClientToken
        );
        if (!streamSessionResp.success) {
          /* Swal.fire({
            title: "Error!",
            text: streamSessionResp.message,
            icon: "error",
            confirmButtonText: "OK",
          }); */
          setPopUp({
            show: true,
            message: streamSessionResp.message ?? "",
            title: "Error!",
            returnFocusTo: "play-now",
            icon: "",
          });
          return;
        }
        /* Swal.fire({
          title: "Info!",
          text: JSON.stringify(streamSessionResp.streamInfo),
          icon: "success",
          confirmButtonText: "OK",
        }); */
        goToMoonLight(streamSessionResp.streamInfo.data);
      }
    })();
  }, [gameClientToken]);
  const goToMoonLight = async (streamInfo: any) => {
    await setPin(
      streamInfo.server_details.server_ip,
      streamInfo.server_details.port_details.pin_port,
      streamInfo.host_session_key
    );
    window.location.replace(
      `/moonlight.html?host_session_key=${streamInfo.host_session_key}&bitrate_kbps=${streamInfo.other_details.bitrate_kbps}&game_fps=${streamInfo.other_details.game_fps}&resolution=${streamInfo.other_details.resolution}&server_ip=${streamInfo.server_details.server_ip}&audio_port=${streamInfo.server_details.port_details.audio_port}&control_port=${streamInfo.server_details.port_details.control_port}&http_port=${streamInfo.server_details.port_details.http_port}&https_port=${streamInfo.server_details.port_details.https_port}&pin_port=${streamInfo.server_details.port_details.pin_port}&rtsp_port=${streamInfo.server_details.port_details.rtsp_port}&video_port=${streamInfo.server_details.port_details.video_port}&user_id=${streamInfo.user_details.user_id}&game_id=${id}&client_token=${gameClientToken}`
    );
  };
  const getActiveSessionStatus = async () => {
    const [userId, sessionId] = atob(sessionContext.sessionToken).split(":");
    setDebugInfo(
      `UserId : ${userId?.length ? userId : "NONE" ?? "NONE"}  | SessionId : ${
        sessionId ?? "NONE"
      } | Store : ${selectedStore}`
    );
    if (userId && sessionId) {
      const activeSessionStatusResp = await getAnyActiveSessionStatus(
        userId,
        sessionId
      );
      if (!activeSessionStatusResp.success) {
        /* Swal.fire({
          title: "Error!",
          text: activeSessionStatusResp.message,
          icon: "error",
          confirmButtonText: "OK",
        }); */
        setPopUp({
          show: true,
          message: activeSessionStatusResp.message ?? "",
          title: "Error!",
          returnFocusTo: "play-now",
          icon: "",
        });
        return;
      }
      setActiveSessionStatus(activeSessionStatusResp);
    }
  };
  useEffect(() => {
    if (!gameDetails) {
      return;
    }
    (async () => {
      getActiveSessionStatus();
    })();

    (async () => {
      const existingGameIds = new Set();
      existingGameIds.add(gameDetails.oplay_id);
      for await (const genre of gameDetails.genre_mappings) {
        const genreGamesResp = await customFeedGames(
          sessionContext.sessionToken,
          { genres: genre, order_by: "trend_score:desc" },
          0,
          0,
          false
        );
        if (genreGamesResp.success && genreGamesResp.games) {
          const newGames: any[] = [];
          for (const game of genreGamesResp.games) {
            if (!existingGameIds.has(game.oplay_id)) {
              newGames.push(game);
              existingGameIds.add(game.oplay_id);
            }
          }
          setGenreGames((prev) => [...prev, ...newGames]);
        }
      }
    })();
    (async () => {
      const existingGameIds = new Set();
      existingGameIds.add(gameDetails.oplay_id);
      for await (const developer of gameDetails.developer) {
        const developerGameResp = await customFeedGames(
          sessionContext.sessionToken,
          { developer: developer, order_by: "trend_score:desc" },
          0,
          0,
          false
        );
        if (developerGameResp.success && developerGameResp.games) {
          const newGames: any[] = [];
          for (const game of developerGameResp.games) {
            if (!existingGameIds.has(game.oplay_id)) {
              newGames.push(game);
              existingGameIds.add(game.oplay_id);
            }
          }
          setDeveloperGames((prev) => [...prev, ...newGames]);
        }
      }
    })();
    (async () => {
      const existingGameIds = new Set();
      existingGameIds.add(gameDetails.oplay_id);
      const similarGamesResp = await getSimilarGames(
        sessionContext.sessionToken,
        gameDetails.oplay_id
      );
      if (similarGamesResp.success && similarGamesResp.games) {
        const newGames: any[] = [];
        for (const game of similarGamesResp.games) {
          if (!existingGameIds.has(game.oplay_id)) {
            newGames.push(game);
            existingGameIds.add(game.oplay_id);
          }
        }
        setSimilarGames((prev) => [...prev, ...newGames]);
      }
    })();
  }, [gameDetails]);
  const renderSimilarGames = () => {
    return similarGames.length ? (
      <div className="col-12" key={`feed_similar_games`}>
        <p className="rail-heading">Similar Games</p>

        <div className="scrolltab">
          {similarGames.map((game: any) =>
            renderSingeGameForRail(game, "similar_games")
          )}
        </div>
      </div>
    ) : null;
  };
  const renderDevelopersGames = () => {
    return developerGames.length ? (
      <div className="col-12" key={`feed_from_developer`}>
        <p className="rail-heading">From Developer</p>

        <div className="scrolltab">
          {developerGames.map((game: any) =>
            renderSingeGameForRail(game, "from_developer")
          )}
        </div>
      </div>
    ) : null;
  };
  const renderGenreGames = () => {
    return genreGames.length ? (
      <div className="col-12" key={`feed_from_genre`}>
        <p className="rail-heading">From Genre</p>

        <div className="scrolltab">
          {genreGames.map((game: any) =>
            renderSingeGameForRail(game, "from_genre")
          )}
        </div>
      </div>
    ) : null;
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

  const getStoreImage = (storeName: string): string => {
    if (/^epic/i.exec(storeName)) {
      return "epic.png";
    } else if (/^battle/i.exec(storeName)) {
      return "battle_net.png";
    } else if (/^(origin|ea)/i.exec(storeName)) {
      return "ea.png";
    } else if (/^steam/i.exec(storeName)) {
      return "steam.png";
    } else if (/^(uplay|ubisoft)/i.exec(storeName)) {
      return "uplay.png";
    } else if (/^gog/i.exec(storeName)) {
      return "gog.png";
    } else if (/^rockstar/i.exec(storeName)) {
      return "rockstar.png";
    }
    return "";
  };
  const getShortDescription = () => {
    return (
      gameDetails?.description
        ?.slice(0, 250)
        .replace(/<[^>]*>|&[^;]+;/gm, "") ?? ""
    );
  };

  const renderSingleStore = (store: any, index: number) => {
    const isSelected =
      !selectedStore && index === 0
        ? "selected"
        : selectedStore === store.name
        ? "selected"
        : "";

    return (
      <FocusableStore
        key={store.name}
        store={store}
        isSelected={isSelected}
        getStoreImage={getStoreImage}
        onChange={onSelectedStoreChange}
      />
    );
  };
  const onResumeNowClicked = () => {
    if (activeSessionStatus?.session_id) {
      setClientTokenStartTime(null);
      setStartGameSession(activeSessionStatus.session_id);
    }
  };

  const renderButtons = () => {
    /*  if (
      activeSessionStatus.is_running &&
      !activeSessionStatus.is_user_connected &&
      activeSessionStatus.resume_in_this_device &&
      activeSessionStatus.game_id &&
      activeSessionStatus.game_id === id
    )  */
    if (playNowButtonText === "Resume Now") {
      return (
        <>
          <FocusableButton
            focusKeyParam="play-now"
            onClick={() => {
              activeSessionStatus?.session_id &&
                //setStartGameSession(activeSessionStatus.session_id);
                onResumeNowClicked();
            }}
          >
            {playNowButtonText}
          </FocusableButton>
          <FocusableButton
            onClick={() =>
              onTerminateGame(activeSessionStatus.session_id ?? null)
            }
          >
            Terminate
          </FocusableButton>
          ;
        </>
      );
    } else if (activeSessionStatus.success) {
      return (
        <FocusableButton onClick={onPlayNowClicked} focusKeyParam="play-now">
          {playNowButtonText}
        </FocusableButton>
      );
    } else {
      return (
        <FocusableButton focusKeyParam="play-now" onClick={doNothing}>
          Loading...
        </FocusableButton>
      );
    }
  };
  const doNothing = () => {};

  const onPopupOkClick = () => {
    const returnFocusTo = popUp.returnFocusTo;
    setPopUp({
      show: false,
      message: "",
      title: "",
      returnFocusTo: "",
      icon: "",
    });
    setFocus(returnFocusTo);
  };
  const onPlayNowClicked = async () => {
    if (!id) {
      return;
    }

    const [userId, sessionId] = atob(sessionContext.sessionToken)?.split(":");
    if (gameDetails && userId && sessionId) {
      setClientTokenStartTime(null);
      setshowLoading(true);
      let sStore = selectedStore;
      if (
        !sStore &&
        gameDetails.stores_mappings &&
        gameDetails.stores_mappings.length
      ) {
        sStore = gameDetails.stores_mappings[0].name;
      }
      if (!sStore && gameDetails.preferred_store) {
        sStore = gameDetails.preferred_store;
      }
      setDebugInfo("");
      setPlayNowButtonText("Initializing...");
      const startGameResp = await startGame(
        userId,
        sessionId,
        id,
        "1920x1080",
        true,
        60,
        20,
        sStore
      );
      if (!startGameResp.success) {
        /*  Swal.fire({
          title: "Error!",
          text: startGameResp.message,
          icon: "error",
          confirmButtonText: "OK",
        }); */
        setPlayNowButtonText("Play Now");
        setshowLoading(false);
        setPopUp({
          show: true,
          message: startGameResp.message ?? "",
          title: "Error!",
          returnFocusTo: "play-now",
          icon: "",
        });
        return;
      }
      if (startGameResp.code === 801 && startGameResp.message) {
        const [queueCount, message1, message2] =
          startGameResp.message?.split(";");
        setPopUp({
          show: true,
          message: message1 + "<br />" + message2,
          title: queueCount,
          returnFocusTo: "play-now",
          icon: "queue",
        });
        setshowLoading(false);
        setPlayNowButtonText("Play Now");
      } else if (startGameResp.data?.api_action === "call_session") {
        if (startGameResp.data.session?.id) {
          setStartGameSession(startGameResp.data.session.id);
        }
      } else if (startGameResp.data?.api_action === "call_terminate") {
        await onTerminateGame(startGameResp.data.session?.id ?? null);
      } else {
        setPlayNowButtonText("Play Now");
        //   this.stopLoading();
        setshowLoading(false);
        /*   Swal.fire({
          title: "No server available!",
          text: "Please try again in sometime, thank you for your patience!",
          imageUrl: "../img/error/Group.svg",
          showCancelButton: true,
          confirmButtonText: "Try Again",
          cancelButtonText: "Close",
        }).then((result) => {
          if (result.isConfirmed) {
            onPlayNowClicked();
          }
        }); */
        setPopUp({
          show: true,
          message: "Please try again in sometime, thank you for your patience!",
          title: "No server available!",
          returnFocusTo: "play-now",
          icon: "group",
        });
      }
    }
  };
  const onGetClientToken = async (sessionId: string | null) => {
    if (gameClientToken) {
      return;
    }
    if (clientTokenStartTime) {
      if (Date.now() - clientTokenStartTime >= 120 * 1000) {
        /*  Swal.fire({
          title: "Error!",
          text: "Get client token time out.",
          icon: "error",
          confirmButtonText: "OK",
        }); */
        setPlayNowButtonText("Play Now");
        setshowLoading(false);
        setPopUp({
          show: true,
          message: "Time out.",
          title: "Error!",
          returnFocusTo: "play-now",
          icon: "",
        });
        return;
      }
    }
    const [userId, sessionToken] = atob(sessionContext.sessionToken)?.split(
      ":"
    );
    if (userId && sessionToken && sessionId) {
      const getClientTokenResp = await getClientToken(
        userId,
        sessionToken,
        sessionId
      );
      if (!getClientTokenResp.success || getClientTokenResp.code !== 200) {
        /* Swal.fire({
          title: "Error!",
          text: getClientTokenResp.message,
          icon: "error",
          confirmButtonText: "OK",
        }); */
        setPlayNowButtonText("Play Now");
        setshowLoading(false);
        setPopUp({
          show: true,
          message: getClientTokenResp.message ?? "",
          title: "Error!",
          returnFocusTo: "play-now",
          icon: "",
        });
        return;
      } else if (getClientTokenResp.data?.client_token) {
        console.log(
          "game client token : ",
          getClientTokenResp.data.client_token
        );
        setGameClientToken(getClientTokenResp.data.client_token);

        /* Swal.fire({
          title: "Success",
          text: getClientTokenResp.data.client_token,
          icon: "success",
          confirmButtonText: "OK",
        }); */
        setshowLoading(false);
      } else {
        await onGetClientToken(startGameSession);
      }
    }
  };
  const onTerminateGame = async (sessionId: string | null) => {
    const [userId, sessionToken] = atob(sessionContext.sessionToken)?.split(
      ":"
    );
    if (userId && sessionToken && sessionId) {
      const terminateGameResp = await terminateGame(
        userId,
        sessionToken,
        sessionId
      );
      if (!terminateGameResp.success) {
        /*  Swal.fire({
          title: "Error!",
          text: terminateGameResp.message,
          icon: "error",
          confirmButtonText: "OK",
        }); */
        setPopUp({
          show: true,
          message: terminateGameResp.message ?? "",
          title: "Error!",
          returnFocusTo: "play-now",
          icon: "",
        });
        return;
      }
      setshowLoading(false);
      setPlayNowButtonText("Play Now");
      await getActiveSessionStatus();
    }
  };
  const onSelectedStoreChange = (checked: boolean, store: string) => {
    if (checked) {
      // setGameDetails((prev: any) => {
      //   return { ...prev, selectedStore: store };
      // });
      setSelectedStore(store);
    }
  };
  useEffect(() => {
    console.log(
      "activesession status : %s %s %s",
      id,
      activeSessionStatus.is_running,
      activeSessionStatus.resume_in_this_device
    );
    if (
      activeSessionStatus.success &&
      activeSessionStatus.game_id === id &&
      activeSessionStatus.is_running &&
      activeSessionStatus.resume_in_this_device &&
      activeSessionStatus.game_id
    ) {
      setPlayNowButtonText("Resume Now");
    } else {
      setPlayNowButtonText("Play Now");
    }
    setFocus("play-now");
  }, [activeSessionStatus, setFocus]);
  return gameDetails ? (
    <FocusContext.Provider value={focusKey}>
      <div className="mainContainer">
        <div className="row">
          <div className="col-md-12">
            <div className="card border-0">
              <img
                className="card-img banner"
                src={gameDetails?.background_image ?? "/img/default_bg.webp"}
                alt="games"
              />
              <div className="card-img-overlay customOverlay p-lg-4 pl-lg-5">
                <div className="row h-100">
                  <div className="col-md-12 align-self-end">
                    {gameDetails?.text_logo ? (
                      <img
                        className="text-logo"
                        alt={gameDetails?.title}
                        src={gameDetails?.text_logo}
                      />
                    ) : null}
                    <p className="text-white fw-bold">
                      {moment(gameDetails?.release_date).format("MMM, YYYY")}
                      {" - "}
                      {gameDetails?.age_rating}
                    </p>
                    {renderButtons()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mt-3 mt-md-4">
            <h3 className="text-white">About Game</h3>
            <p className="textOffWhite font500">
              {getShortDescription()}
              {/* <span className="text-white">...Read more</span> */}
            </p>
          </div>
          {/*   <div className="col-md-6">
            <div className="col-auto pr-lg-5 mt-4">
              {gameDetails?.stores_mappings?.length ? (
                <p className="font500 text-white">Store</p>
              ) : null}
              {gameDetails?.stores_mappings?.map((store: any, index: number) =>
                renderSingleStore(store, index)
              )}
            </div>
          </div> */}
          <div className="col-md-6 ps-lg-5">
            <div className="row">
              {gameDetails?.stores_mappings?.length ? (
                <div className="col-auto mt-4 p-0">
                  <p className="font500 gamesDescription mb-1">Store</p>

                  {gameDetails?.stores_mappings?.map(
                    (store: any, index: number) =>
                      renderSingleStore(store, index)
                  )}
                </div>
              ) : null}
              {gameDetails.developer.length ? (
                <div className="col">
                  <div className="col-auto  mt-4">
                    <p className="font500 gamesDescription mb-1">Developer</p>

                    {gameDetails.developer.map((developer: string) => (
                      <span
                        className="suggestionResult text-white"
                        key={`detail_genre_${developer}`}
                      >
                        {developer + " "}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            {gameDetails.genre_mappings.length ? (
              <div className="row mt-4">
                <div
                  className="col-12"
                  style={{
                    paddingLeft: 0,
                  }}
                >
                  <p className="font500 gamesDescription mb-1">Tags</p>

                  {gameDetails.genre_mappings.map((genre: string) => (
                    <span
                      key={`detail_genre_${genre}`}
                      className="badge rounded-pill text-capitalize customLinearGradient smallText text-white me-3 mt-3 px-4 pb-2"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="row">{renderSimilarGames()}</div>
        <div className="row">{renderGenreGames()}</div>
        <div className="row">{renderDevelopersGames()}</div>
        <div className="row">
          <p style={{ color: "transparent", overflowWrap: "break-word" }}>
            Debug : {debugInfo ?? ""}
            <br />
            Active session response : {JSON.stringify(activeSessionStatus)}
          </p>
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
  ) : (
    <LoaderPopup focusKeyParam="Loader" />
  );
}

const FocusableButton = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {
      scrollToTop();
    },
    onEnterPress: () => {
      props.onClick();
    },
    onArrowPress: (direction, keyProps, detils) => {
      if (
        (direction === "left" || direction === "top") &&
        getCoords(ref.current).left < 130
      ) {
        setFocus("Sidebar", getScrolledCoords(ref.current));
        return false;
      }
      return true;
    },
  });
  return (
    <button
      ref={ref}
      className={
        "btn btnGradient px-4 m-1" + (focused ? " focusedElement" : "")
      }
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

const FocusableStore = (props: any) => {
  const { ref, focused } = useFocusable({
    focusable: true,
    onFocus: () => {
      // scrollToElement(ref.current, 100);
      scrollToTop();
    },
    onEnterPress: () => {
      props.onChange(!props.isSelected, props.store.name);
    },
  });
  return (
    <a
      ref={ref}
      style={{ marginRight: "12px" }}
      key={props.store.name}
      href="#"
      className={`font600 font20 text-white p-2 pr-3 store ${
        props.isSelected
      } ${focused ? " focusedElement" : ""}`}
    >
      <img
        src={`../store/${props.getStoreImage(props.store.name)}`}
        height="32"
        className="me-2"
        alt=""
      />
      <input
        type="checkbox"
        className="checkbox"
        checked={!!props.isSelected}
        onChange={() => props.onChange(!props.isSelected, props.store.name)}
      />
    </a>
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