import axios from "axios";
import { jwtDecode } from "jwt-decode";

function isTokenExpired(token) {
  if (!token) {
    return true;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    return true;
  }
}

const useAxiosInterceptor = () => {
  const apiClient = axios.create();

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    async (config) => {
      const token = localStorage.getItem("accessToken");

      if (token != null) {
        if (isTokenExpired(token)) {
          console.log("Access token expired");

          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;

          const response = await apiClient.get(
            `http://localhost:8383/staff/getbyid/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log(response);

          const { accesstoken } = response.data;
          console.log("Access token: " + accesstoken);
          localStorage.setItem("accessToken", accesstoken);

          config.headers["Authorization"] = `Bearer ${accesstoken}`;
        } else {
          console.log("Access token is valid");
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      if (error.response && error.response.status === 403) {
        // localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );
};

export default useAxiosInterceptor;

