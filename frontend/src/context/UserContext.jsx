import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

export const userDataContext = createContext();

// Enable sending cookies globally with axios
axios.defaults.withCredentials = true;

function UserContext({ children }) {
  const serverUrl = "http://localhost:8000";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`);
      setUserData(result.data);
      console.log("Current user data:", result.data);
    } catch (error) {
      console.error("Error fetching current user:", error.response?.data || error.message);
    }
  };

  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(`${serverUrl}/api/user/asktoassistant`, { command });
      return result.data;
    } catch (error) {
      console.error("Gemini response error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
