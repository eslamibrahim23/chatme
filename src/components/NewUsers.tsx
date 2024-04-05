import { useState, useEffect } from "react";
import axios from "axios";
import WelcomeScreen from "@/pages/WelcomeScreen";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import CreateChat from "./CreateChat";
import SkeletonLoader from "./SkeletonLoader";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

const NewUsers = () => {
  const [receiver, setReceiver] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  const getDataOfOneUser = (userData) => {
    setReceiver(userData);
    setShowChat(true);
  };

  const handleGoBack = () => {
    setReceiver(null);
    setShowChat(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://rippleroomback.onrender.com/user/users"
        );
        if (response.status === 200) {
          setUsers(
            response.data.filter(
              (user) => user._id !== localStorage.getItem("userId")
            )
          );
        } else {
          throw new Error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
              <fieldset className="grid gap-6 rounded-lg border dark:border-zinc-500 border-purple-600 p-4">
                <legend className="-ml-1 px-1 text-lg font-semibold font-Contrail ">
                  All Users
                </legend>

                <ScrollArea className="h-[550px]">
                  <div className="p-3 flex flex-col gap-2">
                    {loading ? (
                      <SkeletonLoader />
                    ) : (
                      users.map((user) => (
                        <>
                          <div
                            key={user._id}
                            onClick={() => getDataOfOneUser(user)}
                            className="flex items-start gap-3 cursor-pointer hover:bg-secondary rounded-md border dark:border-t-0 p-2 shadow-md"
                          >
                            <Avatar className="h-12 w-12 sm:flex rounded-lg">
                              <AvatarImage src={user.Image} alt="Avatar" />
                              <AvatarFallback>
                                {user.userName.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                              <p className="text-sm font-thin font-Comfortaa">
                                {user.userName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {user.Bio ? user.Bio : "Hi there"}
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
          className={`relative  min-h-[50vh] flex-col md:col-span-3 ${
            !showChat ? "hidden" : ""
          }`}
        >
          {receiver && <CreateChat receiver={receiver} />}
          {receiver && (
            <Button
              onClick={handleGoBack}
              className="lg:hidden flex absolute top-4 left-4 "
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

export default NewUsers;
