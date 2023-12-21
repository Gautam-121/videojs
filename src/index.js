const express = require("express");
const app = express();
const database = require("./config/database.js");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");
const VideoModel = require("./model/videoSchema.js");
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

//Handling uncaughtException  --> anyThing Not defined
process.on("uncaughtException", (err) => {
  console.log(`Error ${err.message}`);
  console.log(`Shutting down the server due to uncaughtException Error `);
  process.exit(1);
});

database.sync()
.then(() => {console.log("Database synced");})
.catch((err) => {console.log(err);});

// Configure Multer storage for video and VTT files
const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.get("/getSampleData",async(req , res )=>{
    return res.status(200).json({
        success :true,
        message : "Data is Come From Sample Data"
    })
})

// API endpoint for uploading video and VTT file
app.post("/upload/media",upload.fields([{ name: "video" }, { name: "vtt" }]),async (req, res) => {
    try {

      const videoFilePath = req.files["video"][0].filename;
      const vttFilePath = req.files["vtt"][0].filename;

      const mediaResult = await VideoModel.create({
        video_path: videoFilePath,
        vtt_path: vttFilePath,
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
);

app.get("/getAllVideo", async (req, res) => {
  try {
    // Fetch the video information from the database, assuming you have a method to retrieve it
    console.log("enter Inside GetAllVideo")
    const videoResult = await VideoModel.findAll();
    console.log("After Calling Data")
    return res.status(200).json({
        success : true,
        videoResult
    })
    
  } catch (error) {
    res.status(500).send({
        success : false,
        message : error.message
    });
  }
});


const server = app.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost:${process.env.PORT}`);
});

// Unhandled  Promise Rejection ---> mongoDB cluster ERROR
process.on("unhandledRejection", (err) => {
  console.log(`Error ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
