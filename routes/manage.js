const router = require('koa-router')();
router.prefix('/manage')
router.get('/', async (ctx, next) => {
    await ctx.render('manage_menu', {current: null, title: global.config.title, subtitle: 'Management'});
})

router.get('/articles', async (ctx, next) => {
    const article = global.blog.loadModel('article');
    const user = global.blog.loadModel('user');
    const ArticleSnap = global.blog.loadModule('article_snap');
    let get_param = ctx.query;
    let page = get_param.page;
    if(typeof page === 'undefined') page = 1;
    else page = parseInt(page);
    let pageinate = global.config.manage.article_pageinate;
    let article_cnt = 0;
    await article.findAll().then((ret) => article_cnt = ret.length);
    if(page < 1) page = 1;
    else if (page > article_cnt / pageinate + 1) page = Math.ceil(article_cnt / pageinate);
    console.log(page);
    await article.findAll({offset: pageinate * (page - 1), limit: pageinate}).then(async (ret) => {
        let dict_render = require('../modules/user_agent_snap').response(ctx, "article", '', "Articles");
        var cnt = 0;
        dict_render.data = [];
        for (var i = 0; i < ret.length; ++i) {
            var author = undefined;
            await user.findById(ret[i].author).then((ans) => author = ans);
            dict_render.data.push({
                title: ret[i].title,
                author: author.nickname,
                time_create: ret[i].createdAt.toLocaleDateString(),
            });
        }
        dict_render.pagination = {
            current: parseInt(page), 
            last_page: Math.ceil(article_cnt / pageinate), 
            item_each: pageinate
        }
        dict_render.art_cnt = ret.length;
        await ctx.render('manage_articles', dict_render);
    });
})

module.exports = router;