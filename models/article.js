const Sequelize = require('sequelize')

const db = global.blog.db;
const model = db.define('article', {
    author: { type: Sequelize.INTEGER, defaultValue: 0 }, 
    content: {type: Sequelize.TEXT, defaultValue: ""}, 
    title: {type: Sequelize.TEXT, defaultValue: ""}, 
    tag: {type: Sequelize.STRING, defaultValue: ""}, 
    preface: {type: Sequelize.TEXT, defaultValue: ""}, 
    content_type: {type: Sequelize.STRING, defaultValue: "html"}, 
});
// Test data 
model.sync().then(() => {
    for(var i = 1;i <= 30;++i){
        model.findOrCreate({
            where: { title: `Test ${i}` }, defaults: {
                author: 1
            }
        });
    }
})
model.sync();
module.exports = model