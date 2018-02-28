const Sequelize = require('sequelize')

const db = global.blog.db
const model = db.define('user', {
    first_name: {type: Sequelize.STRING}, 
    last_name: {type: Sequelize.STRING}, 
    nickname: {type: Sequelize.STRING}, 
    user_group: {type: Sequelize.STRING, defaultValue: "U"}, 
    article_count: {type: Sequelize.INTEGER, defaultValue: 0, validate: {isInt: true}}, 
    email: {type: Sequelize.STRING, validate: {isEmail: true, notEmpty: true}}, 
    password: {type: Sequelize.STRING, defaultValue: ""}, 
})
model.sync().then(()=>{
    const crypto = require('crypto');
    const salt = global.config.passwd_salt;
    for(let name in global.config.admins){
        let passwd = salt + global.config.admins[name];
        let actual = crypto.createHash('md5').update(passwd).digest('hex')
        model.findOrCreate({where: {nickname: name}, defaults: {
            first_name: name, 
            last_name: name, 
            user_group: "S", 
            email: "admin@admin.xyz", password: actual}});
    }
})
module.exports = model;