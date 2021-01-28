const express = require(`express`);
const morgan = require(`morgan`);
const fs = require(`fs`);
const path = require(`path`);
const nunjucks = require(`nunjucks`);
const AutoEscapeExtension = require("nunjucks-autoescape")(nunjucks);
const models = require('./models');
const router = require(`./routes`);
const app = express();


let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan(`combined`, {stream: accessLogStream}));


app.use(express.static(`public`));


app.use(express.urlencoded({extended: false}));
app.use(express.json());


const env = nunjucks.configure('views', {noCache: true});// configure devuelve una instancia Enviornment que vamos a querer usar para agregar Markdown después.
env.addExtension('AutoEscapeExtension', new AutoEscapeExtension(env));
app.set('view engine', 'html'); // hace res.render funcionar con archivos html
app.engine('html', nunjucks.render);// cuando res.render funciona con archivos html, haz que use nunjucks para eso.

app.use(router);


models.User.sync({}) // FORCE TRUE
    .then(()=> models.Page.sync({})) // FORCE TRUE
    .then(()=>{
        app.listen(3000, ()=> console.log(`esuchando en el 3000`))
}).catch(err => console.log(err));
