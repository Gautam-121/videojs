const {  DataTypes } = require('sequelize') 
const database = require("../config/database.js")

const VideoModel = database.define('video', {
    video_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'Video ID must be unique.'
        },
        validate: {
            notEmpty: {
                args: true,
                msg: 'Provide Video_id.'
            }
        },
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Title must not be empty'
            }
        },
        allowNull: false,
    },
    video_path: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: {
                args: true,
                msg: 'VideoPath is not be empty.'
            }
        },
        allowNull: false,
    },
    vtt_path: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Vtt is not be empty.'
            }
        },
        allowNull: false
    },
});

module.exports = VideoModel