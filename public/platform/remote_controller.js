function remoteControllerHandler(e) {
  const keyCode = e.keyCode;
  //console.log("keydown : ", e.keyCode);
  switch (keyCode) {
    case tvKey.KEY_UP:
      if (keyboardMode) {
        keyboardFocusUpLine();
      }
      // Navigation.up();
      break;
    case tvKey.KEY_DOWN:
      //Navigation.down();
      if (keyboardMode) {
        keyboardFocusDownLine();
      }
      break;
    case tvKey.KEY_LEFT:
      //Navigation.left();
      if (settingsMode) {
        settingsFocusPrevious();
      } else if (keyboardMode) {
        keyboardFocusPrevious();
      } else if (document.getElementById("quitAppDialog").open) {
        cahngeQuitAppButtonFocus();
      }
      break;
    case tvKey.KEY_RIGHT:
      if (settingsMode) {
        settingsFocusNext();
      } else if (keyboardMode) {
        keyboardFocusNext();
      } else if (document.getElementById("quitAppDialog").open) {
        cahngeQuitAppButtonFocus();
      }
      //Navigation.right();
      break;
    case tvKey.KEY_ENTER:
    case tvKey.KEY_REMOTE_ENTER:
      //Navigation.accept();
      break;
    case tvKey.KEY_RETURN:
      //Navigation.back();
      //quitStreaming();
      if (settingsMode) {
        toogleSettings();
      } else if (keyboardMode) {
        toogleKeyboardOverlay();
      } else if (document.getElementById("quitAppDialog").open) {
        document.getElementById("quitAppDialog").close();
      } else if (controllerShortcutMode) {
        toggleControllerShortcuts();
      } else {
        showConfirmQuitStreamDialog();
      }
      break;
    /*  case tvKey.KEY_VOLUME_UP:
      tizen.tvaudiocontrol.setVolumeUp();
      console.log("volume : " + tizen.tvaudiocontrol.getVolume());
      break;
    case tvKey.KEY_VOLUME_DOWN:
      tizen.tvaudiocontrol.setVolumeDown();
      console.log("volume : " + tizen.tvaudiocontrol.getVolume());
      break;
    case tvKey.KEY_VOLUME_MUTE:
      tizen.tvaudiocontrol.setMute(!tizen.tvaudiocontrol.isMute());
      console.log("mute : " + tizen.tvaudiocontrol.isMute());
      break; */
  }
}
