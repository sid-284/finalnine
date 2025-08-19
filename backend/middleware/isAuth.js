import jwt from 'jsonwebtoken'

const isAuth = async (req,res,next) => {
    try {
        let token = req.cookies?.token
        console.log('isAuth - Token from cookies:', token ? 'Present' : 'Missing');
        console.log('isAuth - All cookies:', req.cookies);
        console.log('isAuth - Request headers:', req.headers);

        // Fallback: accept Authorization: Bearer <token>
        if(!token){
            const authHeader = req.headers?.authorization || ''
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.slice(7)
                console.log('isAuth - Token from Authorization header:', token ? 'Present' : 'Missing')
            }
        }
        
        if(!token){
            console.log('isAuth - No token found in cookies or headers');
            return res.status(401).json({message:"User does not have token"})
        }
        
        let verifyToken
        try {
            verifyToken = jwt.verify(token, process.env.JWT_SECRET)
            console.log('isAuth - Verified token:', verifyToken);
        } catch (jwtError) {
            console.log('isAuth - JWT verification failed:', jwtError.message)
            return res.status(401).json({message:"Invalid or expired token"})
        }

        if(!verifyToken){
            return res.status(401).json({message:"User does not have a valid token"})
        }
        
        // Handle both userId and email tokens (for admin vs regular users)
        if (verifyToken.userId) {
            req.userId = verifyToken.userId;
            console.log('isAuth - User ID set:', req.userId);
        } else if (verifyToken.email) {
            req.adminEmail = verifyToken.email;
            console.log('isAuth - Admin email set:', req.adminEmail);
        } else {
            console.log('isAuth - Token missing both userId and email:', verifyToken)
            return res.status(401).json({message:"Invalid token format - missing user identification"})
        }
        
        next()

    } catch (error) {
         console.log("isAuth error:", error.message)
         return res.status(401).json({message:`Authentication error: ${error.message}`})
    }
}

export default isAuth