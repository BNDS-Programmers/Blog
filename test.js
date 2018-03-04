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

const user_model = db.define('user', {
    first_name: { type: Sequelize.STRING },
    last_name: { type: Sequelize.STRING },
    nickname: { type: Sequelize.STRING },
    user_group: { type: Sequelize.STRING, defaultValue: "U" },
    article_count: { type: Sequelize.INTEGER, defaultValue: 0, validate: { isInt: true } },
    email: { type: Sequelize.STRING, validate: { isEmail: true, notEmpty: true } },
    password: { type: Sequelize.STRING, defaultValue: "" },
})

module.exports = {Sequelize, model, user_model, db};