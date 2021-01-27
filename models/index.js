const User = require(`./User`);
const Page = require(`./Page`)

Page.belongsTo(User, { as: 'author' });

module.exports = { User, Page };