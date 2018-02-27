const Sequelize = require('sequelize')

const db = global.blog.db;
const model = db.define('article', {
    author: { type: Sequelize.INTEGER, defaultValue: 0 }, 
    content: {type: Sequelize.TEXT, defaultValue: ""}, 
    title: {type: Sequelize.TEXT, defaultValue: ""}
});

let Model = require('./common')
class Article extends Model{}
Article.model = model; // Override the model
Article.content = ""
Article.author = 0
module.exports = Article