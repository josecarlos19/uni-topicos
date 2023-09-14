import { axiosAuth } from "../axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const useAxiosAuth = () => {
  const { data: session } = useSession();

  useEffect(() => {
    const requestInterceptor = axiosAuth.interceptors.request.use((config) => {
      if (!config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${session?.user.accessToken}`;
      }
      return config;
    });
    return () => {
      axiosAuth.interceptors.request.eject(requestInterceptor);
    };
  }, [session]);

  return axiosAuth;
};

export default useAxiosAuth;
