const Sequelize = require('sequelize')

const db = global.blog.db;
const model = db.define('article', {
    author: { type: Sequelize.INTEGER, defaultValue: 0 }, 
    content: {type: Sequelize.TEXT, defaultValue: ""}, 
    title: {type: Sequelize.TEXT, defaultValue: ""}
});
/* Test data 
*/model.sync().then(() => {
    for(var i = 1;i < 6;++i){
        model.findOrCreate({
            where: { title: `Test ${i}` }, defaults: {
                author: 1
            }
        });
    }
})
module.exports = model