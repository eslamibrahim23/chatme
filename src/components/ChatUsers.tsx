import { useState, useEffect } from "react";
import axios from "axios";
import WelcomeScreen from "@/pages/WelcomeScreen";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import CreateChat from "./CreateChat";
import SkeletonLoader from "./SkeletonLoader";
import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

const ChatUsers = () => {
  const [receiver, setReceiver] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `https://rippleroomback.onrender.com/chat/chatsForUserLogedIn/${userId}`
        );
        setChats(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const getDataOfOneUser = (userData) => {
    setReceiver(userData.receiver);
    setShowChat(true);
  };

  const handleGoBack = () => {
    setReceiver(null);
    setShowChat(false);
  };

  return (
    <>
      <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`relative flex-col items-start gap-8 lg:block ${
              showChat ? "hidden" : "md:flex"
            }`}
          >
            <div className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border dark:border-zinc-500 border-purple-600 p-3">
                <legend className="-ml-1 px-1 text-lg font-semibold font-Contrail">
                  Chats
                </legend>
                <ScrollArea className="h-[550px]">
                  <div className="p-3 flex flex-col gap-2">
                    {loading ? (
                      <SkeletonLoader />
                    ) : (
                      chats.map((chat, i) => (
                        <>
                          <div
                            key={i}
                            onClick={() => getDataOfOneUser(chat)}
                            className="flex items-start gap-3 cursor-pointer hover:bg-secondary rounded-md border p-2 shadow-md dark:border-t-0"
                          >
                            <Avatar className=" h-12 w-12 sm:flex rounded-lg">
                              <AvatarImage
                                src={chat.receiver.Image}
                                alt="Avatar"
                              />
                              <AvatarFallback>
                                {chat.receiver.userName
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1 ">
                              <p className="text-sm font-thin font-Comfortaa">
                                {chat.receiver.userName}
                              </p>
                              <p className="text-sm  text-ellipsis overflow-hidden text-muted-foreground">
                                {chat.lastMessage}
                              </p>
                            </div>
                          </div>
                        </>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </fieldset>
            </div>
          </div>
        </motion.div>

        <div
          className={`relative min-h-[50vh] flex-col md:col-span-3 ${
            !showChat ? "hidden" : ""
          }`}
        >
          {receiver && <CreateChat receiver={receiver} />}
          {receiver && (
            <Button
              onClick={handleGoBack}
              className="lg:hidden flex absolute top-4 left-4"
              size={"icon"}
              variant={"outline"}
            >
              <ChevronLeft />
            </Button>
          )}
        </div>

        <div
          className={`lg:col-span-3 ${
            showChat || isMobileView ? "hidden" : ""
          }`}
        >
          <WelcomeScreen />
        </div>
      </main>
    </>
  );
};

export default ChatUsers;
