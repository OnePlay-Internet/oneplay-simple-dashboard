import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { Outlet } from "react-router-dom";

export default function GuestLayout({ focusKey: focusKeyParam }: FocusabelComponentProps) {
  const { focusKey, setFocus } = useFocusable({
    focusable: true,
    focusKey: focusKeyParam,
  });
  return (
    <FocusContext.Provider value={focusKey}>
      <Outlet />
    </FocusContext.Provider>
  );
}
