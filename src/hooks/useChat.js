import { useState, useEffect } from "react";
import { useServer } from "../server/server";
import useHandleService from "./useServices";

export default function handleMessages() {
  const { getMessages, update, updateMessage } = useServer();
  const { order } = useHandleService();
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState(null);

  const fetchData = (chat_id) => {
    getMessages(chat_id, (error, response) => {
      if (error) {
        console.error("Erro ao buscar as mensagens:", error);
      } else {
        setMessage(response);
        const messageArray = response?.message;

        const parsedMessages = messageArray.map((item) => {
          try {
            const message = JSON.parse(item);
            return message;
          } catch (error) {
            console.error("Erro ao analisar a string da mensagem:", error);
            return null;
          }
        });

        setChat(parsedMessages);
      }
    });
  };

  const sendMessage = (value) => {
    const chat_id = order?.$id;

    const newMessage = {
      owner: "driver",
      value: value,
      created_at: new Date().toISOString(),
      status: "false",
    };

    const prevMessage = message?.message;
    const updatedMessage = prevMessage.concat([JSON.stringify(newMessage)]);

    updateMessage(chat_id, updatedMessage, (error, response) => {
      if (error) {
        console.error("Erro ao enviar a mensagem:", error);
      } else {
      }
    });
  };

  useEffect(() => {
    const chat_id = order?.$id;
    if (chat_id) {
      fetchData(chat_id);
    }
  }, [order, update]);

  return { chat, sendMessage };
}
