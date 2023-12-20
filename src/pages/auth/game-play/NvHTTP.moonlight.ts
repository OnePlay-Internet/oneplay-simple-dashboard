import { sendMessageToWASM } from "./messages.moonlight";
import { generateRemoteInputKey, generateRemoteInputKeyId, getConnectedGamepadMask } from "./utils.moonlight";
export type StreamStatsResponse = {
  decoder: string;
  received_fps: string;
  rendered_fps: string;
  net_drops: string;
  net_latency: string;
  variance: string;
  decode_time: string;
};

export class NvHTTP {
  private readonly serverIp: string = "";
  private readonly clientId: string = "";
  private readonly sessionKey: string = "";
  private readonly httpPort: number = -1;
  private readonly httpsPort: number = -1;
  private readonly rtspPort: number = -1;
  private readonly controlPort: number = -1;
  private readonly audioPort: number = -1;
  private readonly videoPort: number = -1;
  private pairKey: string = "";
  private serverUID: string = "";
  private paired: boolean = false;
  private currentGame: number = -1;
  private appVersion: string = "";
  private serverMajorVersion: number = -1;
  private hostname: string = "";
  private externalIp: string = "";
  private gfeVersion: string = "";
  private gputype: string = "";
  private numofapps: string = "";
  private supportedDisplayModes: { [key: string]: number[] } = {};
  public appList: { title: string; id: number }[] = [];
  constructor(
    serverIp: string,
    uniqueId: string,
    hostSessionKey: string,
    httpPort: number,
    httpsPort: number,
    rtspPort: number,
    controlPort: number,
    audioPort: number,
    videoPort: number
  ) {
    this.serverIp = serverIp;
    this.clientId = uniqueId;
    this.sessionKey = hostSessionKey;
    this.httpPort = httpPort;
    this.httpsPort = httpsPort;
    this.rtspPort = rtspPort;
    this.controlPort = controlPort;
    this.audioPort = audioPort;
    this.videoPort = videoPort;
  }
  public hasPairKey() {
    return !!this.pairKey;
  }

  public setPairKey = async () => {
    const ppkstr = await sendMessageToWASM("pair", [
      this.serverMajorVersion.toString(),
      this.serverIp,
      this.httpPort.toString(),
      this.sessionKey,
    ]);
    console.log("ppkstr : ", ppkstr);
    if (ppkstr && typeof ppkstr === "string") {
      console.log("set pair key successfully.");
      this.pairKey = ppkstr;
    }
  };

  public pairServer = async (): Promise<boolean> => {
    await this.refreshServerInfo();
    if (this.paired || this.pairKey) {
      return true;
    }
    try {
      await this.setPairKey();
      const pairResponse = await sendMessageToWASM("openUrl", [
        this.getServerAddress(true) + "/pair?uniqueid=" + this.clientId + "&devicename=roth&updateState=1&phrase=pairchallenge",
        this.pairKey,
        false,
      ]);
      console.log("pair response : ", pairResponse);
      if (pairResponse && typeof pairResponse === "string") {
        return this.parseXMLPairedResponse(pairResponse);
      }
      return false;
    } catch (error) {
      console.error("pairServer error : ", error);
      return false;
    }
  };
  /* public resumeApp = async (rikey: string, rikeyid: number, surroundAudioInfo: number) => {
    return await sendMessageToWASM("openUrl", [
      this.getServerAddress(true) +
        "/resume?" +
        this.buildUidStr() +
        "&rikey=" +
        rikey +
        "&rikeyid=" +
        rikeyid +
        "&surroundAudioInfo=" +
        surroundAudioInfo,
      this.pairKey,
      false,
    ]);
  }; */
  public launchApp = async (
    appId: number,
    mode: string,
    sops: number,
    rikey: string,
    rikeyid: number,
    localAudio: number,
    surroundAudioInfo: number,
    gamepadMask: number
  ) => {
    return await sendMessageToWASM("openUrl", [
      this.getServerAddress(true) +
        "/launch?" +
        this.buildUidStr() +
        "&appid=" +
        appId +
        "&mode=" +
        mode +
        "&additionalStates=1&sops=" +
        sops +
        "&rikey=" +
        rikey +
        "&rikeyid=" +
        rikeyid +
        "&localAudioPlayMode=" +
        localAudio +
        "&surroundAudioInfo=" +
        surroundAudioInfo +
        "&remoteControllersBitmap=" +
        gamepadMask +
        "&gcmap=" +
        gamepadMask,
      this.pairKey,
      false,
    ]);
  };
  public startGame = async (
    app: { title: string; id: number },
    frameRate: string,
    streamWidth: string,
    streamHeight: string,
    bitrate: string
  ) => {
    if (!this.pairKey || !this.paired) {
      console.error("host is not paired");
      return;
    }
    var rikey = generateRemoteInputKey();
    var rikeyid = generateRemoteInputKeyId();
    /*  if (this.currentGame === app.id) {
      // if user wants to launch the already-running app, then we resume it.
      const resumeResponse = await this.resumeApp(
        rikey,
        rikeyid,
        0x030002 // Surround channel mask << 16 | Surround channel count
      );
      if (resumeResponse && typeof resumeResponse === "string" && this.checkXMLResponse(resumeResponse)) {
        await this.startRequest(frameRate, streamWidth, streamHeight, bitrate, rikey, rikeyid);
      } else {
        console.error("Failed to resume the app! Returned error was" + resumeResponse);
      }
      return;
    } */
    var remote_audio_enabled = 1; // Play audio locally too?
    var gamepadMask = getConnectedGamepadMask();
    const launchAppRespone = await this.launchApp(
      app.id,
      streamWidth + "x" + streamHeight + "x" + frameRate,
      1, // DON'T Allow GFE (0) to optimize game settings, or ALLOW (1) to optimize game settings
      rikey,
      rikeyid,
      remote_audio_enabled,
      0x030002, // Surround channel mask << 16 | Surround channel count
      gamepadMask
    );
    if (launchAppRespone && typeof launchAppRespone === "string" && this.checkXMLResponse(launchAppRespone)) {
      await this.startRequest(frameRate, streamWidth, streamHeight, bitrate, rikey, rikeyid);
    } else {
      console.error("Failed to launch app width id: " + app.id + "\nReturned error was: " + launchAppRespone);
    }
  };

  private startRequest = async (
    frameRate: string,
    streamWidth: string,
    streamHeight: string,
    bitrate: string,
    rikey: string,
    rikeyid: number
  ) => {
    console.log("inside..startRequest");
    const framePacingEnabled = 1;
    const audioSyncEnabled = 1;
    await sendMessageToWASM("startRequest", [
      this.serverIp,
      String(this.httpsPort),
      streamWidth,
      streamHeight,
      frameRate,
      bitrate,
      rikey,
      String(rikeyid),
      String(this.appVersion),
      "",
      framePacingEnabled,
      audioSyncEnabled,
      `rtsp://${this.serverIp}:${this.rtspPort}`,
      String(this.controlPort),
      String(this.audioPort),
      String(this.videoPort),
    ]);
  };

  private checkXMLResponse = (xmlString: string) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, "text/xml");

    const root = xml.querySelector("root");
    if (!root) {
      return false;
    }
    const statusCode = root.getAttribute("status_code");
    console.log("parseXMLAppList status code : ", statusCode);
    if (!statusCode || +statusCode !== 200) {
      return false;
    }
    return true;
  };
  public getAppList = async () => {
    const appListResponse = await sendMessageToWASM("openUrl", [
      this.getServerAddress(true) + "/applist?" + this.buildUidStr(),
      this.pairKey,
      false,
    ]);
    if (appListResponse && typeof appListResponse === "string") {
      this.parseXMLAppList(appListResponse);
    }
    return this.appList.length > 0;
  };
  public getStats = async (): Promise<StreamStatsResponse | null> => {
    try {
      const statResponse = await sendMessageToWASM("streamStats", []);
      if (statResponse) {
        return statResponse as StreamStatsResponse;
      }
    } catch (error) {
      console.error("Error while getStats : ", error);
    }
    return null;
  };
  private parseXMLAppList(xmlString: string) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, "text/xml");

    const root = xml.querySelector("root");
    if (!root) {
      return false;
    }
    const statusCode = root.getAttribute("status_code");
    console.log("parseXMLAppList status code : ", statusCode);
    if (!statusCode || +statusCode !== 200) {
      return;
    }

    const appElements = root.getElementsByTagName("App");
    this.appList.length = 0;

    for (var i = 0, len = appElements.length; i < len; i++) {
      this.appList.push({
        title: appElements[i].getElementsByTagName("AppTitle")[0].innerHTML.trim(),
        id: parseInt(appElements[i].getElementsByTagName("ID")[0].innerHTML.trim(), 10),
      });
    }
  }
  private parseXMLPairedResponse(xmlString: string): boolean {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, "text/xml");
    this.paired = xml.getElementsByTagName("paired")[0].innerHTML.trim() === "1" ? true : false;
    return this.paired;
  }
  public getServerInfo = async (url: string, key: string, flag: boolean): Promise<boolean> => {
    const serverInfo = await sendMessageToWASM("openUrl", [url, key, flag]);
    if (serverInfo && typeof serverInfo === "string") {
      const validServerInfo = this.parseServerInfoXML(serverInfo);
      return validServerInfo;
    }
    return false;
  };
  public refreshServerInfo = async () => {
    try {
      if (!this.pairKey) {
        console.log("refreshServerInfo : no pairKey trying http");
        const httpInfo = await this.getServerInfo(this.getServerAddress(false) + "/serverinfo?" + this.buildUidStr(), this.pairKey, false);
        return httpInfo;
      }
      console.log("refreshServerInfo: trying https");
      const httpsInfo = await this.getServerInfo(this.getServerAddress(true) + "/serverinfo?" + this.buildUidStr(), this.pairKey, false);
      if (!httpsInfo) {
        console.log("refreshServerInfo: trying http");
        const httpInfoTryAgain = await this.getServerInfo(
          this.getServerAddress(false) + "/serverinfo?" + this.buildUidStr(),
          this.pairKey,
          false
        );
        return httpInfoTryAgain;
      }
    } catch (error) {
      if (error === -100) {
        console.log("refreshServerInfo: trying http in catch");
        const httpInfo = await this.getServerInfo(this.getServerAddress(false) + "/serverinfo?" + this.buildUidStr(), this.pairKey, false);
        return httpInfo;
      } else {
        return false;
      }
    }
  };

  public sendKeyboardClickEvent = async (args: any[]) => {
    console.log("sendKeyboardClickEvent : ", args);
    try {
      await sendMessageToWASM("keyboardKeyPressed", args);
      return true;
    } catch (error) {
      console.error("keyboard click event failed : " + error);
      return false;
    }
  };
  public toggleMouseMode = async (): Promise<boolean> => {
    try {
      await sendMessageToWASM("toogleMouse", []);
      return true;
    } catch (error) {
      console.error("Toggle mouse failed : " + error);
      return false;
    }
  };
  parseServerInfoXML(responseString: string): boolean {
    const parser = new DOMParser();
    const xml = parser.parseFromString(responseString, "text/xml");

    const root = xml.querySelector("root");
    if (!root) {
      return false;
    }
    const statusCode = root.getAttribute("status_code");
    console.log("server info status code : ", statusCode);
    if (!statusCode || +statusCode !== 200) {
      return false;
    }
    const serverUniqueId = root.getElementsByTagName("uniqueid")[0].innerHTML.trim();
    if (this.serverUID && serverUniqueId !== this.serverUID) {
      console.log("invalid server UID");
      return false;
    }

    this.serverUID = serverUniqueId;
    this.paired = root.getElementsByTagName("PairStatus")[0].innerHTML.trim() === "1" ? true : false;
    this.currentGame = parseInt(root.getElementsByTagName("currentgame")[0].innerHTML.trim(), 10);
    this.appVersion = root.getElementsByTagName("appversion")[0].innerHTML.trim();
    this.serverMajorVersion = parseInt(this.appVersion.substring(0, 1), 10);
    this.hostname = root.getElementsByTagName("hostname")[0].innerHTML.trim();
    var externIP = root.getElementsByTagName("ExternalIP")[0]?.innerHTML.trim();
    if (externIP) {
      this.externalIp = externIP;
    }
    try {
      //  these aren't critical for functionality, and don't necessarily exist in older GFE versions.
      this.gfeVersion = root.getElementsByTagName("GfeVersion")[0]?.innerHTML.trim();
      this.gputype = root.getElementsByTagName("gputype")[0]?.innerHTML.trim();
      this.numofapps = root.getElementsByTagName("numofapps")[0]?.innerHTML.trim();

      const displayModeLength = root.getElementsByTagName("DisplayMode")?.length;
      // now for the hard part: parsing the supported streaming
      for (let index = 0; index < displayModeLength; index++) {
        const value = root.getElementsByTagName("DisplayMode")[index];

        // for each resolution:FPS object
        var yres = parseInt(value.getElementsByTagName("Height")[0]?.innerHTML.trim());
        var xres = parseInt(value.getElementsByTagName("Width")[0]?.innerHTML.trim());
        var fps = parseInt(value.getElementsByTagName("RefreshRate")[0]?.innerHTML.trim());
        if (!this.supportedDisplayModes[yres + ":" + xres]) {
          this.supportedDisplayModes[yres + ":" + xres] = [];
        }
        if (!this.supportedDisplayModes[yres + ":" + xres].includes(fps)) {
          this.supportedDisplayModes[yres + ":" + xres].push(fps);
        }
      }
    } catch (err) {
      // we don't need this data, so no error handling necessary
    }
    return true;
  }
  getServerAddress(https: boolean) {
    if (https) {
      return `https://${this.serverIp}:${this.httpsPort}`;
    } else {
      return `http://${this.serverIp}:${this.httpPort}`;
    }
  }
  buildUidStr() {
    return "uniqueid=" + this.clientId + "&uuid=" + this.guuid();
  }
  guuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
