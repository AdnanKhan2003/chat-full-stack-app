import { useState } from "react";

export const useFetch = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (url, options = {}) => {
      setIsLoading(true);
      setError(null);

    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Request Failed!");
      }

      const resData = await res.json();

      setData(resData);

      return resData;
    } catch (err) {
      setError(err.message || "Something Went Wrong!");
      return null;
    } finally {
      setIsLoading(false);
    }

  };

  return { data, error, isLoading, fetchData }
};
