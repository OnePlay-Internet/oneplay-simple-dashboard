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
  heartBeatData = {
    user_id: urlParams.get("user_id").toString(),
    token: urlParams.get("client_token").toString(),
    device: {
      vendor:
        "SAMSUNG_" +
        tizen.systeminfo.getCapability("http://tizen.org/system/model_name"),
      os:
        tizen.systeminfo.getCapability(
          "http://tizen.org/feature/platform.version"
        ) +
        "_" +
        tizen.systeminfo.getCapability("http://tizen.org/system/build.string"),
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

      //heartBeatData.last_input_received_at = vidStats.last_input_received_at;
      heartBeatData.stats.decoder = vidStats.decoder;
      heartBeatData.stats.received_fps = parseInt(vidStats.received_fps);
      heartBeatData.stats.rendered_fps = parseInt(vidStats.rendered_fps);
      heartBeatData.stats.net_drops = parseInt(vidStats.net_drops);
      heartBeatData.stats.net_latency = parseInt(vidStats.net_latency);
      heartBeatData.stats.variance = parseInt(vidStats.variance);
      heartBeatData.stats.decode_time = parseInt(vidStats.decode_time);
      console.log("heart beat data :", heartBeatData);
      $.ajax({
        url: "https://client-apis.oneream.com/client/v2/heart_beat",
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
