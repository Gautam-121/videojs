const multer = require("multer");
const path = require("path");
const VideoModel = require("../model/videoSchema");

const storage = multer.diskStorage({
    destination: "./uploads",
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// CREATING UPLOADMEDIA DATA
const uploadMediaData = async (req, res) => {
    try {

        const videoFilePath = req.files["video"][0].filename;
        const vttFilePath = req.files["vtt"][0].filename;
        const data = JSON.parse(JSON.stringify(req.body))

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
            message: error.message
        });
    }
}

const getVideoById = async (req , res)=>{
    
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
}


module.exports = {uploadMediaData , getAllVideo , getVideoById}
