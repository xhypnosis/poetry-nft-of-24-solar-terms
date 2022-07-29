require('module-alias/register')

const Koa = require('koa')
const app = new Koa()

const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')

const index = require('@routes/index')
const admin = require('@routes/admin')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(require('koa-static')(__dirname + '/public'))


// routes
app.use(index.routes(), index.allowedMethods())
app.use(admin.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

// Note: 0.0.0.0 to be given as host in order to be accessed from outside interface
app.listen(2000, '0.0.0.0', () => {
    console.log('Server is starting at port 2000')
})
