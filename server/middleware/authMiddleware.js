const jwt = require("jsonwebtoken");


const authMiddleware = (req, res, next) => {

    // Get Authorization header
    const authHeader = req.headers.authorization;  
    
    console.log("Authorization Headers:",authHeader);

    //check if Authorization header exists
    if(!authHeader) {
        return res.status(401).json({
            message: "Access Denied. No Token Provided",
        });
    }

    //Extract JWT Token
    const token = authHeader.split(" ")[1];    // split bearer and token and index one give you second element 
    
    console.log("Token:", token);

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decode;  //contoller can access used.id and user.role 

    next();
};

module.exports = authMiddleware;