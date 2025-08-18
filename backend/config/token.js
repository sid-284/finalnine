import jwt from "jsonwebtoken"

export const genToken = async (userId) => {
   try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    let token = await jwt.sign({userId} , process.env.JWT_SECRET , {expiresIn:"7d"})
    return token
   } catch (error) {
     console.error("token error:", error)
     throw error
   }
}

export const genToken1 = async (email) => {
   try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    let token = await jwt.sign({email} , process.env.JWT_SECRET , {expiresIn:"7d"})
    return token
   } catch (error) {
     console.error("token error:", error)
     throw error
   }
}
