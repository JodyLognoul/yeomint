#!/usr/bin/env node
/*jshint multistr:true */

'use strict';

var fs = require('fs');
var yosay = require('yosay');
var chalk = require('chalk');
var http = require('http');
var open = require('open');
var isRoot = require('is-root');
var sudoBlock = require('sudo-block');
var nopt = require('nopt');
var pkg = require('./package.json');



var opts = nopt({
  help: Boolean,
  version: Boolean
}, {
  h: '--help',
  v: '--version'
});

var args = opts.argv.remain;
var cmd = args[0];

function rootCheck() {
  if (isRoot() && process.setuid) {
  	console.log(chalk.red('is ROOT !'));
    try {
      // Try to force yo to run on a safe uid
      process.setuid(501);
    } catch (err) {}
  }

  var msg = chalk.red('Easy with the "sudo"; Yeoman is the master around here.') + '\n\n\
		Since yo is a user command, there is no need to execute it with superuser\n\
		permissions. If you\'re having permission errors when using yo without sudo,\n\
		please spend a few minutes learning more about how your system should work\n\
		and make any necessary repairs.\n\n\
		A quick solution would be to change where npm stores global packages by\n\
		putting ~/npm/bin in your PATH and running:\n' + chalk.blue('npm config set prefix ~/npm') + '\n\n\
		Reading material:\n\
		http://www.joyent.com/blog/installing-node-and-npm\n\
		https://gist.github.com/isaacs/579814\n';
		console.log('ici');
  sudoBlock(msg);
}
function runServer() {
	/*==========  Start Webserver  ==========*/
	http.createServer(function (req, res) {
	  res.writeHead(200, {'Content-Type': 'text/plain'});
	  res.end('Hello World\n');
	}).listen(1337, '127.0.0.1');

	console.log(chalk.blue('Server running at http://127.0.0.1:1337/'));
}

function openBrowser() {
	open("http://127.0.0.1:1337", "Google Chrome Canary.app");
}

function init() {
	runServer();
	// openBrowser();
}

/*==========  pre() function  ==========*/
function pre() {

	// Say hello
	console.log(yosay('Hello, and welcome to my '+ chalk.red('fantastic generator') + ' full of whimsy and bubble gum!'));


  if (opts.version) {
    return console.log(pkg.version);
  }

  // Debugging helper
  if (cmd === 'doctor') {
    return require('./scripts/doctor');
  }

  init();
}

rootCheck();
pre();

