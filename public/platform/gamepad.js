const Controller = (function () {
  let pollingInterval = null;
  const gamepads = {};

  const CONTROLLER_SELECT_BUTTON = 8; //  -for shaks  = 10 - for xbox = 8
  const CONTROLLER_START_BUTTON = 9; // for shaks = 11 - for xbox = 9
  const CONTROLLER_X_BUTTON = 2; // -for shaks = 3 - for fox xbox = 2
  const CONTROLLER_A_BUTTON = 0;
  const JOYSTICK_LEFT_RIGHT = 0;
  const JOYSTICK_UP_DOWN = 1;

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
            if (i === CONTROLLER_A_BUTTON) {
              if (settingsMode) {
                $("#btn-settings-" + settingsCurrentIndex).click();
              } else if (keyboardMode) {
                console.log("fire keyboard click");
                $("#btn-keyboard-" + keyboardCurrentIndex).click();
              }
            }
          } else {
            this.pressedStartTime.set(i, -1);
          }
          if (
            newButtons[CONTROLLER_SELECT_BUTTON].pressed &&
            newButtons[CONTROLLER_X_BUTTON].pressed
          ) {
            toogleSettings();
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
          if (pressedStartTime >= 0 && Date.now() - pressedStartTime >= 2000) {
            this.pressedStartTime.set(i, -1);
            // console.log(i, " pressed for 3 seconds ");
            if (i === CONTROLLER_START_BUTTON) {
              toggleMouse();
            }
          }
        }
      }
      this.buttons = newButtons.map((button) => new Button(button));
    }
    analyzeAxes(axes) {
      axes.forEach((axis, i) => {
        if (this.axisValue.get(i) !== axis.toFixed(2)) {
          if (i === JOYSTICK_UP_DOWN) {
            if (axis.toFixed(2) == 1.0) {
              //down 40

              if (keyboardMode) {
                keyboardFocusDownLine();
              }
            } else if (axis.toFixed(2) == -1.0) {
              //up 38

              if (keyboardMode) {
                keyboardFocusUpLine();
              }
            }
          } else if (i === JOYSTICK_LEFT_RIGHT) {
            if (axis.toFixed(2) == 1.0) {
              //right 39

              if (settingsMode) {
                settingsFocusNext();
              } else if (keyboardMode) {
                keyboardFocusNext();
              }
            } else if (axis.toFixed(2) == -1.0) {
              // left 37

              if (settingsMode) {
                settingsFocusPrevious();
              } else if (keyboardMode) {
                keyboardFocusPrevious();
              }
            }
          }
        }
        this.axisValue.set(i, axis.toFixed(2));
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
