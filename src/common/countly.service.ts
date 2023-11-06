import { COUNTLY_KEY, COUNTLY_PARTNER_NAME, COUNTLY_PLATFORM, COUNTLY_SERVER_URL } from "./constants";
import { CountlyUserData } from "./countly/countly";
declare const Countly: any;

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
  Unknown = "unknown",
}

export interface UserModel {
  readonly user_id: string;
  readonly status: "active" | "inactive";
  readonly username: string | null;
  readonly first_name: string;
  readonly last_name: string;
  readonly bio: string;
  readonly age: number;
  readonly email: string;
  readonly phone: string;
  readonly type: string;
  readonly isVerified: boolean;
  readonly photo: string | null;
  readonly searchPrivacy: boolean;
  readonly partnerId: string;
  readonly gender: Gender;
}

export function initCountly() {
  Countly.init({
    // provide your app key that you retrieved from Countly dashboard
    app_key: COUNTLY_KEY,

    // Provide your server IP or name.
    // If you use your own server, make sure you have https enabled if you use
    // https below.
    url: COUNTLY_SERVER_URL,
    debug: false,
    app_version: "1.0.2",
  });
  Countly.track_sessions();
  Countly.track_clicks();
}
export function initCountlyUser(user: UserModel) {
  if (!user || user.user_id === Countly.get_device_id()) {
    console.log(user.user_id);
    console.log(Countly.get_device_id());
    return;
  }
  const idType = Countly.get_device_id_type();

  switch (idType) {
    case Countly.DeviceIdType.DEVELOPER_SUPPLIED:
      console.log("Countly.DeviceIdType.DEVELOPER_SUPPLIED : ");
      Countly.change_id(user.user_id, false);
      break;
    case Countly.DeviceIdType.SDK_GENERATED:
      console.log("Countly.DeviceIdType.SDK_GENERATED : ");
      Countly.change_id(user.user_id, true);
      break;
    case Countly.DeviceIdType.TEMPORARY_ID:
      console.log("Countly.DeviceIdType.TEMPORARY_ID : ");
      Countly.disable_offline_mode(user.user_id);
      break;
  }

  const option: CountlyUserData = {
    name: user.first_name + " " + user.last_name,
  };

  switch (user.gender) {
    case Gender.Male:
      option.gender = "M";
      break;
    case Gender.Female:
      option.gender = "F";
  }

  if (user.username) {
    option.username = user.username;
  }

  if (user.age) {
    option.byear = new Date().getFullYear() - user.age;
  }

  if (user.photo) {
    option.picture = user.photo;
  }
  Countly.user_details(option);
}
export function startGameLandingViewEvent() {
  Countly.start_event("gameLandingView");
}

export function endGameLandingViewEvent(gameDetails: any, soruce: string, trigger: string) {
  var gameLanding = {
    key: "gameLandingView",
    count: 1,
    segmentation: {
      gameId: gameDetails.oplay_id,
      gameTitle: gameDetails.title,
      gameGenre: gameDetails.genre_mappings.join(", "),
      source: soruce,
      trigger: trigger,
      channel: COUNTLY_PLATFORM,
      partner: COUNTLY_PARTNER_NAME,
    },
  };
  Countly.end_event(gameLanding);
}

export function addMenuClickedEvent(clickedMenu: string) {
  var menuClicked = {
    key: "menuClick",
    count: 1,
    segmentation: {
      homeClicked: clickedMenu === "home" ? "yes" : "no",
      gamesClicked: clickedMenu === "games" ? "yes" : "no",
      searchClicked: clickedMenu === "search" ? "yes" : "no",
      gameStatusClicked: clickedMenu === "status" ? "yes" : "no",
      profileClicked: clickedMenu === "profile" ? "yes" : "no",
      settingsClicked: clickedMenu === "settings" ? "yes" : "no",
      channel: COUNTLY_PLATFORM,
      partner: COUNTLY_PARTNER_NAME,
    },
  };
  Countly.add_event(menuClicked);
}

export function startSettingsViewEvent() {
  Countly.start_event("settingsView");
}

export function endSettingsViewEvent(settingsEvent: any) {
  Countly.end_event(settingsEvent);
}

export function addSearchResultClickedEvent(keyword: string, actionDone: boolean) {
  var menuClicked = {
    key: "search",
    count: 1,
    segmentation: {
      keyword: keyword,
      actionDone: actionDone ? "yes" : "no",
      actionType: "gameClicked",
      channel: COUNTLY_PLATFORM,
      partner: COUNTLY_PARTNER_NAME,
    },
  };
  Countly.add_event(menuClicked);
}

export function startGamePlaySettingsEvent() {
  Countly.start_event("gamePlaySettingsPageView");
}

export function endGamePlaySettingsEvent(
  gameDetails: any,
  store: string,
  changed: boolean,
  resolution: string,
  fps: string,
  vsyncEnabled: boolean,
  bitRate: number
) {
  var settingsEvent = {
    key: "gamePlaySettingsPageView",
    count: 1,
    segmentation: {
      gameId: gameDetails.oplay_id,
      gameTitle: gameDetails.title,
      gameGenre: gameDetails.genre_mappings.join(", "),
      store: store,
      advanceSettingsViewed: "no",
      settingsChanged: changed ? "yes" : "no",
      resolution: resolution,
      vsyncEnabled: vsyncEnabled ? "yes" : "no",
      fps: fps,
      bitRate: bitRate,
      channel: COUNTLY_PLATFORM,
      partner: COUNTLY_PARTNER_NAME,
    },
  };
  Countly.add_event(settingsEvent);
}

export function startGamePlayStartEvent() {
  Countly.start_event("gamePlayStart");
}

export function endGamePlayStartEvent(gameDetails: any, store: string, sessionId: string, showSettingsEnabled: boolean, result: string) {
  var settingsEvent = {
    key: "gamePlayStart",
    count: 1,
    segmentation: {
      gameSessionId: sessionId,
      gameId: gameDetails.oplay_id,
      gameTitle: gameDetails.title,
      gameGenre: gameDetails.genre_mappings.join(", "),
      store: store,
      showSettingsEnabled: showSettingsEnabled ? "yes" : "no",
      result: result,
      channel: COUNTLY_PLATFORM,
      partner: COUNTLY_PARTNER_NAME,
    },
  };
  Countly.add_event(settingsEvent);
}

export function addGameTerminateEvent(terminateEventData: any) {
  console.log("terminate data : ", terminateEventData);
  var event = {
    key: "gameTerminate",
    count: 1,
    segmentation: {
      ...terminateEventData,
      channel: COUNTLY_PLATFORM,
      partner: COUNTLY_PARTNER_NAME,
    },
  };
  Countly.add_event(event);
}
