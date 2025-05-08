// import { useState,useCallback } from "react";
// import axios from "axios";

// export function useCRUD() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState(null)
//   const [deleteStatus, setDeleteStatus] = useState(false); // State to track delete status

// const getAuthHeaders = () => {
//   const accessToken = localStorage.getItem("accessToken");
//   return {
//     "otmm-api-key": "KoaderMasters",
//     Authorization : `Bearer ${accessToken}`,
//     "Content-Type": "application/json",
//   }
// }

// // const refreshToken = useCallback(async() => {
// //   const refreshToken = localStorage.getItem("refreshToken");
// //   if (!refreshToken) {
// //     throw new Error("Refresh token not available");
// //   }
// //   try{
// //     const refreshResponse = await axios.post("http://localhost:8383/auth/refresh-token",{refreshToken});

// //     const newAccessToken = refreshResponse.data.accessToken;
// //     localStorage.setItem("accessToken", newAccessToken);

// //     const newRefreshToken = refreshResponse.data.refreshToken;
// //     localStorage.setItem("refreshToken", newRefreshToken);

// //     console.log("Token refreshed successfully.");
// //     return newAccessToken;
// //   }catch(e){
// //     console.error("Error refreshing token:", e)
// //     throw e
// //   }
// // },[])

// // Refetch function to get fresh data
// const refetch = useCallback(async (url) => {
//   setLoading(true)
//   setError(null)
//   try {
//     const response = await axios.get(url,{
//       headers: getAuthHeaders()
//     })
//     setData(response.data)
//     return response.data
//   } catch (err) {
//     if(err.response?.status === 401){
//       try{
//         await refreshToken()
//         const retryResponse = await axios.get(url,{
//           headers: getAuthHeaders()
//         })
//         setData(retryResponse.data)
//         return retryResponse.data
//       }catch(refreshErr){
//         console.error("Token refresh failed:", refreshErr)
//         setError(refreshErr)
//         throw refreshErr
//       }
//     }else{
//       console.error("Error fetching:", err)
//       setError(err)
//       throw err
//     }
//   } finally {
//     setLoading(false)
//   }
// }, [refreshToken])

//   // Create new record
//   // const handleCreate = async (url, newData) => {
//   //   setLoading(true);
//   //   setError(null);
//   //   try {
//   //     const response = await axios.post(url, newData);
//   //     console.log("Successfully created:", response.data);
//   //     return response.data; // Return the created record if needed
//   //   } catch (err) {
//   //     console.error("Error creating:", err);
//   //     setError(err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const handleCreate = async (url, newData) => {
//     setLoading(true)
//     setError(null)
//     try {
//       const response = await axios.post(url, newData, {
//         headers: getAuthHeaders(),
//       })
//       console.log("Successfully created:", response.data)
//       return response.data // Return the created record if needed
//     } catch (err) {
//       if (err.response?.status === 401) {
//         try {
//           await refreshToken()
//           // Retry with new token
//           const retryResponse = await axios.post(url, newData, {
//             headers: getAuthHeaders(),
//           })
//           console.log("Successfully created after token refresh:", retryResponse.data)
//           return retryResponse.data
//         } catch (refreshErr) {
//           console.error("Error refreshing token:", refreshErr)
//           setError(refreshErr)
//         }
//       } else {
//         console.error("Error creating:", err)
//         setError(err)
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Edit existing record
//   // const handleEdit = async (url, id, updatedData) => {
//   //   setLoading(true);
//   //   setError(null);
//   //   try {
//   //     const response = await axios.put(`${url}/${id}`, updatedData);
//   //     console.log("Successfully edited:", response.data);
//   //     return response.data; // Return the updated record if needed
//   //   } catch (err) {
//   //     console.error("Error editing:", err);
//   //     setError(err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const handleEdit = async (url, id, updatedData) => {
//     setLoading(true)
//     setError(null)
//     try {
//       const response = await axios.put(`${url}/${id}`, updatedData, {
//         headers: getAuthHeaders(),
//       })
//       console.log("Successfully edited:", response.data)
//       return response.data // Return the updated record if needed
//     } catch (err) {
//       if (err.response?.status === 401) {
//         try {
//           await refreshToken()
//           // Retry with new token
//           const retryResponse = await axios.put(`${url}/${id}`, updatedData, {
//             headers: getAuthHeaders(),
//           })
//           console.log("Successfully edited after token refresh:", retryResponse.data)
//           return retryResponse.data
//         } catch (refreshErr) {
//           console.error("Error refreshing token:", refreshErr)
//           setError(refreshErr)
//         }
//       } else {
//         console.error("Error editing:", err)
//         setError(err)
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Delete record
//   // const handleDelete = async (url, id) => {
//   //   setDeleteStatus(true); // Set deleteStatus to true when deleting
//   //   setLoading(true);
//   //   setError(null);
//   //   try {
//   //     const response = await axios.delete(`${url}/${id}`);
//   //     console.log("Successfully deleted:", response.data);
//   //   } catch (err) {
//   //     console.error("Error deleting:", err);
//   //     setError(err);
//   //   } finally {
//   //     setLoading(false);
//   //     setDeleteStatus(false); // Reset deleteStatus after operation is done
//   //   }
//   // };
//     // Delete record
//     const handleDelete = async (url, id) => {
//       setDeleteStatus(true) // Set deleteStatus to true when deleting
//       setLoading(true)
//       setError(null)
//       try {
//         const response = await axios.delete(`${url}/${id}`, {
//           headers: getAuthHeaders(),
//         })
//         console.log("Successfully deleted:", response.data)
//         return response.data
//       } catch (err) {
//         if (err.response?.status === 401) {
//           try {
//             await refreshToken()
//             // Retry with new token
//             const retryResponse = await axios.delete(`${url}/${id}`, {
//               headers: getAuthHeaders(),
//             })
//             console.log("Successfully deleted after token refresh:", retryResponse.data)
//             return retryResponse.data
//           } catch (refreshErr) {
//             console.error("Error refreshing token:", refreshErr)
//             setError(refreshErr)
//           }
//         } else {
//           console.error("Error deleting:", err)
//           setError(err)
//         }
//       } finally {
//         setLoading(false)
//         setDeleteStatus(false) // Reset deleteStatus after operation is done
//       }
//     }

//   return {
//     handleCreate,
//     handleEdit,
//     handleDelete,
//     refetch,
//     data,
//     loading,
//     error,
//     deleteStatus,
//   };
// }


import { useState, useCallback } from "react";
import axios from "axios";

export function useCRUD() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(false);

  const getAuthHeaders = () => ({
    "otmm-api-key": "KoaderMasters",
    "Content-Type": "application/json",
  });

  const refetch = useCallback(async (url) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(url, {
        headers: getAuthHeaders(),
      });
      setData(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreate = async (url, newData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(url, newData, {
        headers: getAuthHeaders(),
      });
      console.log("Successfully created:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error creating:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (url, id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${url}/${id}`, updatedData, {
        headers: getAuthHeaders(),
      });
      console.log("Successfully edited:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error editing:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (url, id) => {
    setDeleteStatus(true);
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`${url}/${id}`, {
        headers: getAuthHeaders(),
      });
      console.log("Successfully deleted:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error deleting:", err);
      setError(err);
    } finally {
      setLoading(false);
      setDeleteStatus(false);
    }
  };

  return {
    handleCreate,
    handleEdit,
    handleDelete,
    refetch,
    data,
    loading,
    error,
    deleteStatus,
  };
}
