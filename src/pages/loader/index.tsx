import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useEffect } from "react";
export default function LoaderPopup(props: any) {
  const { setFocus, focusKey, focusSelf, ref } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    isFocusBoundary: true,
  });

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        className="modal fade show"
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
        style={{ display: "block", opacity: 1, backgroundColor: "#00000099" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content"
            style={{ backgroundColor: "transparent", alignItems: "center" }}
          >
            <div className="loader-spinner"></div>
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
}
