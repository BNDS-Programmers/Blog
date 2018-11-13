const router = require('koa-router')();
router.prefix('/manage')
router.get('/', async (ctx, resp, next) => {
    if(ctx.session.user) {
        let dict_render = global.blog.loadModule('user_agent_snap').response(ctx, null, '', 'Management');
        // await ctx.render('manage_menu', dict_render);
        await ctx.redirect('/manage/articles');
    }else{
        // await ctx.redirect('/manage/login');
        await ctx.throw(403, 'Permisson Denied', {status: 403, msg: 'Permission Denied'});
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
        await ctx.throw(403, 'Permisson Denied', { status: 403, msg: 'Permission Denied' });
    }
    const article = global.blog.loadModel('article');
    const user = global.blog.loadModel('user');
    const ArticleSnap = global.blog.loadModule('article_snap');
    const QuerySnap = global.blog.loadModule('query_snap');
    let get_param = ctx.query;
    let page = get_param.page;
    if(typeof page === 'undefined') page = 1;
    else page = parseInt(page);
    let pageinate = global.config.manage.article_pageinate;
    let article_cnt = 0;
    let dict_render = require('../modules/user_agent_snap').response(ctx, "article", '', "Articles");
    await article.findAll().then((ret) => article_cnt = ret.length);
    if(article_cnt == 0) {
        dict_render.art_cnt = 0;
        return await ctx.render('manage_articles', dict_render);
    }
    if(page < 1) page = 1;
    else if (page > article_cnt / pageinate + 1) page = Math.ceil(article_cnt / pageinate);
    await QuerySnap.page(article, pageinate, page).then(async (ret) => {
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
            href: '/manage/articles', 
            param: [],
        }
        dict_render.art_cnt = ret.length;
        await ctx.render('manage_articles', dict_render);
    });
});

router.get('/users', async (ctx, resp, next) => {
    if(!ctx.session.user) {
        await ctx.throw(403, 'Permission Denied', {status: 403, msg: 'Permission Denied!' });
    } else {
        let dict_render = blog.loadModule('user_agent_snap').response(ctx, 'users', 'Blog', 'User Manage');
        let User = blog.loadModel('user');
        const card_per_line = 3;
        await User.findAll().then(result => {
            dict_render.user_cardList = [];
            var tmp_list = [];
            for(var i = 0;i < result.length;++i) {
                if(tmp_list.length == card_per_line) {
                    dict_render.user_cardList.push(tmp_list);
                    tmp_list = [];
                }
                tmp_list.push({
                    "name": result[i].nickname, 
                    "group": result[i].user_group == 'S'?"Administrator":"Composer", 
                    "createdAt": result[i].createdAt.toLocaleDateString(), 
                    "article_count": result[i].article_count,
                    "email": result[i].email
                });
            }
            if(tmp_list.length !== 0) {
                dict_render.user_cardList.push(tmp_list);
            }
            console.log(dict_render.user_cardList);
        });
        console.log(dict_render.user_cardList);
        await ctx.render('manage_users', dict_render);
    }
});

router.get('/articles/create', async (ctx, resp, next) => {
    if (!ctx.session.user) {
        await ctx.throw(403, 'Permisson Denied', { status: 403, msg: 'Permission Denied' });
    }
    let dict_render = blog.loadModule('user_agent_snap').response(ctx, "article_create", 'Create an Article', '');
    dict_render.article = {
        title: '', 
        tag: '', 
        preface: '', 
        content: '', 
        submit_type: 'create', 
        content_type: '', 
    };
    await ctx.render('article_create', dict_render);
});

router.get('/articles/edit', async (ctx, response, next) => {
    if(!ctx.session.user) {
        await ctx.throw(403, 'Permisson Denied', { status: 403, msg: 'Permission Denied' });
    }
    const ArticleSnap = global.blog.loadModule('article_snap');
    let dict_render = global.blog.loadModule('user_agent_snap').response(ctx, '', '', 'Edit Article');
    let update_id = ctx.query.id;
    if(typeof update_id === 'undefined' || update_id < 0) return ctx.status = 404;
    const article = await ArticleSnap.findById(update_id);
    if(article !== null) {
        dict_render.article = {
            title: article.title, 
            tag: article.tag, 
            preface: article.preface, 
            content: article.content, 
            update_id: update_id, 
            submit_type: 'update', 
            content_type: article.content_type, 
        }
        await ctx.render('article_create', dict_render);
    } else {
        ctx.status = 404;
    }
})

router.post('/articles/submit', async (ctx, next) => {
    const UserSnap = global.blog.loadModule('user_snap');
    const post_data = ctx.request.body;
    const article = global.blog.loadModel('article');
    if(!ctx.session.user) return await ctx.redirect('/manage/login');
    if(post_data.submit_type === 'create') {
        await article.create({
            title: post_data.title, 
            tag: post_data.tags, 
            content: post_data.content, 
            author: ctx.session.user.id, 
            preface: post_data.preface, 
            content_type: post_data.content_type, 
        }).then((ret) => {
            ctx.body = {
                success: true, 
                redirect: '/'
            }
        })
    }else if(post_data.submit_type === 'update') {
        await article.update({
            title: post_data.title,
            tag: post_data.tags,
            content: post_data.content,
            preface: post_data.preface, 
            content_type: post_data.content_type, 
        }, {
            where: {id: post_data.update_id}
        }).then(ret => {
            ctx.body = {
                success: true, 
                redirect: `/articles/${post_data.update_id}`
            }
        })
    }
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

// No proper method discovered...
/*router.post('/upload', async(ctx, resp, next) => {
    const fs = require('fs');
    const crypto = require('crypto');
    if (Object.keys(ctx.files).length == 0) {
        ctx.body = {success : false};
        return;
    }
    let file = ctx.files.imageFile;
    let uuid = crypto.createHash('md5').update('' + Date.now()).digest('hex');
    let file_path = `/static/upload/images/${uuid}.${file.mimetype}`;
    file.mv(file_path, (err) => {
        if (err) {
            ctx.body = {success : false};
        } else {
            ctx.body = { success: true, file_path: config.url + file_path };
        }
    });
}); */

module.exports = router;