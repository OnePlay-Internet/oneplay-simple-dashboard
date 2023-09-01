interface FocusabelComponentProps {
  focusKey: string;
  [key: string]: string | number | boolean | function;
}

interface FocusabelChildComponentProps {
  focusKey: string;
  parentFocus: number;
}

interface FocusableItemProps {
  focused: boolean;
}
interface TestFocusableItemProps {
  $focused: boolean;
}


interface PopupButton {
  text: string;
  focusKey: string;
  className: string;
  onClick: Function;
}

interface ErrorPopupPorps {
  title: string;
  icon: string;
  message: string;
  returnFocusTo: string;
  show: boolean;
  focusKeyParam: string;
  buttons: PopupButton[];
}

declare module "react-infinite-scroller";
declare module "react-lazy-load-image-component";
declare module "lodash.debounce";
declare module "react-slick";