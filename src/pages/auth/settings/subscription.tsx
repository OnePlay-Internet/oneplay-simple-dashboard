import { useNavigate } from "react-router-dom";
import Clock from "../../../assets/images/setting/Alarm.svg";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "src/App";
import { getCurrentSubscriptions } from "src/common/services";
import { SESSION_TOKEN_LOCAL_STORAGE } from "src/common/constants";
import moment from "moment";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import ErrorPopUp from "src/pages/error";
import { scrollToElement } from "src/common/utils";
import { StatusPopupContext } from "src/layouts/auth";

export default function SubscriptionComponent({ focusKey: focusKeyParam }: FocusabelComponentProps) {
  const navigate = useNavigate();
  const sessionContext = useContext(SessionContext);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const { focusSelf, focusKey, setFocus } = useFocusable({
    focusable: true,
    trackChildren: true,
    focusKey: focusKeyParam,
  });
  const statusPopupContext = useContext(StatusPopupContext);
  const [popUp, setPopUp] = useState<ErrorPopupPorps>({
    show: false,
    message: "",
    title: "",
    returnFocusTo: "",
    buttons: [],
    focusKeyParam: "modal-popup",
    icon: "",
  });
  useEffect(() => {
    if (subscriptions.length) {
      if (subscriptions.at(0).subscription_status === "active") {
        setFocus(`current-sub-${subscriptions.at(0).id}`);
      } else {
        setFocus("sub_0");
      }
    } else {
      setFocus("go-to-subscription");
    }
  }, [subscriptions]);
  useEffect(() => {
    if (sessionContext.sessionToken) {
      (async () => {
        const subscriptionResp: any = await getCurrentSubscriptions(sessionContext.sessionToken);
        if (!subscriptionResp.success) {
          /*   Swal.fire({
            title: "Error!",
            text: subscriptionResp.message,
            icon: "error",
            confirmButtonText: "OK",
          }); */
          setPopUp({
            show: true,
            message: subscriptionResp.message ?? "",
            title: "Error!",
            returnFocusTo: "buy-now",
            buttons: [{ text: "Ok", className: "btn gradientBtn btn-lg border-0", focusKey: "btn-ok-popup", onClick: hidePopup }],
            focusKeyParam: "modal-popup",
            icon: "error",
          });
          return;
        }

        setSubscriptions(subscriptionResp.subscriptions);

        if (subscriptionResp.subscriptions.length && subscriptionResp.subscriptions.at(0).subscription_status === "active") {
          setFocus("current-renew");
        } else {
          setFocus("buy-now");
        }
      })();
    }
  }, [sessionContext.sessionToken]);

  const renderCurrentPlan = () => {
    const plans = [];
    for (const subscription of subscriptions) {
      if (subscription.subscription_status === "active") {
        plans.push(renderPlan(subscription));
      }
    }
    return plans;
  };
  const renderPlan = (currenSub: any) => {
    return <FocusablePlan key={currenSub.id} focusKeyParam={`current-sub-${currenSub.id}`} currenSub={currenSub} />;
  };
  const renderSingleSubscriptionRow = (subscription: any, index: number) => {
    return (
      <FocusableTr key={subscription.id} focusKeyParam={"sub_" + index}>
        <td>{moment(subscription.subscription_brought_at_time).format("DD.MM.YYYY")}</td>
        <td>
          <p className="mb-1">{subscription.subscriptionPackage.plan_name}</p>
          <p className="mb-0 gamesDescription">{subscription.subscriptionPackage.plan_description}</p>
        </td>
        <td> ₹ {parseFloat(subscription.amount).toFixed(2)}</td>
        <td className="gradientText" style={{ textTransform: "capitalize" }}>
          {subscription.subscription_status}
        </td>
        <td className="mb-1">{moment(subscription.subscription_active_from).format("DD.MM.YYYY")}</td>
        <td className="mb-1">{moment(subscription.subscription_active_till).format("DD.MM.YYYY")}</td>
      </FocusableTr>
    );
  };
  const hidePopup = () => {
    const returnFocusTo = popUp.returnFocusTo;
    setPopUp({
      show: false,
      message: "",
      title: "",
      returnFocusTo: "",
      buttons: [],
      focusKeyParam: "modal-popup",
      icon: "",
    });
    setFocus(returnFocusTo);
  };
  useEffect(() => {
    const onRemoteReturnClicked = (event: any) => {
      if (statusPopupContext) return;
      if (popUp.show) {
        hidePopup();
      } else {
        window.history.go(-1);
      }
    };
    window.addEventListener("RemoteReturnClicked", onRemoteReturnClicked);
    return () => {
      window.removeEventListener("RemoteReturnClicked", onRemoteReturnClicked);
    };
  }, [popUp, hidePopup, statusPopupContext]);
  return (
    <FocusContext.Provider value={focusKey}>
      <div className="row">
        <div className="col-lg-10 col-md-10 ps-4">
          {subscriptions.length && subscriptions.at(0).subscription_status === "active" ? (
            <p className="GamesTitle">Current Subscription</p>
          ) : (
            <div className="col-auto align-self-center">
              <p className="GamesTitle">You don't have active subscription.</p>
            </div>
          )}
          {renderCurrentPlan()}

          <p className="GamesTitle mt-4">Subscription History</p>
          <div className="table-responsive">
            <table className="table table-dark align-middle customTable table-lg" id="subscription-table">
              <thead>
                <tr>
                  <th>Date of Purchase</th>
                  <th>Subscription Type</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>{subscriptions.map((sub, index) => renderSingleSubscriptionRow(sub, index))}</tbody>
            </table>
          </div>
        </div>
      </div>
      {popUp.show && <ErrorPopUp {...popUp} />}
    </FocusContext.Provider>
  );
}

const FocusableTr = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {
      scrollToElement(ref.current, 100);
      //ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    },
    onArrowPress: (direction, keyProps, details) => {
      switch (direction) {
        case "right":
        case "left":
          setFocus("go-to-subscription");
          return false;
        default:
          return true;
      }
    },
  });
  return (
    <tr ref={ref} className={focused ? " focusedTableRow" : ""}>
      {props.children}
    </tr>
  );
};

const FocusablePlan = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onFocus: () => {
      //scrollToElement(ref.current, 150);
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    onArrowPress: (direction, keyProps, details) => {
      switch (direction) {
        case "right":
        case "left":
          setFocus("go-to-subscription");
          return false;
        default:
          return true;
      }
    },
  });
  return (
    <div ref={ref} className={"card cardBG border-0 mt-3" + (focused ? " focusedElement" : "")}>
      <div className="card-body">
        <div className="row">
          <div className="col">
            <p className="gamesDescription mb-0">
              {props.currenSub.subscriptionPackage.plan_name} (
              {props.currenSub.subscriptionPackage.package_type === "base" ? "Base Plan" : "Addon"})
            </p>
            <h1 className="price">₹ {parseFloat(props.currenSub.amount).toFixed(2)}</h1>
            <img src={Clock} className="img-fluid me-2" alt="" />
            <span className="smallText">
              {Math.round(props.currenSub.remaining_tokens) === 0 ? "0" : ""}
              {(Math.floor(props.currenSub.remaining_tokens / 60) > 0 ? Math.floor(props.currenSub.remaining_tokens / 60) + "h " : "") +
                (props.currenSub.remaining_tokens % 60 > 0 ? (props.currenSub.remaining_tokens % 60).toFixed(0) + "m" : "")}
              /
              {(Math.floor(props.currenSub.subscriptionPackage.total_offered_tokens / 60) > 0
                ? Math.floor(props.currenSub.subscriptionPackage.total_offered_tokens / 60) + "h "
                : "") +
                (props.currenSub.subscriptionPackage.total_offered_tokens % 60 > 0
                  ? (props.currenSub.subscriptionPackage.total_offered_tokens % 60).toFixed(0) + "m"
                  : "")}
              letf.{" "}
            </span>
            <span className="gamesDescription">Expires on {moment(props.currenSub.subscription_active_till).format("MMM DD, YYYY")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};