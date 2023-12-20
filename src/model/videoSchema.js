// userModel.js(
const {  DataTypes } = require('sequelize') 
const database = require("../config/database.js")
// CREATE TABLE media_files (
//     id SERIAL PRIMARY KEY,
//     title VARCHAR(255),
//     video_path VARCHAR(255) NOT NULL,
//     vtt_path VARCHAR(255) NOT NULL
//   )
const VideoModel = database.define('video', {
    video_path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vtt_path: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = VideoModel