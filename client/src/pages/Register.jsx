import { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from "../AuthProvider/AuthProvider";
import Swal from 'sweetalert2';
import logo from '../assets/logolog.png';
import '../css/Register.css'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const { handleSubmit } = useContext(AuthContext);
    const firstNameRef = useRef('');
    const lastNameRef = useRef('');
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [passwordStrength, setPasswordStrength] = useState(''); // State for password strength

    // Function to evaluate password strength
    const evaluatePasswordStrength = (password) => {
        if (password.length < 6) {
            return { strength: 'Weak', color: 'red' };
        }
        if (password.length >= 6 && /[A-Z]/.test(password) && /\d/.test(password)) {
            return { strength: 'Medium', color: 'yellow' };
        }
        if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*]/.test(password)) {
            return { strength: 'Strong', color: 'green' };
        }
        return { strength: 'Weak', color: 'red' };
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        const { strength, color } = evaluatePasswordStrength(password);
        setPasswordStrength({ strength, color });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const body = {
            firstName: firstNameRef.current.value,
            lastName: lastNameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        try {
            const response = await handleSubmit('/register', body);

            if (!response || typeof response !== "object") {
                throw new Error("Invalid response from the server.");
            }

            const { status, message } = response;

            if (status === 201) {
                Swal.fire({
                    title: "Registration Successful!",
                    text: message,
                    icon: "success",
                    
                });

                // Clear input fields
                firstNameRef.current.value = '';
                lastNameRef.current.value = '';
                emailRef.current.value = '';
                passwordRef.current.value = '';
            } else if (status === 400) {
                Swal.fire({
                    title: "Registration Failed",
                    text: message || "Email is already in use. Please try another email.",
                    icon: "error",
                   
                });
            } else {
                throw new Error(message || "Something went wrong. Please try again later.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            Swal.fire({
                title: "Error",
                text: error.message || "Something went wrong. Please try again later.",
                icon: "error",
              
            });
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 p-10 relative">
            <div className="register-top-title">
                Street Smart
            </div>
            <div className="register-shape top-left"></div>
            <div className="register-shape bottom-right"></div>

            <div className="lg:container mx-auto">
                <div className="flex items-center gap-16 justify-between w-full">
                    {/* Left Section */}
                    <div className="left_wrapper">
                        <img
                            src={logo}
                            alt="register"
                            className="max-w-full h-auto"
                        />
                    </div>

                    {/* Right Section */}
                    <div className="right_wrapper space-y-4 max-w-[640px] w-full h-auto">
                        <h3 className="text-5xl text-[#313131] font-semibold capitalize">Register</h3>
                        <p className="text-lg text-[#515def]">
                            Join us today and become a part of the Street Smart community!
                        </p>
                        <form className="space-y-4" onSubmit={handleRegister}>
                            <input
                                type="text"
                                ref={firstNameRef}
                                className="max-w-[640px] w-full h-[56px] border-[1px] border-[#313131] rounded-lg outline-0 pl-3 bg-white text-black"
                                placeholder="First Name"
                                required
                            />
                            <input
                                type="text"
                                ref={lastNameRef}
                                className="max-w-[640px] w-full h-[56px] border-[1px] border-[#313131] rounded-lg outline-0 pl-3 bg-white text-black"
                                placeholder="Last Name"
                                required
                            />
                            <input
                                type="email"
                                ref={emailRef}
                                className="max-w-[640px] w-full h-[56px] border-[1px] border-[#313131] rounded-lg outline-0 pl-3 bg-white text-black"
                                placeholder="Email"
                                required
                            />
                            <div className="relative max-w-[640px] w-full">
                                <input
                                    type={showPassword ? "text" : "password"} // Toggle input type
                                    ref={passwordRef}
                                    onChange={handlePasswordChange} // Evaluate password strength
                                    className="w-full h-[56px] border-[1px] border-[#313131] rounded-lg outline-0 pl-3 pr-10 bg-white text-black"
                                    placeholder="Password"
                                    required
                                />
                                <div
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                                >
                                    {showPassword ? (
                                        <FaEyeSlash className="text-black" style={{ fontSize: "1.5rem" }} />
                                    ) : (
                                        <FaEye className="text-black" style={{ fontSize: "1.5rem" }} />
                                    )}
                                </div>
                            </div>
                            {passwordStrength && (
                                <p className="text-sm font-medium mt-1">
                                    <span style={{ color: "black" }}>Password Strength:</span> {/* Static black text */}
                                    <span style={{ color: passwordStrength.color }}> {passwordStrength.strength}</span> {/* Dynamic color for strength */}
                                </p>
                            )}
                            <button
                                className="max-w-[640px] w-full h-[56px] bg-[#515def] rounded-lg flex items-center justify-center text-base text-[#f3f3f3] capitalize font-semibold"
                            >
                                Create Account
                            </button>
                        </form>
                        <p className='max-w-[640px] w-full h-auto text-sm text-[#313131] font-normal'>
                            Already have an account? <Link to={'/login'} className='text-red-500 font-medium'>Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;