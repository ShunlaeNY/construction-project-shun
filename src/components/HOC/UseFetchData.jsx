import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function useFetchData(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(url,{
        // headers: {
          "otmm-api-key": "KoaderMasters",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        // },
      }); // interceptor adds the token
      setData(response.data);
    } catch (err) {
      console.error("Error fetching data:", err.response?.data || err.message);
      setError(err);
      // navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}


// import { useState, useEffect } from "react";

// export const useFetchData = (url, dependency = null) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const refetch = async () => {
//     setLoading(true);
    
//     // Skip invalid URLs or URLs with null/undefined parameters
//     if (!url || url.includes('/null') || url.includes('/undefined')) {
//       console.log(`Skipping invalid request to: ${url}`);
//       setData([]);
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(url);
      
//       if (!response.ok) {
//         // For 404 errors, return empty array instead of throwing
//         if (response.status === 404) {
//           console.log(`Resource not found at: ${url}`);
//           setData([]);
//           setLoading(false);
//           return;
//         }
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
      
//       const result = await response.json();
//       setData(Array.isArray(result) ? result : [result]);
//     } catch (err) {
//       console.error("Error fetching data:", err.message);
//       setError(err.message);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     refetch();
//   }, [url, dependency]);

//   return { data, loading, error, refetch };
// };