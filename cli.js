#!/usr/bin/env node
/*jshint multistr:true */

'use strict';

var _         = require('lodash');
var chalk     = require('chalk');
var express   = require('express');
var fs        = require('fs');
var http      = require('http');
var Insight   = require('insight');
var isRoot    = require('is-root');
var nopt      = require('nopt');
var opn       = require('opn');
var path      = require('path');
var pkg       = require('./package.json');
var sudoBlock = require('sudo-block');
var yosay     = require('yosay');


var opts = nopt({
  help: Boolean,
  version: Boolean
}, {
  h: '--help',
  v: '--version'
});

var args = opts.argv.remain;
var cmd = args[0];

var insight = new Insight({
  trackingCode: 'UA-31537568-1',
  packageName: pkg.name,
  packageVersion: pkg.version
});

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

  sudoBlock(msg);
}
function runServer() {
	var app = express();
	var env = require('yeoman-generator')();
	var io  = require('socket.io');

	// alias any single namespace to `*:all` and `webapp` namespace specifically
  // to webapp:app.
  env.alias(/^([^:]+)$/, '$1:all');
  env.alias(/^([^:]+)$/, '$1:app');

  // lookup for every namespaces, within the environments.paths and lookups
  env.lookup();

  function Generator(name) {
	  this.name = name;
	}



	// Dummy users
	var generators = [
	  new Generator('emberJS - generator'),
	  new Generator('backboneJS - generator'),
	  new Generator('webapp - generator')
	];


	app.use(app.router);	
	app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler());

	app.set('views', __dirname);
	app.set('view engine', 'jade');
	
	app.get('/', function (req, res) {
	  res.render('views/index',{ generators : generators });
	});

	app.listen(1337);

	console.log(chalk.blue('Server running at http://127.0.0.1:1337/'));
}

function openBrowser() {
	opn("http://127.0.0.1:1337", "Google Chrome Canary.app");
}

function initServer() {
	runServer();
	openBrowser();
}

function init() {
	var env = require('yeoman-generator')();
	
	// alias any single namespace to `*:all` and `webapp` namespace specifically
  // to webapp:app.
  env.alias(/^([^:]+)$/, '$1:all');
  env.alias(/^([^:]+)$/, '$1:app');

  // lookup for every namespaces, within the environments.paths and lookups
  env.lookup();

  // list generators
  if (opts.generators) {
    return console.log(_.uniq(Object.keys(env.getGeneratorsMeta()).map(function (el) {
      return el.split(':')[0];
    })).join('\n'));
  }

  env.on('end', function () {
    console.log('Done running sir');
  });
  
  env.on('error', function (err) {
    console.error('Error', process.argv.slice(2).join(' '), '\n');
    console.error(opts.debug ? err.stack : err.message);
    process.exit(err.code || 1);
  });

  // Register the `yo yo` generator.
  if (!cmd) {
    if (opts.help) {
      return console.log(env.help('yo'));
    }

    env.register(path.resolve(__dirname, './yoyo'), 'yo');
    args = ['yo'];
    // make the insight instance available in `yoyo`
    opts = { insight: insight };
  }

	env.run(args, opts);
}

/*==========  pre() function  ==========*/
function pre() {

  if (opts.version) {
    return console.log(pkg.version);
  }

  // Debugging helper
  if (cmd === 'doctor') {
    return require('./scripts/doctor');
  }

  // init();
  initServer();
}

rootCheck();
pre();

