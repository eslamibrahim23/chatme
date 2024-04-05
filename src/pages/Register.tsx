import { useRef, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { ReloadIcon } from "@radix-ui/react-icons";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import animationData from "../assets/AnimationP.json";
import { motion } from "framer-motion";

// Define Yup validation schema
const registerSchema = yup.object().shape({
  userName: yup.string().min(3).required(),
  Email: yup.string().email().required(),
  Password: yup.string().min(8).required(),
  cPassword: yup
      .string()
      .required("Confirm Password is required")
      .min(4, "Password length should be at least 4 characters")
      .max(12, "Password cannot exceed more than 12 characters")
      .oneOf([yup.ref("Password")], "Passwords do not match"),
});

const ButtonLoading = () => {
  return (
    <Button disabled>
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button>
  );
};

const RegisterPage = () => {
  const RegisterAnimation = useRef<LottieRefCurrentProps>(null);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });
  localStorage.removeItem("token");
  localStorage.removeItem("userId");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Make a POST request to the registration endpoint using Axios
      const response = await axios.post(
        "https://rippleroomback.onrender.com/signup",
        data
      );
      toast.success("Registration successful. Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="w-full h-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-auto">
        <div className="flex items-center justify-center py-12">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto grid w-[350px] gap-6">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Create account</h1>
                <p className="text-balance text-muted-foreground">
                  Create new account
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">User Name</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="User name"
                    {...register("userName")}
                    className={` ${errors.userName && "border-red-500"}`}
                  />
                  {errors.userName && (
                    <p className="text-red-500 text-sm">
                      {errors.userName.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("Email")}
                    className={` ${errors.Email && "border-red-500"}`}
                  />
                  {errors.Email && (
                    <p className="text-red-500 text-sm">
                      {errors.Email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    {...register("Password")}
                    className={`${errors.Password && "border-red-500"}`}
                  />
                  {errors.Password && (
                    <p className="text-red-500 text-sm">
                      {errors.Password.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Confirm Password</Label>
                  </div>
                  <Input
                    id="cPassword"
                    type="password"
                    placeholder="Password"
                    {...register("cPassword")}
                    className={`${errors.cPassword && "border-red-500"}`}
                  />
                  {errors.Password && (
                    <p className="text-red-500 text-sm">
                      {errors.cPassword?.message}
                    </p>
                  )}
                </div>
                {loading ? (
                  <ButtonLoading />
                ) : (
                  <Button type="submit" className="w-full">
                    Register
                  </Button>
                )}
              </form>
              <div className="mt-4 text-center text-sm flex gap-2 justify-center">
                Already have an account?
                <Link to="/login" className="font-semibold">
                  Sign in
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="hidden lg:block">
          <Lottie
            className="object-cover"
            lottieRef={RegisterAnimation}
            animationData={animationData}
          />
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
