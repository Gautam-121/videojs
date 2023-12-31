const VideoModel = require("../model/videoSchema");
const fs = require('fs');
const path = require('path');

// CREATING UPLOADMEDIA DATA
const uploadMediaData = async (req, res) => {
    try {
        
        const videoFilePath = req?.files["video"]?.[0]?.filename;
        let vttFilePath = null;
        const data = JSON.parse(JSON.stringify(req.body))

        if(req.files?.["vtt"]?.[0]?.filename){
            vttFilePath = req.files["vtt"][0].filename
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

const updateVideoById = async (req, res, next) => {
  try {

    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "video_id is Missing",
      });
    }

    const isVideoDataExist = await VideoModel.findByPk(req.params.id);

    if (!isVideoDataExist) {
      return res.status(404).json({
        success: false,
        message: "videoData Not Found",
      });
    }

    let datas = {};
    const data = JSON.parse(JSON.stringify(req.body));

    if (req?.files?.["video"]) {

      const filePathToDelete = path.join(
        "uploads/", isVideoDataExist.video_path
      );

      try {
        await fs.promises.unlink(filePathToDelete);
        console.log(`File deleted: ${filePathToDelete}`);

        const videoFilePath = req?.files["video"]?.[0]?.filename;
        datas["video_path"] = videoFilePath;

      } catch (err) {
        console.log(`Error deleting file: ${filePathToDelete}`);
      }
    }

    if (req?.files?.["vtt"]) {

      if (isVideoDataExist.vtt_path) {
        const filePathToDelete = path.join(
          "uploads/", isVideoDataExist.vtt_path
        );

         try {
          await fs.promises.unlink(filePathToDelete);
          console.log(`File deleted: ${filePathToDelete}`);

          const vttFilePath = req.files["vtt"][0].filename;
          datas["vtt_path"] = vttFilePath;

        } catch (err) {
          console.error(`Error deleting file: ${filePathToDelete}`);
        }
      }
    }

    // Update the project based on the ID
    const [, updatedProject] = await VideoModel.update({...data , ...datas},{
      where: {
        video_id: req.params.id,
      },
      returning: true, // This ensures that the updated row is returned
    });

    return res.status(201).json({
      success: true,
      message: "Video Data Created Successfully",
      updatedProject
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {uploadMediaData , getAllVideo , getVideoById , updateVideoById}
