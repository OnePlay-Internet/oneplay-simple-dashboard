import { useNavigate } from "react-router-dom";
import Clock from "../../../assets/images/setting/Alarm.svg";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "src/App";
import { getCurrentSubscriptions } from "src/common/services";
import Swal from "sweetalert2";
import { SESSION_TOKEN_LOCAL_STORAGE } from "src/common/constants";
import moment from "moment";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";

export default function SubscriptionComponent({
  focusKey: focusKeyParam,
  parentFocus: parentFocusParam,
}: FocusabelChildComponentProps) {
  const navigate = useNavigate();
  const sessionContext = useContext(SessionContext);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const { focusSelf, focusKey, setFocus } = useFocusable({
    trackChildren: true,
    focusKey: focusKeyParam,
  });
  useEffect(() => {
    if (
      subscriptions.length &&
      subscriptions.at(0).subscription_status === "active"
    ) {
      setFocus("current-renew");
    } else {
      setFocus("buy-now");
    }
  }, [focusSelf, parentFocusParam, subscriptions]);
  useEffect(() => {
    (async () => {
      const subscriptionResp: any = await getCurrentSubscriptions(
        sessionContext.sessionToken
      );
      if (!subscriptionResp.success) {
        Swal.fire({
          title: "Error!",
          text: subscriptionResp.message,
          icon: "error",
          confirmButtonText: "OK",
        });
        localStorage.removeItem(SESSION_TOKEN_LOCAL_STORAGE);
        sessionContext.setSessionToken(null);
        navigate("/");
        return;
      }
      setSubscriptions(subscriptionResp.subscriptions);
      if (
        subscriptionResp.subscriptions.length &&
        subscriptionResp.subscriptions.at(0).subscription_status === "active"
      ) {
        setFocus("current-renew");
      } else {
        setFocus("buy-now");
      }
    })();
  }, [sessionContext]);

  const renderCurrentPlan = () => {
    if (
      subscriptions.length &&
      subscriptions.at(0).subscription_status === "active"
    ) {
      const currenSub = subscriptions.at(0);
      return (
        <div className="card cardBG border-0">
          <div className="card-body">
            <div className="row">
              <div className="col">
                <p className="gamesDescription mb-0">
                  {currenSub.subscriptionPackage.plan_name} (
                  {currenSub.subscriptionPackage.package_type === "base"
                    ? "Base Plan"
                    : "Addon"}
                  )
                </p>
                <h1 className="price">
                  ₹ {parseFloat(currenSub.brought_price).toFixed(2)}
                </h1>
                <img src={Clock} className="img-fluid me-2" alt="" />
                <span className="smallText">
                  {(Math.floor(currenSub.remaining_tokens / 60) > 0
                    ? Math.floor(currenSub.remaining_tokens / 60) + "h "
                    : "") +
                    (currenSub.remaining_tokens % 60 > 0
                      ? (currenSub.remaining_tokens % 60).toFixed(0) + "m"
                      : "")}
                  /
                  {(Math.floor(
                    currenSub.subscriptionPackage.total_offered_tokens / 60
                  ) > 0
                    ? Math.floor(
                        currenSub.subscriptionPackage.total_offered_tokens / 60
                      ) + "h "
                    : "") +
                    (currenSub.subscriptionPackage.total_offered_tokens % 60 > 0
                      ? (
                          currenSub.subscriptionPackage.total_offered_tokens %
                          60
                        ).toFixed(0) + "m"
                      : "")}
                  letf.{" "}
                </span>
                <span className="gamesDescription">
                  Expires on{" "}
                  {moment(currenSub.subscription_active_till).format(
                    "MMM DD, YYYY"
                  )}
                </span>
              </div>
              <div className="col-auto align-self-center">
                <FocusableButton
                  focusKeyParam="current-renew"
                  onClick={() => {
                    window.location.replace(
                      "https://www.oneream.com/subscription.html"
                    );
                  }}
                >
                  Renew
                </FocusableButton>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  const renderSingleSubscriptionRow = (subscription: any) => {
    return (
      <FocusableTr
        key={subscription.id}
        focusKeyParam={"sub_" + subscription.id}
      >
        <td>
          {moment(subscription.subscription_brought_at_time).format(
            "DD.MM.YYYY"
          )}
        </td>
        <td>
          <p className="mb-1">{subscription.subscriptionPackage.plan_name}</p>
          <p className="mb-0 gamesDescription">
            {subscription.subscriptionPackage.plan_description}
          </p>
        </td>
        <td> ₹ {parseFloat(subscription.brought_price).toFixed(2)}</td>
        <td className="gradientText" style={{ textTransform: "capitalize" }}>
          {subscription.subscription_status}
        </td>
        <td className="mb-1">
          {moment(subscription.subscription_active_from).format("DD.MM.YYYY")}
        </td>
        <td className="mb-1">
          {moment(subscription.subscription_active_till).format("DD.MM.YYYY")}
        </td>
      </FocusableTr>
    );
  };
  return (
    <FocusContext.Provider value={focusKey}>
      <div className="row">
        <div className="col-lg-10 col-md-10 ps-4">
          {subscriptions.length &&
          subscriptions.at(0).subscription_status === "active" ? (
            <p className="GamesTitle">Current Subscription</p>
          ) : (
            <div className="col-auto align-self-center">
              <p className="GamesTitle">You don't have active subscription.</p>
              <FocusableButton
                focusKeyParam="buy-now"
                onClick={() => {
                  window.location.replace(
                    "https://www.oneream.com/subscription.html"
                  );
                }}
              >
                Buy Now
              </FocusableButton>
            </div>
          )}
          {renderCurrentPlan()}
          <p className="GamesTitle mt-4">Subscription History</p>
          <div className="table-responsive">
            <table className="table table-dark align-middle customTable table-lg">
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
              <tbody>
                {subscriptions.map((sub) => renderSingleSubscriptionRow(sub))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
}

const FocusableButton = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {
      props.onClick();
    },
    onArrowPress: (direction, keyProps, details) => {
      switch (direction) {
        case "right":
        case "left":
          setFocus("go-to-profile");
          return false;
        default:
          return true;
      }
    },
  });
  return (
    <button
      ref={ref}
      className={
        "btn gradientBtn px-4 border-0" + (focused ? " focusedElement" : "")
      }
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

const FocusableTr = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    trackChildren: true,
    onArrowPress: (direction, keyProps, details) => {
      switch (direction) {
        case "right":
        case "left":
          setFocus("go-to-profile");
          return false;
        default:
          return true;
      }
    },
  });
  return (
    <tr ref={ref} className={focused ? " focusedElement" : ""}>
      {props.children}
    </tr>
  );
};
