const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')
global.config = require('./config')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
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

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
