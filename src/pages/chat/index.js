import React, { useState } from "react";
import styles from "./Message.module.sass";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PhoneIcon from "@mui/icons-material/Phone";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import Input from "./input";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { IconButton } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
export const Message = ({ ...props }) => {
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = (e) => {
    e.preventDefault();

    console.log(message);

    setMessage("");
  };

  return (
    <div className={styles["message"]}>
      <div className={styles["message__header"]}>
        <div className={styles["message__header__left"]}>
          <ArrowBackOutlinedIcon
            className={styles["message__header__left__icon"]}
          />
          <img
            className={styles["message__header__left__avatar"]}
            src="https://avatars.githubusercontent.com/u/55942632?v=4"
            alt="avatar"
          />
        </div>
        <div className={styles["message__header__left__info"]}>
          <h3 className={styles["message__header__left__info__name"]}>Sahil</h3>
        </div>
        <IconButton className={styles["message__header__left__info__icon"]}>
          <InfoOutlined />
        </IconButton>
      </div>
    </div>
  );
};

export default Message;
