var Sequelize = require('sequelize');
var Joi = require('joi');

module.exports = function (sql) {
  var Model = sql.define('group', {
    id: {
      typeKey: Sequelize.UUID.key,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      displayName: "Id"
    },
    name: {
      typeKey: Sequelize.STRING.key,
      type: Sequelize.STRING,
      allowNull: false,
      queryable: true,
      validate: {
        len: [1, 36]
      },
      displayName: "Name"
    },
    description: {
      typeKey: Sequelize.STRING.key,
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        len: [1, 255]
      },
      displayName: "Description"
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate: function (models) {
        Model.belongsToMany(models.user, {through: 'userGroup', as: "users"});
        Model.routeOptions.associations.users.include = {model: models.user, as: "users"};
        
        Model.belongsToMany(models.permission, {through: 'groupPermission', as: "permissions"});
        Model.routeOptions.associations.permissions.include = {model: models.permission, as: "permissions", through: models.groupPermission};
      },
      nameField:"name",
      //NOTE: was using "tableName" for this property, but apparently
      // that is a keyword and was somehow causing cyclic dependencies
      tableDisplayName:"Group",
      routeOptions: {
        associations: {
          users: {
            type: "MANY",
            alias: "user"
          },
          permissions: {
            type: "MANY",
            alias: "permission"
          }
        }
      },
      extraReadModelAttributes: {
        updatedAt: Joi.date().optional(),
        createdAt: Joi.date().optional(),
        groupId: Joi.string().allow(null).optional() //HACK: not sure where this comes from.
      }
    }
  });

  return Model;
};