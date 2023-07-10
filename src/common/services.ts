import axios from "axios";
import {
  API_BASE_URL,
  API_CLIENT_URL,
  GAME_FETCH_LIMIT,
  SESSION_TOKEN_LOCAL_STORAGE,
} from "./constants";

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
export type AllGameResponseDTO = {
  success: boolean;
  message?: string;
  games?: [];
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
  data?: { client_token?: string; message?: string };
  code?: number;
  success: boolean;
  message?: string;
};
export async function login(
  id: string,
  password: string,
  device: string
): Promise<LoginResponseDTO> {
  try {
    const loginResponse = await axios.post(API_BASE_URL + "accounts/login", {
      id,
      password,
      device,
    });
    if (loginResponse.status !== 200) {
      return handleNon200Response(loginResponse.data.message);
    }
    return { success: true, sessionToken: loginResponse.data.session_token };
  } catch (error: any) {
    return handleError(error, "login");
  }
}
export async function getProfile(
  sessionToken: string
): Promise<UserProfileResponseDTO> {
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
export async function getAllGames(
  sessionToken: string,
  page: number = 0,
  limit: number = GAME_FETCH_LIMIT
): Promise<AllGameResponseDTO> {
  try {
    const allGameResp = await axios.get(
      API_BASE_URL +
        `games?page=${page}&limit=${limit}&textBackground=320x240&textLogo=640x480&background=1920x1080&poster=265x352`,
      {
        headers: {
          session_token: sessionToken,
        },
      }
    );
    if (allGameResp.status !== 200) {
      return handleNon200Response(allGameResp.data.message);
    }
    return { success: true, games: allGameResp.data };
  } catch (error: any) {
    return handleError(error, "get games");
  }
}
export async function getGameDetails(
  gameId: string,
  sessionToken: string
): Promise<GameDetailResponseDTO> {
  try {
    const gameDetailResp = await axios.get(
      `${API_BASE_URL}games/${gameId}/info`,
      {
        headers: {
          session_token: sessionToken,
        },
      }
    );
    if (gameDetailResp.status !== 200) {
      return handleNon200Response(gameDetailResp.data.message);
    }
    return { success: true, game: gameDetailResp.data };
  } catch (error: any) {
    return handleError(error, "get game details");
  }
}
export async function logout(sessionToken: string): Promise<LogoutResponseDTO> {
  try {
    const [userId, session] = atob(sessionToken)?.split(":");
    if (userId && session) {
      const logoutResp = await axios.delete(
        `${API_BASE_URL}accounts/sessions/user:${userId}:session:${session}`,
        {
          headers: {
            session_token: sessionToken,
          },
        }
      );
      if (logoutResp.status !== 200) {
        return handleNon200Response(logoutResp.data.msg);
      }
      return { success: true };
    }
    return { success: false, message: "Invalid session." };
  } catch (error: any) {
    return handleError(error, "logout");
  }
}

export async function getAnyActiveSessionStatus(
  userId: string,
  sessionId: string
): Promise<GameStatusDTO> {
  try {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("session_token", sessionId);
    const anyActiveSessionResp = await axios.post(
      `${API_CLIENT_URL}/services/v2/get_any_active_session_status`,
      formData
    );
    if (anyActiveSessionResp.status !== 200) {
      return handleNon200Response(anyActiveSessionResp.data.msg);
    }
    return {
      success: true,
      game_id: anyActiveSessionResp.data?.data?.game_id ?? null,
      game_name: anyActiveSessionResp.data?.data?.game_name ?? null,
      is_running: anyActiveSessionResp.data?.data?.is_running ?? false,
      is_user_connected:
        anyActiveSessionResp.data?.data?.is_user_connected ?? false,
      resume_in_this_device:
        anyActiveSessionResp.data?.data?.resume_in_this_device ?? false,
      session_id: anyActiveSessionResp.data?.data?.session_id ?? null,
    };
  } catch (error: any) {
    return handleError(error, " active session status");
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
    const startGameResp = await axios.post(
      `${API_CLIENT_URL}/services/v2/start_game`,
      formData
    );

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
    return {
      success: true,
      ...error.response.data,
      message: error.response.data?.msg,
    };
  }
}
export async function terminateGame(
  userId: string,
  sessionToken: string,
  sessionId: string
) {
  try {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("session_token", sessionToken);
    formData.append("session_id", sessionId);
    const terminateGameResp = await axios.post(
      `${API_CLIENT_URL}/services/v2/terminate_stream`,
      formData
    );

    if (terminateGameResp.status !== 200) {
      return handleNon200Response(terminateGameResp.data.msg);
    }
    return {
      success: true,
      message: terminateGameResp.data?.msg,
    };
  } catch (error: any) {
    return handleError(error, "terminate game");
  }
}
export async function getClientToken(
  userId: string,
  sessionToken: string,
  sessionId: string
): Promise<GetClientTokenDTO> {
  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("session_token", sessionToken);
  formData.append("session_id", sessionId);
  try {
    const clinetTokenResp = await axios.post(
      `${API_CLIENT_URL}/services/v2/get_session`,
      formData
    );
    if (clinetTokenResp.status !== 200) {
      return handleNon200Response(clinetTokenResp.data.msg);
    }
    return {
      success: true,
      message: clinetTokenResp.data?.msg,
      data: {
        client_token: clinetTokenResp.data?.data.client_token,
        message: clinetTokenResp.data?.data.msg,
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
export async function getStreamingSessionInfo(
  streamSessionToken: string
): Promise<{ [key: string]: any }> {
  const formData = new FormData();
  formData.append("stream_session_token", streamSessionToken);

  try {
    const sessionInfoResp = await axios.post(
      `${API_CLIENT_URL}/client/v2/get_session`,
      formData
    );
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
