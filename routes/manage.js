const router = require('koa-router')();
router.prefix('/manage')
router.get('/', async (ctx, next) => {
    await ctx.render('manage_menu', {current: null, title: global.config.title, subtitle: 'Management'});
})

router.get('/articles', async (ctx, next) => {
    const article = global.blog.loadModel('article');
    const user = global.blog.loadModel('user');
    await article.findAll().then(async (ret) => {
        let dict_render = require('../modules/user_agent_snap').response(ctx, "article", '', "Articles");
        var cnt = 0;
        dict_render.data = [];
        /*user.findById(ret[i].author).toJSON().fulfillmentValue.nickname*/
        for (var i = 0; i < ret.length; ++i) {
            var author = undefined;
            await user.findById(ret[i].author).then((ans) => author = ans);
            dict_render.data.push({
                title: ret[i].title,
                author: author.nickname,
                time_create: ret[i].createdAt.toLocaleDateString(),
            });
        }
        dict_render.art_cnt = ret.length;
        await ctx.render('manage_articles', dict_render);
    });
})

module.exports = router;