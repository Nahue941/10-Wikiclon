const router = require(`express`).Router();
const wiki = require(`./wiki`);
const user = require(`./user`);
const Page = require(`../models/Page`);



router.get(`/`,(req, res)=>{
    Page.findAll()
    .then((pages)=> res.render("index",  { pages: [...pages] }))
    
    //res.render(`index`, {})
});


router.use(`/wiki`,wiki);
router.use(`/users`,user);




module.exports = router;