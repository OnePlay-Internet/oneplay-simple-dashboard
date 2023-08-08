// Copyright (c) 2015 Samsung Electronics. All rights reserved.
//
// This file provides a set of widget variables, common functions
// and enums for usage in widgets. It provides:
// - remote controller input,
// - platform, widget and build information,
// - common platform-specific widget initialization.
//
// Sample usage:
//
// To use remote controller you need 'RemoteController' privilege.
// For more info visit www.tizen.org/tv/web_device_api/tvinputdevice
// Example of plaform.js usage for remote controller:
//
// var remoteHandler = {
//   initRemoteController: true,
//   onKeydownListener: remoteDown
// }
//
// function pingApp(e) {
//   var keyCode = e.keyCode;
//
//   switch (keyCode) {
//     case tvKey.KEY_RED:
//       pingAppByAppId('c_app');
//       break;
//
//     case tvKey.KEY_GREEN:
//       clearAppMsg('c_app_msg');
//       break;
//   }
// }
//
// function appOnLoadFn() {
//   ...
// }
//
// var handler = {
//   initFn: appOnLoadFn,
//   initRemoteController: true,
//   onKeydownListener: pingApp,
//   buttonsToRegister: [     // See buttonsNames in this file.
//     buttonsNames.KEY_RED,
//     buttonsNames.KEY_GREEN,
//   ]
// };
//
// ...
//
// <body onload="platformOnLoad(handler)">

// Names used to register buttons used by widget. Useable in buttonsToRegister
// argument of platformOnLoad.
//
// When handling button input, use values from tvKey.
var buttonsNames = {
  KEY_0: "0",
  KEY_1: "1",
  KEY_2: "2",
  KEY_3: "3",
  KEY_4: "4",
  KEY_5: "5",
  KEY_6: "6",
  KEY_7: "7",
  KEY_8: "8",
  KEY_9: "9",
  KEY_GREEN: "ColorF1Green",
  KEY_YELLOW: "ColorF2Yellow",
  KEY_BLUE: "ColorF3Blue",
  KEY_RED: "ColorF0Red",
  KEY_PLAY: "MediaPlay",
  KEY_PAUSE: "MediaPause",
  KEY_PLAYPAUSE: "MediaPlayPause",
  KEY_STOP: "MediaStop",
  KEY_VOLUME_UP: "VolumeUp",
  KEY_VOLUME_DOWN: "VolumeDown",
  KEY_VOLUME_MUTE: "VolumeMute",
  KEY_CHANNEL_UP: "ChannelUp",
  KEY_CHANNEL_DOWN: "ChannelDown",
  KEY_CHANNEL_LIST: "ChannelList",
  /*
  This keys are registered by default.
  There is no way to unregister them.
  Registration try will end with error.
  KEY_LEFT: 'ArrowLeft',
  KEY_UP: 'ArrowUp',
  KEY_RIGHT: 'ArrowRight',
  KEY_DOWN: 'ArrowDown',
  KEY_ENTER: 'Enter',
  KEY_RETURN: 'Return',
*/
};

// Dictionary containing key names for usage in input handler function. This
// variable is set by platformOnLoad.
var tvKey;
var urlParams;
var heartBeatData;
var cpuLoad = 0;
var heartBeatIntervalId = null;
function platformOnLoad(handler) {
  var tvKeyButtons = {
    KEY_0: 48,
    KEY_1: 49,
    KEY_2: 50,
    KEY_3: 51,
    KEY_4: 52,
    KEY_5: 53,
    KEY_6: 54,
    KEY_7: 55,
    KEY_8: 56,
    KEY_9: 57,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    KEY_ENTER: 13,
    KEY_REMOTE_ENTER: 32,
    KEY_RETURN: 10009,
    KEY_GREEN: 404,
    KEY_YELLOW: 405,
    KEY_BLUE: 406,
    KEY_RED: 403,
    KEY_PLAY: 415,
    KEY_PAUSE: 19,
    KEY_PLAYPAUSE: 10252,
    KEY_STOP: 413,
    KEY_VOLUME_UP: 447,
    KEY_VOLUME_DOWN: 448,
    KEY_VOLUME_MUTE: 449,
    KEY_CHANNEL_UP: 427,
    KEY_CHANNEL_DOWN: 428,
    KEY_CHANNEL_LIST: 10073,
  };
  tvKey = tvKeyButtons;

  if (!handler) return;

  if (handler.initFn) {
    handler.initFn();
  }

  /* if (handler.initRemoteController) {
    var event_anchor;
    if (handler.focusId)
      event_anchor = document.getElementById(handler.focusId);
    else
      event_anchor = document.getElementById("eventAnchor");
    if (event_anchor)
      event_anchor.focus();
  } */
  if (handler.onKeydownListener) {
    document.addEventListener("keydown", handler.onKeydownListener);
  }
  if (handler.buttonsToRegister) {
    handler.buttonsToRegister.forEach(function (button) {
      tizen.tvinputdevice.registerKey(button);
    });
  }
  urlParams = new URLSearchParams(window.location.search);
  initHeartBeatData();
}

function initHeartBeatData() {
  renderKeyboradButtons();
  heartBeatData = {
    user_id: urlParams.get("user_id").toString(),
    token: urlParams.get("client_token").toString(),
    device: {
      vendor:
        "SAMSUNG_" +
        tizen.systeminfo.getCapability("http://tizen.org/system/model_name"),
      os: tizen.systeminfo.getCapability(
        "http://tizen.org/feature/platform.version"
      ),
      client_version: "",
      client_type: tizen.systeminfo.getCapability(
        "http://tizen.org/system/platform.name"
      ),
    },
    game_id: urlParams.get("game_id").toString(),
    vm_ip: urlParams.get("server_ip").toString(),
    last_input_received_at: 0,
    ram: {
      total: parseInt(tizen.systeminfo.getTotalMemory() / (1024 * 1024)),
      available: parseInt(
        tizen.systeminfo.getAvailableMemory() / (1024 * 1024)
      ),
    },
    cpu: {
      vendor: tizen.systeminfo.getCapability(
        "http://tizen.org/system/platform.processor"
      ),
      usage: cpuLoad,
    },
    network: {
      connection_type: "UNKNOWN",
      bitrate: parseInt(urlParams.get("bitrate_kbps").toString()),
    },
    stats: {
      resolution: urlParams.get("resolution").toString(),
      total_fps: parseInt(urlParams.get("game_fps").toString()),
      decoder: "",
      received_fps: 0,
      rendered_fps: 0,
      net_drops: 0,
      net_latency: 0,
      variance: 0,
      decode_time: 0,
    },
  };
  checkNetworkConnection();
}

function onCPULoadChange(cpu) {
  cpuLoad = (cpu.load * 100).toPrecision(2);
}

tizen.systeminfo.addPropertyValueChangeListener("CPU", onCPULoadChange);

function callHeartBeatAPI() {
  sendMessage("streamStats", []).then(
    function (vidStats) {
      console.info(
        "%c[platform.js, streamStats]",
        "color: green;",
        "streamStats:",
        vidStats
      );
      heartBeatData.cpu.usage = cpuLoad;
      heartBeatData.ram.available = parseInt(
        tizen.systeminfo.getAvailableMemory() / (1024 * 1024)
      );

      //heartBeatData.last_input_received_at =   parseInt(vidStats.last_input_received_at)
      heartBeatData.stats.decoder = vidStats.decoder;
      heartBeatData.last_input_received_at = 0;
      heartBeatData.stats.received_fps = parseInt(vidStats.received_fps);
      heartBeatData.stats.rendered_fps = parseInt(vidStats.rendered_fps);
      heartBeatData.stats.net_drops = parseInt(vidStats.net_drops);
      heartBeatData.stats.net_latency = parseInt(vidStats.net_latency);
      heartBeatData.stats.variance = parseInt(vidStats.variance);
      heartBeatData.stats.decode_time = parseInt(vidStats.decode_time);
      //console.log("heart beat data :", heartBeatData);
      const statString = ` VM: ${urlParams.get("server_ip")}<br /> OS: ${
        heartBeatData.device.os
      }<br /> Network: ${
        heartBeatData.network.connection_type
      }<br /> Bit Rate: ${heartBeatData.network.bitrate}<br /> Resolution: ${
        heartBeatData.stats.resolution
      }<br /> Last Input: ${
        heartBeatData.last_input_received_at
      }<br /> Total FPS: ${
        heartBeatData.stats.total_fps
      }<br /> CPU Load: ${cpuLoad} %<br /> RAM(available/total):${
        heartBeatData.ram.available
      }/${heartBeatData.ram.total} MB<br /> Decoder: ${
        vidStats.decoder
      }<br /> Received FPS: ${
        heartBeatData.stats.received_fps
      }<br /> Rendered FPS: ${vidStats.rendered_fps}<br /> Net Drops: ${
        vidStats.net_drops
      }<br /> Net Latency : ${vidStats.net_latency}<br /> Variance: ${
        vidStats.variance
      }<br /> Decode Time: ${vidStats.decode_time}`;
      $("#heart_beat_stats").html(statString);
      $.ajax({
        // url: "https://client-apis.oneream.com/client/v2/heart_beat",
        url: "https://client-apis.oneplay.in/client/v2/heart_beat",
        type: "POST",
        data: JSON.stringify(heartBeatData),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (resp) {
          console.log("heart beat api resp : ", resp);
        },
      });
    },
    function (faildStats) {
      console.error(
        "%c[platform.js, streamStats]",
        "color: green;",
        "Failed to get streamStats: \n",
        faildStats
      );
    }
  );
}

function stopHeartBeatAPI() {
  if (heartBeatIntervalId) {
    clearInterval(heartBeatIntervalId);
    heartBeatIntervalId = null;
  }
}
function startHeartBeatAPI() {
  heartBeatIntervalId = setInterval(callHeartBeatAPI, 10 * 1000);
}

function checkNetworkConnection() {
  tizen.systeminfo.getPropertyValue(
    "WIFI_NETWORK",
    (s) => {
      if (s.status === "CONNECTED") {
        heartBeatData.network.connection_type = "WIFI";
      } else {
        tizen.systeminfo.getPropertyValue(
          "ETHERNET_NETWORK",
          (s) => {
            if (s.status === "CONNECTED") {
              heartBeatData.network.connection_type = "ETHERNET";
            } else {
              heartBeatData.network.connection_type = "UNKNOWN";
            }
          },
          (e) => {
            console.log("WIFI_NETWORK error : ", e);
          }
        );
      }
    },
    (e) => {
      console.log("WIFI_NETWORK error : ", e);
      tizen.systeminfo.getPropertyValue(
        "ETHERNET_NETWORK",
        (s) => {
          if (s.status === "CONNECTED") {
            heartBeatData.network.connection_type = "ETHERNET";
          } else {
            heartBeatData.network.connection_type = "UNKNOWN";
          }
        },
        (e) => {
          console.log("ETHERNET_NETWORK error : ", e);
        }
      );
    }
  );
}

function setGameStartedSuccessfully() {
  gameStartedSuccessfully = true;
  gameReconnectTryCount = 0;
}

function quitStreaming() {
  stopHeartBeatAPI();
  goToReact();

  /*  if (!api) {
    goToReact();
    return;
  }
  api.quitApp().then(
    function (ret2) {
      console.log(
        "%c[index.js, stopGame]",
        "color:green;",
        "quit streaming success:" + ret2
      );
      goToReact();
      return;
    },
    function (failedQuitApp) {
      console.error(
        "%c[index.js, stopGame]",
        "color:green;",
        "Failed to quit app! Returned error was:" + failedQuitApp
      );
    }
  ); */
}
function toggleMouse() {
  sendMessage("toogleMouse", []).then(
    function (ret) {
      console.log("Toogle mouse result : ", ret);
      mouseMode = !mouseMode;
      //  alert("Toogle mouse result : " + ret);
      //snackbarLog("Toogle mouse result : ", ret);
    },
    function (error) {
      console.log("Toogle mouse failed : " + error);
      //alert("Toogle mouse failed : " + error);
      //snackbarLog("Toogle mouse failed : " + error);
    }
  );
}
function goToReact() {
  window.location.replace(
    "/index.html/?redirect=/games-detail/" + urlParams.get("game_id").toString()
  );
}
var newKeyboardKeys = [
  { char: "`", shiftChar: "~", charCode: 192 },
  { char: "1", shiftChar: "!", charCode: 49 },
  { char: "2", shiftChar: "@", charCode: 50 },
  { char: "3", shiftChar: "#", charCode: 51 },
  { char: "4", shiftChar: "$", charCode: 52 },
  { char: "5", shiftChar: "%", charCode: 53 },
  { char: "6", shiftChar: "^", charCode: 54 },
  { char: "7", shiftChar: "&", charCode: 55 },
  { char: "8", shiftChar: "*", charCode: 56 },
  { char: "9", shiftChar: "(", charCode: 57 },
  { char: "0", shiftChar: ")", charCode: 48 },
  { char: "-", shiftChar: "_", charCode: 0xbd },
  { char: "=", shiftChar: "+", charCode: 0xbb },
  {
    char: "Backspace",
    shiftChar: "Backspace",
    charCode: 8,
  },
  { char: "Tab", shiftChar: "Tab", charCode: 9 },
  { char: "q", shiftChar: "Q", charCode: 81 },
  { char: "w", shiftChar: "W", charCode: 87 },
  { char: "e", shiftChar: "E", charCode: 69 },
  { char: "r", shiftChar: "R", charCode: 82 },
  { char: "t", shiftChar: "T", charCode: 84 },
  { char: "y", shiftChar: "Y", charCode: 89 },
  { char: "u", shiftChar: "U", charCode: 85 },
  { char: "i", shiftChar: "I", charCode: 73 },
  { char: "o", shiftChar: "O", charCode: 79 },
  { char: "p", shiftChar: "P", charCode: 80 },
  { char: "[", shiftChar: "{", charCode: 0xdb },
  { char: "]", shiftChar: "}", charCode: 0xdd },
  { char: "\\", shiftChar: "|", charCode: 0xdc },
  // { char: "Capslock", shiftChar: "Capslock", charCode: "20" },
  { char: "a", shiftChar: "A", charCode: 65 },
  { char: "s", shiftChar: "S", charCode: 83 },
  { char: "d", shiftChar: "D", charCode: 68 },
  { char: "f", shiftChar: "F", charCode: 70 },
  { char: "g", shiftChar: "G", charCode: 71 },
  { char: "h", shiftChar: "H", charCode: 72 },
  { char: "j", shiftChar: "J", charCode: 74 },
  { char: "k", shiftChar: "K", charCode: 75 },
  { char: "l", shiftChar: "L", charCode: 76 },
  { char: ";", shiftChar: ":", charCode: 0xba },
  { char: "'", shiftChar: '"', charCode: 222 },
  { char: "Enter", shiftChar: "Enter", charCode: 13 },
  { char: "Shift", shiftChar: "Shift", charCode: "" },
  { char: "z", shiftChar: "Z", charCode: 90 },
  { char: "x", shiftChar: "X", charCode: 88 },
  { char: "c", shiftChar: "C", charCode: 67 },
  { char: "v", shiftChar: "V", charCode: 86 },
  { char: "b", shiftChar: "B", charCode: 66 },
  { char: "n", shiftChar: "N", charCode: 78 },
  { char: "m", shiftChar: "M", charCode: 77 },
  { char: ",", shiftChar: "<", charCode: 0xbc },
  { char: ".", shiftChar: ">", charCode: 0xbe },
  { char: "/", shiftChar: "?", charCode: 0xbf },
  { char: "Space", shiftChar: "Space", charCode: 32 },
  { char: "←", shiftChar: "←", charCode: 37 },
  { char: "↑", shiftChar: "↑", charCode: 38 },
  { char: "↓", shiftChar: "↓", charCode: 40 },
  { char: "→", shiftChar: "→", charCode: 39 },
  { char: "Close Keyboard", shiftChar: "Close Keyboard", charCode: "" },
];
var mouseMode = false;
var settingsMode = false;
var settingsCurrentIndex = 0;
var keyboardMode = false;
var keyboardCurrentIndex = 0;
var capsLockOn = false;
var currentKeyboardLine = 0;
var keyboardLines = [
  { first: 0, last: 13 },
  { first: 14, last: 27 },
  { first: 28, last: 39 },
  { first: 40, last: 50 },
  { first: 51, last: 56 },
];
const MODIFIER_SHIFT = 0x01;
function virtualKeyboardButtonClick(index) {
  let pressedCharCode;
  switch (newKeyboardKeys[index].char) {
    case "Capslock":
    case "Shift":
      capsLockOn = !capsLockOn;
      renderKeyboradButtons();
      return;
    case "Close Keyboard":
      toogleKeyboardOverlay();
      return;
    default:
      pressedCharCode = newKeyboardKeys[index].charCode;
      break;
  }
  let filter = 0;
  if (capsLockOn) {
    filter |= MODIFIER_SHIFT;
  }
  sendMessage("keyboardKeyPressed", [
    pressedCharCode.toString(16),
    filter.toString(),
  ]).then(
    function (ret) {
      console.log("keyboardKeyPressed success result : ", ret);
      $("#btn-keyboard-" + keyboardCurrentIndex).focus();
    },
    function (error) {
      console.log("keyboardKeyPressed error : ", error);
      $("#btn-keyboard-" + keyboardCurrentIndex).focus();
    }
  );
}

function toogleSettings() {
  if (settingsMode) {
    //hide settings menu
    $("#settingsOverLay").hide();
    $("#nacl_module").focus();
    $("#btn-settings-" + settingsCurrentIndex).removeClass("activeOption");
    $("#btn-keyboard-" + keyboardCurrentIndex).removeClass("activeOption");
    settingsCurrentIndex = 0;
  } else {
    //show settings menu
    if (mouseMode) {
      toggleMouse();
    }
    keyboardMode = false;
    keyboardCurrentIndex = 0;
    $("#btn-keyboard-" + keyboardCurrentIndex).removeClass("activeOption");
    $("#keyboardOverlay").hide();
    settingsCurrentIndex = 1;
    $("#settingsOverLay").show();
    $("#btn-settings-1").addClass("activeOption");
    $("#btn-settings-1").focus();
  }
  settingsMode = !settingsMode;
}

function toogleStats() {
  $("#heart_beat_stats").toggle();
  toogleSettings();
}

function toogleKeyboardOverlay() {
  if (keyboardMode) {
    $("#btn-keyboard-" + keyboardCurrentIndex).removeClass("activeOption");
    $("#keyboardOverlay").hide();
    keyboardCurrentIndex = 0;
    $("#nacl_module").focus();
  } else {
    settingsMode = false;
    settingsCurrentIndex = 0;
    keyboardCurrentIndex = 0;
    $("#settingsOverLay").hide();
    $("#keyboardOverlay").show();
    $("#btn-keyboard-0").addClass("activeOption");
    $("#btn-keyboard-0").focus();
  }
  keyboardMode = !keyboardMode;
}

function settingsFocusNext() {
  $("#btn-settings-" + settingsCurrentIndex).removeClass("activeOption");
  settingsCurrentIndex++;
  if (settingsCurrentIndex > 3) {
    settingsCurrentIndex = 0;
  }
  $("#btn-settings-" + settingsCurrentIndex).addClass("activeOption");
  $("#btn-settings-" + settingsCurrentIndex).focus();
}

function settingsFocusPrevious() {
  $("#btn-settings-" + settingsCurrentIndex).removeClass("activeOption");
  settingsCurrentIndex--;
  if (settingsCurrentIndex < 0) {
    settingsCurrentIndex = 3;
  }
  $("#btn-settings-" + settingsCurrentIndex).addClass("activeOption");
  $("#btn-settings-" + settingsCurrentIndex).focus();
}

function keyboardFocusNext() {
  if (
    !(
      capsLockOn &&
      (newKeyboardKeys[keyboardCurrentIndex].char === "Shift" ||
        newKeyboardKeys[keyboardCurrentIndex].char === "Capslock")
    )
  ) {
    $("#btn-keyboard-" + keyboardCurrentIndex).removeClass("activeOption");
  }
  keyboardCurrentIndex++;
  if (keyboardCurrentIndex > newKeyboardKeys.length - 1) {
    keyboardCurrentIndex = 0;
  }
  setKeyboardCurrentLine();
  $("#btn-keyboard-" + keyboardCurrentIndex).addClass("activeOption");
  $("#btn-keyboard-" + keyboardCurrentIndex).focus();
}
function keyboardFocusPrevious() {
  if (
    !(
      capsLockOn &&
      (newKeyboardKeys[keyboardCurrentIndex].char === "Shift" ||
        newKeyboardKeys[keyboardCurrentIndex].char === "Capslock")
    )
  ) {
    $("#btn-keyboard-" + keyboardCurrentIndex).removeClass("activeOption");
  }
  keyboardCurrentIndex--;
  if (keyboardCurrentIndex < 0) {
    keyboardCurrentIndex = newKeyboardKeys.length - 1;
  }
  setKeyboardCurrentLine();
  $("#btn-keyboard-" + keyboardCurrentIndex).addClass("activeOption");
  $("#btn-keyboard-" + keyboardCurrentIndex).focus();
}
function setKeyboardCurrentLine() {
  for (const [line, index] in keyboardLines) {
    if (
      keyboardCurrentIndex >= line.first &&
      keyboardCurrentIndex <= line.last
    ) {
      currentKeyboardLine = index;
      break;
    }
  }
}
function keyboardFocusUpLine() {
  let oldpos = keyboardCurrentIndex - keyboardLines[currentKeyboardLine].first;
  currentKeyboardLine--;
  if (currentKeyboardLine < 0) {
    currentKeyboardLine = keyboardLines.length - 1;
  }
  if (
    !(
      capsLockOn &&
      (newKeyboardKeys[keyboardCurrentIndex].char === "Shift" ||
        newKeyboardKeys[keyboardCurrentIndex].char === "Capslock")
    )
  ) {
    $("#btn-keyboard-" + keyboardCurrentIndex).removeClass("activeOption");
  }
  if (
    oldpos >
    keyboardLines[currentKeyboardLine].last -
      keyboardLines[currentKeyboardLine].first
  ) {
    oldpos =
      keyboardLines[currentKeyboardLine].last -
      keyboardLines[currentKeyboardLine].first;
  } else if (oldpos < 0) {
    oldpos = 0;
  }
  let t = keyboardLines[currentKeyboardLine].first + oldpos;

  if (t < 0) {
    t = 0;
  } else if (t >= newKeyboardKeys.length) {
    t = keyboardLines.length - 1;
  }
  keyboardCurrentIndex = t; // keyboardLines[currentKeyboardLine].first + t;

  $("#btn-keyboard-" + keyboardCurrentIndex).addClass("activeOption");
  $("#btn-keyboard-" + keyboardCurrentIndex).focus();
}
function keyboardFocusDownLine() {
  let oldpos = keyboardCurrentIndex - keyboardLines[currentKeyboardLine].first;
  currentKeyboardLine++;
  if (currentKeyboardLine >= keyboardLines.length) {
    currentKeyboardLine = 0;
  }
  if (
    !(
      capsLockOn &&
      (newKeyboardKeys[keyboardCurrentIndex].char === "Shift" ||
        newKeyboardKeys[keyboardCurrentIndex].char === "Capslock")
    )
  ) {
    $("#btn-keyboard-" + keyboardCurrentIndex).removeClass("activeOption");
  }
  if (
    oldpos >
    keyboardLines[currentKeyboardLine].last -
      keyboardLines[currentKeyboardLine].first
  ) {
    oldpos =
      keyboardLines[currentKeyboardLine].last -
      keyboardLines[currentKeyboardLine].first;
  } else if (oldpos < 0) {
    oldpos = 0;
  }
  let t = keyboardLines[currentKeyboardLine].first + oldpos;
  if (t < 0) {
    t = 0;
  } else if (t >= newKeyboardKeys.length) {
    t = keyboardLines.length - 1;
  }
  keyboardCurrentIndex = t;
  $("#btn-keyboard-" + keyboardCurrentIndex).addClass("activeOption");
  $("#btn-keyboard-" + keyboardCurrentIndex).focus();
}
function renderKeyboradButtons() {
  $("#keyWrapper").html("");

  for (let index = 0; index < keyboardLines.length; index++) {
    const element = keyboardLines[index];
    var newLineHTML = '<div class="keyboardRow">';
    //$("#keyWrapper").append("<div>");
    for (let i = element.first; i <= element.last; i++) {
      let char = newKeyboardKeys[i].char;
      if (capsLockOn) {
        char = newKeyboardKeys[i].shiftChar;
      }
      newLineHTML += `<button class="keyboardButton settingsButton${
        keyboardCurrentIndex === i ||
        (capsLockOn &&
          (newKeyboardKeys[i].char === "Capslock" ||
            (capsLockOn && newKeyboardKeys[i].char === "Shift")))
          ? " activeOption"
          : ""
      }" onclick="virtualKeyboardButtonClick('${i}')" id="btn-keyboard-${i}">${char}</button>`;
    }
    newLineHTML += "</div>";
    $("#keyWrapper").append(newLineHTML);
  }
}
