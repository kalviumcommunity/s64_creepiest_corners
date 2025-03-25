const { DataTypes } = require('sequelize');
const { sequelize } = require('./database/database'); // Correctly import the sequelize instance
const User = require('./models/user'); // Import the User model

const Post = sequelize.define('Post', { 
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    created_by: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    timestamps: true
});

module.exports = Post;
