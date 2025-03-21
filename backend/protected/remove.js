// to implement

exports.remove = async (req,res,next) => {
    try{

    }
    catch(error){
        res.status(500).json({
            success: false,
            data: "Internal server error",
            message: error.message,
        });
    }
}