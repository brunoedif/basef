//imports
import React, { createContext, useCallback, useEffect, useState } from "react";
import { useServer } from "../server/server";
export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [work, setWork] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoords] = useState({ lat: null, lon: null });
  const [user, setUser] = useState(null);
  const { getAccount, logout, getMedia } = useServer();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionActive = await getAccount();

        if (sessionActive) {
          setIsSignedIn(true);
          setUser(sessionActive);
        } else {
          setIsSignedIn(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    setIsSignedIn(false);
    navigation.navigate("Login");
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        showMap,
        coordinates,
        user,
        handleLogout,
        work,
        setWork,
        setIsSignedIn,
        isSignedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
