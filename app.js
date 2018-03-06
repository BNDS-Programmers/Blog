const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const csrf = require('koa-csrf')
const session = require('koa-session')

const index = require('./routes/index')
const users = require('./routes/users')
const manage = require('./routes/manage')
global.config = require('./config')

// error handler
onerror(app)

// Config session
app.keys = [global.config.session_sec]
let sessionConf = {
  secret: global.config.session_sec,
  cookie: {},
  rolling: false,
  saveUninitialized: true,
  resave: true
}
app.use(session(sessionConf, app));

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(new csrf({
  invalidSessionSecretMessage: 'Invalid session secret',
  invalidSessionSecretStatusCode: 403,
  invalidTokenMessage: 'Invalid CSRF token',
  invalidTokenStatusCode: 403,
  excludedMethods: ['GET', 'HEAD', 'OPTIONS'],
  disableQuery: false
}));
app.use(require('koa-static')(__dirname + '/static'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms from ${ctx.ip}`)
})

global.blog = {
  log(msg){
    console.log('IBlog => ' + msg)
  }, 
  db: null, 
  async connectDB(){
    const Sequlize = require('sequelize')
    this.db = new Sequlize(global.config.db.database, global.config.db.username, global.config.db.password, {
      host: global.config.db.host, 
      dialect: global.config.db.dialect, 
      logging: global.config.mode === 'dev' ? this.log: null 
    });
    global.Promise = Sequlize.Promise;
    this.loadModel('article');
    this.loadModel('user');
    await this.db.sync();
  }, 
  loadModel(name){
    return require(`./models/${name}`);
  }, 
  loadApp(name){
    return require(`./app/${name}`);
  }, 
  loadModule(name){
    return require(`./modules/${name}`);
  },
  init(){
    this.connectDB();
  }, 
  run(){
    app.listen(global.config.port, global.config.host, () => {
      console.log("Blog is running @ port " + (global.config.port))
    });
  }
}

blog.init();
blog.run();

// error page
app.use(async (ctx, next) => {
	try {
		await next();
		if (ctx.status === 404) {
			ctx.throw(404);
		}
	} catch (err) {
		let dict_render = blog.loadModule('user_agent_snap').response(ctx, 'error', 'Error', err.status);
		console.error(err.stack);
		dict_render.error = {};
		const status = err.status || 500;
		dict_render.error.status = err.status;
		ctx.status = status;
		if (status === 404) {
			dict_render.error.message = '何もいませんです QwQ';
		} else if (status === 500) {
			dict_render.error.message = 'まじやばくね？Server Internal Error！';
		} else if (status === 403) {
			dict_render.error.message = '立入禁止！！出でいけ！';
		}
		await ctx.render("error", dict_render);
	}
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(manage.routes(), manage.allowedMethods())

// error-handling
app.on('error', async (err, ctx) => {
    console.error('server error', err, ctx);
	let dict_render = blog.loadModule('user_agent_snap').response(ctx, 'error', 'Error', toString(err.status));
	dict_render.error = {};
    if(err.status === 404) {
		dict_render.error.message = '何もいませんです';
    } else if(err.status === 500) {
		dict_render.error.message = 'Server Error QuQ!!!';
	}
	await ctx.render('error', dict_render);
});

module.exports = app
