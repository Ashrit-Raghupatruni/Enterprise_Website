export default function adminGuard(req,res,next){
    if(!req.user||req.user.role!=="ADMIN"){
        return res.status(403).json({
            success:false,
            message:'Forbidden : Admin access only.'
        });
    }
    next();
}

