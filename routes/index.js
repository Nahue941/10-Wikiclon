const router = require(`express`).Router();
const wiki = require(`./wiki`);
const user = require(`./user`);
const search = require(`./search`)
const Page = require(`../models/Page`);



router.get(`/`,(req, res)=>{
    Page.findAll()
    .then((pages)=> res.render("index",  { pages: [...pages] }))
    
    //res.render(`index`, {})
});

router.use(`/search`,search)
router.use(`/wiki`,wiki);
router.use(`/users`,user);




module.exports = router;