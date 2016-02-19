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

if(program.args.length === 1) {
  if(test('-d', program.args[0])) {
    console.log(chalk.red('failed: ' + program.args[0]+ ' project directory already exits!'));
    exit(1);
  }
 
  mkdir('-p', program.args[0]);
  cd(program.args[0]);

  console.log(chalk.yellow.bold('Start to create new project: ' + program.args[0]));
  exec('git init');
}
 
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