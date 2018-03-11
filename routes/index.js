const router = require('koa-router')();
// const article = global.blog.loadModel('article');

router.get('/', async (ctx, next) => {
    const UserAgentSnap = global.blog.loadModule('user_agent_snap');
    const article = global.blog.loadModel('article');
    const QuerySnap = global.blog.loadModule('query_snap');
    const UserSnap = global.blog.loadModule('user_snap');
    const ArticleSnap = global.blog.loadModule('article_snap');
    const query_title = ctx.query['search-title'];
    const Op = require('sequelize').Op;
    let article_cnt = await ArticleSnap.count();
    let dict_render = UserAgentSnap.response(ctx, 'home', '', '');
    dict_render.art_list_length = 0;
    if(article_cnt === 0) {
        return await ctx.render('index', dict_render);
    }
    var data = [];
    let paginate = global.config.article_per_page;
    let page = ctx.query.page;
    let where_query = {};
    if(typeof query_title !== 'undefined' && query_title !== '') { where_query = {title: { [Op.regexp]: query_title }}; }
    if(typeof page === 'undefined') page = 1;
    else page = parseInt(page);
    await QuerySnap.page(article, paginate, page, where=where_query).then(async (ret) => {
        data = ret
        let last_page = await QuerySnap.page_count(article, paginate, where_query);
        page = Math.max(page, 1);
        page = Math.min(page, last_page);
        dict_render.article_list = []
        for(var i = 0;i < data.length; ++i) {
            dict_render.article_list.push({
                cover: Math.max(Math.round(Math.random() * global.config.article_cover_count), 1), 
                title: data[i].title, 
                author: await UserSnap.find_nickname_by_id(data[i].author), 
                preface: data[i].preface === ''?'No Preface QwQ': data[i].preface, 
                create: data[i].createdAt.toLocaleDateString(),
                update: data[i].updatedAt.toLocaleDateString(),
                id: data[i].id, 
                tags: data[i].tag.split(',').map(x => x.trim()).filter(x => x.length), 
            })
        }
        dict_render.art_list_length = data.length;
        let query_param = [];
        if(typeof query_title !== 'undefined' && query_title !== '') query_param.push(`search-title=${query_title}`);
        dict_render = UserAgentSnap.paginate(dict_render, page, last_page, paginate, config.url, query_param);
        await ctx.render('index', dict_render);
    })
})

router.get('/articles/:id', async (ctx, response, next) => {
    const UserAgentSnap = global.blog.loadModule('user_agent_snap');
    const ArticleSnap = global.blog.loadModule('article_snap');
    const UserSnap = global.blog.loadModule('user_snap');
    const MdIt = require('markdown-it')();
    let dict_render = UserAgentSnap.response(ctx, '', '', '');
    if(ctx.params.id < 0) {
        ctx.status = 404;
    }else{
        let article = await ArticleSnap.findById(ctx.params.id);
        if(article){
            dict_render.title = article.title;
            dict_render.tags = ArticleSnap.get_tags(article);
            dict_render.author = await UserSnap.find_nickname_by_id(article.author);
            dict_render.date = article.createdAt.toLocaleDateString();
            dict_render.content = article.content;
            if (article.content_type === 'markdown')
                dict_render.content = MdIt.render(dict_render.content);
            dict_render.user = ctx.session.user;
            dict_render.article_id = article.id;
            await ctx.render('article', dict_render);
        }else{
            ctx.status = 404;
        }
    }
})

router.get('/archive', async (ctx, response, next) => {
    const ArticleSnap = global.blog.loadModule('article_snap');
    let dict_render = global.blog.loadModule('user_agent_snap').response(ctx, 'archive', '', 'Archive');
    let article_list = await ArticleSnap.all();
    dict_render.article_date_list = [];
    if (article_list.length === 0) {
    dict_render.article_date_list = [];
    return ctx.render('archive', dict_render);
    }
    let article_date_list = [];
    let current_date = article_list[0].createdAt.toLocaleDateString();
    article_date_list[0] = {
        date: current_date, 
        articles: [article_list[0], ], 
    };
    var archive_length = 0;
    for(var i = 1;i < article_list.length;++i) {
        var cur_article = article_list[i];
        var date = cur_article.createdAt.toLocaleDateString();
        if(current_date !== date) {
            current_date = date;
            article_date_list[++archive_length] = {};
            article_date_list[archive_length].date = date;
            article_date_list[archive_length].articles = [cur_article, ];
        }else{
            article_date_list[archive_length].articles.push(cur_article);
        }
    }
    dict_render.article_date_list = article_date_list;
    await ctx.render('archive', dict_render);
})

router.get('/works', async (ctx, response, next) => {
    const dict_render = global.blog.loadModule('user_agent_snap').response(ctx, 'projects', '', 'Projects');
    await ctx.render('work_page', dict_render);
})

router.get('/about', async (ctx, response, next) => {
    const dict_render = global.blog.loadModule('user_agent_snap').response(ctx, 'about', '', 'About me');
    await ctx.render('about', dict_render);
})


module.exports = router
