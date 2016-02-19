var program = require('commander');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync(__dirname + '/../package.json'));

var chalk = require('chalk');
var elegantSpinner = require('elegant-spinner');
var logUpdate = require('log-update');
var frame = elegantSpinner();
require('shelljs/global');

program
.version(config.version)
.description('Create a Devify project in the new directory!')
.parse(process.argv);

if (!which('git')) {
  console.log(chalk.red('git: command not found. Please install git command line tools!'));
  exit(1);
}

if(program.args.length < 1) {
  console.log(chalk.red('usage: devify <dir>')); 
  exit(1);
}

if(program.args.length === 1
  && program.args[0] !== 'serve'
  && program.args[0] !== 'install') {
  if(test('-d', program.args[0])) {
    console.log(chalk.red('failed: ' + program.args[0]+ ' project directory already exits!'));
    exit(1);
  }
 
  mkdir('-p', program.args[0]);
  cd(program.args[0]);

  console.log(chalk.yellow.bold('Start to create new project: ' + program.args[0]));
  exec('git init');

  var interval = setInterval(function() {
    logUpdate("Fetching Devify boilerplate..." + chalk.cyan.bold.dim(frame()));
  }, 50)
   
  exec('git pull https://github.com/DevifyPlatform/devify-server', function(code, stdout, stderr) {
    clearInterval(interval);
    if(code !== 0) {
      console.log(chalk.red.bold('git: repo pull error. Please try again!'));
      exit(1);
    }
    console.log(chalk.green.bold('Completed.'));
    console.log(chalk.yellow.bold('* Your project is at ' + program.args[0]));
  });
}

if(program.args.length === 1 && program.args[0] === 'install') {
  console.log(chalk.red('usage: devify install <ui>')); 
  exit(1);
}

if(program.args.length === 2 && program.args[0] === 'install') {
  var repo = program.args[1];

  if(test('-d', repo)) {
    console.log(chalk.red('failed: ' + repo + ' already exits!'));
    exit(1);
  }

  var interval = setInterval(function() {
    logUpdate(chalk.yellow.bold('Fetching Devify UI: ' + repo) + '...' + chalk.cyan.bold.dim(frame()));
  }, 50)
   
  exec('git clone https://github.com/wotcity/' + repo, function(code, stdout, stderr) {
    clearInterval(interval);
    if(code !== 0) {
      console.log(chalk.red.bold('git: invalid UI name. Please try again!'));
      exit(1);
    }
    console.log(chalk.green.bold('Completed.'));
    console.log(chalk.yellow.bold('* Your UI is at ' + repo + '/'));
    console.log(chalk.yellow.bold('* Run \'devify serve ' + repo + '\' to start web server'));
  });
}

if(program.args.length === 1 && program.args[0] === 'serve') {
  console.log(chalk.red('usage: devify serve <ui_dir>')); 
  exit(1);
}

if(program.args.length === 2 && program.args[0] === 'serve') {
  var repo = program.args[1];
  var publicPath = repo + '/dist/';
  var http = require('http');
  var pathUtil = require('path');
  var connect = require('connect');
  var port = 3000;

  publicPath = pathUtil.resolve(publicPath || '.')

  // Create Server
  var app = connect();

  var serveStatic = require('serve-static');
  app.use(serveStatic(publicPath, {
    'index': ['index.html']
  }));

  // Listen
  var server = http.createServer(app).listen(port);

  // Log
  var address = server.address()
  var serverHostname = 'localhost';
  if (address.address !== '0.0.0.0')  serverHostname = address.address;
  var serverPort = address.port;
  var serverLocation = "http://"+serverHostname+":"+serverPort+"/"
  console.log('UI serves at ' + serverLocation + ' with directory ' + publicPath);
}