const router = require(`express`).Router();
const Page = require(`../models/Page`);
const User = require(`../models/User`);



router.get(`/`, (req,res)=>{
    res.redirect('/');
});

router.get(`/add`, (req,res)=>{
    res.render(`addpage`, {})
});

router.get(`/:urlTitle`, (req, res)=>{
    Page.findOne({ 
        where: { urltitle: req.params.urlTitle } 
      })
      .then((foundPage)=>{
            res.render(`wikipage`, {page: foundPage});
      })
      .catch(err => console.log(err));
});

router.post(`/`, (req,res)=>{

    let r = req.body;

    let user = {name: r.name, email: r.email};
    let page = {title: r.title, content: r.content, status: r.status}

    User.findOrCreate({  where: user }) //Devuelve array, 1era posicion el elemento 2 da si fue creado o no 
    .then( values => {
        let pUser = values[0];
        let pPage = Page.create( page );
        return pPage.then( page => page.setAuthor(pUser));
    })
    .then( page => res.redirect(page.route));
});



module.exports = router;