// require('dotenv').config()
// const jwt = require("jsonwebtoken");

// const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// const verifyToken = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       throw new UnauthenticatedError('No token provided');
//     }

//     const token = authHeader.split(' ')[1];

//     if (!token) {
//       return res.status(403).send("A token is required for authentication");
//     }
//     try {
//       const decoded = jwt.verify(token, JWT_SECRET_KEY);

//       req.user = decoded.userId;

//     } catch (err) {
//       return res.status(401).send("Invalid Token");
//     }
//     return next();
//   };

//   module.exports = {
//     verifyToken,
//   };


async function isActive(userId) {
    try {
        // console.log("userId", userId);
        const member = await Member.findOne({ member_user_id: userId });
        // console.log("member", member);

        if (member && member.isActive === true) {
            return member; 
        } else {
            return false; 
        }
    } catch (error) {
        console.log("error in ValidMember", error);
        throw error;
    }
}

async function isActiveAdmin(userId) {
    try {
        const admin = await Admin.findOne({ admin_user_id: userId });

        if (admin && admin.isActive === true) {
            return admin; 
        } else {
            return false; 
        }
    } catch (error) {
        console.log("error in ValidMember", error);
        throw error;
    }
}


require('dotenv').config();
const jwt = require("jsonwebtoken");
const Member = require("../models/memberModel");
const Admin = require("../models/AdminModel");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;


// Below is running code for ValidMember()
// const ValidMember = async (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {   //|| !authHeader.startsWith('Bearer ')
//         return res.status(401).send("No token provided");
//     }

//     // const token = authHeader.split(' ')[1];

//     // if (!token) {
//     //     return res.status(401).send("A token is required for authentication");
//     // }

//     try {
//         const decoded = jwt.verify(authHeader, JWT_SECRET_KEY);

//         console.log(decoded);

//         const userId = decoded.userId;
//         const userType = decoded.userType;

//         const verify = await isActive(userId); 

//         if (!verify) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Member Not Found !",
//             });
//         }
//         if (verify.userType !== userType) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Invalid User Type !",
//             });
//         }

//         // Attach the user object to the request for further processing
//         req.user = verify;
//         req.userType = userType;
//         next();
//     } catch (err) {
//         if (err.name === 'JsonWebTokenError') {
//             return res.status(401).send("Invalid token");
//         } else {
//             console.log(err)
//             return res.status(500).send("Internal Server Error");
//         }
//     }
// };

// Authentication process with user activity check
const authenticateUser = async (username, password) => {
    try {
      const user = await Member.findOne({ member_user_id: username });
  
      if (!user) {
        // User not found
        return { error: "User not found" };
      }
  
      if (!user.isActive) {
        // Inactive user, return an error
        return { error: "Inactive User" };
      }
  
      // Perform password validation here (compare hashed password, etc.)
  
      // Generate token if the user is active and password is valid
      const token = jwt.sign(
        { userId: user.member_user_id, userType: user.userType },
        JWT_SECRET_KEY,
        { expiresIn: '1h' } // Adjust expiration time as needed
      );
  
      return { token };
    } catch (error) {
      console.error('Error during authentication:', error);
      return { error: "Internal Server Error" };
    }
  };
  
  // ValidMember middleware with user activity check
  const ValidMember = async (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return res.status(401).send("No token provided");
    }
  
    try {
      const decoded = jwt.verify(authHeader, JWT_SECRET_KEY);
  
      const userId = decoded.userId;
      const userType = decoded.userType;
  
      const user = await Member.findOne({ member_user_id: userId });
  
      if (!user) {
        return res.status(403).json({
          success: false,
          message: "Invalid User! Please contact support.",
        });
      }
  
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Inactive User! Please contact support.",
        });
      }
  
      if (user.userType !== userType) {
        return res.status(403).json({
          success: false,
          message: "Invalid User Type!",
        });
      }
  
      // Attach the user object to the request for further processing
      req.user = user;
      req.userType = userType;
      next();
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).send("Invalid token");
      } else {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }
    }
  };
  




const isAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {   //|| !authHeader.startsWith('Bearer ')
        return res.status(401).send("No token provided");
    }

    // const token = authHeader.split(' ')[1];

    // if (!token) {
    //     return res.status(401).send("A token is required for authentication");
    // }

    try {
        const decoded = jwt.verify(authHeader, JWT_SECRET_KEY);

        console.log(decoded);

        const userId = decoded.userId;
        const userType = decoded.userType;

        const verify = await isActiveAdmin(userId);

        if (!verify) {
            return res.status(403).json({
                success: false,
                message: "Admin Not Found !",
            });
        }
        if (verify.userType !== userType) {
            return res.status(403).json({
                success: false,
                message: "Invalid User Type !",
            });
        }

        // Attach the user object to the request for further processing
        req.user = verify;
        req.userType = userType;
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).send("Invalid token");
        } else {
            console.log(err)
            return res.status(500).send("Internal Server Error");
        }
    }
};

// Updated isActive function
// const isActive = async (userId) => {
//     try {
//         const user = await Member.findOne({ member_user_id: userId });

//         if (!user) {
//             return false; // User not found
//         }

//         return user.isActive; // Assuming there is an isActive field in the Member model
//     } catch (error) {
//         console.error('Error checking user activity:', error);
//         return false; // Return false in case of an error
//     }
// };



module.exports = {
    ValidMember,
    isAdmin
};
