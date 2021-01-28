const router = require(`express`).Router();
const Page = require(`../models/Page`);
const User = require(`../models/User`);



router.get(`/`, (req,res)=>{
    res.redirect('/');
});

router.get(`/add`, (req,res)=>{
    res.render(`addpage`, {})
});

router.get(`/search`, (req,res)=>{ //En caso de que venga más de un tag, separarlos
    
    let arr = req.query.tags.split(" ")

    Page.findByTag(arr)
        .then(wikis => res.render(`index`, {pages: wikis, showTag: true, tags: arr}))
    
});


router.get(`/:urlTitle`, (req, res)=>{
    Page.findOne({
        where: {
            urltitle: req.params.urlTitle
        },
        include: [
            {model: User, as: 'author'}
        ]
    })
    .then((page) => {
        // la instancia page va a tener una propiedad .author 
        // como un objeto user ({ name, email })
        if (page === null) {
            res.status(404).send();
        } else {
            res.render('wikipage', {
                page: page,
                author: page.author
            });
        }
    })
    
});


//SIMILAR
router.get(`/:urlTitle/similar`, (req,res)=>{ //En caso de que venga más de un tag, separarlos
    
    Page.findOne({where: {urltitle: req.params.urlTitle}})
        .then(page => page.findSimilar())
        .then(wikis => res.render(`index`, {pages: wikis, showTag: false, tags: wikis.tags}))  
    
});


//DELETE
router.get(`/:urlTitle/delete`, (req,res)=>{ //En caso de que venga más de un tag, separarlos
    Page.destroy({where: {urltitle: req.params.urlTitle}})
        .then(() => res.render(`index`,{deleteWiki: true})) 
    
});

//FORMULARIO EDIT 
router.get(`/:urlTitle/edit`, (req, res)=>{
    Page.findOne({
        where: {
            urltitle: req.params.urlTitle
        },
        include: [
            {model: User, as: 'author'}
        ]
    })
    .then((page) => {
        // la instancia page va a tener una propiedad .author 
        // como un objeto user ({ name, email })
        if (page === null) {
            res.status(404).send();
        } else {
            let pTags = page.tags.join(" ")
            res.render('editpage', {
                page: page,
                author: page.author,
                tags: pTags
            });
        }
    })
})


//EDIT
router.post(`/:urlTitle/edit`, (req, res)=>{
    
    Page.findOne({where: {urltitle: req.params.urlTitle}})
        .then((page)=>{
            for (let key in req.body) page[key] = req.body[key]
            page.tags = page.tags.match(/[A-Za-z0-9]+/g)
            page.urltitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '')
            return page.save()
        })
        .then(updatedPage => res.redirect(updatedPage.route)) 
       
})


//POST
router.post(`/`, (req,res)=>{

    let r = req.body;

    let user = {name: r.name, email: r.email};
    let page = {title: r.title, content: r.content, status: r.status, tags: r.tags}

    User.findOrCreate({  where: user }) //Devuelve array, 1era posicion el elemento 2 da si fue creado o no 
    .then( values => {
        let pUser = values[0];
        let pPage = Page.create( page );
        return pPage.then( page => page.setAuthor(pUser));
    })
    .then( page => res.redirect(page.route));
});



module.exports = router;