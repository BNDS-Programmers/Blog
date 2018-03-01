const router = require('koa-router')();
// const article = global.blog.loadModel('article');

router.get('/', async (ctx, next) => {
  const UserAgentSnap = global.blog.loadModule('user_agent_snap');
  const article = global.blog.loadModel('article');
  var data = [];
  console.log(article.findAll())
  await article.findAll().then(async (ret) => {
    data = ret
    let dict_render = UserAgentSnap.response(ctx, 'home', '', '');
    dict_render.article_list = []
    for(var i = 0;i < data.length; ++i) {
      dict_render.article_list.push({
        title: data[i].title, 
        author: data[i].author, 
        create: data[i].createdAt.toLocaleDateString(),
        update: data[i].updatedAt.toLocaleDateString(),
      })
    }
    dict_render.art_list_length = data.length;
    console.log(dict_render)
    await ctx.render('index', dict_render);
  })
})


module.exports = router
