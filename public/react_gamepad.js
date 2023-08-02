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
            if (i === 0) {
              window.dispatchEvent(
                new KeyboardEvent("keydown", { keyCode: "13" })
              );
            }
          }
          window.dispatchEvent(
            new CustomEvent("gamepadbuttonpressed", {
              detail: {
                key: i,
                pressed: newButtons[i].pressed,
              },
            })
          );
        }
      }

      this.buttons = newButtons.map((button) => new Button(button));
    }
    analyzeAxes(axes) {
      axes.forEach((axis, i) => {
        if (this.axisValue.get(i) !== axis.toFixed(4)) {
          if (i === 9) {
            if (axis.toFixed(4) == 0.1429) {
              console.log("down : 40");
              window.dispatchEvent(
                new KeyboardEvent("keydown", { keyCode: "40" })
              );
            } else if (axis.toFixed(4) == 0.7143) {
              console.log("left : 37");
              window.dispatchEvent(
                new KeyboardEvent("keydown", { keyCode: "37" })
              );
            } else if (axis.toFixed(4) == -0.4286) {
              console.log("right : 39");
              window.dispatchEvent(
                new KeyboardEvent("keydown", { keyCode: "39" })
              );
            } else if (axis.toFixed(4) == -1.0) {
              console.log("up : 38");
              window.dispatchEvent(
                new KeyboardEvent("keydown", { keyCode: "38" })
              );
            }
          } else if (i === 1) {
            if (axis.toFixed(4) == 1.0) {
              console.log("down : 40");
              window.dispatchEvent(
                new KeyboardEvent("keydown", { keyCode: "40" })
              );
            } else if (axis.toFixed(4) == -1.0) {
              console.log("up : 38");
              window.dispatchEvent(
                new KeyboardEvent("keydown", { keyCode: "38" })
              );
            }
          } else if (i === 0) {
            if (axis.toFixed(4) == 1.0) {
              console.log("right : 39 ");
              window.dispatchEvent(
                new KeyboardEvent("keydown", { keyCode: "39" })
              );
            } else if (axis.toFixed(4) == -1.0) {
              console.log("left : 37");
              window.dispatchEvent(
                new KeyboardEvent("keydown", { keyCode: "37" })
              );
            }
          }
        }
        this.axisValue.set(i, axis.toFixed(4));
      });
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
      pGamepad.analyzeAxes(gamepad.axes);
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
