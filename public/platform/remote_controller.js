function remoteControllerHandler(e) {
  const keyCode = e.keyCode;
  console.log("remote key code : ", keyCode);
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
      }

      break;
    case tvKey.KEY_RIGHT:
      if (settingsMode) {
        settingsFocusNext();
      } else if (keyboardMode) {
        keyboardFocusNext();
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
      break;
  }
}
