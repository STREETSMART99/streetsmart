import { createContext, useState } from "react";
import useAxiosInstance from "../Hooks/UseAxiosInstance";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const axiosInstance = useAxiosInstance();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user"); 
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleSubmit = async (url, body) => {
    try {
      const res = await axiosInstance.post(url, body);

      console.log("Processed API response:", res.data);

      if (res.status === 200) {
        const loggedInUser = { token: res.data.token, isAdmin: res.data.isAdmin };
        localStorage.setItem("user", JSON.stringify(loggedInUser)); 
        setUser(loggedInUser);
      }

      return {
        status: res.status,
        message: res.data.message,
        token: res.data.token,
        isAdmin: res.data.isAdmin,
      };
    } catch (error) {
      console.error("API request error:", error.message);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ handleSubmit, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
export default AuthProvider;
