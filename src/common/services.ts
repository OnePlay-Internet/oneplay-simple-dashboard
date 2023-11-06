import axios from "axios";
import axiosInstance from "./axiosInstance";
import { API_BASE_URL, API_CLIENT_URL, GAME_FETCH_LIMIT, SESSION_TOKEN_LOCAL_STORAGE } from "./constants";

export type QRCodeDTO = {
  success: boolean;
  message?: string;
  code?: string;
  token?: string;
};

export type LoginResponseDTO = {
  success: boolean;
  message?: string;
  sessionToken?: string;
};

export type UserProfileResponseDTO = {
  success: boolean;
  message?: string;
  profile?: { [key: string]: string } | null;
};
export type UserUpdateSearchPrivacyResponseDTO = {
  success: boolean;
  message?: string;
};
export type AllGameResponseDTO = {
  success: boolean;
  message?: string;
  games?: any[];
};
export type TopResultsDTO = {
  success: boolean;
  message?: string;
  results?: string[] | any[];
};
export type PersonalizedResponseDTO = {
  success: boolean;
  message?: string;
  feeds?: [];
};
export type GameDetailResponseDTO = {
  success: boolean;
  message?: string;
  game?: null | { [key: string]: any };
};
export type LogoutResponseDTO = {
  success: boolean;
  message?: string;
};

export type GameStatusDTO = {
  success: boolean;
  game_id?: string | null;
  game_name?: string | null;
  is_running?: boolean;
  is_user_connected?: boolean;
  resume_in_this_device?: boolean;
  session_id?: string | null;
  message?: string;
};
export type StartGameDTO = {
  code?: number;
  data?: {
    api_action?: "call_terminate" | "call_session";
    game?: {
      game_id: string;
      game_name: string;
    };
    session?: {
      id: string;
      launched_at: number;
    };
  };
  message?: string;
  status?: number;
  success: boolean;
};

export type GetClientTokenDTO = {
  data?: { client_token?: string; message?: string; progress: number };
  code?: number;
  success: boolean;
  message?: string;
};
export type GetLoadingConfigDTO = {
  tips?: any[];
  code?: number;
  success: boolean;
  message?: string;
};

export interface TokensUsageDTO {
  success: boolean;
  message: string;
  data?: {
    total_tokens: number;
    used_tokens: number;
    remaining_tokens: number;
  };
}
export async function getQRCode(): Promise<QRCodeDTO> {
  try {
    const qrCodeResponse = await axios.post(API_BASE_URL + "accounts/qr/generate");

    if (qrCodeResponse.status !== 201 && qrCodeResponse.status !== 200) {
      return handleNon200Response(qrCodeResponse.data.message);
    }
    return { success: true, code: qrCodeResponse.data.code, token: qrCodeResponse.data.token };
  } catch (error: any) {
    return handleError(error, "qr generate");
  }
}
export async function getQrSession(code: string, token: string): Promise<LoginResponseDTO> {
  try {
    const qrSesssionResponse = await axios.post(API_BASE_URL + "accounts/qr/get_session", { code, token });

    if (qrSesssionResponse.status !== 201 && qrSesssionResponse.status !== 200) {
      return handleNon200Response(qrSesssionResponse.data.message);
    }
    return { success: true, sessionToken: qrSesssionResponse.data.sessionToken };
  } catch (error: any) {
    return handleError(error, "qr get session");
  }
}
export async function login(id: string, password: string, device: string): Promise<LoginResponseDTO> {
  try {
    const loginResponse = await axios.post(API_BASE_URL + "accounts/login", {
      id,
      password,
      device,
    });

    if (loginResponse.status !== 201 && loginResponse.status !== 200) {
      return handleNon200Response(loginResponse.data.message);
    }
    return { success: true, sessionToken: loginResponse.data.session_token };
  } catch (error: any) {
    return handleError(error, "login");
  }
}
export async function getProfile(sessionToken: string): Promise<UserProfileResponseDTO> {
  try {
    const profileResp = await axios.get(API_BASE_URL + "accounts/profile", {
      headers: {
        session_token: sessionToken,
      },
    });
    if (profileResp.status !== 200) {
      return handleNon200Response(profileResp.data.message);
    }
    return { success: true, profile: profileResp.data };
  } catch (error: any) {
    return handleError(error, "get profile.");
  }
}

export async function updateProfile(sessionToken: string, body: { [key: string]: string | Blob }): Promise<UserProfileResponseDTO> {
  try {
    const formData = new FormData();
    for (const key in body) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        formData.append(key, body[key]);
      }
    }
    console.log("update profile form data : ", formData);
    const profileResp = await axios.put(API_BASE_URL + "accounts/profile", formData, {
      headers: {
        session_token: sessionToken,
      },
    });
    if (profileResp.status !== 200) {
      return handleNon200Response(profileResp.data.message);
    }
    return { success: true, profile: profileResp.data };
  } catch (error: any) {
    return handleError(error, "get profile.");
  }
}

export async function setUserSearchPrivacy(sessionToken: string, search_privacy: boolean): Promise<UserUpdateSearchPrivacyResponseDTO> {
  try {
    const response = await axios.put(
      API_BASE_URL + "accounts/set_search_privacy",
      { search_privacy },
      {
        headers: {
          session_token: sessionToken,
        },
      }
    );
    console.log("search privacy : ", response.data);
    if (response.status !== 200 && response.status !== 201) {
      return handleNon200Response(response.data.message);
    }
    return { success: response.data?.success };
  } catch (error: any) {
    return handleError(error, "set search privacy.");
  }
}
export async function getPersonalizedFeed(sessionToken: string): Promise<PersonalizedResponseDTO> {
  try {
    const pFeedResp = await axios.get(API_BASE_URL + `games/feed/personalized?textBackground=290x185&textLogo=400x320&poster=528x704`, {
      headers: {
        session_token: sessionToken,
      },
    });
    if (pFeedResp.status !== 200) {
      return handleNon200Response(pFeedResp.data.message);
    }
    return {
      success: true,
      feeds: pFeedResp.data,
    };
  } catch (error: any) {
    return handleError(error, "get personalized feed");
  }
}

export async function getAllGames(sessionToken: string, page: number = 0, limit: number = GAME_FETCH_LIMIT): Promise<AllGameResponseDTO> {
  try {
    const allGameResp = await axios.post(
      API_BASE_URL + `games/feed/custom?page=${page}&limit=${limit}`, //&textBackground=320x240&textLogo=640x480&background=1920x1080&poster=265x352
      { order_by: "release_date:desc" },
      {
        headers: {
          session_token: sessionToken,
        },
      }
    );
    if (allGameResp.status !== 201 && allGameResp.status !== 200) {
      return handleNon200Response(allGameResp.data.message);
    }
    return {
      success: true,
      games: allGameResp.data,
    };
  } catch (error: any) {
    return handleError(error, "get games");
  }
}
export async function getGameDetails(gameId: string, sessionToken: string): Promise<GameDetailResponseDTO> {
  try {
    const gameDetailResp = await axios.get(`${API_BASE_URL}games/${gameId}/info`, {
      headers: {
        session_token: sessionToken,
      },
    });
    if (gameDetailResp.status !== 200) {
      return handleNon200Response(gameDetailResp.data.message);
    }
    return { success: true, game: gameDetailResp.data };
  } catch (error: any) {
    return handleError(error, "get game details");
  }
}
export async function searchGame(
  sessionToken: string,
  query: string,
  page: number = 0,
  limit: number = GAME_FETCH_LIMIT
): Promise<AllGameResponseDTO> {
  try {
    const gameSearchResponse = await axios.get(`${API_BASE_URL}games/search?query=${query}&page=${page}&limit=${limit}`, {
      headers: {
        session_token: sessionToken,
      },
    });
    if (gameSearchResponse.status !== 200) {
      return handleNon200Response(gameSearchResponse.data.message);
    }
    return { success: true, games: gameSearchResponse.data.results };
  } catch (error: any) {
    return handleError(error, "search games");
  }
}
export async function customFeedGames(
  sessionToken: string,
  body: {
    [key: string]: string | number | boolean;
  },
  page: number = 0,
  limit: number = GAME_FETCH_LIMIT,
  addPagination: boolean = true
): Promise<AllGameResponseDTO> {
  try {
    let url = `${API_BASE_URL}games/feed/custom?textBackground=290x185`;
    if (addPagination) {
      url += `&page=${page}&limit=${limit}`;
    }
    const gameSearchResponse = await axios.post(url, body, {
      headers: {
        session_token: sessionToken,
      },
    });
    if (gameSearchResponse.status !== 201 && gameSearchResponse.status !== 200) {
      return handleNon200Response(gameSearchResponse.data.message);
    }
    return { success: true, games: gameSearchResponse.data };
  } catch (error: any) {
    return handleError(error, "custom feed");
  }
}
export async function getSimilarGames(sessionToken: string, gameId: string): Promise<AllGameResponseDTO> {
  try {
    const similarGameResp = await axios.get(`${API_BASE_URL}games/${gameId}/similar?textBackground=290x185`, {
      headers: {
        session_token: sessionToken,
      },
    });
    if (similarGameResp.status !== 200) {
      return handleNon200Response(similarGameResp.data.message);
    }
    return { success: true, games: similarGameResp.data };
  } catch (error: any) {
    return handleError(error, "similar games");
  }
}
export async function getTopResults(sessionToken: string, top: string, limit: number): Promise<TopResultsDTO> {
  try {
    const similarGameResp = await axios.get(`${API_BASE_URL}games/${top}?limit=${limit}`, {
      headers: {
        session_token: sessionToken,
      },
    });
    if (similarGameResp.status !== 200) {
      return handleNon200Response(similarGameResp.data.message);
    }
    return { success: true, results: similarGameResp.data };
  } catch (error: any) {
    return handleError(error, "top genres");
  }
}
export async function getCurrentSubscriptions(sessionToken: string) {
  try {
    const subscriptionListResponse = await axios.get(`${API_BASE_URL}accounts/subscription/current`, {
      headers: {
        session_token: sessionToken,
      },
    });
    if (subscriptionListResponse.status !== 200) {
      return handleNon200Response(subscriptionListResponse.data.message);
    }
    return { success: true, subscriptions: subscriptionListResponse.data };
  } catch (error: any) {
    return handleError(error, "current subscriptions");
  }
}
export async function getUsersWishlist(sessionToken: string) {
  try {
    const wishlistResp = await axios.get(`${API_BASE_URL}accounts/wishlist`, {
      headers: {
        session_token: sessionToken,
      },
    });
    if (wishlistResp.status !== 200) {
      return handleNon200Response(wishlistResp.data.message);
    }
    return { success: true, wishlist: wishlistResp.data };
  } catch (error: any) {
    return handleError(error, "wishlist");
  }
}
export async function getUsersSessions(sessionToken: string) {
  try {
    const sesstionsResp = await axios.get(`${API_BASE_URL}accounts/sessions`, {
      headers: {
        session_token: sessionToken,
      },
    });
    if (sesstionsResp.status !== 200) {
      return handleNon200Response(sesstionsResp.data.message);
    }
    return { success: true, sessions: sesstionsResp.data };
  } catch (error: any) {
    return handleError(error, "wishlist");
  }
}
export async function sessionLogout(sessionKey: string, sessionToken: string): Promise<LogoutResponseDTO> {
  try {
    const logoutResp = await axios.delete(`${API_BASE_URL}accounts/sessions/${sessionKey}`, {
      headers: {
        session_token: sessionToken,
      },
    });
    if (logoutResp.status !== 200) {
      return handleNon200Response(logoutResp.data.msg);
    }
    return { success: true };
  } catch (error: any) {
    return handleError(error, "logout");
  }
}
export async function logout(sessionToken: string): Promise<LogoutResponseDTO> {
  try {
    const [userId, session] = atob(sessionToken)?.split(":");
    if (userId && session) {
      const logoutResp = await axios.delete(`${API_BASE_URL}accounts/sessions/user:${userId}:session:${session}`, {
        headers: {
          session_token: sessionToken,
        },
      });
      if (logoutResp.status !== 200) {
        return handleNon200Response(logoutResp.data.msg);
      }
      return { success: true };
    }
    return { success: false, message: "Invalid session." };
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      return { success: true };
    } else {
      return handleError(error, "logout");
    }
  }
}
export async function deleteAllSessionData(userId: string, sessionId: string) {
  try {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("session_token", sessionId);
    const deleteAllSessionDataResp = await axios.post(`${API_CLIENT_URL}/services/v2/delete_user_data`, formData);
    if (deleteAllSessionDataResp.status !== 200) {
      return handleNon200Response(deleteAllSessionDataResp.data.msg);
    }
    return {
      success: true,
    };
  } catch (error: any) {
    return handleError(error, " delete session data");
  }
}
export async function getAnyActiveSessionStatus(userId: string, sessionId: string): Promise<GameStatusDTO> {
  try {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("session_token", sessionId);
    const anyActiveSessionResp = await axios.post(`${API_CLIENT_URL}/services/v2/get_any_active_session_status`, formData);
    if (anyActiveSessionResp.status !== 200) {
      return handleNon200Response(anyActiveSessionResp.data.msg);
    }
    return {
      success: true,
      game_id: anyActiveSessionResp.data?.data?.game_id ?? null,
      game_name: anyActiveSessionResp.data?.data?.game_name ?? null,
      is_running: anyActiveSessionResp.data?.data?.is_running ?? false,
      is_user_connected: anyActiveSessionResp.data?.data?.is_user_connected ?? false,
      resume_in_this_device: anyActiveSessionResp.data?.data?.resume_in_this_device ?? false,
      session_id: anyActiveSessionResp.data?.data?.session_id ?? null,
    };
  } catch (error: any) {
    return handleError(error, " active session status");
  }
}

export async function getTokensUsage(sessionToken: string): Promise<TokensUsageDTO> {
  try {
    const tokenUsage = await axios.get(`${API_BASE_URL}accounts/subscription/remaining_stream_time`, {
      headers: {
        session_token: sessionToken,
      },
    });
    if (tokenUsage.status !== 200) {
      return handleNon200Response(tokenUsage.data.msg);
    }
    return { success: true, message: "", data: tokenUsage.data };
  } catch (error: any) {
    return handleError(error, "remaining_stream_time");
  }
}
export async function startGame(
  userId: string,
  sessionId: string,
  gameId: string,
  resolution: string,
  is_vsync_enabled: boolean,
  fps: number,
  bitrate: number,
  storeName: string
): Promise<StartGameDTO> {
  const payload: { [key: string]: string | boolean | number } = {
    resolution,
    is_vsync_enabled,
    fps,
    bitrate,
  };
  if (storeName) {
    payload.store = storeName.replace(/\s/g, "").toLowerCase();
  }
  try {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("session_token", sessionId);
    formData.append("game_id", gameId);
    formData.append("launch_payload", JSON.stringify(payload));
    const startGameResp = await axios.post(`${API_CLIENT_URL}/services/v2/start_game`, formData);
    if (startGameResp.status !== 200) {
      return handleNon200Response(startGameResp.data.msg);
    }
    return {
      success: true,
      ...startGameResp.data,
      message: startGameResp.data?.msg,
    };
  } catch (error: any) {
    if (!error.response) {
      return handleError(error, "start game");
    }
    if (error.response.code === 801) {
      return {
        success: false,
        ...error.response.data,
        message: error.response.data?.msg,
      };
    }
    return {
      success: false,
      ...error.response.data,
      message: error.response.data?.msg,
    };
  }
}
export async function terminateGame(userId: string, sessionToken: string, sessionId: string) {
  try {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("session_token", sessionToken);
    formData.append("session_id", sessionId);
    const terminateGameResp = await axios.post(`${API_CLIENT_URL}/services/v2/terminate_stream`, formData);

    if (terminateGameResp.status !== 200) {
      return handleNon200Response(terminateGameResp.data.msg);
    }
    return {
      success: true,
      data: terminateGameResp.data.data,
      message: terminateGameResp.data?.msg,
    };
  } catch (error: any) {
    return handleError(error, "terminate game");
  }
}
export async function getGameConfig(userId: string, sessionToken: string): Promise<GetLoadingConfigDTO> {
  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("session_token", sessionToken);
  formData.append("type", "tips");
  formData.append("client_type", "tizen");
  formData.append("client_version", "1.0.0");
  try {
    const configResp = await axios.post(`${API_CLIENT_URL}/services/v2/get_config`, formData);
    if (configResp.status !== 200) {
      return handleNon200Response(configResp.data.msg);
    }
    return {
      success: true,
      message: configResp.data?.msg,
      tips: configResp.data?.data.at(0).tips,
      code: configResp.data?.code,
    };
  } catch (error: any) {
    if (!error.response) {
      return handleError(error, "get config");
    }
    return {
      success: true,
      code: error.response.data?.code,
      message: error.response.data?.msg,
    };
  }
}
export async function getClientToken(userId: string, sessionToken: string, sessionId: string): Promise<GetClientTokenDTO> {
  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("session_token", sessionToken);
  formData.append("session_id", sessionId);
  try {
    const clinetTokenResp = await axios.post(`${API_CLIENT_URL}/services/v2/get_session`, formData);
    if (clinetTokenResp.status !== 200) {
      return handleNon200Response(clinetTokenResp.data.msg);
    }
    return {
      success: true,
      message: clinetTokenResp.data?.msg,
      data: {
        client_token: clinetTokenResp.data?.data.client_token,
        message: clinetTokenResp.data?.data.msg,
        progress: clinetTokenResp.data?.data.progress,
      },
      code: clinetTokenResp.data?.code,
    };
  } catch (error: any) {
    if (!error.response) {
      return handleError(error, "get client token");
    }
    return {
      success: true,
      code: error.response.data?.code,
      message: error.response.data?.msg,
    };
  }
}
export async function getStreamingSessionInfo(streamSessionToken: string): Promise<{ [key: string]: any }> {
  const formData = new FormData();
  formData.append("stream_session_token", streamSessionToken);

  try {
    const sessionInfoResp = await axios.post(`${API_CLIENT_URL}/client/v2/get_session`, formData);
    if (sessionInfoResp.status !== 200) {
      return handleNon200Response(sessionInfoResp.data.msg);
    }
    return {
      success: true,
      message: sessionInfoResp.data?.msg,
      streamInfo: sessionInfoResp.data,
    };
  } catch (error: any) {
    if (!error.response) {
      return handleError(error, "get stream session");
    }
    return {
      success: true,
      code: error.response.data?.code,
      message: error.response.data?.msg,
    };
  }
}
export async function setPin(host: string, port: string, sessionKey: string): Promise<{ [key: string]: any }> {
  try {
    const url = `https://${host}:${port}/api/setpin`;
    const pin = sessionKey;
    const sessionInfoResp = await axios.get(`https://client-apis.oneplay.in/backend/redirect?url=${url}&pin=${pin}`);
    if (sessionInfoResp.status !== 200) {
      return handleNon200Response(sessionInfoResp.data.msg);
    }
    console.log("set pin resp : ", sessionInfoResp);
    return {
      success: true,
      message: sessionInfoResp.data?.msg,
      streamInfo: sessionInfoResp.data,
    };
  } catch (error: any) {
    if (!error.response) {
      return handleError(error, "setpin");
    }
    return {
      success: true,
      code: error.response.data?.code,
      message: error.response.data?.msg,
    };
  }
}
function handleError(error: any, operation: string = "") {
  let errorMessage = null;
  if (error.response) {
    errorMessage =
      error.response.data?.message ?? error.response.data?.msg ?? null;
  } else if (!errorMessage && error.message) {
    errorMessage = error.message;
  }
  if (!errorMessage) {
    errorMessage = `Something went wrong, ${
      operation ? "could not complete " + operation : ""
    } `;
  }
  return { success: false, message: errorMessage };
}

function handleNon200Response(message: string) {
  return {
    success: false,
    message: message,
  };
}
