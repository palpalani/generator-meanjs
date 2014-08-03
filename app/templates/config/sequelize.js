'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var _         = require('lodash');
var config    = require('./config');
var db        = {};

console.log('Initializing Sequelize...');

// create your instance of sequelize
var sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
  host: config.db.host,
  dialect: 'mysql',
});

config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
	var model = sequelize.import(path.resolve(modelPath));
	db[model.name] = model;
});

// invoke associations on each of the models
Object.keys(db).forEach(function(modelName) {
  if (db[modelName].options.hasOwnProperty('associate')) {
    db[modelName].options.associate(db);
  }
});

/**/
// Synchronizing any model changes with database.
// WARNING: this will DROP your database everytime you re-run your application
sequelize
  .sync({force: true})
  .complete(function(err){
    if(err) console.log('An error occured %j',err);
    else console.log('Database dropped and synchronized');
});

// assign the sequelize variables to the db object and returning the db. 
module.exports = _.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);