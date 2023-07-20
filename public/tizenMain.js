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
    console.log("Key code : " + e.keyCode);
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
        if (
          window.location.pathname === "/" ||
          window.location.pathname === "/all-games"
        ) {
          console.log("exit app");
          tizen.application.getCurrentApplication().exit();
        } else {
          console.log("go back");
          window.history.go(-1);
        }
        break;
    }
  });
};
// window.onload can work without <body onload="">
window.onload = init;
