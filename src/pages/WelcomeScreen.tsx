import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import animationData from "../assets/wsa.json";
import { motion, useAnimation, useInView } from "framer-motion";
import axios from "axios";

const WelcomeScreen = () => {
  const chatAnimation = useRef<LottieRefCurrentProps>(null);
  const ref = useRef(null);
  const mainControls = useAnimation();
  const slidControls = useAnimation();
  const isInView = useInView(ref, { once: true });
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `https://rippleroomback.onrender.com/user/profile/${userId}`
        );
        setUserName(response.data.userName); // Assuming the username field is named "userName"
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    if (isInView) {
      mainControls.start("visible");
      slidControls.start("visible");
      fetchUserName();
    }
  }, [isInView, mainControls, slidControls]);

  return (
    <>
      <main className="flex flex-1 flex-col gap-5  lg:gap-4 lg:p-4 h-full">
        <div ref={ref} className="flex items-center">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 75 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate={mainControls}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.h1
              className="text-lg font-thin md:text-xl p-2 font-korna"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { delay: 0.5, staggerChildren: 0.1 },
                },
              }}
              initial="hidden"
              animate="visible"
            >
              {["Welcome", userName && ` ${userName},`, "To", "Chat", "Me"].map(
                (word, index) => (
                  <motion.span key={index}>
                    {word.split("").map((letter, index) => (
                      <motion.span
                        key={index}
                        style={{ display: "inline-block" }}
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1 },
                        }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                    {index !== 4 && <span>&nbsp;</span>}
                  </motion.span>
                )
              )}
            </motion.h1>
          </motion.div>
          <motion.div
            variants={{
              hidden: { left: 0 },
              visible: { left: "100%" },
            }}
            initial="hidden"
            animate={slidControls}
            transition={{ duration: 0.5, ease: "easeIn" }}
          />
        </div>
        <div className="flex flex-1 items-center justify-center rounded-lg  border dark:border-none shadow-md h-full ">
          <div className="flex flex-col items-center gap-1 text-center ">
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duratioan: 0.5 }}
            >
              <h3 className="text-3xl font-bold tracking-wide text-fuchsia-700 font-Contrail">
                Start Chatting Now . . .
              </h3>
              <p className="text-sm text-muted-foreground">
                Welcome! Thank you for using our app.
              </p>
              <Lottie
                className="h-72 w-96"
                lottieRef={chatAnimation}
                animationData={animationData}
              />
            </motion.div>
            <Link to="/chat-users" className="rounded-lg">
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  rotateZ: [0, -5, 5, -5, 5, -5, 5, 0],
                  transition: { duration: 0.5 },
                }}
              >
                <Button className="mt-4 font-Comfortaa">Create chat</Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default WelcomeScreen;
