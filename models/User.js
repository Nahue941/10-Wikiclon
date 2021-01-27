var S = require('sequelize');
var db = new S('postgres://localhost/wiki', {
    logging: false
});

class User extends S.Model {};

User.init({
    name: {
        type: S.STRING,
        allowNull: false,
      },
      email: { // NECESITAMOS AGREGAR UN DEFAULT VALUE?
        type: S.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        }
    }
}, { sequelize: db, modelName: 'user' });


module.exports = User;