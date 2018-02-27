const router = require('koa-router')();
router.prefix('/manage')
router.get('/', async (ctx, next) => {
    await ctx.render('manage_menu', {current: null, title: global.config.title, subtitle: 'Management'});
})

router.get('/articles', async (ctx, next) => {
    await ctx.render('manage_articles', { current: null, title: global.config.title, subtitle: 'Management' });
})

module.exports = router;