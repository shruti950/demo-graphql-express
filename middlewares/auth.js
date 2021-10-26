const jwt = require('jsonwebtoken')

module.exports = async (req,res,next)=>{
  try{
    const tokenHeader = req.get('Authorization');
    if(!tokenHeader){
      req.isAuth = false;
      return next();
    }
    const token = tokenHeader.split(' ')[1];
    const decodedToken = await jwt.verify(token,'secretkey')
      req.isAuth = true;
      req.userId = decodedToken.userId;
      next()
  } catch (error){
    throw error;
  }
}