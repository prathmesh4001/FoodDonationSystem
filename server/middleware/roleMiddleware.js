const roleMiddleware = (...allowedRoles) => {       //allowedrole called rest operator collect all roles into array

    return (req, res, next) => {

        //check if logged-in user's role is allowed
        if(!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access Denied . You are not authorized.",
            });
        }

        //user has permission
        next();
    };
};

module.exports  = roleMiddleware;
