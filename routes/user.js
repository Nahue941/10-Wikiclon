const router = require(`express`).Router();
const User = require(`../models/User`);
const Page = require(`../models/Page`);

router.get(`/`, (req,res)=>{
    User.findAll().then(users => res.render(`users`, {users: users}) )

})

router.get(`/:id`, (req,res)=>{ 
    let userProm = User.findByPk(req.params.id);
    let pageProm = Page.findAll({where: {authorId : req.params.id}});


    Promise.all([userProm, pageProm])
    .then(arrProm => {
        let user = arrProm[0];
        let pages = arrProm[1];
        res.render(`index`, {users: user, pages: pages}) //RENDERIZAR NOMBRE DE AUTOR EN INDEX
    })
});

module.exports = router;