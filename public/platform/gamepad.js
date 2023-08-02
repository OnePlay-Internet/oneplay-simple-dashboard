const Controller = (function () {
  let pollingInterval = null;
  const gamepads = {};

  class Button {
    constructor(button) {
      this.value = button.value;
      this.pressed = button.pressed;
      this.pressedTime = -1;
    }
  }

  class Gamepad {
    constructor(gamepad) {
      this.buttons = gamepad.buttons.map((button) => new Button(button));
      this.pressedStartTime = new Map();
      this.axisValue = new Map();
    }

    analyzeButtons(newButtons) {
      if (this.buttons.length !== newButtons.length) {
        console.error("New buttons layout does not match saved one");
        return;
      }

      for (let i = 0; i < newButtons.length; ++i) {
        if (this.buttons[i].pressed !== newButtons[i].pressed) {
          //   console.log(i + " pressed : " + newButtons[i].pressed);
          if (newButtons[i].pressed) {
            this.pressedStartTime.set(i, Date.now());
          } else {
            this.pressedStartTime.set(i, -1);
          }
          window.dispatchEvent(
            new CustomEvent("gamepadbuttonpressed", {
              detail: {
                key: i,
                pressed: newButtons[i].pressed,
              },
            })
          );
        } else if (newButtons[i].pressed) {
          const pressedStartTime = this.pressedStartTime.get(i);
          if (
            i === 9 &&
            pressedStartTime >= 0 &&
            Date.now() - pressedStartTime >= 2000
          ) {
            this.pressedStartTime.set(i, -1);
            //alert("Sending toogleMouse");
            // console.log(i, " pressed for 3 seconds ");
            sendMessage("toogleMouse", []).then(
              function (ret) {
                console.log("Toogle mouse result : ", ret);
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
        }
      }

      this.buttons = newButtons.map((button) => new Button(button));
    }
  }

  function gamepadConnected(gamepad) {
    gamepads[gamepad.index] = new Gamepad(gamepad);
  }

  function gamepadDisconnected(gamepad) {
    gamepads.delete(gamepad.index);
  }

  function analyzeGamepad(gamepad) {
    const index = gamepad.index;
    const pGamepad = gamepads[index];

    if (pGamepad) {
      pGamepad.analyzeButtons(gamepad.buttons);
    }
  }

  function pollGamepads() {
    const gamepads = navigator.getGamepads
      ? navigator.getGamepads()
      : navigator.webkitGetGamepads
      ? navigator.webkitGetGamepads
      : [];
    for (const gamepad of gamepads) {
      if (gamepad) {
        analyzeGamepad(gamepad);
      }
    }
  }

  function startWatching() {
    if (!pollingInterval) {
      window.addEventListener("gamepadconnected", function (e) {
        gamepadConnected(e.gamepad);
        console.log(
          "%c[gamepad.js, gamepadconnected] gamepad connected: " +
            JSON.stringify(e.gamepad),
          e.gamepad
        );
      });
      window.addEventListener("gamepaddisconnected", function (e) {
        gamepadDisconnected(e.gamepad);
      });
      pollingInterval = setInterval(pollGamepads, 5);
    }
  }

  function stopWatching() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  }

  return { startWatching, stopWatching };
})();
