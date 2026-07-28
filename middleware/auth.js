export default function authMiddleware(req,res,next){


console.log(
    "ID RECEBIDO:",
    req.sessionID
);


console.log(
    "ADMIN RECEBIDO:",
    req.session.admin
);


if(!req.session.admin){

    return res.status(401).json({

        success:false,

        message:"Acesso não autorizado."

    });

}


next();

}