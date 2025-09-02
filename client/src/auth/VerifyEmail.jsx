import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { useContext } from "react";
import Swal from "sweetalert2";
import logo from '../assets/logolog.png';
import '../css/VerifyEmail.css'; 





const VerifyEmail = () => {


const { token } = useParams();
const {handleSubmit} = useContext(AuthContext)
const navigate = useNavigate();

console.log('verify email token', token)

const handleVerifyEmail = async (e) => {
e.preventDefault();

  const {status, message} = await handleSubmit(`/verify-email/${token}`, {});
  console.log(`Attempting verification with token: ${token}`);


  if(status === 200) {
    Swal.fire({
      title: message,
      icon: "success",
    });

    console.log('verify email', status, message);

    navigate('/login') 
  }
};


  return(
<div className="verify-page w-full min-h-screen flex items-center justify-center bg-gray-100 p-10 relative">

<div className="top-title">Street Smart</div>

<div className="verify-shape top-right"></div>
<div className="verify-shape bottom-right"></div>

    <div className="lg:container mx-auto">
      <div className="flex items-center gap-16 justify-between w-full">
      
        {/* Right Section */}
        <div className="right_wrapper space-y-4 max-w-[640px] w-full h-auto">
          <h3 className="text-5xl text-[#313131] font-semibold capitalize">Verify Email</h3>
          <p className="text-lg text-[#515def]">
            An authentication link has been sent to your email.
          </p>
          <form className="space-y-4" onSubmit={handleVerifyEmail}>
  
            <button
              className="max-w-[640px] w-full h-[56px] bg-[#515def] rounded-lg flex items-center justify-center text-base text-[#f3f3f3] capitalize font-semibold"
            >
              Verify Email
            </button>
          </form>
        </div>
  {/* Left Section */}
  <div className="left_wrapper">    
          <img
            src={logo}
            alt="verify email"
            
          />
        </div>

      </div>
    </div>
  </div>

    );
};

export default VerifyEmail;