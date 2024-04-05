import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "@/components/SideBar";
import WelcomeScreen from "./WelcomeScreen";
import NewUsers from "@/components/NewUsers";
import ChatUsers from "@/components/ChatUsers";
import { Routes, Route } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MainPage() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `https://rippleroomback.onrender.com/user/profile/${userId}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="grid md:h-screen lg:h-screen w-screen pl-[53px]">
      <SideBar />
      <div className="flex flex-col">
        <header className="sticky top-0 z-20 flex h-[53px] items-center gap-1 border-b dark:border-zinc-500 border-purple-600 bg-background px-4 justify-between">
          <h1 className="text-2xl font-semibold uppercase font-korna">
            Chat <span className="font-normal text-fuchsia-700">me</span>
          </h1>
          <div className="flex flex-row gap-2 items-center font-Noto">
            <span>{userData?.userName}</span>
            <Avatar>
              {userData && userData.Image ? (
                <AvatarImage src={userData.Image} />
              ) : (
                <AvatarFallback>
                  {userData && userData.userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/new-users" element={<NewUsers />} />
          <Route path="/chat-users" element={<ChatUsers />} />
        </Routes>
      </div>
    </div>
  );
}
