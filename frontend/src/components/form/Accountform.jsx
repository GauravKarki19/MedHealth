import React, { useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import commonContext from "../../contexts/common/commonContext";
import useOutsideClose from "../../hooks/useOutsideClose";
import useScrollDisable from "../../hooks/useScrollDisable";
import { Alert, CircularProgress } from "@mui/material";
import httpClient from "../../httpClient";
import { useDarkMode } from "../../contexts/DarkMode/DarkModeContext";
import {
  FaUser,
  FaUserMd,
  FaUserClock,
  FaIdCard,
  FaPhoneAlt,
  FaPencilAlt,
  FaTimes,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { auth, signInWithPopup, provider, isFirebaseConfigured } from "../../firebase";
import heartRateLogo from "../../assets/heart-rate-logo.png";
import doctorMale from "../../assets/doctor-male.png";
import doctorFemale from "../../assets/doctor-female.png";
import patientMale from "../../assets/patient-male.png";
import patientFemale from "../../assets/patient-female.png";

const AccountForm = ({ isSignup, setIsSignup }) => {
  const { isFormOpen, toggleForm, setFormUserInfo } = useContext(commonContext);
  const { isDarkMode = false } = useDarkMode();
  const [username, setUsername] = useState("");
  const [usertype, setUsertype] = useState("patient");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [isInvEmail, setIsInvEmail] = useState(false);
  const [isInvPass, setIsInvPass] = useState(false);
  const [isInvPhone, setIsInvPhone] = useState(false);
  const [isInvAge, setIsInvAge] = useState(false);
  const [isAlert, setIsAlert] = useState("");
  const [alertCont, setAlertCont] = useState("");
  const [isSuccessLoading, setIsSuccessLoading] = useState(false);
  const [doctorId, setDoctorId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);
  const [isTelMedSphereAuth, setIsTelMedSphereAuth] = useState(true);
  const setCurrAuthApp = [setIsTelMedSphereAuth, setIsGoogleAuth];
  const [currAuthAppIdx, setCurrAuthAppIdx] = useState(0);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Close form handler
  const handleCloseForm = () => {
    toggleForm(false);
    setUsername("");
    setUsertype("patient");
    setAge("");
    setGender("male");
    setPhone("");
    setEmail("");
    setPasswd("");
    setIsForgotPassword(false);
    setSpecialization("");
    setDoctorId("");
    setProfilePic(null);
    setProfilePicFile(null);
  };

  useOutsideClose(formRef, handleCloseForm);

  useScrollDisable(isFormOpen);

  const [isSignupVisible, setIsSignupVisible] = useState(isSignup);
  useEffect(() => {
    setIsSignupVisible(isSignup);
  }, [isSignup]);

  // Signup-form visibility toggling
  const handleIsSignupVisible = () => {
    setIsSignupVisible((prevState) => !prevState);
    setIsForgotPassword(false);
  };

  // Default profile picture based on usertype and gender
  const getDefaultProfilePic = () => {
    if (usertype === "doctor") {
      return gender === "female" ? doctorFemale : doctorMale;
    } else {
      return gender === "female" ? patientFemale : patientMale;
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
      setProfilePicFile(file);
    }
  };

  // Clear profile picture
  const removeProfilePic = () => {
    setProfilePic(null);
  };

  const checkAge = (a) => {
    const t = parseInt(a) > 0 && parseInt(a) <= 120 && /^[0-9]{1,3}$/.test(a);
    setIsInvAge(!t);
    return t;
  };

  const checkEmail = (email) => {
    // eslint-disable-next-line
    const res = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    setIsInvEmail(!res);
    return res;
  };

  const checkPasswd = (passwd) => {
    const res = /^.{6,}$/.test(passwd);
    setIsInvPass(!res);
    return res;
  };

  const validatePhoneNumber = (phoneNumber) => {
    const pattern = /^\+?1?\d{10,10}$/;
    const res = pattern.test(phoneNumber);
    setIsInvPhone(!res);
    return res;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (isInvEmail) return;

    setIsSuccessLoading(true);
    try {
      await httpClient.post("/forgot_password", { email });
      setIsAlert("success");
      setAlertCont("Password reset link sent to your email");
      setTimeout(() => {
        setIsAlert("");
        setIsForgotPassword(false);
      }, 1500);
    } catch (err) {
      setIsAlert("error");
      setAlertCont("Email not found");
      setTimeout(() => setIsAlert(""), 1500);
    }
    setIsSuccessLoading(false);
  };

  const handleAuthApp = (idx) => {
    setCurrAuthAppIdx((prevIdx) => {
      setCurrAuthApp[prevIdx](false); // Reset previous auth to false
      setCurrAuthApp[idx](true); // Set new auth to true
      return idx; // Update index properly
    });
  };

  const handleGoogleRegister = async () => {
    if (!isFirebaseConfigured || !auth || !provider) {
      setIsAlert("error");
      setAlertCont("Google Sign-In is not configured. Please set up Firebase in your .env file.");
      setTimeout(() => setIsAlert(""), 3000);
      return;
    }

    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(); // Get the ID token

      // Create a FormData object
      const formData = new FormData();
      formData.append("registerer", usertype);
      formData.append("email", result.user.email);
      formData.append("id_token", idToken);

      if (profilePicFile && profilePicFile instanceof File) {
        // If profilePicFile exists, append it
        formData.append("profile_picture", profilePicFile);
      } else {
        // If profilePicFile is empty, fetch patientMale URL and convert it to Blob
        try {
          const response = await fetch(getDefaultProfilePic());
          const blob = await response.blob();
          formData.append("profile_picture", blob, "default_profile.jpg");
        } catch (err) {
          console.error("Error fetching default profile picture:", err);
        }
      }

      // Send the FormData request
      const res = await httpClient.post("/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsAlert("success");
      setAlertCont("Signup Successful");

      setTimeout(() => {
        setIsAlert("");
        toggleForm(false);
        setFormUserInfo({
          username: res.data.username,
          usertype: usertype,
          gender: res.data.gender,
          phone: res.data.phone,
          email: res.data.email,
          passwd,
          specialization: res.data.specialization,
          doctorId: res.data.doctorId,
          age: res.data.age,
          verified: false,
          profile_picture: res.data.profile_picture,
        });
        toggleForm(false);
        // window.location.reload();
      }, 1500);
    } catch (error) {
      console.error(error);
      setIsAlert("error");
      setAlertCont("Signup Failed");
      setTimeout(() => {
        setIsAlert("");
      }, 1500);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isFirebaseConfigured || !auth || !provider) {
      setIsAlert("error");
      setAlertCont("Google Sign-In is not configured. Please set up Firebase in your .env file.");
      setTimeout(() => setIsAlert(""), 3000);
      return;
    }

    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(); // Get the ID token

      // Send ID token to the backend for login
      const res = await httpClient.post("/login", { id_token: idToken });

      // Store access token in local storage
      localStorage.setItem("token", res.data.access_token);

      // Set success alert
      setIsAlert("success");
      setAlertCont("Login Successful");

      // Update user info & UI state
      setTimeout(() => {
        setIsAlert("");
        toggleForm(false);
        setFormUserInfo({
          username: res.data.username,
          usertype: res.data.usertype,
          gender: res.data.gender,
          phone: res.data.phone,
          email: res.data.email,
          passwd,
          specialization: res.data.specialization,
          doctorId: res.data.doctorId,
          age: res.data.age,
          verified: res.data.verified,
          profile_picture: res.data.profile_picture,
          fee: res.data.fee,
        });

        // window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Login Error:", error);

      // Handle login failure
      setIsAlert("error");
      setAlertCont("Login Failed");

      setTimeout(() => {
        setIsAlert("");
      }, 1500);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (isInvEmail || isInvPass || isInvPhone) return;

    setIsSuccessLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("registerer", usertype);
      formData.append("age", age);
      formData.append("gender", gender);
      formData.append("phone", "+91" + phone);
      formData.append("email", email);
      formData.append("passwd", passwd);
      formData.append("specialization", specialization);
      formData.append("doctorId", doctorId);

      // Handle profile picture
      if (profilePicFile && profilePicFile instanceof File) {
        formData.append("profile_picture", profilePicFile);
      } else {
        try {
          const response = await fetch(getDefaultProfilePic());
          const blob = await response.blob();
          formData.append("profile_picture", blob, "default_profile.jpg");
        } catch (err) {
          console.error("Error fetching default profile picture:", err);
        }
      }

      setIsSuccessLoading(false);

      // Choose between login or signup
      if (isSignupVisible) {
        isGoogleAuth
          ? await handleGoogleRegister()
          : await handleRegister(formData);
      } else {
        isGoogleAuth ? await handleGoogleLogin() : await handleLogin();
      }
    } catch (error) {
      console.error("Form Submission Error:", error);
      setIsSuccessLoading(false);
      setIsAlert("error");
      setAlertCont("An unexpected error occurred.");
      setTimeout(() => setIsAlert(""), 1500);
    }
  };

  // Helper function to handle registration
  const handleRegister = async (formData) => {
    try {
      const res = await httpClient.post("/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsAlert("success");
      setAlertCont("Signup Successful");

      setTimeout(() => {
        setIsAlert("");
        setFormUserInfo({
          username,
          usertype,
          gender,
          phone,
          email,
          passwd,
          specialization,
          doctorId,
          age,
          verified: false,
          profile_picture: res.data.profile_picture,
        });
        toggleForm(false);
        // window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Signup Error:", err);
      setIsAlert("error");
      setAlertCont("User already exists");
      setTimeout(() => setIsAlert(""), 1500);
    }
  };

  // Helper function to handle login
  const handleLogin = async () => {
    try {
      const res = await httpClient.post("/login", { email, passwd });

      localStorage.setItem("token", res.data.access_token);
      setIsAlert("success");
      setAlertCont("Login Successful");

      setTimeout(() => {
        setIsAlert("");
        toggleForm(false);
        setFormUserInfo({
          username: res.data.username,
          usertype: res.data.usertype,
          gender: res.data.gender,
          phone: res.data.phone,
          email: res.data.email,
          passwd,
          specialization: res.data.specialization,
          doctorId: res.data.doctorId,
          age: res.data.age,
          verified: res.data.verified,
          profile_picture: res.data.profile_picture,
        });
        // window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Login Error:", err);
      setIsAlert("error");
      setAlertCont("Login Failed");
      setTimeout(() => setIsAlert(""), 1500);
    }
  };

  return (
    <AnimatePresence>
      {isFormOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseForm}
            className="fixed inset-0 z-[9998] bg-black/50"
          />
          
          {/* Modal Container - Centered with Flexbox */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none min-h-screen">
            {/* Modal with Solid Gray Background */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl shadow-2xl pointer-events-auto bg-gray-50 border border-gray-200 overflow-hidden"
              ref={formRef}
            >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseForm}
              className="absolute top-4 right-4 z-30 p-2 rounded-lg transition-all duration-200 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
            <form
              onSubmit={isForgotPassword ? handleForgotPassword : handleFormSubmit}
              className="relative z-10 p-8 pb-10 bg-gray-50"
            >

              {/* Header Section */}
              <div className="relative mb-6 text-center">
                {/* Logo */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-blue-50 border border-blue-200 shadow-md">
                    <img
                      src="/icon.png"
                      alt="MedHealth"
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                  {isForgotPassword
                    ? "Reset Password"
                    : isSignupVisible
                    ? "Create Account"
                    : "Welcome Back"}
                </h2>
                
                {/* Subtitle */}
                <p className="text-sm mb-4 text-gray-600">
                  {isForgotPassword
                    ? "Enter your email to receive a reset link"
                    : isSignupVisible
                    ? "Join MedHealth to access healthcare services"
                    : "Sign in to continue to MedHealth"}
                </p>

                {/* Switch Login/Register */}
                {!isForgotPassword && (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={handleIsSignupVisible}
                      className="text-sm font-medium transition-colors text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {isSignupVisible ? "Already have an account? Sign in" : "New here? Create an account"}
                    </button>
                  </div>
                )}
              </div>

              {/* Alert */}
              {isAlert !== "" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <Alert severity={isAlert} className="rounded-lg border bg-white">
                    {alertCont}
                  </Alert>
                </motion.div>
              )}

              {/* Form Content */}
              <div className="space-y-4">

                {/* Profile Picture Upload - Only for Signup */}
                {isSignupVisible && (
                  <div className="flex justify-center -mt-6 mb-2">
                      <div
                      className="relative group cursor-pointer"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 bg-white group-hover:border-blue-400 transition-all duration-200 shadow-md">
                        <img
                          src={profilePic || getDefaultProfilePic()}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                        {profilePic && isHovered && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full">
                            <FaTimes className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                        <label
                          htmlFor="profile_picture"
                        className="absolute -bottom-0.5 -right-0.5 p-1 rounded-full cursor-pointer transition-all bg-blue-600 hover:bg-blue-700 border border-white"
                        onClick={(e) => {
                          if (profilePic && isHovered) {
                            e.preventDefault();
                            removeProfilePic();
                          }
                        }}
                      >
                        <FaPencilAlt className="w-2.5 h-2.5 text-white" />
                        </label>
                      <input
                        type="file"
                        name="profile_picture"
                        id="profile_picture"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                )}

                {/* User Type Selection - Only for Signup */}
                {isSignupVisible && (
                  <div className="mb-2">
                    <div className="inline-flex p-1 rounded-lg bg-gray-100 border border-gray-300 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setUsertype("patient")}
                        className={`px-4 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                          usertype === "patient"
                            ? 'bg-white text-blue-600 shadow-md'
                            : 'text-gray-600 hover:text-gray-900 bg-transparent'
                        }`}
                        >
                          Patient
                      </button>
                      <button
                        type="button"
                        onClick={() => setUsertype("doctor")}
                        className={`px-4 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                          usertype === "doctor"
                            ? 'bg-white text-blue-600 shadow-md'
                            : 'text-gray-600 hover:text-gray-900 bg-transparent'
                        }`}
                        >
                          Doctor
                      </button>
                      </div>
                    </div>
                )}

                {/* Username Input - Only for Signup */}
                {isSignupVisible && !isGoogleAuth && (
                  <div>
                          <input
                            type="text"
                            name="username"
                      placeholder="Full Name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 text-sm shadow-sm"
                            required
                          />
                        </div>
                )}

                {/* Doctor Specific Fields */}
                {isSignupVisible && !isGoogleAuth && usertype === "doctor" && (
                          <>
                              <input
                                type="text"
                                name="specialization"
                      placeholder="Specialization (e.g., Cardiology, Pediatrics)"
                                value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 text-sm shadow-sm"
                                required
                              />
                              <input
                                type="text"
                                name="ID"
                      placeholder="Doctor ID / License Number"
                                value={doctorId}
                                onChange={(e) => setDoctorId(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 text-sm shadow-sm"
                                required
                              />
                          </>
                        )}

                {/* Patient Age Field */}
                {isSignupVisible && !isGoogleAuth && usertype === "patient" && (
                          <div>
                              <input
                                type="text"
                                name="age"
                                placeholder="Age"
                                value={age}
                                onChange={(e) => {
                                  checkAge(e.target.value);
                                  setAge(e.target.value);
                                }}
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 text-sm shadow-sm ${isInvAge ? 'border-red-500 focus:ring-red-500' : ''}`}
                                required
                              />
                            {age !== "" && isInvAge && (
                      <p className="mt-1.5 text-xs text-red-500">Please enter a valid age</p>
                            )}
                          </div>
                        )}

                {/* Gender Selection - Only for Signup */}
                {isSignupVisible && !isGoogleAuth && (
                  <div>
                    <div className="inline-flex p-1 rounded-lg bg-gray-100 border border-gray-300 shadow-sm">
                      {['male', 'female', 'other'].map((gen) => (
                        <button
                          key={gen}
                          type="button"
                          onClick={() => setGender(gen)}
                          className={`px-4 py-2 rounded-md text-xs font-medium transition-all duration-200 capitalize ${
                            gender === gen
                              ? 'bg-white text-blue-600 shadow-md'
                              : 'text-gray-600 hover:text-gray-900 bg-transparent'
                          }`}
                        >
                          {gen}
                        </button>
                      ))}
                          </div>
                        </div>
                )}

                {/* Phone Number - Only for Signup */}
                {isSignupVisible && !isGoogleAuth && (
                  <div>
                          <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => {
                              validatePhoneNumber(e.target.value);
                              setPhone(e.target.value);
                            }}
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 text-sm shadow-sm ${isInvPhone ? 'border-red-500 focus:ring-red-500' : ''}`}
                            required
                          />
                        {phone !== "" && isInvPhone && (
                      <p className="mt-1.5 text-xs text-red-500">Please enter a valid phone number</p>
                        )}
                  </div>
                )}

                {/* Email Input */}
                {!isGoogleAuth && (
                    <div>
                        <input
                      type="email"
                          name="email"
                      placeholder="Email address"
                          value={email}
                          onChange={(e) => {
                            checkEmail(e.target.value);
                            setEmail(e.target.value);
                          }}
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 text-sm shadow-sm ${isInvEmail ? 'border-red-500 focus:ring-red-500' : ''}`}
                          required
                        />
                      {email !== "" && isInvEmail && (
                      <p className="mt-1.5 text-xs text-red-500">Please enter a valid email address</p>
                      )}
                    </div>
                )}

                {/* Password Input */}
                {!isForgotPassword && !isGoogleAuth && (
                  <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={passwd}
                            onChange={(e) => {
                              checkPasswd(e.target.value);
                              setPasswd(e.target.value);
                            }}
                      className={`w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 text-sm shadow-sm ${isInvPass ? 'border-red-500 focus:ring-red-500' : ''}`}
                            required
                      autoComplete="new-password"
                          />
                    <button
                      type="button"
                            onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                        <IoEyeOffOutline size={18} />
                            ) : (
                        <IoEyeOutline size={18} />
                            )}
                    </button>
                        {isSignupVisible && passwd !== "" && isInvPass && (
                      <p className="mt-1.5 text-xs text-amber-500">Password must be at least 6 characters</p>
                        )}
                      </div>
                    )}

                {/* Forgot Password Link */}
                {!isSignupVisible && !isForgotPassword && !isGoogleAuth && (
                  <div className="flex justify-end -mt-2">
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                      className="text-xs font-medium transition-colors text-blue-600 hover:text-blue-700"
                      >
                      Forgot password?
                      </button>
                  </div>
                    )}

                {/* Back to Login Link */}
                    {isForgotPassword && (
                  <div className="flex justify-start -mt-2">
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(false)}
                      className="text-xs font-medium transition-colors text-blue-600 hover:text-blue-700"
                      >
                      ← Back to login
                      </button>
                  </div>
                )}

                {/* Submit Button */}
                {isTelMedSphereAuth && (
                  <button
                    type="submit"
                    disabled={
                      (!isGoogleAuth && isForgotPassword && isInvEmail) ||
                      (isSignupVisible && (isInvAge || isInvEmail || isInvPass)) ||
                      (!isForgotPassword && !isSignupVisible && (isInvEmail || isInvPass))
                    }
                    className="w-full mt-2 py-3 rounded-lg font-semibold text-base transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:shadow-md"
                  >
                    {isSuccessLoading ? (
                      <div className="flex items-center justify-center">
                        <CircularProgress size={20} className="mr-2" />
                        <span>Processing...</span>
                      </div>
                    ) : isForgotPassword ? (
                      "Send Reset Link"
                    ) : isSignupVisible ? (
                      "Create Account"
                    ) : (
                      "Sign In"
                    )}
                  </button>
                )}

                {/* Google Auth Button */}
                {isGoogleAuth && (
                    <button
                      type="submit"
                    className="w-full mt-2 py-3 rounded-lg font-medium text-base transition-all duration-300 flex items-center justify-center gap-2 border-2 bg-white text-gray-900 hover:bg-gray-50 hover:border-gray-300 border-gray-300 shadow-md hover:shadow-lg"
                    >
                      <img
                        src="https://img.icons8.com/fluency/48/google-logo.png"
                      alt="google"
                      className="w-5 h-5"
                      />
                      <span>
                      {isSignupVisible ? "Sign Up" : "Sign In"} with Google
                      </span>
                    </button>
                )}

                {/* Auth Method Switcher */}
              {!isForgotPassword && (
                  <div className="mt-6 pt-6 border-t border-gray-300">
                    <p className="text-center text-xs mb-4 text-gray-600 font-medium">
                      {isSignupVisible ? "Sign up using" : "Sign in using"}
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleAuthApp(0)}
                        className={`p-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg ${
                          isTelMedSphereAuth
                            ? 'bg-blue-100 border-2 border-blue-400 scale-110'
                            : 'bg-white border-2 border-gray-300 hover:border-gray-400 hover:scale-105'
                        }`}
                      >
                        <img
                          src={heartRateLogo}
                          alt="MedHealth"
                          className="w-5 h-5 object-contain"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAuthApp(1)}
                        className={`p-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg ${
                          isGoogleAuth
                            ? 'bg-blue-100 border-2 border-blue-400 scale-110'
                            : 'bg-white border-2 border-gray-300 hover:border-gray-400 hover:scale-105'
                        }`}
                      >
                        <img
                          src="https://img.icons8.com/fluency/48/google-logo.png"
                          alt="Google"
                          className="w-5 h-5 object-contain"
                        />
                      </button>
                    </div>
                  </div>
              )}
              </div>
            </form>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AccountForm;
