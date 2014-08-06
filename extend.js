var _     = require('lodash');
var chalk = require('chalk');

function Voiture() {}

Voiture.prototype.print = function(){
	console.log('Je suis une voiture');
};

Voiture.prototype.print = function(){
	Voiture.prototype.print.call(this);
	console.log('et une Fiat');
};

var voiture = new Voiture();
voiture.print();