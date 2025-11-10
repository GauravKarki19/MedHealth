import React, { useState } from "react";
import { CommonProvider } from "./contexts/common/commonContext";
import { CartProvider } from "./contexts/cart/cartContext";
import { FiltersProvider } from "./contexts/filters/filterContext";
import GovernmentHeader from "./components/common/GovernmentHeader";
import RouterRoutes from "./routes/RouterRoutes";
import GovernmentFooter from "./components/common/GovernmentFooter";
import httpClient from "./httpClient";
import ChatBot from "./components/common/ChatBot";
import AccountForm from "./components/form/Accountform";
import Profile from "./components/common/Profile";
// import CursorTrail from "./components/common/Cursortrail";
import { DarkModeProvider, useDarkMode } from "./contexts/DarkMode/DarkModeContext";

const AppContent = ({ isSignup, setIsSignup }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <>
      <GovernmentHeader isSignup={isSignup} setIsSignup={setIsSignup} />
      <main className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <RouterRoutes />
      </main>
      <GovernmentFooter />
      <ChatBot />
      <AccountForm isSignup={isSignup} setIsSignup={setIsSignup} />
      <Profile />
    </>
  );
};

const App = () => {
  const [isSignup, setIsSignup] = useState(false);

  setInterval(() => {
    localStorage.getItem("usertype") === "doctor" &&
      httpClient
        .post("make_meet", { email: localStorage.getItem("email") })
        .then((res) => {
          if (res.data.link !== null) {
            localStorage.setItem("curpname", res.data.link["name"]);
            localStorage.setItem("curmlink", res.data.link["link"]);
            localStorage.setItem("setSearchPatient", true);
            localStorage.setItem("searching", 2);
          } else {
            localStorage.setItem("setSearchPatient", false);
            localStorage.setItem("curpname", "");
            localStorage.setItem("curmlink", "");
            localStorage.setItem("searching", 1);
          }
        })
        .catch((err) => {
          console.log(err);
        });
  }, 25000);

  return (
    <>
      <DarkModeProvider>
        <CommonProvider>
          <FiltersProvider>
            <CartProvider>
              <AppContent isSignup={isSignup} setIsSignup={setIsSignup} />
            </CartProvider>
          </FiltersProvider>
        </CommonProvider>
      </DarkModeProvider>
      {/*<CursorTrail/>*/}
    </>
  );
};

export default App;
