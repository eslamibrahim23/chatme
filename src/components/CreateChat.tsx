import { useEffect, useState } from "react";
import axios from "axios";
import ChatBox from "./ChatBox";

function CreateChat({ receiver }) {
  const senderId = localStorage.getItem("userId");
  // console.log(receiver);
  const receiverId = receiver._id;
  const [chat, setChat] = useState();
  useEffect(() => {
    const fetchChat = async () => {
      const createChat = await axios.post(
        `https://rippleroomback.onrender.com/chat/getorCreateChat/${senderId}`,
        { userId: `${receiverId}` }
      );
      setChat(createChat.data);
      console.log(createChat.data);
    };
    fetchChat();
  }, [receiver]);

  return (
    <>
      <ChatBox
        senderId={senderId}
        receiverId={receiverId}
        receiver={receiver}
        chat={chat}
      />
    </>
  );
}

export default CreateChat;
