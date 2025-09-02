import { useRef, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../AuthProvider/AuthProvider";
import logo from '../assets/logolog.png';
import '../css/ResetPassword.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
  const createPasswordRef = useRef('');
  const confirmPasswordRef = useRef('');
  const { token } = useParams();
  const navigate = useNavigate();
  const { handleSubmit } = useContext(AuthContext);

  const [showCreatePassword, setShowCreatePassword] = useState(false); // State for "New Password"
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for "Re-enter New Password"

  console.log('reset password token', token);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (createPasswordRef.current.value === confirmPasswordRef.current.value) {
      const body = {
        password: confirmPasswordRef.current.value
      };

      const { status, message } = await handleSubmit(`/reset-password/${token}`, body);

      if (status === 200) {
        Swal.fire({
          title: message,
          icon: "success",
        });

        console.log('user logged', status, message);

        navigate('/login');
      }
    } else {
      Swal.fire({
        title: "Passwords do not match",
        text: "Please make sure both passwords are the same.",
        icon: "error",
  
      });
    }
  };

  return (
    <div className="reset-password-page w-full min-h-screen flex items-center justify-center bg-gray-100 p-10 relative">
      <div className="top-title">Street Smart</div>

      <div className="verify-shape top-right"></div>
      <div className="verify-shape bottom-right"></div>

      <div className="lg:container mx-auto">
        <div className="flex items-center gap-16 justify-between w-full">
          {/* Right Section */}
          <div className="right_wrapper space-y-4 max-w-[640px] w-full h-auto">
            <h3 className="text-5xl text-[#313131] font-semibold capitalize">Reset Password</h3>
            <p className="text-lg text-[#515def]">
              Join us today and become a part of the Street Smart community!
            </p>
            <form className="space-y-4" onSubmit={handleResetPassword}>
              <div className="relative max-w-[640px] w-full">
                <input
                  type={showCreatePassword ? "text" : "password"} // Toggle input type
                  ref={createPasswordRef}
                  className="w-full h-[56px] border-[1px] border-[#313131] rounded-lg outline-0 pl-3 pr-10"
                  placeholder="New Password"
                  required
                />
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowCreatePassword(!showCreatePassword)} // Toggle visibility
                >
                  {showCreatePassword ? (
                    <FaEyeSlash className="text-black" style={{ fontSize: "1.5rem" }} />
                  ) : (
                    <FaEye className="text-black" style={{ fontSize: "1.5rem" }} />
                  )}
                </div>
              </div>

              <div className="relative max-w-[640px] w-full">
                <input
                  type={showConfirmPassword ? "text" : "password"} // Toggle input type
                  ref={confirmPasswordRef}
                  className="w-full h-[56px] border-[1px] border-[#313131] rounded-lg outline-0 pl-3 pr-10"
                  placeholder="Re-enter New Password"
                  required
                />
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-black" style={{ fontSize: "1.5rem" }} />
                  ) : (
                    <FaEye className="text-black" style={{ fontSize: "1.5rem" }} />
                  )}
                </div>
              </div>

              <button
                className="max-w-[640px] w-full h-[56px] bg-[#515def] rounded-lg flex items-center justify-center text-base text-[#f3f3f3] capitalize font-semibold"
              >
                Reset Password
              </button>
            </form>
          </div>

          {/* Left Section */}
          <div className="left_wrapper">
            <img
              src={logo}
              alt="Reset Password"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
