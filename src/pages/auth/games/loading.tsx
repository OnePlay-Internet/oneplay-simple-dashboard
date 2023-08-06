import { useEffect, useState } from "react";
import brandLogo from "../../../assets/images/oneplayLogo.svg";

export default function GameLoading(props: any) {
  const [currentTip, setCurrentTip] = useState<{ tip: string; index: number }>({
    tip: "TIP: you can connect & use your game controller.",
    index: 0,
  });
  useEffect(() => {
    const tipChangeInterval = setInterval(() => {
      setCurrentTip((prev) => {
        if (props.tips.length > prev.index + 1) {
          return { tip: props.tips[prev.index + 1], index: prev.index + 1 };
        } else {
          return { tip: props.tips[0], index: 0 };
        }
      });
    }, 5000);
    return () => {
      clearInterval(tipChangeInterval);
    };
  }, [props.tips]);
  return (
    <>
      <div className="container-fluid initializing fixed-top">
        <div className="row">
          <div className="col-12 p-0">
            <div className="card border-0">
              <img
                className="card-img img-fluid"
                style={{
                  objectFit: "cover",
                  objectPosition: "top",
                  height: "100vh",
                }}
                src={props.bg}
              />
              <div className="card-img-overlay h-100">
                <div className="cardBox p-lg-4 p-3 m-lg-5 m-md-3 m-1 fixed-bottom">
                  <div className="row m-lg-1 justify-content-center">
                    <div className="col-md-9 col-sm-9 col-12 borderright pr-md-5">
                      <p className="header text-white mb-2 mb-lg-3">Loading</p>
                      <div className="row fixedHeight">
                        <div className="col-auto align-self-center">
                          <p className="countTip mb-0">
                            {currentTip.index + 1}
                          </p>
                        </div>
                        <div className="col pl-0 align-self-center">
                          <h3 className="tipText mb-0">{currentTip.tip}</h3>
                        </div>
                      </div>
                      <div className="card outerRange border-0 mt-lg-4 mt-2">
                        <div
                          className="innerRange text-right pr-3"
                          style={{
                            width:
                              Math.min(Math.max(props.progress, 0), 100) + "%",
                          }}
                        ></div>
                        <div className="card-img-overlay text-center p-0">
                          <span className="percenterText text-white">
                            {props.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-3 col-5 text-center align-self-center">
                      <img
                        src={brandLogo}
                        className="img-fluid mt-lg-3 mt-2 mb-0"
                        alt="logo"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}