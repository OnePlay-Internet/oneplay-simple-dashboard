import brandLogo from "../../../assets/images/oneplayLogo.svg";
import Games from "../../../assets/images/games/Rectangle 210.svg";
import { NavLink, useNavigate, useParams } from "react-router-dom";
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
} from "../../../common/services";
import moment from "moment";
import Swal from "sweetalert2";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { styled } from "styled-components";

export default function GamesDetail({
  focusKey: focusKeyParam,
}: FocusabelComponentProps) {
  const sessionContext = useContext(SessionContext);
  let { id } = useParams();
  const navigate = useNavigate();
  const { focusSelf, focusKey, setFocus } = useFocusable({
    focusable: true,
  });
  const [gameDetails, setGameDetails] = useState<any>(null);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
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
  useEffect(() => {
    focusSelf();
  }, [focusSelf]);
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
          Swal.fire({
            title: "Error!",
            text: gameResp.message,
            icon: "error",
            confirmButtonText: "OK",
          });
          navigate("/all-games");
        }
        setGameDetails(gameResp.game);
        setSelectedStore(
          gameResp.game?.preferred_store ??
            gameResp.game?.stores_mappings?.length
            ? gameResp.game?.stores_mappings?.at(0).name
            : null
        );
        await getActiveSessionStatus();
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
          Swal.fire({
            title: "Error!",
            text: streamSessionResp.message,
            icon: "error",
            confirmButtonText: "OK",
          });
          return;
        }
         Swal.fire({
           title: "Info!",
           text: JSON.stringify(streamSessionResp.streamInfo),
           icon: "success",
           confirmButtonText: "OK",
         });
      }
    })();
  }, [gameClientToken]);
  const getActiveSessionStatus = async () => {
    const [userId, sessionId] = atob(sessionContext.sessionToken)?.split(":");
    if (userId && sessionId) {
      const activeSessionStatusResp = await getAnyActiveSessionStatus(
        userId,
        sessionId
      );
      if (!activeSessionStatusResp.success) {
        Swal.fire({
          title: "Error!",
          text: activeSessionStatusResp.message,
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      setActiveSessionStatus(activeSessionStatusResp);
    }
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
        ?.slice(0, 100)
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
    if (
      activeSessionStatus.is_running &&
      !activeSessionStatus.is_user_connected &&
      activeSessionStatus.resume_in_this_device &&
      activeSessionStatus.game_id &&
      activeSessionStatus.game_id === id
    ) {
      return (
        <>
          <FocusableButton
            onClick={() => {
              activeSessionStatus?.session_id &&
                //setStartGameSession(activeSessionStatus.session_id);
                onResumeNowClicked();
            }}
          >
            Resume Now
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
        <FocusableButton onClick={onPlayNowClicked}>Play Now</FocusableButton>
      );
    } else {
      return <button className="btn btnGradient px-4 m-1">Loading...</button>;
    }
  };
  const onPlayNowClicked = async () => {
    if (!id) {
      return;
    }
    setClientTokenStartTime(null);
    setshowLoading(true);
    const [userId, sessionId] = atob(sessionContext.sessionToken)?.split(":");
    if (gameDetails && userId && sessionId && selectedStore) {
      const startGameResp = await startGame(
        userId,
        sessionId,
        id,
        "1280x720",
        true,
        60,
        20,
        selectedStore
      );
      if (!startGameResp.success || startGameResp.code !== 200) {
        Swal.fire({
          title: "Error!",
          text: startGameResp.message,
          icon: "error",
          confirmButtonText: "OK",
        });
        setshowLoading(false);
        return;
      }
      if (startGameResp.data?.api_action === "call_session") {
        /* this._initializedModalRef = this.ngbModal.open(this.initializedModal, {
           centered: true,
           modalDialogClass: "modal-sm",
           backdrop: "static",
           keyboard: false,
         });
         this.sessionToTerminate = data.data.session.id;
         this.startGameWithClientToken(data.data.session.id); */
        if (startGameResp.data.session?.id) {
          setStartGameSession(startGameResp.data.session.id);
        }
      } else if (startGameResp.data?.api_action === "call_terminate") {
        //this.terminateGame(data.data.session.id);
        await onTerminateGame(startGameResp.data.session?.id ?? null);
      } else {
        //   this.stopLoading();
        setshowLoading(false);
        Swal.fire({
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
        Swal.fire({
          title: "Error!",
          text: "Get client token time out.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setshowLoading(false);
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
        Swal.fire({
          title: "Error!",
          text: getClientTokenResp.message,
          icon: "error",
          confirmButtonText: "OK",
        });
        setshowLoading(false);
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
        Swal.fire({
          title: "Error!",
          text: terminateGameResp.message,
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      setshowLoading(false);
      getActiveSessionStatus();
    }
  };
  const onSelectedStoreChange = (checked: boolean, store: string) => {
    if (checked) {
      setSelectedStore(store);
    }
  };
  return gameDetails ? (
    <FocusContext.Provider value={focusKey}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
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
                <FocusableAllGames
                  onClick={() => {
                    navigate("/all-games");
                  }}
                >
                  All Games
                </FocusableAllGames>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container-fluid bg-dark">
        <div className="row">
          <div className="col-md-12">
            <div className="card border-0">
              <img
                className="card-img banner"
                src={gameDetails?.background_image ?? Games}
                alt="games"
              />
              <div className="card-img-overlay customOverlay p-lg-4 pl-lg-5">
                <div className="row h-100">
                  <div className="col-md-12 align-self-end">
                    <img
                      className="text-logo"
                      alt={gameDetails?.title}
                      src={gameDetails?.text_logo}
                    />
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
              <span className="text-white">...Read more</span>
            </p>
          </div>
          <div className="col-md-6">
            <div className="col-auto pr-lg-5 mt-4">
              {gameDetails?.stores_mappings?.length && (
                <p className="font500 text-white">Store</p>
              )}
              {gameDetails?.stores_mappings?.map((store: any, index: number) =>
                renderSingleStore(store, index)
              )}
            </div>
          </div>
        </div>
      </div>
      {showLoading && (
        <div style={{ display: "flex" }} className="my-modal">
          <div className="my-modal-content">
            <div className="my-loader"></div>
            <div className="my-modal-text">Loading...</div>
          </div>
        </div>
      )}
    </FocusContext.Provider>
  ) : (
    <div style={{ display: "flex" }} className="my-modal">
      <div className="my-modal-content">
        <div className="my-loader"></div>
        <div className="my-modal-text">Loading...</div>
      </div>
    </div>
  );
}

const FocusableAllGamesStyled = styled.a<FocusableItemProps>`
  box-shadow: ${({ focused }) =>
    focused ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" : "none"};
`;

const FocusableAllGames = (props: any) => {
  const { ref, focused } = useFocusable({
    focusable: true,
    onEnterPress: () => {
      props.onClick();
    },
    onFocus: () => {
      ref.current.scrollIntoView({ behavior: "smooth" });
    },
  });
  return (
    <FocusableAllGamesStyled
      ref={ref}
      focused={focused}
      href="#"
      className="nav-link "
      onClick={props.onClick}
    >
      {props.children}
    </FocusableAllGamesStyled>
  );
};

const FocusableButtonStyled = styled.button<FocusableItemProps>`
  box-shadow: ${({ focused }) =>
    focused ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" : "none"};
`;
const FocusableButton = (props: any) => {
  const { ref, focused } = useFocusable({
    focusable: true,
    onEnterPress: () => {
      props.onClick();
    },
  });
  return (
    <FocusableButtonStyled
      ref={ref}
      focused={focused}
      className="btn btnGradient px-4 m-1"
      onClick={props.onClick}
    >
      {props.children}
    </FocusableButtonStyled>
  );
};

const FocusableStoreStyled = styled.a<FocusableItemProps>`
  box-shadow: ${({ focused }) =>
    focused ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" : "none"};
`;
const FocusableStore = (props: any) => {
  const { ref, focused } = useFocusable({
    focusable: true,
    onEnterPress: () => {
      props.onChange(!props.isSelected, props.store.name);
    },
  });
  return (
    <FocusableStoreStyled
      ref={ref}
      focused={focused}
      key={props.store.name}
      href="javascript:void(0)"
      className={`font600 font20 text-white p-2 pr-3 store ${props.isSelected} 
        `}
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
    </FocusableStoreStyled>
  );
};