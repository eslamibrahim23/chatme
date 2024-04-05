import { useEffect, useState, useRef } from "react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import axios from "axios";
import IsSender from "./IsSender";
import IsReceiver from "./IsReceiver";
import { ScrollArea } from "./ui/scroll-area";
import { CornerDownLeft } from "lucide-react";
import { Button } from "./ui/button";
import { io } from "socket.io-client";

const ChatBox = ({ receiver, receiverId, senderId, chat }) => {
  const lastMessageRef = useRef();
  const [sender, setSender] = useState();
  const [msg, setMsg] = useState("");
  const [data, setData] = useState({ msg: "" });
  const [messages, setMessages] = useState([]);
  const [receiverData, setReceiverData] = useState(null);

  const socketRef = useRef(null);
  useEffect(() => {
    const socketServerUrl = `https://rippleroomback.onrender.com`;
    socketRef.current = io(socketServerUrl);

    socketRef.current.on("connect", () => {
      console.log("Connected to server");
    });

    socketRef.current.on("receive_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  //.....................fetch all messages in specicic chat.....................//
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `https://rippleroomback.onrender.com/message/messagesChatId/${chat?._id}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [chat]);

  //.....................fetch ReceiverData.....................//
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://rippleroomback.onrender.com/user/profile/${receiverId}`
        );
        setReceiverData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [receiverId]);

  const onChaneHandler = (e) => {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
  };

  useEffect(() => {
    socketRef.current.emit("join_room", chat?._id);
  }, [chat]);

  const onSubmit = async () => {
    try {
      // Send the message
      const response = await axios.post(
        `https://rippleroomback.onrender.com/message/createMessage/${chat._id}`,
        { sender: receiverId, content: data.msg }
      );
      // Emit message

      socketRef.current.emit("send_message", {
        sender: { _id: receiverId },
        content: data.msg,
        chatId: chat._id,
      });

      setData({ msg: "" });

      setMessages((prev) => [
        ...prev,
        {
          sender: { _id: receiverId },
          content: data.msg,
          chatId: chat._id,
        },
      ]);
    } catch (error) {
      console.error("msg request failed:", error);
    }
  };

  //.....................fetch SenderData.....................//
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://rippleroomback.onrender.com/user/profile/${senderId}`
        );
        setSender(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [senderId]);

  //.....................End of Sroll.....................//
  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);
  return (
    <>
      <div className="relative flex h-full flex-col rounded-xl bg-muted/50 p-4 lg:col-span-3 shadow-md">
        <Badge
          variant="outline"
          className="hidden border-none text-lg absolute lg:flex left-5 top-1 z-10 mb-2 font-Noto"
        >
          Chat with {receiverData ? receiverData.userName : "loading"}
        </Badge>
        <div className="flex-1" />
        <ScrollArea className="h-[470px] w-full rounded-md mb-3 shadow-md flex">
          <div>
            {messages
              ? messages.map((m, i) => {
                  return (
                    <>
                      <div ref={lastMessageRef} key={i}>
                        {m.sender._id === sender._id ? (
                          <IsReceiver receiver={receiverData || {}} msg={m} />
                        ) : (
                          <IsSender sender={sender} msg={m} />
                        )}
                      </div>
                    </>
                  );
                })
              : "loading"}
          </div>
        </ScrollArea>
        <div className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring dark:border-zinc-500 border-purple-600">
          <Input
            onChange={onChaneHandler}
            name="msg"
            value={data.msg}
            id="message"
            placeholder="Type your message here..."
            className="min-h-12 resize-none p-3 border-none focus-visible:ring-0  "
          />
          <div className="flex items-center p-3 pt-0">
            <div></div>
            <Button
              onClick={onSubmit}
              type="button"
              size="sm"
              className="ml-auto gap-1.5 font-Comfortaa"
            >
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBox;
