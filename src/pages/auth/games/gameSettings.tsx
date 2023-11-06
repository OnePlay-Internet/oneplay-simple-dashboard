import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";

import { useCallback, useEffect, useRef, useState } from "react";
import iconClose from "../../../assets/images/icon-close.svg";
import { endGamePlaySettingsEvent, startGamePlaySettingsEvent } from "src/common/countly.service";
export default function GameSettingsPopup({
  focusKeyParam,
  gameSettingsValue,
  sStore,
  startGameRequest,
  close,
  gameDetails,
}: FocusabelComponentProps) {
  const { setFocus, focusKey, focusSelf } = useFocusable({
    focusable: true,
    focusKey: focusKeyParam,
    preferredChildFocusKey: "",
    isFocusBoundary: true,
  });
  const [vsyncStatus, setVsyncStatus] = useState<boolean>(gameSettingsValue.current.vSync);
  useEffect(() => {
    focusSelf();
  }, [focusSelf]);
  const onVsyncChanged = () => {
    setVsyncStatus((prev) => !prev);
  };
  const valueChanged = useRef<boolean>(false);
  const [resolution, setResolution] = useState<string>(gameSettingsValue.current.resolution);
  const [FPS, setFPS] = useState<string>(gameSettingsValue.current.fps + " FPS");
  const [bitRate, setBitRate] = useState<number>(gameSettingsValue.current.bitRate);
  const onLaunchGameClicked = useCallback(() => {
    endGamePlaySettingsEvent(
      gameDetails,
      sStore,
      valueChanged.current,
      gameSettingsValue.current.resolution,
      gameSettingsValue.current.fps + "fps",
      gameSettingsValue.current.vSync,
      gameSettingsValue.current.bitRate
    );
    startGameRequest();
  }, []);
  useEffect(() => {
    if (gameSettingsValue.current.resolution !== resolution) {
      valueChanged.current = true;
    }

    gameSettingsValue.current.resolution = resolution;

    setBitRate((prev) => {
      const nB = getIdleBitrate(gameSettingsValue.current.resolution, gameSettingsValue.current.fps);
      if (nB !== prev) {
        valueChanged.current = true;
      }
      return nB;
    });
  }, [gameSettingsValue, resolution]);
  useEffect(() => {
    if (gameSettingsValue.current.vSync !== vsyncStatus) {
      valueChanged.current = true;
    }
    gameSettingsValue.current.vSync = vsyncStatus;
  }, [gameSettingsValue, vsyncStatus]);
  useEffect(() => {
    if (gameSettingsValue.current.fps !== +FPS.split(" ")[0]) {
      valueChanged.current = true;
    }
    gameSettingsValue.current.fps = +FPS.split(" ")[0];

    setBitRate((prev) => {
      const nB = getIdleBitrate(gameSettingsValue.current.resolution, +FPS.split(" ")[0]);
      if (nB !== prev) {
        valueChanged.current = true;
      }
      return nB;
    });
  }, [gameSettingsValue, FPS]);
  useEffect(() => {
    gameSettingsValue.current.bitRate = bitRate;
  }, [gameSettingsValue, bitRate]);
  const getIdleBitrate = (inputRes: string, inputFPS: number) => {
    const b = {
      "1280x720": 10000,
      "1920x1080": 20000,
      "2560x1440": 40000,
      "3840x2160": 50000,
    };
    //@ts-ignore
    const bitrate: number = b[inputRes];
    const res = bitrate * (inputFPS / 60);
    return res > 50000 ? 50 : res / 1000;
  };
  useEffect(() => {
    console.log("Bitrate : ", bitRate);
  }, [bitRate]);

  useEffect(() => {
    startGamePlaySettingsEvent();
    return () => {};
  }, []);

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        className="modal fade show"
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
        style={{ display: "block", opacity: 1, backgroundColor: "#00000099" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ backgroundColor: "#212123" }}>
            <div className="modal-body text-center p-4">
              <FocusableButton focusKeyParam="btn-close-faqs" onClick={close} className="setting-popup-close">
                <img src={iconClose} className="img-fluid" alt="" />
              </FocusableButton>
              <p className="font500 text-white mt-1" style={{ fontSize: "20px" }}>
                Select your game settings
              </p>
              <div className="warningWrapper border-0 p-2 text-center">
                <p className="mb-0 font500 font14responsive">To play this game, you must own it on {sStore}</p>
              </div>

              <label htmlFor="resolution" className="font18 font500 lightGrayColor offWhiteText mt-4" style={{ float: "left" }}>
                Resolution
              </label>
              <FocusableSelect
                focusKeyParam="select-resolution"
                id="resolution"
                className="font18 inputBorder font500 offWhiteText fullWidth mt-2"
                optionValues={["1280x720", "1920x1080", "2560x1440", "3840x2160"]}
                defaultValue={resolution}
                setValue={setResolution}
                set
              ></FocusableSelect>
              <div className="row mt-4">
                <div className="col-md-6">
                  <FocusableCard focusKeyParam="card-user-privacy" onClick={onVsyncChanged} className="inputBorder">
                    <div className="offWhiteText" style={{ textAlign: "left" }}>
                      <label className="font18" style={{ float: "left" }}>
                        Vsync
                      </label>
                      <div className="form-check form-switch" style={{ float: "right" }}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          checked={vsyncStatus}
                          onChange={(e) => {
                            console.log("checked : ", e.target.checked);
                          }}
                        />
                      </div>
                    </div>
                  </FocusableCard>
                </div>
                <div className="col-md-6">
                  <FocusableSelect
                    focusKeyParam="select-fps"
                    id="fps"
                    className="font18 inputBorder font500 offWhiteText fullWidth "
                    optionValues={["30 FPS", "60 FPS", "90 FPS", "120 FPS"]}
                    defaultValue={FPS}
                    setValue={setFPS}
                  ></FocusableSelect>
                </div>
              </div>
              <FocusableSlider
                focusKeyParam="slider-bit-rate"
                min="5"
                max="50"
                step="5"
                setValue={setBitRate}
                className="rangeSlider"
                value={bitRate}
              />
              <div className="mt-4">
                <FocusableButton
                  focusKeyParam="game-settings-launch-game-button"
                  onClick={onLaunchGameClicked}
                  className="btn gradientBtn btn-lg border-0 fullWidth"
                >
                  Launch game
                </FocusableButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
}
const FocusableSlider = (props: any) => {
  /* useEffect(() => {
    props.setValue(sliderValue);
  }, [sliderValue, props]); */
  const { ref, focused } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {},
    onArrowPress: (direction, keyProps, details) => {
      switch (direction) {
        case "right":
          {
            const newBitrate = props.value < Number(props.max) ? props.value + 5 : props.value;

            props.setValue(newBitrate);
          }
          return false;
        case "left":
          {
            const newBitrate = props.value > Number(props.min) ? props.value - 5 : props.value;

            props.setValue(newBitrate);
          }
          return false;
        default:
          return true;
      }
    },
  });
  return (
    <div className="rangeSlidecontainer mt-4" ref={ref}>
      <div className="col-md-12 offWhiteText font18" style={{ textAlign: "left" }}>
        Bitrate ({props.value} MBPS)
      </div>
      <div className="col-md-12 mt-3">
        <input
          value={props.value}
          className={props.className + (focused ? " focusedSliderThumb" : "")}
          type="range"
          min={props.min}
          max={props.max}
          step={props.step}
          onChange={(e) => {
            props.setValue(+e.target.value);
          }}
        />
      </div>
    </div>
  );
};

const FocusableButton = (props: any) => {
  const { ref, focused } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {
      props.onClick();
    },
    /*  onArrowPress: (direction, keyProps, details) => {
      return false;
    }, */
  });
  return (
    <button ref={ref} className={props.className + (focused ? " focusedElement" : "")} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

const FocusableCard = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {},
    onEnterPress: () => {
      props.onClick();
    },
  });
  return (
    <div
      className={props.className + (focused ? " focusedElement" : "")}
      style={{ padding: "12px 20px" }}
      ref={ref}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
};

const FocusableSelect = (props: any) => {
  const [selectedOption, setSelectedOption] = useState<number>(props.optionValues.findIndex((v: string) => v === props.defaultValue));
  const [isActive, setIsActive] = useState(false);
  // useEffect(() => {
  //   props.setValue(props.optionValues[selectedOption]);
  // }, [selectedOption, props]);
  const { ref, focused } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {
      if (!isActive) {
        setIsActive(true);
      } else {
        props.setValue(props.optionValues[selectedOption]);
        ref.current.value = props.optionValues[selectedOption];
        setIsActive(false);
      }
    },
    onBlur: () => {
      setIsActive(false);
    },

    onArrowPress: (direction, keyProps, details) => {
      switch (direction) {
        case "up":
          if (!isActive || selectedOption <= 0) {
            return true;
          }
          setSelectedOption((prev) => prev - 1);
          return false;

        case "down":
          if (!isActive || selectedOption >= props.optionValues.length - 1) {
            return true;
          }
          setSelectedOption((prev) => prev + 1);
          return false;

        default:
          return true;
      }
    },
  });
  return (
    <div style={{ position: "relative" }}>
      <select ref={ref} className={props.className + (focused ? " focusedElement" : "")} defaultValue={props.optionValues[selectedOption]}>
        {props.optionValues.map((value: string, index: number) => {
          return (
            <option value={value} key={value}>
              {value}
            </option>
          );
        })}
      </select>
      <div className="fake-select-options" style={{ color: "white", display: isActive ? "block" : "none" }}>
        <ul>
          {props.optionValues.map((value: string, index: number) => {
            return (
              <li key={`li-${value}`} className={"font18 " + (index === selectedOption ? "is-selected" : "")}>
                {value}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
