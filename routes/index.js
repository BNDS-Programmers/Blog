const router = require('koa-router')();
// const article = global.blog.loadModel('article');

router.get('/', async (ctx, next) => {
  const article = global.blog.loadModel('article');
  var data = [];
  console.log(article.findAll())
  await article.findAll().then(async (ret) => {
    data = ret
    let dict_render = { title: global.config.title, subtitle: global.config.description };
    dict_render.article_list = []
    for(var i = 0;i < data.length; ++i) {
      dict_render.article_list.push({
        title: data[i].title, 
        author: data[i].author, 
        create: data[i].createdAt.toLocaleDateString(),
        update: data[i].updatedAt.toLocaleDateString(),
      })
    }
    dict_render.current = 'home';
    dict_render.art_list_length = data.length;
    console.log(dict_render)
    await ctx.render('index', dict_render);
  })
})


module.exports = router
