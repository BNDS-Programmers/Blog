const Model = global.blog.loadModel('article');
global.ArticleSnap = {
    async all(){
        await Model.findAll().then(async (ret) => {
            return (await ret);
        });
    },
    async count(){
        await Model.findAll().then(async (ret) => {
            return ret.length;
        });
    }
}

module.exports = ArticleSnap;