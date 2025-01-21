import axios from "axios";

const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
const axiosInstance = axios.create({
  baseURL: apiEndpoint,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authTokens = JSON.parse(localStorage.getItem('authTokens'));
    const token = authTokens?.accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
   
    
    const originalRequest = error.config;
    if (error.response.status === 401) {
      const firstMessage = error?.response?.data?.messages?.[0];
      if (firstMessage?.token_class === 'AccessToken' && firstMessage?.message === 'Token is invalid or expired') {
        const accessToken = await refreshAccessToken();
        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
        return axiosInstance(originalRequest);
      } else if (firstMessage?.token_class === 'RefreshToken' && firstMessage?.message === 'Token is invalid or expired') {
        handleRefreshTokenFailure();
      }
      return Promise.reject(error);
    } else if (error.response && (error.response.status === 400 || error.response.status === 404) || error.response.status === 500) {
     
      return Promise.reject(error);
    } else {
      
      return Promise.reject(error);
    }
  }
);

const refreshAccessToken = async () => {
  const authTokens = JSON.parse(localStorage.getItem('authTokens'));
  const refreshToken = authTokens.refreshToken;
  const data = { "refresh": refreshToken };
  try {
    const response = await axios.post(`${apiEndpoint}api/token/refresh/`, data);
    const accessToken = response.data.access;
    let newAuthTokens = JSON.stringify({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
    localStorage.setItem('authTokens', newAuthTokens);
    return accessToken;
  } catch (err) {
    handleRefreshTokenFailure();
  }
};

const handleRefreshTokenFailure = () => {
  localStorage.clear();
  window.location.replace('/login');
};

const axiosPrivate = axiosInstance;
export { axiosPrivate,axiosInstance };
