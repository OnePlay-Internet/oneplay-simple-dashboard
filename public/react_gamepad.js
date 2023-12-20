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
  const CONTROLLER_SELECT_BUTTON = 8; //  -for shaks  = 10 - for xbox = 8
  const CONTROLLER_START_BUTTON = 9; // for shaks = 11 - for xbox = 9
  const CONTROLLER_X_BUTTON = 2; // -for shaks = 3 - for fox xbox = 2
  const CONTROLLER_A_BUTTON = 0;
  const CONTROLLER_B_BUTTON = 1;
  const CONTROLLER_UP_BUTTON = 12;
  const CONTROLLER_DOWN_BUTTON = 13;
  const CONTROLLER_RIGHT_BUTTON = 15;
  const CONTROLLER_LEFT_BUTTON = 14;
  const JOYSTICK_LEFT_RIGHT = 0;
  const JOYSTICK_UP_DOWN = 1;
  class Gamepad {
    constructor(gamepad) {
      this.buttons = gamepad.buttons.map((button) => new Button(button));
      this.pressedStartTime = new Map();
      this.axisValue = new Map();
      this.axisValueStartTime = new Map();
    }

    analyzeShortcutButtons(newButtons) {
      if (this.buttons.length !== newButtons.length) {
        console.error("New buttons layout does not match saved one");
        return;
      }
      for (let i = 0; i < newButtons.length; i++) {
        if (this.buttons[i].pressed !== newButtons[i].pressed) {
          if (newButtons[i].pressed) {
            this.pressedStartTime.set(i, Date.now());
          } else {
            this.pressedStartTime.set(i, -1);
          }
          if (newButtons[CONTROLLER_SELECT_BUTTON].pressed && newButtons[CONTROLLER_X_BUTTON].pressed) {
            window.enableGamepad = true;
            window.dispatchEvent(new CustomEvent("showGamePlaySettings"));
            //alert("show settings");
          }
          if (newButtons[CONTROLLER_SELECT_BUTTON].pressed && newButtons[CONTROLLER_A_BUTTON].pressed) {
            window.enableGamepad = true;
            // alert("show keyboard");
            window.dispatchEvent(new CustomEvent("showGamePlayVirtualKeyboard"));
          }
        }
        if (i === CONTROLLER_START_BUTTON) {
          const pressedStartTime = this.pressedStartTime.get(i);
          if (pressedStartTime >= 0 && Date.now() - pressedStartTime >= 2000) {
            this.pressedStartTime.set(i, -1);
            window.dispatchEvent(new CustomEvent("gamePlayToggleMouseMode"));
          }
        }
      }
      this.buttons = newButtons.map((button) => new Button(button));
    }
    analyzeButtons(newButtons) {
      if (this.buttons.length !== newButtons.length) {
        console.error("New buttons layout does not match saved one");
        return;
      }

      for (let i = 0; i < newButtons.length; ++i) {
        if (this.buttons[i].pressed !== newButtons[i].pressed) {
          if (newButtons[i].pressed) {
            this.pressedStartTime.set(i, Date.now());
            //console.log(i + " pressed : " + newButtons[i].pressed);
            switch (i) {
              case CONTROLLER_A_BUTTON:
                window.dispatchEvent(new KeyboardEvent("keydown", { keyCode: "13" }));
                break;
              case CONTROLLER_B_BUTTON:
                document.dispatchEvent(new KeyboardEvent("keydown", { keyCode: "10009" }));
                break;
              default:
                break;
            }
          } else {
            this.pressedStartTime.set(i, -1);
          }
        }
        const now = Date.now();

        if (
          newButtons[i].pressed &&
          (!this.buttons[i].pressed || this.pressedStartTime.get(i) === -1 || now - this.pressedStartTime.get(i) > 120)
        ) {
          // console.log(i + " pressed : " + newButtons[i].pressed);
          switch (i) {
            case CONTROLLER_UP_BUTTON:
              window.dispatchEvent(new KeyboardEvent("keydown", { keyCode: "38" }));
              this.pressedStartTime.set(i, now);
              break;
            case CONTROLLER_DOWN_BUTTON:
              window.dispatchEvent(new KeyboardEvent("keydown", { keyCode: "40" }));
              this.pressedStartTime.set(i, now);
              break;
            case CONTROLLER_RIGHT_BUTTON:
              window.dispatchEvent(new KeyboardEvent("keydown", { keyCode: "39" }));
              this.pressedStartTime.set(i, now);
              break;
            case CONTROLLER_LEFT_BUTTON:
              window.dispatchEvent(new KeyboardEvent("keydown", { keyCode: "37" }));
              this.pressedStartTime.set(i, now);
              break;
            default:
              break;
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

      this.buttons = newButtons.map((button) => new Button(button));
    }
    analyzeAxes(axes) {
      const now = Date.now();
      axes.forEach((axis, i) => {
        // if (this.axisValue.get(i) !== axis.toFixed(2)) {
        if (i === JOYSTICK_UP_DOWN) {
          if (axis.toFixed(2) == 1.0) {
            //console.log("down : 40");
            //down 40
            if (!this.axisValueStartTime.has(i) || this.axisValueStartTime.get(i) === -1 || now - this.axisValueStartTime.get(i) > 120) {
              window.dispatchEvent(new KeyboardEvent("keydown", { keyCode: "40" }));
              this.axisValueStartTime.set(i, Date.now());
            }
          } else if (axis.toFixed(2) == -1.0) {
            //console.log("up : 38");
            //up 38
            if (!this.axisValueStartTime.has(i) || this.axisValueStartTime.get(i) === -1 || now - this.axisValueStartTime.get(i) > 120) {
              window.dispatchEvent(new KeyboardEvent("keydown", { keyCode: "38" }));
              this.axisValueStartTime.set(i, Date.now());
            }
          }
        } else if (i === JOYSTICK_LEFT_RIGHT) {
          if (axis.toFixed(2) == 1.0) {
            //console.log("right : 39 ");
            //rigth 39
            if (!this.axisValueStartTime.has(i) || this.axisValueStartTime.get(i) === -1 || now - this.axisValueStartTime.get(i) > 120) {
              window.dispatchEvent(new KeyboardEvent("keydown", { keyCode: "39" }));
              this.axisValueStartTime.set(i, Date.now());
            }
          } else if (axis.toFixed(2) == -1.0) {
            // console.log("left : 37");
            //left 37

            if (!this.axisValueStartTime.has(i) || this.axisValueStartTime.get(i) === -1 || now - this.axisValueStartTime.get(i) > 120) {
              window.dispatchEvent(new KeyboardEvent("keydown", { keyCode: "37" }));
              this.axisValueStartTime.set(i, Date.now());
            }
          }
        }
        /*    } else {
          this.axisValueStartTime.set(i, -1);
        } */
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
      if (window.enableGamepad) {
        pGamepad.analyzeButtons(gamepad.buttons);
        pGamepad.analyzeAxes(gamepad.axes);
      } else {
        pGamepad.analyzeShortcutButtons(gamepad.buttons);
      }
    }
  }

  function pollGamepads() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads : [];
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
