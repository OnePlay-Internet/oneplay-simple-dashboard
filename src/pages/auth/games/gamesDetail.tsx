import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
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
  getGameConfig,
  getTokensUsage,
} from "../../../common/services";
import moment from "moment";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { getCoords, getScrolledCoords, railScrollTo, scrollToElement, scrollToTop } from "src/common/utils";
import ErrorPopUp from "src/pages/error";
import LoaderPopup from "src/pages/loader";
import GameLoading from "./loading";
import { StatusPopupContext } from "src/layouts/auth";
import {
  addGameTerminateEvent,
  endGameLandingViewEvent,
  endGamePlaySettingsEvent,
  endGamePlayStartEvent,
  startGameLandingViewEvent,
  startGamePlayStartEvent,
} from "src/common/countly.service";
import GameSettingsPopup from "./gameSettings";
import { SHOW_GAME_SETTINGS_CHECKED } from "src/common/constants";
import { useSearchParams } from "react-router-dom";
import warningIcon from "../../../assets/images/warning/warning-icon.svg";
import "../../../assets/css/warning-icon.css";
export default function GamesDetail({ focusKey: focusKeyParam }: FocusabelComponentProps) {
  const sessionContext = useContext(SessionContext);
  let { id } = useParams();
  const navigate = useNavigate();
  const [gameDetails, setGameDetails] = useState<any>(null);
  const [developerGames, setDeveloperGames] = useState<any[]>([]);
  const [genreGames, setGenreGames] = useState<any[]>([]);
  const [similarGames, setSimilarGames] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState("");
  const [playNowButtonText, setPlayNowButtonText] = useState<string>("Play Now");
  const [activeSessionStatus, setActiveSessionStatus] = useState<GameStatusDTO>({
    is_user_connected: false,
    is_running: false,
    game_id: null,
    game_name: null,
    session_id: null,
    success: false,
  });
  const [showWarningMsg, setShowWarningMsg] = useState<boolean>(false);
  const [startGameSession, setStartGameSession] = useState<string | null>(null);
  const [gameClientToken, setGameClientToken] = useState<string | null>(null);
  const [clientTokenStartTime, setClientTokenStartTime] = useState<number | null>(null);
  const [showLoading, setshowLoading] = useState(false);
  const [showGameLoading, setShowGameLoading] = useState<boolean>(false);
  const [gameTips, setGameTips] = useState<any[]>([]);
  const [gameLoadProgress, setGameLoadProgress] = useState<number>(0);
  const [gameLoadMessage, setGameLoadMessage] = useState<string>("Loading...");
  const { focusSelf, focusKey, setFocus } = useFocusable({
    focusable: true,
    trackChildren: true,
    focusKey: focusKeyParam,
    isFocusBoundary: false,
  });
  const queueRunning = useRef<boolean>(false);
  const queueTimeout = useRef<NodeJS.Timer | null>(null);
  const [readMore, setReadMore] = useState<boolean>(true);
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
  const [showGamesettingsChecked, setShowGamesettingsChecked] = useState(true);
  const [showGameSettings, setShowGameSettings] = useState<boolean>(false);
  const gameSettingsValue = useRef({ resolution: "1280x720", vSync: true, fps: 60, bitRate: 10 });
  const [searchParams] = useSearchParams();
  const [warningMsgPresent, setWarningMsgPresent] = useState<boolean>(false);
  useEffect(() => {
    setShowGamesettingsChecked(localStorage.getItem(SHOW_GAME_SETTINGS_CHECKED) === "true");
  }, []);
  useEffect(() => {
    localStorage.setItem(SHOW_GAME_SETTINGS_CHECKED, String(showGamesettingsChecked));
  }, [showGamesettingsChecked]);
  useEffect(() => {
    if (gameDetails) {
      startGameLandingViewEvent();
    }
    return () => {
      if (gameDetails) {
        endGameLandingViewEvent(gameDetails, searchParams.get("source") ?? "gamesPage", searchParams.get("trigger") ?? "card");
      }
    };
  }, [gameDetails]);

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
      setGameDetails(null);
      setDeveloperGames([]);
      setSimilarGames([]);
      setGenreGames([]);
      setReadMore(true);
      setActiveSessionStatus({
        is_user_connected: false,
        is_running: false,
        game_id: null,
        game_name: null,
        session_id: null,
        success: false,
      });
      setGameClientToken(null);
      setStartGameSession(null);
      setClientTokenStartTime(null);
      (async () => {
        const gameResp = await getGameDetails(id, sessionContext.sessionToken);
        if (!gameResp.success) {
          setPopUp({
            show: true,
            message: gameResp.message ?? "",
            title: "Error!",
            returnFocusTo: "btn-login",
            buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
            focusKeyParam: "modal-popup",
            icon: "error",
          });
          //navigate("/all-games");
          return;
        }
        setGameDetails(gameResp.game);
        let sStore = "";
        if (gameResp.game && gameResp.game.stores_mappings && gameResp.game.stores_mappings.length) {
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
  }, [sessionContext.sessionToken, id]);
  useEffect(() => {
    if (gameDetails) {
      setWarningMsgPresent(!!gameDetails.warning_message);
      //{gameDetails.warning_message===""?setWarningMsgPresent(true):setWarningMsgPresent(false)}
    }
  }, [gameDetails]);
  useEffect(() => {
    (async () => {
      if (gameClientToken) {
        const streamSessionResp = await getStreamingSessionInfo(gameClientToken);
        if (!streamSessionResp.success) {
          setPopUp({
            show: true,
            message: streamSessionResp.message ?? "",
            title: "Error!",
            returnFocusTo: "play-now",
            buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
            focusKeyParam: "modal-popup",
            icon: "error",
          });
          setShowGameLoading(false);
          return;
        }

        goToMoonLight(streamSessionResp.streamInfo.data);
      }
    })();
  }, [gameClientToken]);
  const goToMoonLight = async (streamInfo: any) => {
    await setPin(streamInfo.server_details.server_ip, streamInfo.server_details.port_details.pin_port, streamInfo.host_session_key);
    navigate(
      `/game-play?host_session_key=${streamInfo.host_session_key}&bitrate_kbps=${streamInfo.other_details.bitrate_kbps}&game_fps=${streamInfo.other_details.game_fps}&resolution=${streamInfo.other_details.resolution}&server_ip=${streamInfo.server_details.server_ip}&audio_port=${streamInfo.server_details.port_details.audio_port}&control_port=${streamInfo.server_details.port_details.control_port}&http_port=${streamInfo.server_details.port_details.http_port}&https_port=${streamInfo.server_details.port_details.https_port}&pin_port=${streamInfo.server_details.port_details.pin_port}&rtsp_port=${streamInfo.server_details.port_details.rtsp_port}&video_port=${streamInfo.server_details.port_details.video_port}&user_id=${streamInfo.user_details.user_id}&game_id=${id}&client_token=${gameClientToken}`
    );
    /* await setPin(streamInfo.server_details.server_ip, streamInfo.server_details.port_details.pin_port, streamInfo.host_session_key);
    window.location.replace(
      `/moonlight.html?host_session_key=${streamInfo.host_session_key}&bitrate_kbps=${streamInfo.other_details.bitrate_kbps}&game_fps=${streamInfo.other_details.game_fps}&resolution=${streamInfo.other_details.resolution}&server_ip=${streamInfo.server_details.server_ip}&audio_port=${streamInfo.server_details.port_details.audio_port}&control_port=${streamInfo.server_details.port_details.control_port}&http_port=${streamInfo.server_details.port_details.http_port}&https_port=${streamInfo.server_details.port_details.https_port}&pin_port=${streamInfo.server_details.port_details.pin_port}&rtsp_port=${streamInfo.server_details.port_details.rtsp_port}&video_port=${streamInfo.server_details.port_details.video_port}&user_id=${streamInfo.user_details.user_id}&game_id=${id}&client_token=${gameClientToken}`
    ); */
  };
  const getActiveSessionStatus = async () => {
    const [userId, sessionId] = atob(sessionContext.sessionToken).split(":");
    setDebugInfo(`UserId : ${userId?.length ? userId : "NONE" ?? "NONE"}  | SessionId : ${sessionId ?? "NONE"} | Store : ${selectedStore}`);
    if (userId && sessionId) {
      const activeSessionStatusResp = await getAnyActiveSessionStatus(userId, sessionId);
      if (!activeSessionStatusResp.success) {
        /* Swal.fire({
          title: "Error!",
          text: activeSessionStatusResp.message,
          icon: "error",
          confirmButtonText: "OK",
        }); */
        setPlayNowButtonText("Play Now");
        setPopUp({
          show: true,
          message: activeSessionStatusResp.message ?? "",
          title: "Error!",
          returnFocusTo: "play-now",
          buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
          focusKeyParam: "modal-popup",
          icon: "error",
        });
        return;
      }
      setActiveSessionStatus(activeSessionStatusResp);

      const tipsResp = await getGameConfig(userId, sessionId);
      if (tipsResp.success && tipsResp.tips) {
        setGameTips(tipsResp.tips);
      }
    }
  };
  useEffect(() => {
    if (!gameDetails) {
      return;
    }
    if (!["coming_soon", "maintenance", "updating"].includes(gameDetails.status)) {
      (async () => {
        getActiveSessionStatus();
      })();
    }

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
      const similarGamesResp = await getSimilarGames(sessionContext.sessionToken, gameDetails.oplay_id);
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
          {similarGames.map((game: any, index: number) =>
            renderSingeGameForRail(
              game,
              "similar_games",
              index === 0,
              index === similarGames.length - 1,
              genreGames.length === 0 && developerGames.length === 0
            )
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
          {developerGames.map((game: any, index: number) =>
            renderSingeGameForRail(game, "from_developer", index === 0, index === developerGames.length - 1, true)
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
          {genreGames.map((game: any, index: number) =>
            renderSingeGameForRail(game, "from_genre", index === 0, index === genreGames.length - 1, developerGames.length === 0)
          )}
        </div>
      </div>
    ) : null;
  };
  const renderSingeGameForRail = (game: any, feedId: string, isFirst: boolean, isLast: boolean, isLastRow: boolean) => {
    return (
      <FocusableRailGameWrapper
        key={`rail_${feedId}_${game.oplay_id}`}
        game={game}
        goToDetail={navigate}
        focusKeyParam={`rail_${feedId}_${game.oplay_id}`}
        isFirst={isFirst}
        isLast={isLast}
        allowDownArrow={!isLastRow}
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
  const shortDescLength = () => {
    if (window.screen.width >= 2438) {
      return 320;
    } else if (window.screen.width >= 1440) {
      return 200;
    } else if (window.screen.width >= 1024) {
      return 135;
    } else if (window.screen.width >= 768) {
      return 95;
    } else if (window.screen.width >= 425) {
      return 170;
    } else if (window.screen.width >= 375) {
      return 145;
    } else {
      return 100;
    }
  };
  const getShortDescription = () => {
    return readMore
      ? gameDetails?.description?.replace(/<[^>]*>|&[^;]+;/gm, "").slice(0, shortDescLength()) ?? ""
      : gameDetails?.description.replace(/<[^>]*>|&[^;]+;/gm, "");
  };
  const renderWarningMsg = (msg: string) => {
    return (
      <FocusableWarningButton
        focusKeyParam="btn-display-warning"
        onClick={toggleWarningMsg}
        showWarningMsg={showWarningMsg}
        msg={msg}
        allowDownArrow={true}
        allowRightArrow={false}
        className="dialog-box"
        setShowWarningMsg={setShowWarningMsg}
      ></FocusableWarningButton>
    );
  };
  const renderSingleStore = (store: any, index: number) => {
    const isSelected = !selectedStore && index === 0 ? "selected" : selectedStore === store.name ? "selected" : "";

    return (
      <FocusableStore
        focusKeyParam={`store-${index}`}
        key={store.name}
        store={store}
        isSelected={isSelected}
        getStoreImage={getStoreImage}
        onChange={onSelectedStoreChange}
      />
    );
  };
  const onResumeNowClicked = () => {
    if (showGameSettings) {
      console.log(gameSettingsValue.current);
      setShowGameSettings(false);
      //      return;
    } else if (showGamesettingsChecked) {
      setShowGameSettings(true);
      return;
    }
    if (activeSessionStatus?.session_id) {
      setshowLoading(true);
      setPlayNowButtonText("Initializing...");
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
    if (["coming_soon", "maintenance", "updating"].includes(gameDetails.status)) {
      return (
        <div className="borderRadius90 mt-3 blackColor" style={{ width: "fit-content" }}>
          <FocusableButton
            focusKeyParam="play-now"
            warningMsgPresent={warningMsgPresent}
            onClick={doNothing}
            className="btn blackColor borderRadius90 px-lg-4 border-0 text-white GradientBtnPadding position-relative fullWidthBtn font600"
            allowDownArrow={true}
            allowRightArrow={false}
          >
            {gameDetails.status === "coming_soon" ? "Coming Soon" : ""}
            {gameDetails.status === "maintenance" ? "Under Maintenance" : ""}
            {gameDetails.status === "updating" ? "Unavailable" : ""}
          </FocusableButton>
        </div>
      );
    }
    if (playNowButtonText === "Resume Now") {
      return (
        <>
          <FocusableButton
            focusKeyParam="play-now"
            warningMsgPresent={warningMsgPresent}
            className="btn btnGradient px-4 m-1"
            onClick={() => {
              activeSessionStatus?.session_id &&
                //setStartGameSession(activeSessionStatus.session_id);
                startGamePlayStartEvent();
              onResumeNowClicked();
            }}
            allowDownArrow={true}
            allowRightArrow={true}
          >
            {playNowButtonText}
          </FocusableButton>
          <FocusableButton
            className="btn btnGradient px-4 m-1"
            focusKeyParam="terminate-game"
            warningMsgPresent={warningMsgPresent}
            onClick={() => onTerminateGame(activeSessionStatus.session_id ?? null)}
            allowDownArrow={true}
            allowRightArrow={false}
          >
            Terminate
          </FocusableButton>
          <FocusableCheckbox
            focusKeyParam="checkbox-show-settings"
            onChange={setShowGamesettingsChecked}
            checked={showGamesettingsChecked}
          />
        </>
      );
    } else if (activeSessionStatus.success) {
      return (
        <>
          <FocusableButton
            className="btn btnGradient px-4 m-1"
            onClick={startGameRequest}
            focusKeyParam="play-now"
            warningMsgPresent={warningMsgPresent}
            allowDownArrow={true}
            allowRightArrow={false}
          >
            {playNowButtonText}
          </FocusableButton>
          <FocusableCheckbox
            focusKeyParam="checkbox-show-settings"
            onChange={setShowGamesettingsChecked}
            checked={showGamesettingsChecked}
          />
        </>
      );
    } else {
      return (
        <>
          <FocusableButton
            className="btn btnGradient px-4 m-1"
            focusKeyParam="play-now"
            onClick={doNothing}
            allowDownArrow={true}
            allowRightArrow={false}
            warningMsgPresent={warningMsgPresent}
          >
            Loading...
          </FocusableButton>
        </>
      );
    }
  };
  const renderWarnings = () => {
    if (["coming_soon", "maintenance", "updating", "not_optimized"].includes(gameDetails.status)) {
      return (
        <div className="font16 my-3 textCenterInResponsive">
          {gameDetails.status === "coming_soon" ? <p className="cancelgradientText font600">Stay tuned, Coming soon to OnePlay!</p> : ""}{" "}
          {gameDetails.status === "maintenance" ? (
            <p className="yellowGradient font600">We are working diligently to ensure a smoother gameplay. Game will be back soon!</p>
          ) : (
            ""
          )}
          {gameDetails.status === "updating" ? (
            <p className="gradientInfoText font600">We're implementing important updates, game will be back shortly!</p>
          ) : (
            ""
          )}
          {gameDetails.status === "not_optimized" ? (
            <p className="orangeGradient font600">The Quality of the gameplay may vary depending on your device.</p>
          ) : (
            ""
          )}
        </div>
      );
    }
  };
  const doNothing = () => {};

  const hidePopup = () => {
    setPopUp((prev) => {
      if (prev.returnFocusTo) {
        setFocus(prev.returnFocusTo);
      }
      return { show: false, message: "", title: "", returnFocusTo: "", buttons: [], focusKeyParam: "modal-popup", icon: "" };
    });
  };

  const onGetClientToken = async (sessionId: string | null) => {
    const initTime = Date.now();
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
        setGameLoadProgress(0);
        setGameLoadMessage("Loading...");
        setshowLoading(false);
        setShowGameLoading(false);
        setPopUp({
          show: true,
          message: "Time out.",
          title: "Error!",
          returnFocusTo: "play-now",
          buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
          focusKeyParam: "modal-popup",
          icon: "error",
        });
        return;
      }
    }
    const [userId, sessionToken] = atob(sessionContext.sessionToken)?.split(":");
    if (userId && sessionToken && sessionId) {
      console.log("get_session requested at : ", new Date().toLocaleString());
      const getClientTokenResp = await getClientToken(userId, sessionToken, sessionId);
      if (!getClientTokenResp.success || getClientTokenResp.code !== 200) {
        setPlayNowButtonText("Play Now");
        setshowLoading(false);
        setShowGameLoading(false);
        setPopUp({
          show: true,
          message: getClientTokenResp.message ?? "",
          title: "Error!",
          returnFocusTo: "play-now",
          buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
          focusKeyParam: "modal-popup",
          icon: "error",
        });
        return;
      } else if (getClientTokenResp.data?.client_token) {
        console.log("game client token : ", getClientTokenResp.data.client_token);
        setGameLoadProgress(100);
        setGameClientToken(getClientTokenResp.data.client_token);
        setshowLoading(false);
      } else {
        if (getClientTokenResp.data) {
          setGameLoadProgress(getClientTokenResp.data.progress);
          setGameLoadMessage(getClientTokenResp.data.message ?? "Loading...");
        }
        const currentTime = Date.now();
        // console.log("get_session diff : ", (currentTime - initTime) / 1000);
        if (currentTime - initTime > 3 * 1000) {
          // console.log("took more than 3 sec call get_session immediately.");
          await onGetClientToken(startGameSession);
        } else {
          //console.log("call get_session  after : ", 3 - (currentTime - initTime) / 1000);
          setTimeout(async () => {
            await onGetClientToken(startGameSession);
          }, 3 * 1000 - (currentTime - initTime));
        }
      }
    }
  };
  const onTerminateGame = async (sessionId: string | null) => {
    const [userId, sessionToken] = atob(sessionContext.sessionToken)?.split(":");
    if (userId && sessionToken && sessionId) {
      setshowLoading(true);
      const terminateGameResp: any = await terminateGame(userId, sessionToken, sessionId);

      if (terminateGameResp.data) {
        console.log("terminate resp : ");
        console.log(terminateGameResp.data);
        addGameTerminateEvent({
          gameSessionId: sessionId,
          gameId: gameDetails.oplay_id,
          gameTitle: gameDetails.title,
          gameGenre: gameDetails.genre_mappings.join(", "),
          store: selectedStore,
          terminationType: terminateGameResp.data.termination_type,
          sessionDuration: terminateGameResp.data.session_duration,
          playDuration: terminateGameResp.data.play_duration,
          idleDuration: terminateGameResp.data.idle_duration,
        });
      }
      setshowLoading(false);
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
          buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
          focusKeyParam: "modal-popup",
          icon: "error",
        });
        return;
      }
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
    console.log("activesession status : %s %s %s", id, activeSessionStatus.is_running, activeSessionStatus.resume_in_this_device);
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

  const startQueueTimeout = () => {
    if (queueRunning.current) {
      queueTimeout.current = setTimeout(startGameRequest, 10 * 1000);
    }
  };

  const startGameRequest = async () => {
    /* navigate(
      `/game-play?host_session_key=123&bitrate_kbps=10&game_fps=60&resolution=1920x768&server_ip=192.168.0.1&audio_port=123&control_port=123&http_port=123&https_port=123&pin_port=123&rtsp_port=123&video_port=123&user_id=123&game_id=${id}&client_token=123`
    ); */
    startGamePlayStartEvent();
    if (showGameSettings) {
      console.log(gameSettingsValue.current);
      setShowGameSettings(false);
    } else if (showGamesettingsChecked) {
      setShowGameSettings(true);
      return;
    }
    if (!id) {
      return;
    }
    const remainingTokens = await getTokensUsage(sessionContext.sessionToken);
    if (!remainingTokens.success) {
      return;
    }
    let errorMessage: string = "";
    if (remainingTokens.data?.total_tokens === 0) {
      errorMessage = `Looks like your gaming subscription has expired, use OnePlay app or website to buy/renew subscription.`;
    } else if (remainingTokens.data && remainingTokens.data?.total_tokens > 0 && remainingTokens.data?.remaining_tokens < 10) {
      errorMessage = `Minimum 10 mins required for gameplay, use OnePlay app or website to renew subscription.`;
    }
    //show error message.
    if (errorMessage) {
      endGamePlayStartEvent(gameDetails, selectedStore, "", showGamesettingsChecked, "failure");
      setPopUp({
        show: true,
        message: errorMessage,
        title: "Wait!",
        returnFocusTo: "play-now",
        buttons: [
          {
            text: "Okay",
            className: "btn gradientBtn btn-lg border-0",
            focusKey: "btn-ok-popup",
            onClick: hidePopup,
          },
        ],
        focusKeyParam: "modal-popup",
        icon: "recharge",
      });
      return;
    }

    const [userId, sessionId] = atob(sessionContext.sessionToken)?.split(":");
    if (gameDetails && userId && sessionId) {
      setClientTokenStartTime(null);
      if (!queueTimeout.current) {
        setshowLoading(true);
      }
      let sStore = selectedStore;
      if (!sStore && gameDetails.stores_mappings && gameDetails.stores_mappings.length) {
        sStore = gameDetails.stores_mappings[0].name;
      }
      if (!sStore && gameDetails.preferred_store) {
        sStore = gameDetails.preferred_store;
      }
      setDebugInfo("");
      setPlayNowButtonText("Initializing...");
      queueRunning.current = true;
      const startGameResp = await startGame(
        userId,
        sessionId,
        id,
        gameSettingsValue.current.resolution,
        gameSettingsValue.current.vSync,
        gameSettingsValue.current.fps,
        gameSettingsValue.current.bitRate,
        sStore
      );
      if (!startGameResp.success) {
        setPlayNowButtonText("Play Now");
        setshowLoading(false);
        if (startGameResp.code === 801 && startGameResp.message) {
          endGamePlayStartEvent(gameDetails, selectedStore, "", showGamesettingsChecked, "wait");
          const [queueCount, message1, message2] = startGameResp.message?.split(";");
          setPopUp({
            show: true,
            message: message1 + "<br />" + message2,
            title: queueCount,
            returnFocusTo: "play-now",
            buttons: [
              {
                text: "Cancel",
                className: "btn gradientBtn btn-lg border-0",
                focusKey: "btn-ok-popup",
                onClick: () => {
                  stopQueueTimeout();
                  hidePopup();
                  setFocus("play-now");
                },
              },
            ],
            focusKeyParam: "modal-popup-game-queue",
            icon: "queue",
          });

          startQueueTimeout();
        } else {
          endGamePlayStartEvent(gameDetails, selectedStore, "", showGamesettingsChecked, "failure");
          setPopUp({
            show: true,
            message: startGameResp.message ?? "Something went wront!",
            title: "Alert!",
            returnFocusTo: "play-now",
            buttons: [
              {
                text: "Okay",
                className: "btn gradientBtn btn-lg border-0",
                focusKey: "btn-ok-popup",
                onClick: hidePopup,
              },
            ],
            focusKeyParam: "modal-popup",
            icon: startGameResp.code === 601 ? "time-limit" : "gaming-issue",
          });
        }
        return;
      } else if (startGameResp.data?.api_action === "call_session") {
        if (queueRunning.current) {
          stopQueueTimeout();
          hidePopup();
        }
        if (startGameResp.data.session?.id) {
          endGamePlayStartEvent(gameDetails, selectedStore, startGameResp.data.session?.id, showGamesettingsChecked, "success");
          setShowGameLoading(true);
          setStartGameSession(startGameResp.data.session.id);
        } else {
          setPlayNowButtonText("Play Now");
        }
        setshowLoading(false);
      } else if (startGameResp.data?.api_action === "call_terminate") {
        endGamePlayStartEvent(gameDetails, selectedStore, "", showGamesettingsChecked, "failure");
        await onTerminateGame(startGameResp.data.session?.id ?? null);
      } else {
        setPlayNowButtonText("Play Now");
        //   this.stopLoading();
        setshowLoading(false);
        endGamePlayStartEvent(gameDetails, selectedStore, "", showGamesettingsChecked, "failure");
        setPopUp({
          show: true,
          message: "Please try again in sometime, thank you for your patience!",
          title: "No server available!",
          returnFocusTo: "play-now",
          buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
          focusKeyParam: "modal-popup",
          icon: "error",
        });
      }
    }
  };

  const stopQueueTimeout = () => {
    queueRunning.current = false;
    if (queueTimeout.current) {
      clearTimeout(queueTimeout.current);
      queueTimeout.current = null;
    }
  };
  const toogleReadMore = () => {
    setReadMore((prev) => !prev);
    setTimeout(() => {
      document.getElementById("game-details-info")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
  };
  const toggleWarningMsg = () => {
    setShowWarningMsg((prev) => !prev);
  };
  useEffect(() => {
    const onRemoteReturnClicked = (event: any) => {
      if (statusPopupContext) return;
      if (showGameSettings) {
        setShowGameSettings(false);
        setFocus("play-now");
        return;
      }
      if (popUp.show) {
        hidePopup();
        stopQueueTimeout();
      } else {
        window.history.go(-1);
      }
    };
    window.addEventListener("RemoteReturnClicked", onRemoteReturnClicked);
    return () => {
      window.removeEventListener("RemoteReturnClicked", onRemoteReturnClicked);
    };
  }, [popUp, hidePopup, statusPopupContext]);
  return gameDetails ? (
    <FocusContext.Provider value={focusKey}>
      <div className="mainContainer">
        <div className="row">
          <div className="col-md-12">
            <div className="card border-0">
              <img className="card-img banner" src={gameDetails?.background_image ?? "/img/default_bg.webp"} alt="games" />
              <div className="card-img-overlay customOverlay p-lg-4 pl-lg-5">
                <div className="row h-100">
                  <div className="col-md-12 align-self-end">
                    {gameDetails?.text_logo ? <img className="text-logo" alt={gameDetails?.title} src={gameDetails?.text_logo} /> : null}
                    <p className="text-white fw-bold">
                      {moment(gameDetails?.release_date).format("MMM, YYYY")}

                      {gameDetails?.age_rating && gameDetails?.age_rating !== "null" ? " - " + gameDetails?.age_rating : ""}
                      {gameDetails?.is_free === "true" ? " - Free" : ""}
                    </p>
                    <div>{gameDetails.warning_message && renderWarningMsg(gameDetails.warning_message)}</div>
                    {renderButtons()}
                    {renderWarnings()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mt-3 mt-md-4">
            <h3 className="text-white">About Game</h3>
            <p className="textOffWhite font500" id="game-details-info">
              {getShortDescription()}
              <FocusableButton
                warningMsgPresent={warningMsgPresent}
                focusKeyParam="btn-read-more"
                onClick={toogleReadMore}
                className="read-more-button"
                allowDownArrow={similarGames.length > 0 || genreGames.length > 0 || developerGames.length > 0}
                allowRightArrow={gameDetails.stores_mappings.length > 0}
              >
                {readMore ? "...Read More" : "Read Less"}
              </FocusableButton>
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

                  {gameDetails?.stores_mappings?.map((store: any, index: number) => renderSingleStore(store, index))}
                </div>
              ) : null}
              {gameDetails.developer.length ? (
                <div className="col">
                  <div className="col-auto  mt-4">
                    <p className="font500 gamesDescription mb-1">Developer</p>

                    {gameDetails.developer.map((developer: string) => (
                      <span className="suggestionResult text-white" key={`detail_genre_${developer}`}>
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
      {popUp.show && <ErrorPopUp {...popUp} />}
      {showGameLoading ? (
        <GameLoading bg={gameDetails.background_image} tips={gameTips} progress={gameLoadProgress} message={gameLoadMessage} />
      ) : null}
      {showGameSettings ? (
        <GameSettingsPopup
          focusKey="game-settings-popup"
          startGameRequest={startGameRequest}
          gameSettingsValue={gameSettingsValue}
          sStore={selectedStore}
          close={() => setShowGameSettings(false)}
          gameDetails={gameDetails}
        />
      ) : null}
    </FocusContext.Provider>
  ) : (
    <LoaderPopup focusKeyParam="Loader" />
  );
}

const FocusableWarningButton = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {
      scrollToTop();
    },
    onEnterPress: () => {
      props.onClick();
    },
    onBlur: () => {
      props.setShowWarningMsg(false);
    },
    onArrowPress: (direction, keyProps, detils) => {
      if (direction === "up" || direction === "left") {
        setFocus("Sidebar", getScrolledCoords(ref.current));
        return false;
      }
      if (direction === "down") {
        setFocus("play-now");
        return false;
      }
      return true;
    },
  });
  return (
    <>
      <button ref={ref} onClick={props.onClick} className={"warning-button" + (focused ? " focusedWarningElement" : "")}>
        <img src={warningIcon} className="img-fluid" alt="" />
      </button>
      {props.showWarningMsg && (
        <div className={props.className}>
          <div className="warning-msg-content">{props.msg}</div>
        </div>
      )}
    </>
  );
};

const FocusableButton = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {
      if (props.focusKeyParam === "btn-read-more") {
        //scrollToElement(ref.current.parentElement, 150);
        ref.current.parentElement.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        scrollToTop();
      }
    },
    onEnterPress: () => {
      props.onClick();
    },
    onArrowPress: (direction, keyProps, detils) => {
      if ((direction === "right" && !props.allowRightArrow) || (direction === "down" && !props.allowDownArrow)) {
        return false;
        /*  } else if (props.focusKeyParam === "play-now" && direction === "down") {
        setFocus("checkbox-show-settings");
        //setFocus("btn-read-more");
        return false;
      } */
      } else if (props.focusKeyParam === "play-now") {
        console.log("play now arrow : ", direction);
        switch (direction) {
          case "left":
            setFocus("Sidebar", getScrolledCoords(ref.current));
            return false;
          case "up":
            if (props.warningMsgPresent) {
              setFocus("btn-display-warning");
              return false;
            }
            break;
        }
      } else if (props.focusKeyParam === "btn-read-more" && direction === "left") {
        setFocus("Sidebar", getScrolledCoords(ref.current));
        return false;
      } else if (direction === "right" && props.focusKeyParam === "btn-read-more" && props.allowRightArrow) {
        setFocus("store-0");
        return false;
      }
      return true;
    },
  });
  return (
    <button ref={ref} className={props.className + (focused ? " focusedElement" : "")} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

const FocusableStore = (props: any) => {
  const { ref, focused } = useFocusable({
    focusKey: props.focusKeyParam,
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
      className={`font600 font20 text-white p-2 pr-3 store ${props.isSelected} ${focused ? " focusedElement" : ""}`}
    >
      <img src={`../store/${props.getStoreImage(props.store.name)}`} height="32" className="me-2" alt="" />
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
      // if (direction === "left" && getCoords(ref.current).left + ref.current.offsetLeft < 220) {
      if (direction === "left" && props.isFirst) {
        setFocus("Sidebar", { pos: getScrolledCoords(ref.current) });
        return false;
      } else if ((direction === "right" && props.isLast) || (direction === "down" && !props.allowDownArrow)) {
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
        padding: "5px",
        verticalAlign: "top",
        position: "relative",
        cursor: "pointer",
      }}
      onClick={() => {
        props.goToDetail(`/games-detail/${props.game.oplay_id}`);
      }}
    >
      <img
        src={props.game.text_background_image ?? "/img/default_bg.webp"}
        className={"img-fluid rounded coverImg" + (focused ? " focusedElement" : "")}
        alt={props.game.title ?? "game_" + props.game.oplay_id}
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
    </div>
  );
};

const FocusableCheckbox = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusKey: props.focusKeyParam,
    focusable: true,
    onFocus: () => {
      // scrollToElement(ref.current, 100);
      scrollToTop();
    },
    onEnterPress: () => {
      props.onChange(!props.checked);
    },
    onArrowPress: (direction, keyProps, detils) => {
      if (direction === "left") {
        setFocus("Sidebar", getScrolledCoords(ref.current));
        return false;
      } else if (direction === "right") {
        setFocus("store-0");
        return false;
      }
      return true;
    },
  });
  return (
    <div className="mt-3" style={{ paddingLeft: "1rem", position: "relative" }} ref={ref}>
      <input
        type="checkbox"
        id="checkbox-show-settings"
        className="custom-input-checkbox"
        checked={props.checked}
        onChange={(e) => props.onChange(e.target.checked)}
      ></input>
      <label
        htmlFor="checkbox-show-settings"
        className={"custom-input-checkbox-label font16 font500 text-white" + (focused ? " focusedCheckbox" : "")}
        style={{ paddingLeft: "10px" }}
      >
        <span className="marginLeftNegative">Show gameplay settings before launch</span>
      </label>
    </div>
  );
};