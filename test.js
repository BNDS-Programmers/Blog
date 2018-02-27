const Sequelize = require('sequelize')
const db = new Sequelize('blog', 'root', 'root', {
    dialect: 'mysql', 
    host: 'localhost'
});
const model = db.define('article', {
    author: { type: Sequelize.INTEGER, defaultValue: 0 },
    content: { type: Sequelize.TEXT, defaultValue: "" },
    title: { type: Sequelize.TEXT, defaultValue: "" }
});
module.exports = {Sequelize, model, db};