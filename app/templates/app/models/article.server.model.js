'use strict';

module.exports = function(sequelize, DataTypes) {
    var Article = sequelize.define('Article', {
        title: {
            type: DataTypes.STRING,
            validate:{
                notEmpty: true
            }
        },
        content: {
            type: DataTypes.STRING
         },{
            associate: function(models){
                Article.hasOne( models.User, { foreignKey: 'customer_id' } );
        }
    });
    return Article;
};