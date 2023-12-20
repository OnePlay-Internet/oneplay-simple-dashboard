// @ts-nocheck

export function runningOnChrome(): boolean {
  try {
    if (chrome) {
      return true;
    }
  } catch (e) {}

  return false;
}

export function _arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function _base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

export function generateRemoteInputKey() {
  var array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

export function generateRemoteInputKeyId() {
  // Value must be signed 32-bit int for correct behavior
  var array = new Int32Array(1);
  window.crypto.getRandomValues(array);
  return array[0];
}

// Based on OpenBSD arc4random_uniform()
export function cryptoRand(upper_bound) {
  var min = (Math.pow(2, 32) - upper_bound) % upper_bound;
  var array = new Uint32Array(1);

  do {
    window.crypto.getRandomValues(array);
  } while (array[0] < min);

  return array[0] % upper_bound;
}

export function getConnectedGamepadMask() {
  var count = 0;
  var mask = 0;
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : [];

  for (var i = 0; i < gamepads.length; i++) {
    var gamepad = gamepads[i];
    if (gamepad) {
      // See logic in gamepad.cpp
      // These must stay in sync!

      if (!gamepad.connected) {
        // Not connected
        continue;
      }

      if (gamepad.timestamp == 0) {
        // On some platforms, Chrome returns "connected" pads that
        // really aren't, so timestamp stays at zero. To work around this,
        // we'll only count gamepads that have a non-zero timestamp in our
        // controller index.
        continue;
      }

      mask |= 1 << count++;
    }
  }

  console.log("%c[utils.js, getConnectedGamepadMask]", "color:gray;", "Detected " + count + " gamepads");
  return mask;
}