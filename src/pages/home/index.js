import React, { useEffect, useState } from "react";
import styles from "./Home.module.sass";
import Card from "@/components/Card";

import Map from "./components/Map/index";
import { useSelector, useDispatch } from "react-redux";

import {
  setOrigin,
  setDestination,
  setLocation,
  setMaps,
} from "@/context/locationSlice";
import useHandleConfig from "@/hooks/useConfig";
import useHandleNotification from "@/hooks/useNotification";
import useHandleService from "@/hooks/useService";
import { toName } from "@/libs/utils";
export default function index() {
  const dispatch = useDispatch();
  const maps = useSelector((state) => state.location.maps);
  const { config } = useHandleConfig();
  const { notification } = useHandleNotification();
  const { order, user } = useHandleService();
  const [location, setLocation] = useState(false);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (!position?.coords?.latitude) return;

        const latitude = position?.coords?.latitude;
        const longitude = position?.coords?.longitude;
        setLocation(true);
        dispatch(
          setMaps({
            lat: latitude,
            lng: longitude,
            status: "location",
          })
        );
      });
    }
  }, [!location]);

  return (
    <>
      <div className={styles.home}>
        <Map maps={maps} />
        <Card
          notification={notification}
          badge={notification?.length}
          location={location}
          avatar={
            user && user?.prefs && user?.prefs?.avatar && user?.prefs?.avatar
          }
          name={user && user?.name && toName(user?.name)}
        />
      </div>
    </>
  );
}
