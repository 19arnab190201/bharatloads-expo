// src/hooks/useApi.js
import { useState } from "react";
import axios from "axios";
import { token } from "../context/AuthProvider";
const useApi = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = async (url, method = "get", body = null, ...rest) => {
    setLoading(true);
    console.log("url", url);

    console.log("headers");
    try {
      const response = await axios(
        {
          method,
          url: process.env.EXPO_PUBLIC_API_URL + url,
          data: body,
        },
        {
          ...rest,
        }
      );

      console.log("response", response);

      setData(response.data);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err);
      setLoading(false);
      console.log("err", err);
      throw err;
    }
  };

  return { data, error, loading, request };
};

export default useApi;
