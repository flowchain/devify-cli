var program = require('commander');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync(__dirname + '/../package.json'));

var chalk = require('chalk');
var elegantSpinner = require('elegant-spinner');
var logUpdate = require('log-update');
var frame = elegantSpinner();
require('shelljs/global');

if (!which('git')) {
  console.log(chalk.red('git: command not found. Please install git command line tools!'));
  exit(1);
}

program
.version(config.version);

program
.command('new <dir>')
.description('Create a new devify-server project in the directory')
.action(function(dir) {
  console.log('Running fetch...');

  if(test('-d', dir)) {
    console.log(chalk.red('failed: ' + dir + ' project directory already exits!'));
    exit(1);
  }
 
  mkdir('-p', dir);
  cd(dir);

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
    console.log(chalk.yellow.bold('* Your project is at ' + dir));
  });
});

program
.command('ui <name>')
.description('Install one ui package')
.action(function(name) {
  if(test('-d', name)) {
    console.log(chalk.red('failed: ' + name + ' already exits!'));
    exit(1);
  }

  var interval = setInterval(function() {
    logUpdate(chalk.yellow.bold('Fetching Devify UI: ' + name) + '...' + chalk.cyan.bold.dim(frame()));
  }, 50)
   
  exec('git clone https://github.com/wotcity/' + name, function(code, stdout, stderr) {
    clearInterval(interval);
    if(code !== 0) {
      console.log(chalk.red.bold('git: invalid UI name. Please try again!'));
      exit(1);
    }
    console.log(chalk.green.bold('Completed.'));
    console.log(chalk.yellow.bold('* Your UI is at ' + name + '/'));
    console.log(chalk.yellow.bold('* Run \'devify serve ' + name + '\' to start web server'));
  });
}).on('--help', function() {
  console.log('  Examples:');
  console.log();
  console.log('    $ devify install ui-d3js-gauge');
  console.log('    $ devify install ui-moving-line');
  console.log();
});

program
.command('serve <dir>')
.description('Start ui package server')
.action(function(dir) {
  console.log('Running serve...');

  var publicPath = dir + '/dist/';
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
}).on('--help', function() {
  console.log('  Examples:');
  console.log();
  console.log('    $ devify serve ui-d3js-gauge');
  console.log('    $ devify serve ui-moving-line');
  console.log('    $ devify serve ./');
  console.log();
});

program
.parse(process.argv);