const router = require('koa-router')();
router.prefix('/manage')
router.get('/', async (ctx, next) => {
    if(ctx.session.user) {
        let dict_render = global.blog.loadModule('user_agent_snap').response(ctx, null, '', 'Management');
        await ctx.render('manage_menu', dict_render);
    }else{
        await ctx.redirect('/manage/login');
    }
})

router.get('/login', async (ctx, res, next) => {
    const UserSnap = global.blog.loadModule('user_snap');
    const UserAgentSnap = global.blog.loadModule('user_agent_snap');
    if(ctx.session.user) {
        let username = ctx.session.username;
        let passwd = ctx.session.password;
        const result = UserSnap.verify_passwd(username, passwd);
        if(result.success) {
            return await ctx.redirect('/manage');
        }
    }
    let dict_render = UserAgentSnap.response(ctx, 'login', '', 'Login');
    await ctx.render('login', dict_render);
})

router.post('/login', async (ctx, resp, next) => {
    const post_data = ctx.request.body;
    const UserSnap = global.blog.loadModule('user_snap');
    const User = global.blog.loadModel('user');
    if(!post_data){
        ctx.body = {
            success: false,
            code: 1
        }
    }else{
        const username = post_data.username;
        const passwd = post_data.password;
        if (username === '' && passwd === '') {
            ctx.body = {
                success: false, 
                code: 1
            }
        }else{
            let result = await UserSnap.verify_passwd(username, passwd);
            if(result.success && result.code === 0) {
                ctx.session.user = {
                    username: username, 
                    password: passwd,
                    id: await UserSnap.find_id_by_nickname(username)
                }
            }
            ctx.body = result;
        }
    }
}); 

router.get('/logout', async (ctx, resp, next) => {
    ctx.session.user = null;
    ctx.redirect('/');
})

router.get('/articles', async (ctx, next) => {
    if (!ctx.session.user) {
        return await ctx.redirect('/manage/login')
    }
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
    await article.findAll({offset: pageinate * (page - 1), limit: pageinate}).then(async (ret) => {
        let dict_render = require('../modules/user_agent_snap').response(ctx, "article", '', "Articles");
        var cnt = 0;
        dict_render.data = [];
        for (var i = 0; i < ret.length; ++i) {
            var author = undefined;
            await user.findById(ret[i].author).then((ans) => author = ans);
            dict_render.data.push({
                id: ret[i].id, 
                title: ret[i].title,
                author: author.nickname,
                time_create: ret[i].createdAt.toLocaleDateString(),
            });
        }
        dict_render.pagination = {
            current: parseInt(page), 
            last_page: Math.ceil(article_cnt / pageinate), 
            item_each: pageinate, 
            href: '/manage/articles'
        }
        dict_render.art_cnt = ret.length;
        await ctx.render('manage_articles', dict_render);
    });
});

router.get('/articles/create', async (ctx, next) => {
    if (!ctx.session.user) {
        return await ctx.redirect('/manage/login')
    }
    let dict_render = blog.loadModule('user_agent_snap').response(ctx, "article_create", 'Create an Article', '');
    dict_render.article = {
        title: '', 
        tag: '', 
        preface: '', 
        content: '', 
        submit_type: 'create'
    };
    await ctx.render('article_create', dict_render);
});

router.post('/articles/submit', async (ctx, next) => {
    const UserSnap = global.blog.loadModule('user_snap');
    const post_data = ctx.request.body;
    const article = global.blog.loadModel('article');
    if(!ctx.session.user) return await ctx.redirect('/manage/login');
    await article.create({
        title: post_data.title, 
        tag: post_data.tags, 
        content: post_data.content, 
        author: ctx.session.user.id, 
        preface: post_data.preface
    }).then((ret) => {
        ctx.body = {
            success: true, 
            redirect: '/'
        }
    })
});

router.post('/articles/delete', async (ctx, next) => {
    const post_data = ctx.request.body;
    if(typeof post_data.delete_list === 'undefined') {
        ctx.body = {
            success: false, 
            errono: -1, 
            redirect: '/manage/articles'
        }
    }else{
        const article = global.blog.loadModel('article');
        for(let id in post_data.delete_list) {
            article.destroy({where: {id: post_data.delete_list[id]}});
        }
        ctx.body = {
            success: true, 
            redirect: '/manage/articles', 
        }
    }
});

router.post('/upload', async(ctx, next) => {
    const fs = require('fs');
    const crypto = require('crypto');
    let uuid = crypto.createHash('md5').update('' + Date.now()).digest('hex');
    let file_data = ctx.request.body.upload_file;
    let file_type = ctx.request.body.file_type;
    let file_path = `/upload/images/${uuid}.${file_type}`
    await fs.writeFile(file_path, file_data, (err) => {
        if(err){
            blog.log('Error while uploding ' + uuid);
            ctx.body = {
                success: false
            }
        }else{
            blog.log(`${uuid}.${file_type} written!`);
            ctx.body = {
                success: true, 
                file_path: config.url + file_path
            }
        }
    });
})

module.exports = router;