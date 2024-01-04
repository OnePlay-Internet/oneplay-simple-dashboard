import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import "./heartbeat.css";
import { HEART_BEAT_API } from "src/common/constants";
import { NvHTTP } from "../NvHTTP.moonlight";
import ErrorPopUp from "src/pages/error";

type HeartBeatStatistics = {
  user_id: string;
  token: string;
  device: {
    vendor: string;
    os: string;
    client_version: string;
    client_type: string;
  };
  game_id: string;
  vm_ip: string;
  last_input_received_at: number;
  cpu: {
    vendor: string;
    usage: number;
  };
  ram: {
    total: 0;
    available: 0;
  };
  network: {
    connection_type: string;
    bitrate: string;
  };
  stats: {
    resolution: string;
    total_fps: number;
    decoder: string;
    total_received_fps: number;
    total_render_fps: number;
    received_fps: number;
    rendered_fps: number;
    net_drops: number;
    net_latency: number;
    variance: number;
    total_decode_time: number;
    decode_time: number;
    timeStamp: number;
  };
};
type HeartBeatRO = {
  code: number;
  data: {
    acknowledged: boolean;
    alert_duration: number | null;
    alert_image: string | null;
    alert_message: string | null;
    do_terminate: boolean;
    time_remaining: number;
  };
  msg: string;
  status: "success" | "failed";
};
const transitionStyles = {
  leftRemoved: { transform: "translateX(-110%)" },
  rightRemoved: { transform: "translateX(110%)" },
  entered: { transform: "translateX(0%)" },
};
const HeartBeatAPI = (props: {
  bitrate: string;
  resolution: string;
  nvHttp: NvHTTP;
  gameFps: string;
  userId: string;
  serverIp: string;
  gameId: string;
  clientToken: string;
  goBackToGameDetails: Function;
}) => {
  const [remainTimeTextState, setRemainTimeTextState] = useState<"entered" | "rightRemoved">("entered");
  const heartBeatStatistics = useRef<HeartBeatStatistics | null>(null);
  const lastInputReceivedAt = useRef(0);
  const [heartBeatResponse, setHeartBeatResponse] = useState<HeartBeatRO | null>(null);
  const [streamTimeAlertMessage, setStreamTimeAlertMessage] = useState<{
    message: string;
    status: "entered" | "leftRemoved";
  }>({ message: "", status: "leftRemoved" });
  // const [remainingTimerState, setRemainingTimerState] = useState<
  //     "rightRemoved" | "entered"
  // >("rightRemoved");
  const [showRemainTimer, setShowRemainTimer] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(300);
  const [cpuLoad, setCpuLoad] = useState<number>(0);
  const [popUp, setPopUp] = useState<ErrorPopupPorps>({
    show: false,
    message: "",
    title: "",
    returnFocusTo: "",
    buttons: [],
    focusKeyParam: "modal-popup",
    icon: "",
  });
  useEffect(() => {
    let remainingTimerInterval: NodeJS.Timer | null = setInterval(() => {
      if (remainingTime > 0) {
        setRemainingTime((prev) => {
          return prev - 1;
        });
      }
    }, 1000);
    let heartBeatInterval: NodeJS.Timer | null = setInterval(async () => {
      if (heartBeatStatistics.current && heartBeatStatistics.current.vm_ip) {
        const statsResponse = await props.nvHttp.getStats();
        if (!statsResponse) {
          return;
        }
        const now = Date.now();
        const diffSec = (now - heartBeatStatistics.current.stats.timeStamp) / 1000;
        heartBeatStatistics.current = {
          ...heartBeatStatistics.current,
          cpu: {
            ...heartBeatStatistics.current.cpu,
            usage: cpuLoad,
          },
          ram: {
            //@ts-ignore
            total: parseInt(tizen.systeminfo.getTotalMemory() / (1024 * 1024)),
            //@ts-ignore
            available: parseInt(tizen.systeminfo.getAvailableMemory() / (1024 * 1024)),
          },
          stats: {
            ...heartBeatStatistics.current,
            decoder: statsResponse.decoder,
            total_received_fps: parseInt(statsResponse.received_fps),
            total_render_fps: parseInt(statsResponse.rendered_fps),
            total_decode_time: parseInt(statsResponse.decode_time),
            received_fps: parseInt(
              ((parseInt(statsResponse.received_fps) - heartBeatStatistics.current.stats.total_received_fps) / diffSec).toFixed(4)
            ),
            rendered_fps: parseInt(
              ((parseInt(statsResponse.rendered_fps) - heartBeatStatistics.current.stats.total_render_fps) / diffSec).toFixed(4)
            ),
            decode_time: Number((parseInt(statsResponse.decode_time) - heartBeatStatistics.current.stats.total_decode_time).toFixed(4)),
            net_drops: Number(parseFloat(statsResponse.net_drops).toFixed(4)),
            timeStamp: now,
            resolution: props.resolution,
            total_fps: parseInt(props.gameFps),
            net_latency: parseFloat(statsResponse.net_latency),
            variance: parseFloat(statsResponse.variance),
          },
        };

        const sendData = { ...heartBeatStatistics.current };
        //  if (Date.now() - sendData.stats.timeStamp >= 10 * 1000) {
        //                 //when theres no update since last heart beat signal
        //             }
        //@ts-ignore
        sendData.last_input_received_at = lastInputReceivedAt.current;
        // sendData.network.bitrate = props.bitrate.toString();
        //@ts-ignore
        delete sendData.stats.total_decode_time;
        //@ts-ignore
        delete sendData.stats.timeStamp;
        //@ts-ignore
        delete sendData.stats.total_received_fps;
        //@ts-ignore
        delete sendData.stats.total_render_fps;

        axios
          .post(HEART_BEAT_API, sendData)
          .then((response) => response.data)
          .then((data: HeartBeatRO) => {
            setHeartBeatResponse((prev) => {
              setRemainingTime(data.data.time_remaining);
              if (data.data.do_terminate) {
                console.log("do terminate : ********");
                if (heartBeatInterval) {
                  clearInterval(heartBeatInterval);
                  heartBeatInterval = null;
                }
                if (remainingTimerInterval) {
                  clearInterval(remainingTimerInterval);
                  remainingTimerInterval = null;
                }
                setShowRemainTimer(false);
                setRemainTimeTextState("rightRemoved");
                showTerminateAlert(data.data.alert_message ?? "You are out of tokens. Please recharge to continue.");
                return prev;
              }
              if (!prev) {
                //show remain time for 5 seconds when game session starts
                setRemainTimeTextState("entered");
                //hide remain time text after 5 secs
                if (data.data.time_remaining > 5 * 60) {
                  setTimeout(() => {
                    setRemainTimeTextState("rightRemoved");
                  }, 5 * 1000);
                }
              }
              if (data.data.alert_message) {
                dispatchEscapeKeyEvent();
                //  Swal.fire({
                //   icon: "warning",
                //   title: "Attention!",
                //   text: data.data.alert_message + "Click on Top-up to buy a streaming plan.",
                //   showCloseButton: true,
                //   showCancelButton: true,
                //   confirmButtonText: "Top-Up",
                //   cancelButtonText: "Ignore",
                // }).then((result) => {
                //   if (result.isConfirmed) {
                //     window.open("https://www.oneplay.in/subscription.html", "_blank");
                //   }
                // });
              }

              if (data.data.time_remaining > 5 * 60) {
                setShowRemainTimer(false);
                if (prev) {
                  setRemainTimeTextState("rightRemoved");
                }
              } else if (data.data.time_remaining <= 5 * 60) {
                //display alert when remain time is less than 5 mins
                if (!showRemainTimer) {
                  setShowRemainTimer(true);
                  setRemainTimeTextState("entered");
                }
              }
              //show alert message for low remain time
              if (
                prev &&
                ((prev.data.time_remaining >= 600 && data.data.time_remaining <= 600) ||
                  (prev.data.time_remaining >= 1200 && data.data.time_remaining <= 1200) ||
                  (prev.data.time_remaining >= 1800 && data.data.time_remaining <= 1800))
              ) {
                setStreamTimeAlertMessage({
                  message: `You have ${
                    data.data.time_remaining > 1200 ? "30" : data.data.time_remaining > 600 ? "20" : "10"
                  } minutes of gameplay remaining in your streaming plan.`,
                  status: "entered",
                });
                //hide low remain time after 10 secs
                setTimeout(() => {
                  setStreamTimeAlertMessage((prev) => {
                    return {
                      ...prev,
                      status: "leftRemoved",
                    };
                  });
                }, 10 * 1000);
              }
              return data;
            });
          })
          .catch((error) => {
            if (error.response) {
              const data: HeartBeatRO = error.response.data;
              if (data?.code === 401) {
                console.log("heartBeatInterval : ", heartBeatInterval);
                console.log("remainingTimerInterval : ", remainingTimerInterval);
                if (heartBeatInterval) {
                  clearInterval(heartBeatInterval);
                  heartBeatInterval = null;
                }
                if (remainingTimerInterval) {
                  clearInterval(remainingTimerInterval);
                  remainingTimerInterval = null;
                }
                setShowRemainTimer(false);
                setRemainTimeTextState("rightRemoved");
                showTerminateAlert(data?.data?.alert_message ?? "You are out of tokens. Please recharge to continue.");
              }
            }
          });
      }
    }, 10 * 1000);

    heartBeatStatistics.current = {
      user_id: props.userId,
      token: props.clientToken,
      device: {
        //@ts-ignore
        vendor: "SAMSUNG_" + tizen.systeminfo.getCapability("http://tizen.org/system/model_name"),
        //@ts-ignore
        os: tizen.systeminfo.getCapability("http://tizen.org/feature/platform.version"),
        client_version: "1.0.5",
        //@ts-ignore
        client_type: tizen.systeminfo.getCapability("http://tizen.org/system/platform.name"),
      },
      game_id: props.gameId,
      vm_ip: props.serverIp,
      last_input_received_at: 0,
      ram: {
        //@ts-ignore
        total: parseInt(tizen.systeminfo.getTotalMemory() / (1024 * 1024)),
        //@ts-ignore
        available: parseInt(tizen.systeminfo.getAvailableMemory() / (1024 * 1024)),
      },
      cpu: {
        //@ts-ignore
        vendor: tizen.systeminfo.getCapability("http://tizen.org/system/platform.processor"),
        usage: cpuLoad,
      },
      network: {
        connection_type: "UNKNOWN",
        bitrate: props.bitrate,
      },
      stats: {
        resolution: props.resolution,
        total_fps: parseInt(props.gameFps),
        decoder: "",
        received_fps: 0,
        rendered_fps: 0,
        net_drops: 0,
        net_latency: 0,
        variance: 0,
        decode_time: 0,
        timeStamp: Date.now(),
        total_decode_time: 0,
        total_received_fps: 0,
        total_render_fps: 0,
      },
    };

    //@ts-ignore
    const cpuChangeListener = tizen.systeminfo.addPropertyValueChangeListener("CPU", onCPULoadChange);
    return () => {
      if (heartBeatInterval) {
        clearInterval(heartBeatInterval);
      }
      if (remainingTimerInterval) {
        clearInterval(remainingTimerInterval);
      }
      if (cpuChangeListener) {
        //@ts-ignore
        tizen.systeminfo.removePropertyValueChangeListener(cpuChangeListener);
      }
    };
  }, []);
  const onCPULoadChange = (usage: number) => {
    setCpuLoad(Number((usage * 100).toPrecision(2)));
  };
  /*  useEffect(() => {
    if (props.client) {
      const remoteClient: RemoteDesktopClient = props.client;
      remoteClient.HandleLastInputTime = () => {
        lastInputReceivedAt.current = Date.now();
      };
      remoteClient.HandleMetricRaw = async (data: NetworkMetrics | VideoMetrics | AudioMetrics) => {
        switch (data.type) {
          case "video":
            const now = Date.now();
            const diffSec = (now - heartBeatStatistics.current.stats.timeStamp) / 1000;
            heartBeatStatistics.current = {
              ...heartBeatStatistics.current,
              stats: {
                ...heartBeatStatistics.current,
                decoder: data.decoderImplementation ?? streamCodec.current,
                total_received_fps: data.framesReceived,
                total_render_fps: data.framesDecoded,
                total_decode_time: data.totalDecodeTime,
                received_fps: parseInt(((data.framesReceived - heartBeatStatistics.current.stats.total_received_fps) / diffSec).toFixed(4)),
                rendered_fps: parseInt(((data.framesDecoded - heartBeatStatistics.current.stats.total_render_fps) / diffSec).toFixed(4)),
                decode_time: Number((data.totalDecodeTime - heartBeatStatistics.current.stats.total_decode_time).toFixed(4)),
                net_drops: Number(data.packetsLost.toFixed(4)),
                timeStamp: now,
              },
            };

            break;
          case "network":
            heartBeatStatistics.current = {
              ...heartBeatStatistics.current,
              vm_ip: heartBeatStatistics.current?.vm_ip ? heartBeatStatistics.current.vm_ip : data.remoteIP,
              stats: {
                ...heartBeatStatistics.current?.stats,
                net_latency: Number(data.currentRoundTripTime.toFixed(4)),
              },
            };

            break;
          default:
            break;
        }
      };
      const uaData = new UAParser();
      heartBeatStatistics.current = {
        user_id: props.userId,
        token: searchParams.get("client_token") ?? "",
        device: {
          vendor: uaData.getBrowser().name + " " + uaData.getBrowser().version,
          os: uaData.getOS().name + " " + uaData.getOS().version,
          client_version: version,
          client_type: name,
        },
        game_id: searchParams.get("game_id") ?? "",
        vm_ip: "",
        last_input_received_at: 0,
        ram: {
          total: 0,
          available: 0,
        },
        cpu: {
          vendor: uaData.getCPU().architecture,
          usage: 0,
        },
        network: {
          connection_type: navigator["connection"]?.effectiveType ?? "Unknown",
          bitrate: props.bitrate.toString(),
        },
        stats: {
          resolution: searchParams.get("resolution") ?? "",
          total_fps: parseInt(searchParams.get("fps") ?? "0"),
          decoder: "",
          received_fps: 0,
          rendered_fps: 0,
          total_received_fps: 0,
          total_render_fps: 0,
          net_drops: 0,
          net_latency: 0,
          variance: 0,
          total_decode_time: 0,
          decode_time: 0,
          timeStamp: Date.now(),
        },
      };
    }
  }, [props.client]); */

  const hidePopup = useCallback(() => {
    setPopUp((prev) => {
      if (prev.returnFocusTo) {
        //setFocus(prev.returnFocusTo);
      }
      return { show: false, message: "", title: "", returnFocusTo: "", buttons: [], focusKeyParam: "modal-popup", icon: "" };
    });
  }, []);

  const showTerminateAlert = (message: string) => {
    setPopUp({
      show: true,
      message: message,
      title: "Error!",
      returnFocusTo: "",
      buttons: [
        {
          text: "Ok",
          className: "btn gradientBtn btn-lg border-0",
          focusKey: "btn-ok-popup",
          onClick: props.goBackToGameDetails,
        },
      ],
      focusKeyParam: "modal-popup",
      icon: "error",
    });
  };
  const formatRemainTokens = (tokens: number) => {
    let str = "";
    const hr = Math.floor(tokens / 3600);
    const min = Math.floor((tokens % 3600) / 60);
    if (hr > 0) {
      str = str + String(hr).padStart(2, "0") + " Hrs ";
      str = str + String(min).padStart(2, "0") + " Mins";
    } else {
      str = str + String(min).padStart(2, "0") + " Mins ";
      const sec = Math.round(tokens % 60);
      str = str + String(sec).padStart(2, "0") + " Secs";
    }
    return str.trim();
  };
  //dispatch escape key event to pause the game
  const dispatchEscapeKeyEvent = () => {
    const event = new KeyboardEvent("keydown", {
      key: "Escape",
    });
    document.dispatchEvent(event);
  };
  useEffect(() => {
    if (showRemainTimer) {
      dispatchEscapeKeyEvent();
    }
  }, [showRemainTimer]);

  return (
    <div id="heart-beat-wrapper">
      {heartBeatResponse && (
        <div
          id="remain-time-wrapper"
          className="overlay-card heart-beat-popup"
          style={{
            ...transitionStyles[remainTimeTextState],
          }}
        >
          <p className="heart-beat-message-wrapper">
            Play Time Remaining <br />
            {formatRemainTokens(remainingTime)}
          </p>
          {showRemainTimer && (
            <>
              <br />
              <p>
                <span>Visit : </span> Oneplay.in/subscription
              </p>
            </>
          )}
        </div>
      )}

      {streamTimeAlertMessage.message && (
        <div
          id="in-stream-message"
          className="overlay-card heart-beat-popup"
          style={{
            ...transitionStyles[streamTimeAlertMessage.status],
          }}
        >
          <p className="heart-beat-message-wrapper">{streamTimeAlertMessage.message}</p>
          <br />
          <p>
            <span>Visit : </span> Oneplay.in/subscription
          </p>
        </div>
      )}

      {popUp.show && <ErrorPopUp {...popUp} />}
    </div>
  );
};

export default HeartBeatAPI;
