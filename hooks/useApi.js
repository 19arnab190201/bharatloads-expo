// src/hooks/useApi.js
import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useApi = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = async (url, method = "get", body = null) => {
    setLoading(true);
    console.log("url", url);
    try {
      let user = await AsyncStorage.getItem("user");
      user = JSON.parse(user);

      console.log("user444", user);

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      };

      const response = await axios({
        method,
        url: process.env.EXPO_PUBLIC_API_URL + url,
        data: body,
        headers,
      });

      console.log("response", response);

      setData(response.data);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return { data, error, loading, request };
};

export default useApi;
