import { runningOnChrome } from "./utils.moonlight";

const SyncFunctions = {
  //@ts-ignore
  // no parameters
  makeCert: (...args: any) => Module.makeCert(...args),
  //@ts-ignore
  // cert, privateKey, myUniqueid
  httpInit: (...args: any) => Module.httpInit(...args),
  //@ts-ignore
  // host, width height fps bitrate rikey rikeyid appversion gfeversion
  startRequest: (...args: any) => Module.startStream(...args),
  //@ts-ignore
  // no parameters
  stopRequest: (...args: any) => Module.stopStream(...args),
  //@ts-ignore
  // no parameters
  streamStats: (...args: any) => Module.VidStreamStats(...args),
  //@ts-ignore
  //no parameters
  toogleMouse: (...args: any) => Module.EnableEmulatedMouseEvent(...args),
  //@ts-ignore
  //no parameters
  keyboardKeyPressed: (...args: any) => Module.SendKeyCodeToServer(...args),
};

const AsyncFunctions = {
  //@ts-ignore
  // url, ppk, binaryResponse
  openUrl: (...args: any) => Module.openUrl(...args),
  //@ts-ignore
  // no parameters
  STUN: (...args: any) => Module.STUN(...args),
  //@ts-ignore
  // serverMajorVersion, address, randomNumber
  pair: (...args: any) => Module.pair(...args),
};

const callbacks: { [key: number]: any } = {};
let callbacks_ids: number = 1;
/**
 * var sendMessage - Sends a message with arguments to the NaCl module
 *
 * @param  {String} method A named method
 * @param  {(String|Array)} params An array of options or a signle string
 * @return {void}        The NaCl module calls back trought the handleMessage method
 */
export const sendMessageToWASM = (method: string, params: any[]): Promise<{ [key: string]: any | string }> | undefined => {
  if (method in SyncFunctions) {
    return new Promise(function (resolve, reject) {
      const ret = SyncFunctions[method as keyof typeof SyncFunctions](...params);
      if (ret.type === "resolve") {
        resolve(ret.ret);
      } else {
        reject(ret.ret);
      }
    });
  } else if (method in AsyncFunctions) {
    return new Promise(function (resolve, reject) {
      const id = callbacks_ids++;
      callbacks[id] = {
        resolve: resolve,
        reject: reject,
      };
      AsyncFunctions[method as keyof typeof AsyncFunctions](id, ...params);
    });
  }
};

export const handleWASMPromiseMessage = (callbackId: number, type: string, msg: any) => {
  callbacks[callbackId][type](msg);
  delete callbacks[callbackId];
};

/**
 * handleMessage - Handles messages from the NaCl module
 *
 * @param  {Object} msg An object given by the NaCl module
 * @return {void}
 */

export function handleWASMMessages(msg: any) {
  console.log("%c[messages.moonlight.ts, handleMessage]", "color:gray;", "Message data: ", msg);
}

//@ts-ignore
window.handleMessage = handleWASMMessages;