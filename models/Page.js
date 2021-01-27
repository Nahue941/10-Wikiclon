var S = require('sequelize');
var db = new S('postgres://localhost/wiki', {
    logging: false
});

function generateUrlTitle (title) {
    if (title) return title.replace(/\s+/g, '_').replace(/\W/g, '');
    else return Math.random().toString(36).substring(2, 7);
}


class Page extends S.Model {};

Page.init({
    title: {
        type: S.STRING,
        allowNull: false
    },
    urltitle: {
        type: S.TEXT,
        allowNull: false
    },
    content:{ 
        type: S.STRING,
        allowNull: false
    },
    status: {
        type: S.ENUM('open', 'closed')
    },
    route:{
        type: S.VIRTUAL,
        get(){
            return `/wiki/` + this.urltitle;
        }
    }
},{ sequelize: db, modelName: 'page' });

Page.addHook('beforeValidate', (page) => {
    page.urltitle = generateUrlTitle(page.title);
  });

module.exports = Page;