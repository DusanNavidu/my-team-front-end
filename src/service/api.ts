// axiosConfig (Frontend)

import axios, { AxiosError } from "axios"
import { refreshTokens } from "./auth"

const api = axios.create({
  baseURL: "https://my-team-back-end.vercel.app/api/v1",
  withCredentials: true
});


const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register"]

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url))

  if (!isPublic && token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config

    if (
      error.response?.status === 401 &&
      !PUBLIC_ENDPOINTS.some((url) => originalRequest.url?.includes(url)) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) throw new Error("No refresh token available")

        const data = await refreshTokens(refreshToken)
        localStorage.setItem("accessToken", data.accessToken)

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return axios(originalRequest)
      } catch (refreshErr) {
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("accessToken")
        window.location.href = "/login"
        return Promise.reject(refreshErr)
      }
    }
    return Promise.reject(error)
  }
)

export default api