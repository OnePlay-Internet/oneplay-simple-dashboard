interface FocusabelComponentProps {
  focusKey: string;
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
declare module "react-infinite-scroller";
declare module "react-lazy-load-image-component";
declare module "lodash.debounce";