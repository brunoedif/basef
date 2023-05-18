import { useState, useEffect, useContext } from "react";
import { useServer } from "../server/server";
import { AuthContext } from "../context/auth";

export default function useHandleService() {
  const { update, getMyService } = useServer();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [encodedRoute, setEncodedRoute] = useState(null);

  const handleUpdateService = (status) => {
    const id = order?.$id;
    if (!id || !status) {
      return;
    }
    updateService(id, status, (error, response) => {
      if (error) {
        console.warn("Error:", error);
      }

      if (response) {
      }
    });
  };

  const fetchData = (id) => {
    getMyService(id, (error, response) => {
      if (error) {
        console.error("Error:", error);
      } else {
        if (response?.length < 1) {
          setOrder(null);
          return;
        }

        if (response[0] !== order) {
          setOrder(response[0]);
        }

        if (response[0] && response[0].rota !== encodedRoute) {
          setEncodedRoute(response[0].rota);
        }
      }
    });
  };

  useEffect(() => {
    const id = user?.id;
    if (!id) {
      return;
    }
    fetchData(id);
  }, [user, update]);
  return {
    order,
    user,
    handleUpdateService,
  };
}
