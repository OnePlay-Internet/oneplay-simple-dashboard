import React, { useContext, useEffect, useState } from "react";
import { PairingCertContext, VideoElementContext } from "src/App";
import { runningOnChrome } from "./utils.moonlight";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NvHTTP } from "./NvHTTP.moonlight";
import { MOONLIGHT_UID } from "src/common/constants";

function GamePlay() {
  const [searchParams] = useSearchParams();
  const videoElement = useContext(VideoElementContext);
  const pairingCert = useContext(PairingCertContext);
  const navigate = useNavigate();
  const [nvHttp, setNvHttp] = useState<NvHTTP | null>(null);

  const initMoonlightConnection = async () => {
    const serverIp = searchParams.get("server_ip");
    const hostSessionKey = searchParams.get("host_session_key");
    const httpPort = searchParams.get("http_port");
    const httpsPort = searchParams.get("http_port");
    const rtspPort = searchParams.get("rtsp_port");
    const controlPort = searchParams.get("control_port");
    const audioPort = searchParams.get("audio_port");
    const videoPort = searchParams.get("video_port");
    if (!serverIp || !hostSessionKey || !httpPort || !httpsPort || !rtspPort || !controlPort || !audioPort || !videoPort || nvHttp) {
      return;
    }

    const nv = new NvHTTP(serverIp, MOONLIGHT_UID, hostSessionKey, +httpPort, +httpsPort, +rtspPort, +controlPort, +audioPort, +videoPort);
    const hasServerInfo = await nv.refreshServerInfo();
    if (!hasServerInfo) {
      return;
    }
    await nv.setPairKey();
    const paired = await nv.pairServer();
    console.log("server paired : ", paired);
    if (paired) {
      await nv.getAppList();
    }
    setNvHttp(nv);
  };
  useEffect(() => {
    const onRemoteReturnClicked = (event: any) => {
      navigate(-1);
    };
    window.addEventListener("RemoteReturnClicked", onRemoteReturnClicked);
    return () => {
      window.removeEventListener("RemoteReturnClicked", onRemoteReturnClicked);
    };
  }, []);
  useEffect(() => {
    initMoonlightConnection();
  }, []);

  const makeVideoElementFullScreen = () => {
    const selectedRes = searchParams.get("resolution");
    if (!videoElement || !selectedRes) {
      return;
    }
    var streamWidth = +selectedRes.split("x")[0]; //$("#selectResolution").data("value").split(":")[0];
    var streamHeight = +selectedRes.split("x")[1]; //$("#selectResolution").data("value").split(":")[1];
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;

    var xRatio = screenWidth / streamWidth;
    var yRatio = screenHeight / streamHeight;

    var zoom = Math.min(xRatio, yRatio);

    //var module = $("#nacl_module")[0];

    videoElement.width = zoom * streamWidth;
    videoElement.height = zoom * streamHeight;
    videoElement.style.paddingTop = (screenHeight - videoElement.height) / 2 + "px";
    videoElement.style.display = "block";
    videoElement.focus();
    videoElement.dispatchEvent(new Event("mousedown"));
  };

  return <div>This is game play screen. </div>;
}

export default GamePlay;
