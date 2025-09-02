import { useContext, useRef } from 'react';
import { AuthContext } from "../AuthProvider/AuthProvider";
import Swal from 'sweetalert2';
import '../css/ForgetPassword.css';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
  const findEmailRef = useRef('');
  const { handleSubmit } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleForget = async (e) => {
    e.preventDefault();

    const body = {
      email: findEmailRef.current.value,
    };

    const { status, message } = await handleSubmit(`/forget-password`, body);

    if (status === 200) {
      Swal.fire({
        title: message,
        icon: "success",
      });

      console.log('forget user', status, message);

      navigate('/login');
    }
  };

  return (
    <div className="forget-password-page w-full min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-8 md:p-10 relative">
      <Link to="/login" className="top-header">
        <ArrowLeft />
        <span>Go back</span>
      </Link>

      <div className="top-title">
        Street Smart
      </div>

      <div className="forget-shape bottom-right"></div>
      <div className="forget-shape top-right"></div>
      <div className="lg:container mx-auto">
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16 justify-between w-full">
          {/* Right Section */}
          <div className="right_wrapper space-y-4 max-w-[640px] w-full h-auto">
            <h3 className="text-3xl sm:text-4xl md:text-5xl text-[#313131] font-semibold capitalize">Forget Your Password?</h3>
            <p className="text-base sm:text-lg text-[#515def]">
              Enter your email below to recover your password
            </p>
            <form className="space-y-4" onSubmit={handleForget}>
              <input
                type="email"
                ref={findEmailRef}
                className="max-w-[640px] w-full h-[48px] sm:h-[56px] border-[1px] border-[#313131] rounded-lg outline-0 pl-3 bg-white text-black"
                placeholder="Email"
                required
              />

              <button
                className="max-w-[640px] w-full h-[48px] sm:h-[56px] bg-[#515def] rounded-lg flex items-center justify-center text-base text-[#f3f3f3] capitalize font-semibold cursor-pointer">
                Submit
              </button>
            </form>
          </div>
          {/* Left Section */}
          <div className="left_wrapper flex justify-center items-center w-full md:w-auto mb-8 md:mb-0">
            <img
              src="src/assets/logolog.png"
              alt="forget"
              className="w-40 sm:w-64 md:w-[320px] lg:w-[400px] h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;