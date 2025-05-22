const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const serveIndex = require('serve-index');
const { IpFilter } = require('express-ipfilter'); 

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Lista de IPs bloqueadas
const blacklist = ['192.168.1.100', '10.0.0.5', '127.0.0.9', '10.0.1.17']; 

const app1 = express();

app1.set('views', path.join(__dirname, 'views'));
app1.set('view engine', 'ejs');

app1.use(logger('dev'));
app1.use(express.json());
app1.use(express.urlencoded({ extended: false }));
app1.use(cookieParser());
app1.use(express.static(path.join(__dirname, 'public')));

app1.set('trust proxy', true); // ← necesario si hay un proxy como HAProxy
app1.use(IpFilter(blacklist, { mode: 'deny',
  detectIp: (req) => {
    const ip = req.ip;
    if (ip.includes('::ffff:')) {
      return ip.split('::ffff:')[1];
    }
    return ip;
  }
})); // ← activa el filtro

app1.use('/', indexRouter);
app1.use('/users', usersRouter);
app1.use('/logs', serveIndex(path.join(__dirname, 'public/logs')));
app1.use('/logs', express.static(path.join(__dirname, 'public/logs')));

app1.use((req, res, next) => next(createError(404)));
app1.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app1.listen(3000, () => {
  console.log("Server1 is running");
});

const app2 = express();

app2.set('views', path.join(__dirname, 'views'));
app2.set('view engine', 'ejs');

app2.use(logger('dev'));
app2.use(express.json());
app2.use(express.urlencoded({ extended: false }));
app2.use(cookieParser());
app2.use(express.static(path.join(__dirname, 'public')));

app2.set('trust proxy', true);
app2.use(IpFilter(blacklist, { mode: 'deny',
  detectIp: (req) => {
    const ip = req.ip;
    if (ip.includes('::ffff:')) {
      return ip.split('::ffff:')[1];
    }
    return ip;
  } 
}));

app2.use('/', indexRouter);
app2.use('/users', usersRouter);
app2.use('/logs', serveIndex(path.join(__dirname, 'public/logs')));
app2.use('/logs', express.static(path.join(__dirname, 'public/logs')));

app2.use((req, res, next) => next(createError(404)));
app2.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app2.listen(3001, () => {
  console.log("Server2 is running");
});
