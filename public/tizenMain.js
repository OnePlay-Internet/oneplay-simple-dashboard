//Initialize function
var init = function () {
  // TODO:: Do your initialization job
  console.log("init() called");

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      // Something you want to do when hide or exit.
    } else {
      // Something you want to do when resume.
    }
  });

  // add eventListener for keydown
  document.addEventListener("keydown", function (e) {
    //console.log("keydown : ", e.keyCode);
    switch (e.keyCode) {
      case 37: //LEFT arrow
        break;
      case 38: //UP arrow
        break;
      case 39: //RIGHT arrow
        break;
      case 40: //DOWN arrow
        break;
      case 13: //OK button
        break;
      /*  case "VolumeUp":
        tizen.tvaudiocontrol.setVolumeUp();
        console.log("volume : " + tizen.tvaudiocontrol.getVolume());
        break;
      case "VolumeDown":
        tizen.tvaudiocontrol.setVolumeDown();
        console.log("volume : " + tizen.tvaudiocontrol.getVolume());
        break;
      case "VolumeMute":
        tizen.tvaudiocontrol.setMute(!tizen.tvaudiocontrol.isMute());
        console.log("mute : " + tizen.tvaudiocontrol.isMute());
        break; */
      case 10009: //RETURN button
        const urlParams = new URLSearchParams(window.location.search);
        console.log("back : ", urlParams.get("back"));
        if (window.location.pathname === "/" || window.location.pathname === "/home") {
          // var confirmExitEvent = new CustomEvent("ShowConfirmExitDialog");
          // window.dispatchEvent(confirmExitEvent);
          var RemoteReturnClickEvent = new CustomEvent("RemoteReturnClicked");
          window.dispatchEvent(RemoteReturnClickEvent);
          //tizen.application.getCurrentApplication().exit();
        } else if (window.location.pathname.startsWith("/games-detail") && urlParams.get("back")) {
          window.reactNavigate("/home");
        } else {
          var confirmExitEvent = new CustomEvent("RemoteReturnClicked");
          window.dispatchEvent(confirmExitEvent);
          //  window.history.go(-1);
        }
        break;
    }
  });
};
// window.onload can work without <body onload="">
window.onload = init;
Controller.startWatching();