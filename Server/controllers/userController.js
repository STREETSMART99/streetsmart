const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail'); 

const userRegistration = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { firstName, lastName, email, password, isVerified } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create user
    const adminEmail = process.env.ADMIN_EMAIL;
    const isAdmin = email === adminEmail;

    user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      isVerified,
      verificationToken,
      isAdmin,
    });

    await user.save(); // Save user before generating token

    // Generate JWT token after saving user
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("Verification Link:", `${process.env.CLIENT_URL}/verify-email/${verificationToken}`);

    // Send verification email
    const emailContent = `
      <h2>Email verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${process.env.CLIENT_URL}/verify-email/${verificationToken}" target="_blank">
        Verify Email
      </a>
    `;
    await sendEmail(user.email, "Verify your Email", emailContent);

    return res.status(201).json({
      message: "User registered successfully! Check your email for verification.",
      token,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
    
        if (!user) return res.status(404).json({ message: "User not found" });
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
    
        const token = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin }, 
          process.env.JWT_SECRET, 
          { expiresIn: "1h" } // Token expires in 1h minutes
        );
    
        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 60 * 60 * 1000, 
        });
    
        console.log("Full API response before sending:", {
          message: "User logged in successfully",
          token,
          isAdmin: user.isAdmin,
        });
    
        return res.status(200).json({
          message: "User logged in successfully",
          token,
          isAdmin: user.isAdmin,
        });
    
      } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
      }
    };




    

const userPasswordForget = async (req, res) => {
try {
const {email} = req.body;


//check if user exist
const user = await User.findOne({email});
if(!user) {
    return res.status(400).json({
        message: 'User does not exist'
    })
};


// generate a password rest token
const resetToken = crypto.randomBytes(32).toString('hex');
console.log('Reset Token:', resetToken);

//store the reset token in the user's database record(temporary)
user.resetPasswordToken = resetToken;
user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

await user.save();
console.log('Reset token and expiration saved for user:', user);

//reset password link
const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`; //frontend url > http://localhost:5173/${resetToken}
console.log('Reset Link:', resetLink);
console.log('CLIENT_URL:', process.env.CLIENT_URL);



//email content
const emailContent = `
   <h2>Password reset request</h2>
   <p>Click the link below to reset your password:</p>
   <a href="${resetLink}" target="_blank">${resetLink}</a>
   <p>This link will expire in 1 hour.</p>
`;



   //send email
   await sendEmail(user.email, 'Password Reset Request', emailContent);
   console.log('Email successfully sent!');


res.status(200).json({
    message: 'Password reset link sent to your email',
    resetToken
})

    
} catch (error) {
    res.status(500).json({  
        message: 'server error'
    })
}

};


const userPasswordReset = async (req, res) =>{
    try {
        
        const {token} = req.params;
        const {password} = req.body
//find user by reset token and check if token is still valid
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {$gt: Date.now()}, //ensure token is not expired
        });

        if(!user) {
            return res.status(400).json({
                message: 'Invalid or expired token'
            })
        };


        //hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        //clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;  

        //save user new password
        await user.save();  

        res.status(200).json({
            message: 'Password reset successfully',
            user  
        });


    } catch (error) {
        res.status(500).json({  
            message: 'server error'
        })
    }
    
};


const userVerifyEmail =   async (req, res) => {
try {
    
const {token} = req.params;

const user= await User.findOne({verificationToken: token,})
if (!user){
    return res.status(400).json({
        message: 'Invalid or expired verification token'
    })
}

//mark user as verified
user.isVerified =true,
user.verificationToken =undefined;

await user.save();


res.status(200).json({
message: 'Email verified successfully',
user
});



} catch (error) {
    res.status(500).json({  
        message: 'server error'
    })
}
}



const userLogout = async (req, res) => {
    try {
      // Correct syntax for clearCookie
      res.clearCookie('token', {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        sameSite: 'strict',
      });
  
     
      res.status(200).json({
        message: 'User logged out successfully',
      });
    } catch (error) {
      // Catch and handle errors
      res.status(500).json({
        message: 'Server error',
      });
    }
  };
  



// Function to get user details
const getUserDetails = async (req, res) => {
  try {
    // Use the user ID from the decoded token (set by authMiddleware)
    const user = await User.findById(req.user.id); // Fetch user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's details
    res.status(200).json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
    userRegistration,
    userLogin,
    userPasswordForget,
    userPasswordReset,
    userVerifyEmail,
    userLogout,
    getUserDetails

    

};

