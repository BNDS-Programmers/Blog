const Model = global.blog.loadModel('article');
global.ArticleSnap = {
    async all(){
        let ans = [];
        await Model.findAll().then(async (ret) => {
            ans = ret;
        });
        return ans;
    },
    async count(){
        let ret = 0;
        await Model.findAll().then(async (ret) => {
            ret = ret.length;
        });
        return ret;
    }, 
    async findById(id) {
        let result = undefined;
        await Model.findById(id).then(ret => {
            result = ret;
        });
        return result;
    }, 
    get_tags(obj) {
        return obj.tag.split(',').map(x => x.trim()).filter(x => x.length);
    }
}

module.exports = ArticleSnap;