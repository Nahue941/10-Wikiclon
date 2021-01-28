var S = require('sequelize');
const marked = require("marked");
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
        type: S.STRING(2000),
        allowNull: false
    },
    status: {
        type: S.ENUM('open', 'closed')
    },
    tags: {
        type: S.ARRAY(S.STRING)
    },
    route:{
        type: S.VIRTUAL,
        get(){
            return `/wiki/` + this.urltitle;
        }
    },
    renderedContent: {
        type: S.VIRTUAL,
        get(){
            return marked(this.content)
        }
    }

},{ sequelize: db, modelName: 'page' });

Page.findByTag = function(arr) {
    
    return this.findAll({
        where : {
                tags: {
                    [S.Op.overlap]: arr //machea un grupo de posibilidades
                }
            }    
        });

};

Page.prototype.findSimilar = function(){
    return Page.findAll({
        where: {
                tags: {
                    [S.Op.ne]: this.tags
                },
                urltitle: {
                    [S.Op.ne]: this.urltitle
                }
        }
        
    })
};


Page.addHook('beforeValidate', (page) => {
    page.urltitle = generateUrlTitle(page.title);
  });

Page.addHook('beforeCreate', (page) => {
    page.tags = page.tags.match(/[A-Za-z0-9]+/g);
  });

module.exports = Page;

