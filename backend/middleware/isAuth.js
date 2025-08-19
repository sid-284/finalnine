import jwt from 'jsonwebtoken'


const isAuth = async (req,res,next) => {
    try {
        let token = req.cookies?.token
        console.log('isAuth - Token from cookies:', token ? 'Present' : 'Missing');

        // Fallback: accept Authorization: Bearer <token>
        if(!token){
            const authHeader = req.headers?.authorization || ''
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.slice(7)
                console.log('isAuth - Token from Authorization header:', token ? 'Present' : 'Missing')
            }
        }
        
        if(!token){
            return res.status(401).json({message:"User does not have token"})
        }
        
        let verifyToken = jwt.verify(token,process.env.JWT_SECRET)
        console.log('isAuth - Verified token:', verifyToken);

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
            return res.status(401).json({message:"Invalid token format"})
        }
        
        next()

    } catch (error) {
         console.log("isAuth error:", error.message)
    return res.status(401).json({message:`Authentication error: ${error.message}`})
        
    }
}

export default isAuth