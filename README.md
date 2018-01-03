# Boar Server

## Example usage for app

put these lines in your server.js
``` javascript
  var koa = require('koa');
  var path = require('path');
  var koaApp = module.exports = koa();
  var config = require('./config');
  var App = require('boar-server').app;

  var app = new App(koaApp);
  app.connectToMongoose(config.mongooseUri);
  app.addDynamicViewMiddleware(path.join(config.root, '/views'), config.env === 'development');
  app.addStaticContentMiddleware(path.join(config.root, '/assets'));
  app.addHookMiddleware();
  app.loadControllers(path.join(config.root, 'controllers'));
  app.loadModels(path.join(config.root, 'models'));

  if (!module.parent) { app.listen(config.port); }
```

## Add middleware for your app
``` javascript
  var cors = require('koa-cors');
  var app = new App(koaApp);
  app.addMiddleware(cors());
```

## Graceful shutdown
You can stop the server from recieving new connections with `app.close()`. It returns a Promise that resolves when all existing connections are ended.
``` javascript
  var app = new App(koaApp);
  app.listen(config.port);
  process.on('SIGTERM', () => {
    app.close().then(() => {
      // additional cleaning (e.g. closing db connection)
      process.exit(0);
    })
  })
```

## HTTPS support
To enable HTTPS support, simple create `SERVE_HTTPS` environment variable with value `true`.
The port for https will be the port of the application increased with 10000 (10k).

If you want to serve the requests with your own SSL certification, create `HTTPS_KEY` and `HTTPS_CERT`
environment variables with path of the files as values.

### Example
```
export SERVE_HTTPS=true
export HTTPS_KEY="path/to/cert.key"
export HTTPS_CERT="path/to/cert.crt"

node server.js
```

## Build-in Middlewares

### Cors Support ([koa-cors](https://github.com/evert0n/koa-cors))

``` javascript
  app.addCorsSupportMiddleware();
```

### Static Content ([koa-static](https://github.com/koajs/static))

| Param | Type  | Description |
| ----- | ----- | ----------- |
| __path__ | `String` | Path to the static content's folder |

``` javascript
  app.addStaticContentMiddleware(path);
```

### Dynamic View

This middleware is a wrapper for [koa-pug](https://github.com/chrisyip/koa-pug).

| Param | Type  | Description |
| ----- | ----- | ----------- |
| __path__ | `String` | Path to the pug files |

``` javascript
  app.addDynamicViewMiddleware(path);
```

### Method Override ([koa-methodoverwrite](https://github.com/koa-modules/methodoverride))

``` javascript
  app.addMethodOverrideMiddleware();
```

### Error Handler

| Param | Type  | Description |
| ----- | ----- | ----------- |
| __path__ | `String` | Path to error page pug template |

``` javascript
  app.addErrorHandlerMiddleware(path);
```

### Body Parse ([koa-bodyparser](https://github.com/koajs/body-parser))

| Param | Type  | Description |
| ----- | ----- | ----------- |
| __options__ | `Object` | [More info.](https://github.com/koajs/bodyparser#options) |

``` javascript
  app.addBodyParseMiddleware(options);
```

### Request Id ([koa-requestid](https://github.com/seegno/koa-requestid))

| Param | Type  | Description |
| ----- | ----- | ----------- |
| __options__ | `Object` | _optional_ |
| ↳header | `String` | The name of the header to read the id on the request, `false` to disable. |
| ↳query  | `String` | The name of the header to read the id on the query string, `false` to disable. |
| ↳expose | `String` | The name of the header to expose the id on the response, `false` to disable. |

``` javascript
  app.addRequestIdmiddleware(options);
```

### Enforce SSL ([koa-ssl](https://github.com/jclem/koa-ssl))

| Param | Type  | Description |
| ----- | ----- | ----------- |
| __options__ | `Object` | [More info.](https://github.com/jclem/koa-ssl#use) |

``` javascript
  app.addEnforceSSLMiddleware();
```

If your application is running behind reverse proxy (like Heroku) you should set the trustProxy configuration option to *true* in order to process the x-forwarded-proto header.

``` javascript
  var app = new App(koaApp);
  app.addEnforceSSLMiddleware({ trustProxy: true });
```

__Note__: if you use this middleware EnforceSSL middleware should be the first you add.


### Hook

``` javascript
  app.addHookMiddleware();
```

### Security
Provides middlewares for setting up various security related HTTP headers.

| Param | Type  | Description |
| ----- | ----- | ----------- |
| __options__ | `Object` |  |
| ↳csp | `Object` | [More info.](https://github.com/helmetjs/csp) Learn more: [CSP quick reference](http://content-security-policy.com/) |
| ↳hsts | `Object` | [More info.](https://github.com/helmetjs/hsts) Learn more: [OWASP HSTS page](https://www.owasp.org/index.php/HTTP_Strict_Transport_Security) |
| ↳useXssFilter | `Boolean` | If `true`, [x-xss-protection](https://github.com/helmetjs/x-xss-protection) middleware will be included. Default: `true` |
| ↳useNoSniff | `Boolean` |  If `true`, [dont-sniff-mimetype](https://github.com/helmetjs/dont-sniff-mimetype) middleware will be included. Default: `true` |

``` javascript
  app.addSecurityMiddlewares(options);
```

#### Default configuration
``` javascript
  {
    csp: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'"],
        frameAncestors: ["'self'"],
        reportUri: 'about:blank'
      },
      reportOnly: true
    },
    hsts: {
      maxAge: 30,
      includeSubdomains: true,
      preload: false
    },
    useXssFilter: true,
    useNoSniff: true
  }
```


## Libraries

### Mask email address
``` javascript
  var maskEmailAddress = require('boar-server').lib.maskEmailAddress;
  maskEmailAddress('test@gmail.com');
```

### Real ip address (in heroku)
``` javascript
  var realIpAddress = require('boar-server').lib.realIpAddress;
  realIpAddress(request);
```

### ControllerFactory
``` javascript
  var ControllerFactory = require('boar-server').lib.controllerFactory;

  module.exports = ControllerFactory.create(function(router) {
    router.get('/', ControllerFactory.load('main/actions/get'));
    router.get('/healthcheck', ControllerFactory.load('main/actions/healthcheck/get'));
    router.get('/list', ControllerFactory.loadByAcceptType('main/actions/list/get'));
  });
```

### ClearCollections

***deprecated*** aliased to `dropCollections`

Use the more descriptively named `dropCollections` instead.

### DropCollections

```javascript
  var dropCollections = require('boar-server').lib.dropCollections(mongoose);
  
  dropCollections(); // returns a promise
```

This will _drop_ all your collections.

### TruncateCollections

```javascript
  var truncateCollections = require('boar-server').lib.truncateCollections(mongoose);

  truncateCollections(); // returns a promise
```

This will _truncate_ all your collections.

### ClearGridfs

### Database

Wrapper for mongoose connection.

### ExceptionHandler
