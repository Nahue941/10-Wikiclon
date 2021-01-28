const router = require(`express`).Router();
const Page = require(`../models/Page`)

router.get(`/`, (req,res)=>{
    res.render(`tags`, {})
});

router.get(`/:tagName`, (req,res)=>{ //En caso de que venga más de un tag, separarlos
    let nameTag = req.params.tagName

    Page.findByTag([nameTag])
        .then(wikis => res.render(`index`, {pages: wikis, showTag: true, tags: [nameTag]}))
    
});

module.exports = router;