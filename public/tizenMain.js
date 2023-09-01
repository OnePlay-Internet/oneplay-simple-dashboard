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
      case 10009: //RETURN button
        const urlParams = new URLSearchParams(window.location.search);
        console.log("back : ", urlParams.get("back"));
        if (window.location.pathname === "/" || window.location.pathname === "/home") {
          // var confirmExitEvent = new CustomEvent("ShowConfirmExitDialog");
          // window.dispatchEvent(confirmExitEvent);
          var confirmExitEvent = new CustomEvent("RemoteReturnClicked", { callback: goBack });
          window.dispatchEvent(confirmExitEvent);
          //tizen.application.getCurrentApplication().exit();
        } else if (window.location.pathname.startsWith("/games-detail") && urlParams.get("back")) {
          window.reactNavigate("/home");
        } else {
          var confirmExitEvent = new CustomEvent("RemoteReturnClicked", { callback: goBack });
          window.dispatchEvent(confirmExitEvent);
          //  window.history.go(-1);
        }
        break;
    }
  });
};
function goBack() {
  window.history.go(-1);
}
// window.onload can work without <body onload="">
window.onload = init;
Controller.startWatching();