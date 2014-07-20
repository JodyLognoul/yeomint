var inquirer = require("inquirer");

var prompts = [{
    type: 'confirm',
    name: 'compassBootstrap',
    message: 'Would you like to include Bootstrap for Sass?',
    default: true
  }];

  inquirer.prompt(prompts, function (props) {
    console.log(props);
}.bind(this));