import { setMaps } from "@/context/locationSlice";
import cn from "classnames";
import { debounce } from "lodash";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import useGetRoute from "@/utils/getRouter";
import { CancelOutlined, LocationDisabled } from "@mui/icons-material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import Icon from "../Icons";
import List from "../List";
import style from "./Card.module.sass";
import { Badge, Divider, styled } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { toDate } from "@/libs/utils";
const Card = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestionsArray, setSuggestionsArray] = useState({
    suggestions: [],
    isOpen: false,
    input: "",
  });

  const location = useSelector((state) => state.location.value);

  const maps = useSelector((state) => state.location.maps);

  const dispatch = useDispatch();

  const locationRef = useRef(null);
  const destinationRef = useRef(null);
  const [locationInput, setLocationInput] = useState({
    origin: "",
    destination: "",
    valueOrigin: "",
    valueDestination: "",
    inputType: "",
  });

  const handleRoute = debounce(async (data, input) => {
    if (!data || data.length < 1) {
      setSuggestionsArray({
        ...suggestionsArray,
        isOpen: false,
        suggestions: [],
      });
      return;
    }

    if (data.length > 3) {
      const routeSuggestions = await useGetRoute(data, input);
      setSuggestionsArray({
        ...suggestionsArray,
        isOpen: true,
        suggestions: routeSuggestions,
        input: input,
      });
    }
  }, 300);

  const handleSetOrigem = async (data) => {
    if (locationInput.inputType == "origin") {
      setLocationInput({
        ...locationInput,
        valueOrigin: data.place_name,
      });

      setSuggestionsArray({
        ...suggestionsArray,
        isOpen: false,
        suggestions: [],
      });

      dispatch(
        setMaps({
          ...maps,
          lat: data.center[1],
          lng: data.center[0],
          place: data.place_name,
          status: "origin",
          origin: [data.center[0], data.center[1]],
        })
      );

      destinationRef.current.focus();
    } else {
      setLocationInput({
        ...locationInput,
        valueDestination: data.place_name,
      });
      setSuggestionsArray({
        ...suggestionsArray,
        isOpen: false,
        suggestions: [],
      });
      dispatch(
        setMaps({
          ...maps,
          lat: data.center[1],
          lng: data.center[0],
          place: data.place_name,
          status: "destination",
          destination: [data.center[0], data.center[1]],
        })
      );
    }
  };

  const handleInputChange = (locationType, value) => {
    if (locationType == "origin") {
      setLocationInput({
        ...locationInput,
        valueOrigin: value,
        inputType: locationType,
      });
      handleRoute(value, locationType);
    } else {
      setLocationInput({
        ...locationInput,
        valueDestination: value,
        inputType: locationType,
      });
      handleRoute(value, locationType);
    }
  };

  function del(input) {
    if (input == "origin") {
      setLocationInput({
        ...locationInput,
        valueOrigin: "",
      });
    } else {
      setLocationInput({
        ...locationInput,
        valueDestination: "",
      });
    }
  }
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  }));

  console.log(props.notification);
  return (
    <>
      <div
        className={cn("container", {
          "card-open": suggestionsArray.isOpen,
          "card-closed": !suggestionsArray.isOpen,
        })}
      >
        <div className={style["card-container"]}>
          {!props.location && (
            <div className={style["location-list"]}>
              <div className={style["row-list"]}>
                <LocationDisabled className={style["place-svg"]} />
                <div className={style["col-list"]}>
                  <p className={style["text-2-list"]}>
                    Por favor ative sua Localização!
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className={style.card}>
            <div className={style["card--header"]}>
              <div className={style.media}>
                <div className={style["media--body"]}>
                  <div className={style.avatar}>
                    <img className={style["img-1"]} alt="" src={props.avatar} />
                  </div>
                  <div className={style["media--content"]}>
                    <p className={style["text-2"]}>{props.name}</p>
                    <IconButton
                      onClick={() => setIsOpen(true)}
                      aria-label="cart"
                    >
                      <StyledBadge
                        badgeContent={props.badge}
                        className={style.badge}
                      >
                        <NotificationsNoneIcon sx={{ width: 20, height: 20 }} />
                      </StyledBadge>
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
            <div className={style["input--origem"]}>
              <div className={style["address--conteiner-origem"]}>
                <Icon
                  className={style["svgorigin--destino"]}
                  name="originDestination"
                />
                <div className={style["address"]}>
                  <div
                    style={{
                      flexDirection: "row",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <input
                      className={style["input--address"]}
                      placeholder="De Onde?"
                      onChange={(e) =>
                        handleInputChange("origin", e.target.value)
                      }
                      value={locationInput.valueOrigin}
                      ref={locationRef}
                    />
                    <IconButton onClick={() => del("origin")}>
                      <CancelOutlined />
                    </IconButton>
                  </div>
                  <div
                    style={{
                      borderTopColor: "gray",
                      borderTopWidth: "1px",
                      borderTopStyle: "solid",
                      width: "95%",
                      marginBlock: "10px",
                      height: "1px",
                      opacity: "0.25",
                    }}
                  />
                  <div
                    style={{
                      flexDirection: "row",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <input
                      className={style["input--address"]}
                      placeholder="Para onde?"
                      ref={destinationRef}
                      onChange={(e) =>
                        handleInputChange("destination", e.target.value)
                      }
                      value={locationInput.valueDestination}
                    />

                    <IconButton onClick={() => del("destination")}>
                      <CancelOutlined />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>

            {suggestionsArray?.isOpen &&
              suggestionsArray.suggestions.map((suggestion, index) => (
                <List
                  handleSetOrigem={handleSetOrigem}
                  suggestion={suggestion}
                  index={index}
                  input={suggestionsArray.input}
                />
              ))}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className={style.modal}>
          <div className={style["modal-header"]}>
            <p className={style["text-1"]}>Notificações</p>
            <IconButton onClick={() => setIsOpen(false)}>
              <CloseOutlinedIcon />
            </IconButton>
          </div>
          <div className={style["modal-body"]}>
            {props.notification.map((item) => {
              return (
                <>
                  <div className={style["cardBody"]}>
                    <div>
                      <img className={style.img} src={item.foto} alt="" />
                    </div>
                    <div className={style.textBox}>
                      <div className={style.textContent}>
                        <p className={style.h1}>{item.title}</p>
                        <span className={style.span}>
                          {toDate(item.$updatedAt)}
                        </span>
                      </div>
                      <p className={style.p}>{item.notification}</p>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
