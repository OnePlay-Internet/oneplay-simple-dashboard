import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import React, { useEffect, useState } from "react";
import iconClose from "../../../assets/images/icon-close.svg";
function OnScreenKeyboard({
  focusKey: focusKeyParam,
  toggle,
  sendKeyboardClickEvent,
}: {
  focusKey: string;
  toggle: Function;

  sendKeyboardClickEvent: Function;
}) {
  const [shiftPressed, setShiftPressed] = useState<boolean>(false);
  const [capsLockPressed, setCapsLockPressed] = useState<boolean>(false);
  const { focusSelf, focusKey, setFocus } = useFocusable({
    focusable: true,
    trackChildren: true,
    focusKey: focusKeyParam,
    isFocusBoundary: true,
  });
  var virtualKeys = [
    { char: "`", shiftChar: "~", charCode: 192 },
    { char: "1", shiftChar: "!", charCode: 49 },
    { char: "2", shiftChar: "@", charCode: 50 },
    { char: "3", shiftChar: "#", charCode: 51 },
    { char: "4", shiftChar: "$", charCode: 52 },
    { char: "5", shiftChar: "%", charCode: 53 },
    { char: "6", shiftChar: "^", charCode: 54 },
    { char: "7", shiftChar: "&", charCode: 55 },
    { char: "8", shiftChar: "*", charCode: 56 },
    { char: "9", shiftChar: "(", charCode: 57 },
    { char: "0", shiftChar: ")", charCode: 48 },
    { char: "-", shiftChar: "_", charCode: 0xbd },
    { char: "=", shiftChar: "+", charCode: 0xbb },
    {
      char: "Backspace",
      shiftChar: "Backspace",
      charCode: 8,
    },
    { char: "Tab", shiftChar: "Tab", charCode: 9 },
    { char: "q", shiftChar: "Q", charCode: 81 },
    { char: "w", shiftChar: "W", charCode: 87 },
    { char: "e", shiftChar: "E", charCode: 69 },
    { char: "r", shiftChar: "R", charCode: 82 },
    { char: "t", shiftChar: "T", charCode: 84 },
    { char: "y", shiftChar: "Y", charCode: 89 },
    { char: "u", shiftChar: "U", charCode: 85 },
    { char: "i", shiftChar: "I", charCode: 73 },
    { char: "o", shiftChar: "O", charCode: 79 },
    { char: "p", shiftChar: "P", charCode: 80 },
    { char: "[", shiftChar: "{", charCode: 0xdb },
    { char: "]", shiftChar: "}", charCode: 0xdd },
    { char: "\\", shiftChar: "|", charCode: 0xdc },
    { char: "Capslock", shiftChar: "Capslock", charCode: "20" },
    { char: "a", shiftChar: "A", charCode: 65 },
    { char: "s", shiftChar: "S", charCode: 83 },
    { char: "d", shiftChar: "D", charCode: 68 },
    { char: "f", shiftChar: "F", charCode: 70 },
    { char: "g", shiftChar: "G", charCode: 71 },
    { char: "h", shiftChar: "H", charCode: 72 },
    { char: "j", shiftChar: "J", charCode: 74 },
    { char: "k", shiftChar: "K", charCode: 75 },
    { char: "l", shiftChar: "L", charCode: 76 },
    { char: ";", shiftChar: ":", charCode: 0xba },
    { char: "'", shiftChar: '"', charCode: 222 },
    { char: "Enter", shiftChar: "Enter", charCode: 13 },
    { char: "Shift", shiftChar: "Shift", charCode: "" },
    { char: "z", shiftChar: "Z", charCode: 90 },
    { char: "x", shiftChar: "X", charCode: 88 },
    { char: "c", shiftChar: "C", charCode: 67 },
    { char: "v", shiftChar: "V", charCode: 86 },
    { char: "b", shiftChar: "B", charCode: 66 },
    { char: "n", shiftChar: "N", charCode: 78 },
    { char: "m", shiftChar: "M", charCode: 77 },
    { char: ",", shiftChar: "<", charCode: 0xbc },
    { char: ".", shiftChar: ">", charCode: 0xbe },
    { char: "/", shiftChar: "?", charCode: 0xbf },
    { char: "Space", shiftChar: "Space", charCode: 32 },
    { char: "←", shiftChar: "←", charCode: 37 },
    { char: "↑", shiftChar: "↑", charCode: 38 },
    { char: "↓", shiftChar: "↓", charCode: 40 },
    { char: "→", shiftChar: "→", charCode: 39 },
    //{ char: "Close Keyboard", shiftChar: "Close Keyboard", charCode: "" },
  ];
  const virtualKeyLines = [
    { first: 0, last: 13 },
    { first: 14, last: 27 },
    { first: 28, last: 40 },
    { first: 41, last: 51 },
    { first: 52, last: 56 },
  ];
  useEffect(() => {
    if (!focusSelf) return;
    focusSelf();
  }, [focusSelf]);
  const virtualKeyClicked = (index: number) => {
    const MODIFIER_SHIFT = 0x01;
    let pressedCharCode;
    switch (virtualKeys[index].char) {
      case "Capslock":
        setCapsLockPressed((prev) => !prev);
        break;
      case "Shift":
        setShiftPressed((prev) => !prev);
        return;
      case "Close Keyboard":
        //toogleKeyboardOverlay();
        return;
      default:
        pressedCharCode = virtualKeys[index].charCode;
        break;
    }
    if (!pressedCharCode) {
      return;
    }
    let filter = 0;
    if (shiftPressed || (capsLockPressed && virtualKeys[index].char.match(/[a-zA-Z]/))) {
      filter |= MODIFIER_SHIFT;
    }
    sendKeyboardClickEvent([pressedCharCode.toString(16), filter.toString()]);
  };
  const renderVirtualKeyChar = (index: number) => {
    const char = virtualKeys[index].char;
    if (char.length > 1) {
      return char;
    }
    if (char.match(/[a-zA-Z]/)) {
      if (shiftPressed || capsLockPressed) {
        return virtualKeys[index].shiftChar;
      } else {
        return char;
      }
    } else {
      if (shiftPressed) {
        return virtualKeys[index].shiftChar;
      } else {
        return char;
      }
    }
  };
  const renderVirtualKeyboardLine = (line: { first: number; last: number }) => {
    const lines = [];
    for (let index = line.first; index <= line.last; index++) {
      lines.push(
        <FocusableKeyboardButton
          key={`virtual_keyboard_key_` + index}
          focusKeyParam={`virtual_keyboard_key_` + index}
          onClick={() => {
            virtualKeyClicked(index);
          }}
          shiftPressed={shiftPressed}
          capsLockPressed={capsLockPressed}
          isShift={virtualKeys[index].char === "Shift"}
          isCapslock={virtualKeys[index].char === "Capslock"}
        >
          {renderVirtualKeyChar(index)}
        </FocusableKeyboardButton>
      );
    }
    return lines;
  };
  const renderVirtualKeyboard = () => {
    return virtualKeyLines.map((line, index) => {
      return (
        <div className="keyboardRow" key={`virtual_key_row_${index}`}>
          {renderVirtualKeyboardLine(line)}
        </div>
      );
    });
  };
  return (
    <FocusContext.Provider value={focusKeyParam}>
      <div id="keyboardOverlay">
        <div id="keyWrapper">
          <FocusableButton focusKeyParam="btn-close-faqs" onClick={toggle}>
            <img src={iconClose} className="img-fluid" alt="" />
          </FocusableButton>
          {renderVirtualKeyboard()}
        </div>
      </div>
    </FocusContext.Provider>
  );
}

const FocusableKeyboardButton = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,

    onEnterPress: () => {
      props.onClick();
    },
  });
  return (
    <button
      ref={ref}
      onClick={props.onClick}
      className={
        "keyboardButton " +
        (props.isShift && props.shiftPressed ? "keyPressed " : " ") +
        (props.isCapslock && props.capsLockPressed ? "keyPressed " : " ") +
        (focused ? " focusedElement " : " ")
      }
    >
      {props.children}
    </button>
  );
};

const FocusableButton = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {},
    onEnterPress: () => {
      props.onClick();
    },
    /* onArrowPress: (direction, aprops, details) => {
      if (direction === "down") {
        setFocus("accordion-1");
      }
      return false;
    }, */
  });
  return (
    <button ref={ref} onClick={props.onClick} className={"setting-popup-close" + (focused ? " focusedElement" : "")}>
      <img src={iconClose} className="img-fluid" alt="" />
    </button>
  );
};
export default OnScreenKeyboard;
