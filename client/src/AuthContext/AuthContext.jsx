import { createContext, useState } from "react";
import useAxiosInstance from "../Hooks/UseAxiosInstance";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const axiosInstance = useAxiosInstance();
  const [user, setUser] = useState(null);

  const handleSubmit = async (url, body) => {
    try {
      const res = await axiosInstance.post(url, body);

      console.log("Processed API response in AuthProvider:", res.data);

      if (res.status === 200) {
        setUser({
          token: res.data.token,
          isAdmin: res.data.isAdmin,
        });
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
