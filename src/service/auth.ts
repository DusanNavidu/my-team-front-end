import api from "./api"

export const login = async (username: string, password: string) => {
  const res = await api.post("/auth/login", { email: username, password })

  return res.data
}

export const register = async (fullname: string, email: string, password: string) => {
  const res = await api.post("/auth/register", { fullname, email, password })

  return res.data
}

export const getMyDetails = async () => {
  const res = await api.get("/auth/me")
  return res.data
}

export const refreshTokens = async (refreshToken: string) => {
  const res = await api.post("/auth/refresh", {
    token: refreshToken
  })
  return res.data
}

export const getRole = async () => {
  const res = await api.get("/auth/role")
  return res.data
}

export interface UserData {
  _id: string;
  fullname: string;
  email: string;
  roles: string[];
  status: "ACTIVE" | "DEACTIVE";
  createdAt: string;
  updatedAt: string;
}

export const getAllUsers = async (page: number = 1) => {
  try {
    const response = await api.get(`/auth/admin/getallusers?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

export const getAllOrganizers = async (page: number = 1) => {
  try {
    const response = await api.get(`/auth/admin/getallorganizers?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all organizers:", error);
    throw error;
  }
};

export const getAllPlayers = async (page: number = 1) => {
  try {
      const response = await api.get(`/auth/admin/getallplayers?page=${page}`);
      return response.data; 
  } catch (error) {
      console.error("Error fetching all players:", error);
      throw error;
  }
}

export const getAllUsersByRole = async (page: number = 1) => {
  try {
    const response = await api.get(`/auth/admin/getallusersbyrole?page=${page}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}

export const getAllActiveUsers = async (page: number = 1) => {
  try {
    const response = await api.get(`/auth/admin/getallactiveusers?page=${page}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching all active users:", error);
    throw error;
  }
}

export const getAllDeactivatedUsers = async (page: number = 1) => {
  try {
    const response = await api.get(`/auth/admin/getalldeactivatedusers?page=${page}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching all deactivated users:", error);
    throw error;
  }
}

export const searchUsers = async (query: string, page: number = 1) => {
  const response = await api.get(`/auth/admin/search?query=${encodeURIComponent(query)}&page=${page}`);
  return response.data; 
};

export const getAllUsersCount = async () => {
  const res = await api.get("/auth/admin/getalluserscount");
  return res.data.data.totalUsers;
};

export const getAllOrganizersCount = async () => {
  const res = await api.get("/auth/admin/getallorganizerscount");
  return res.data.data.totalOrganizers;
};

export const getAllPlayersCount = async () => {
  const res = await api.get("/auth/admin/getallplayerscount");
  return res.data.data.totalPlayers;
};

export const getAllUsersByRoleCount = async () => {
  const res = await api.get("/auth/admin/getallusersbyrolecount");
  console.log("Response data for users by role count:", res.data);
  return res.data.data.totalUsersByRole;
};

export const getAllActiveUsersCount = async () => {
  const res = await api.get("/auth/admin/getallactiveuserscount");
  return res.data.data.totalActiveUsers;
};

export const getAllDeactivatedUsersCount = async () => {
  const res = await api.get("/auth/admin/getalldeactivateduserscount");
  return res.data.data.totalDeactiveUsers;
};

export const updateUser = async (userId: string, data: Partial<UserData>) => {
  const res = await api.put(`/auth/admin/user/${userId}`, data);
  return res.data;
};

export const changeUserStatus = async (userId: string) => {
  const res = await api.put(`/auth/admin/user/${userId}/status`);
  return res.data;
};

export const changeUserRoleToPlayer = async (userId: string) => {
  const res = await api.put(`/auth/roleUpdate/player/${userId}`);
  return res.data;
};

export const getPlayerProfiles = async () => {
  const res = await api.get("/auth/player/playersprofiles");
  return res.data;
}

export const getPlayerProfileById = async (id: string) => {
    const response = await api.get(`/auth/player/profile/${id}`);
    return response.data;
};

export const getAllUserFullnames = async () => {
    const res = await api.get("/auth/user/fullnames");
    return res.data;
};