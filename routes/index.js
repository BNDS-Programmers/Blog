const router = require('koa-router')();
// const article = global.blog.loadModel('article');

router.get('/', async (ctx, next) => {
  const UserAgentSnap = global.blog.loadModule('user_agent_snap');
  const article = global.blog.loadModel('article');
  const QuerySnap = global.blog.loadModule('query_snap');
  const UserSnap = global.blog.loadModule('user_snap');
  var data = [];
  let paginate = 10;
  let page = ctx.query.page;
  if(typeof page === 'undefined') page = 1;
  else page = parseInt(page);
  await QuerySnap.page(article, paginate, page).then(async (ret) => {
    data = ret
    let dict_render = UserAgentSnap.response(ctx, 'home', '', '');
    let last_page = await QuerySnap.page_count(article, paginate);
    page = Math.max(page, 1);
    page = Math.min(page, last_page);
    dict_render.article_list = []
    for(var i = 0;i < data.length; ++i) {
      dict_render.article_list.push({
        cover: Math.max(Math.round(Math.random() * global.config.article_cover_count), 1), 
        title: data[i].title, 
        author: await UserSnap.find_nickname_by_id(data[i].author), 
        preface: data[i].preface, 
        create: data[i].createdAt.toLocaleDateString(),
        update: data[i].updatedAt.toLocaleDateString(),
        id: data[i].id, 
        tags: data[i].tag.split(',').map(x => x.trim()).filter(x => x.length), 
      })
    }
    dict_render.art_list_length = data.length;
    dict_render = UserAgentSnap.paginate(dict_render, page, last_page, paginate, config.url);
    await ctx.render('index', dict_render);
  })
})


module.exports = router
