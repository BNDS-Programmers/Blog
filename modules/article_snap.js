const Model = global.blog.loadModel('article');
global.ArticleSnap = {
    async all(){
        await Model.findAll().then(async (ret) => {
            return (await ret);
        });
    },
}

module.exports = ArticleSnap;