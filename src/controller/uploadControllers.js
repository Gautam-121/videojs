const VideoModel = require("../model/videoSchema");

// CREATING UPLOADMEDIA DATA
const uploadMediaData = async (req, res) => {
    try {

        console.log("Enter inside UpdloadData")
        const videoFilePath = req?.files["video"]?.[0]?.filename;
        console.log("Rich line No 8")
        let vttFilePath = null;
        const data = JSON.parse(JSON.stringify(req.body))

        console.log(req?.files["video"]?.[0])

        if(req.files?.["vtt"]?.[0]?.filename){
            vttFilePath = req.files["vtt"][0].filename
            console.log(req.files?.["vtt"]?.[0]?.filename)
        }

        const mediaResult = await VideoModel.create({
            video_path: videoFilePath,
            vtt_path: vttFilePath,
            video_id : data.id,
            title: data.title
        });

        return res.status(201).json({
            success: true,
            message: "Video Data Created Successfully",
            mediaResult,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
            msg: error
        });
    }
}

// FETCH ALL UPLOADMEDIA 
const getAllVideo = async (req, res) => {
    try {
        const videoResult = await VideoModel.findAll();
        return res.status(200).json({
            success: true,
            videoResult
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        });
    }
}

const getVideoById = async (req , res)=>{
    try {
        if(!req.params.id){
            return res.status(400).json({
                success : false,
                message : "Video_id is Missing"
            })
        }
        const videoData = await VideoModel.findOne({ 
            where: { video_id: req.params.id } 
        })
        if(!videoData){
            return res.status(404).json({
                success : false,
                message : "Video data not Found"
            })
        }
        return res.status(200).json({
            success : true,
            data : videoData
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}


module.exports = {uploadMediaData , getAllVideo , getVideoById}
