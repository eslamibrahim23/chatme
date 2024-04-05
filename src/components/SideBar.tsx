import {
  AudioWaveform,
  LogOut,
  Send,
  UserRound,
  UsersRound,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { ModeToggle } from "./mode-toggle";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { motion } from "framer-motion";

const SideBar = () => {
  const [profileData, setProfileData] = useState({
    userName: "",
    Email: "",
    Bio: "",
    Image: "",
  });
  const [errors, setErrors] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const profileSchema = Yup.object().shape({
    userName: Yup.string().min(3).required("User name is required"),
    Email: Yup.string().email("Invalid email").required("Email is required"),
    Bio: Yup.string().max(100),
    Image: Yup.mixed(),
  });

  const fetchProfileData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `https://rippleroomback.onrender.com/user/profile/${userId}`
      );
      const { userName, Email, Bio, Image } = response.data;
      setProfileData({ userName, Email, Bio, Image });
      setErrors({});
      console.log(profileData);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const validateProfile = async () => {
    try {
      await profileSchema.validate(profileData, { abortEarly: false });
      setErrors({});
      setIsValidating(false);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error("Error validating profile:", error);
      }
      setIsValidating(false);
    }
  };

  useEffect(() => {
    if (isValidating) {
      validateProfile();
    }
  }, [isValidating]);

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
    setIsValidating(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData({
          ...profileData,
          Image: reader.result, // Set the image data to be displayed
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const checkErrors = () => {
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    setIsSaveEnabled(checkErrors());
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsValidating(true);
    setTimeout(() => {
      if (checkErrors()) {
        saveProfileData();
      }
    }, 1000);
  };

  const saveProfileData = async () => {
    try {
      await profileSchema.validate(profileData, { abortEarly: false });
      const userId = localStorage.getItem("userId");
      const formData = new FormData();
      formData.append("userName", profileData.userName);
      formData.append("Email", profileData.Email);
      formData.append("Bio", profileData.Bio);
      formData.append("Image", profileData.Image); // Append the image data
      await axios.patch(
        `https://rippleroomback.onrender.com/user/editprofile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Updating profile successful");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    setIsOpen(true);
  };
  const confirmDeleteAccount = () => {
    axios
      .delete(
        `https://rippleroomback.onrender.com/user/deleteProfile/${userId}`
      )
      .then((response) => {
        console.log("Account deleted successfully:", response.data);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error deleting account:", error);
        toast.error("Error deleting account. Please try again later.");
      });
  };
  const cancelDelete = () => {
    setIsOpen(false);
  };

  return (
    <>
      <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r dark:dark:border-zinc-500 border-e-purple-600 gap-2">
        <div className="border-b dark:border-zinc-500 border-purple-600 p-2">
          <Link to="/" className="rounded-lg">
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.1 }}
            >
              <Button variant="ghost" size="icon" aria-label="Welcome Screen">
                <AudioWaveform className="size-5 fill-foreground" />
              </Button>
            </motion.div>
          </Link>
        </div>
        <nav className="grid gap-4 p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/new-users" className="rounded-lg">
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-lg"
                      aria-label="New Users"
                    >
                      <UsersRound className="size-5" />
                    </Button>
                  </motion.div>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="font-Comfortaa"
                sideOffset={5}
              >
                All Users
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/chat-users" className="rounded-lg">
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-lg"
                      aria-label="Chats"
                    >
                      <Send className="size-5" />
                    </Button>
                  </motion.div>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="font-Comfortaa"
                sideOffset={5}
              >
                Chats
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto grid gap-1 p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Dialog>
                  <DialogTrigger asChild>
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.1 }}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        className="mt-auto rounded-lg"
                        aria-label="Profile"
                        onClick={fetchProfileData}
                      >
                        <UserRound className="size-5" />
                      </Button>
                    </motion.div>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 py-4">
                        <Avatar
                          className="h-20 w-20 sm:flex cursor-pointer"
                          onClick={handleAvatarClick}
                        >
                          <AvatarImage
                            src={profileData.Image}
                            alt={profileData.userName}
                          />
                          <AvatarFallback>
                            {profileData.userName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="username" className="text-top">
                            User name
                          </Label>
                          <Input
                            id="username"
                            name="userName"
                            value={profileData.userName}
                            onChange={handleInputChange}
                            className="col-span-4"
                          />
                          {isValidating && !errors.userName && (
                            <div className="success-message text-green-600"></div>
                          )}
                          {errors.userName && (
                            <div className="error-message">
                              {errors.userName}
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-top">
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="Email"
                            disabled
                            value={profileData.Email}
                            onChange={handleInputChange}
                            className="col-span-4"
                          />
                          {isValidating && !errors.Email && (
                            <div className="success-message text-green-600"></div>
                          )}

                          {errors.Email && (
                            <div className="error-message ">{errors.Email}</div>
                          )}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="bio" className="text-top">
                            Bio
                          </Label>
                          <Input
                            id="bio"
                            name="Bio"
                            value={profileData.Bio}
                            onChange={handleInputChange}
                            className="col-span-4"
                          />
                          <div className="error-message ">{errors.Bio}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Input
                            id="picture"
                            ref={fileInputRef}
                            name="Image"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                            className="col-span-4 dark:text-white"
                          />
                          <div className="error-message">{errors.Image}</div>
                        </div>
                      </div>
                      <DialogFooter className="flex gap-2">
                        <DialogClose>
                          <Button
                            type="submit"
                            variant={"outline"}
                            disabled={!isSaveEnabled}
                            className="w-full"
                          >
                            Save changes
                          </Button>
                        </DialogClose>
                        <AlertDialog open={isOpen}>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              onClick={handleDeleteAccount}
                            >
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to delete your account?
                              </AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={cancelDelete}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction onClick={confirmDeleteAccount}>
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Profile
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.1 }}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="mt-auto rounded-lg"
                    aria-label="Theme"
                  >
                    <ModeToggle />
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="font-Comfortaa"
                sideOffset={5}
              >
                Theme
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Link to="/login">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mt-auto rounded-lg"
                      aria-label="Logout"
                      onClick={() => {
                        localStorage.removeItem("token"),
                          localStorage.removeItem("userId");
                      }}
                    >
                      <LogOut className="size-5" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="font-Comfortaa"
                  sideOffset={5}
                >
                  Logout
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default SideBar;
