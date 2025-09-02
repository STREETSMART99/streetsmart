// import '../css/Login.css'; 
// import { useRef, useContext, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from "../AuthProvider/AuthProvider";
// import Swal from 'sweetalert2';
// import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
// import logo from '../assets/logolog.png';

// const Login = () => {
//   const emailRef = useRef('');
//   const passwordRef = useRef('');
//   const { handleSubmit } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const body = {
//       email: emailRef.current.value,
//       password: passwordRef.current.value
//     };
//     try {
//       const response = await handleSubmit("/login", body);
//       if (!response || typeof response !== "object") {
//         throw new Error("Invalid response format");
//       }
//       const { status, message, token, isAdmin } = response;
//       if (status === 200) {
//         localStorage.setItem("token", token);
//         Swal.fire({ title: message, icon: "success" });
//         navigate(isAdmin ? "/admin/dashboard" : "/dashboard");
//       } else {
//         // Show backend message or a fallback
//         throw new Error(message || "Login failed");
//       }
//     } catch (error) {
//       let errorMsg = error.message;
//       // Optionally, customize known errors
//       if (errorMsg.toLowerCase().includes("password")) {
//         errorMsg = "Password is incorrect.";
//       } else if (errorMsg.toLowerCase().includes("user")) {
//         errorMsg = "User not found.";
//       }
//       Swal.fire({ title: "Login failed", text: errorMsg, icon: "error" });
//     }
//   };

//   return (
//     <div className="login-page w-full min-h-screen flex items-center justify-center bg-gray-100 p-10 relative">
//       <button
//         className="login-top-title login-title-btn"
//         onClick={() => navigate('/')}
//         type="button"
//         tabIndex={0}
//       >
//         Street Smart
//       </button>
//       <div className="shape top-left"></div>
//       <div className="shape bottom-left"></div>

//       {/* Responsive container: stacks on mobile, row on desktop */}
//       <div className="lg:container mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16 justify-between w-full">
//         {/* Left Section */}
//         <div className="left_wrapper mb-6 md:mb-0 flex-shrink-0 flex items-center justify-center">
//           <img src={logo} alt="Login" />
//         </div>
//         {/* Right Section */}
//         <div className="right_wrapper space-y-4 max-w-[640px] w-full h-auto">
//           <h3 className="text-3xl md:text-5xl text-[#313131] font-semibold capitalize">Welcome!</h3>
//           <p className="text-base md:text-lg text-[#515def]">
//             Join us today and become a part of the Street Smart community!
//           </p>
//           <form className="space-y-4" onSubmit={handleLogin}>
//             <input
//               type="email"
//               ref={emailRef}
//               className="max-w-[640px] w-full h-[48px] md:h-[56px] border-[1px] border-[#313131] rounded-lg outline-0 pl-3 bg-white text-black text-sm md:text-base"
//               placeholder="Email"
//               required
//             />
//             <div className="relative max-w-[640px] w-full">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 ref={passwordRef}
//                 className="w-full h-[48px] md:h-[56px] border-[1px] border-[#313131] rounded-lg outline-0 pl-3 pr-10 bg-white text-black text-sm md:text-base"
//                 placeholder="Password"
//                 required
//               />
//               <div
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? (
//                   <FaEyeSlash className="text-black" style={{ fontSize: "1.5rem" }} />
//                 ) : (
//                   <FaEye className="text-black" style={{ fontSize: "1.5rem" }} />
//                 )}
//               </div>
//             </div>
//             <p className="max-w-[640px] w-full h-auto text-xs md:text-sm text-[#313131] font-normal">
//               <Link to={'/forget-password'} className="text-red-500 font-medium flex items-center justify-end">Forget Password?</Link>
//             </p>
//             <button
//               type="submit"
//               className="max-w-[640px] w-full h-[48px] md:h-[56px] bg-[#515def] rounded-lg flex items-center justify-center text-base text-[#f3f3f3] capitalize font-semibold"
//             >
//               Continue
//             </button>
//           </form>
//           <p className="max-w-[640px] w-full h-auto text-xs md:text-sm text-[#313131] font-normal">
//             Don't have an account? <Link to={'/register'} className="text-red-500 font-medium">Sign Up</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import '../css/Login.css'; 
import { useRef, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../AuthProvider/AuthProvider";
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import logo from '../assets/logolog.png';

const Login = () => {
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const { handleSubmit } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const body = {
      email: emailRef.current.value,
      password: passwordRef.current.value
    };
    try {
      const response = await handleSubmit("/login", body);
      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format");
      }
      const { message, token, role } = response;
      if (token) {
        localStorage.setItem("token", token);
        Swal.fire({ title: message, icon: "success" });
        navigate(role === "admin" ? "/admin/dashboard" : "/dashboard");
      } else {
        throw new Error(message || "Login failed");
      }
    } catch (error) {
      // Get backend error message if available
      let errorMsg = error.response?.data?.message || error.message;
      Swal.fire({ title: "Login failed", text: errorMsg, icon: "error" });
    }
  };

  return (
    <div className="login-page w-full min-h-screen flex items-center justify-center bg-gray-100 p-10 relative">
      <button
        className="login-top-title login-title-btn"
        onClick={() => navigate('/')}
        type="button"
        tabIndex={0}
      >
        Street Smart
      </button>
      <div className="shape top-left"></div>
      <div className="shape bottom-left"></div>

      {/* Responsive container: stacks on mobile, row on desktop */}
      <div className="lg:container mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16 justify-between w-full">
        {/* Left Section */}
        <div className="left_wrapper mb-6 md:mb-0 flex-shrink-0 flex items-center justify-center">
          <img src={logo} alt="Login" />
        </div>
        {/* Right Section */}
        <div className="right_wrapper space-y-4 max-w-[640px] w-full h-auto">
          <h3 className="text-3xl md:text-5xl text-[#313131] font-semibold capitalize">Welcome!</h3>
          <p className="text-base md:text-lg text-[#515def]">
            Join us today and become a part of the Street Smart community!
          </p>
          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              type="email"
              ref={emailRef}
              className="max-w-[640px] w-full h-[48px] md:h-[56px] border-[1px] border-[#313131] rounded-lg outline-0 pl-3 bg-white text-black text-sm md:text-base"
              placeholder="Email"
              required
            />
            <div className="relative max-w-[640px] w-full">
              <input
                type={showPassword ? "text" : "password"}
                ref={passwordRef}
                className="w-full h-[48px] md:h-[56px] border-[1px] border-[#313131] rounded-lg outline-0 pl-3 pr-10 bg-white text-black text-sm md:text-base"
                placeholder="Password"
                required
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-black" style={{ fontSize: "1.5rem" }} />
                ) : (
                  <FaEye className="text-black" style={{ fontSize: "1.5rem" }} />
                )}
              </div>
            </div>
            <p className="max-w-[640px] w-full h-auto text-xs md:text-sm text-[#313131] font-normal">
              <Link to={'/forget-password'} className="text-red-500 font-medium flex items-center justify-end">Forget Password?</Link>
            </p>
            <button
              type="submit"
              className="max-w-[640px] w-full h-[48px] md:h-[56px] bg-[#515def] rounded-lg flex items-center justify-center text-base text-[#f3f3f3] capitalize font-semibold"
            >
              Continue
            </button>
          </form>
          <p className="max-w-[640px] w-full h-auto text-xs md:text-sm text-[#313131] font-normal">
            Don't have an account? <Link to={'/register'} className="text-red-500 font-medium">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
