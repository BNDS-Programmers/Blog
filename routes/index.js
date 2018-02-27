const router = require('koa-router')();
// const article = global.blog.loadModel('article');

router.get('/', async (ctx, next) => {
  const article = global.blog.loadModel('article');
  var data = [];
  article.model.all().then((ret) => data = ret)
  let dict_render = {title: global.config.title, subtitle: global.config.description};
  let article_list = []
  global.blog.log(data)
  for(let art in data){
    article_list.push(art.title);
    dict_render[art.title] = {
      author: art.author, 
      create: art.createdAt.toLocaleDateString(), 
      upadte: art.updatedAt.toLocaleDataString(),
    }
  }
  dict_render.art_list = article_list;
  dict_render.current = 'home';
  dict_render.art_list_length = article_list.length;
  dict_render.art_list = article_list;
  console.log(dict_render)
  await ctx.render('index', dict_render);
})


module.exports = router
