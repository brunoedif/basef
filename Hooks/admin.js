import React, { createContext, useContext, useState } from "react";
const AdminContext = createContext();

export const useAdminContext = () => {
  return useContext(AdminContext);
};
export const AdminProvider = ({ children }) => {
  const [selected, setSelected] = useState(null);
  const [role, setRole] = useState(null);
  const [ab, setAb] = useState({});
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [userNotification, setUserNotification] = useState([]);

  function setNotification(objeto) {
    if (objeto) {
      setUserNotification(objeto);
    }
  }

  return (
    <AdminContext.Provider
      value={{
        selected,
        setSelected,
        role,
        setRole,
        userNotification,
        setUserNotification,
        setNotification,
        ab,
        setAb,
        selectedConfig,
        setSelectedConfig,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
