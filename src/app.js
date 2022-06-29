require('dotenv').config()
const express = require('express')
const app = express()
let alert = require('alert');
const path = require('path')
const bcrypt = require('bcryptjs');
var cookieParser = require('cookie-parser')
require('./db/connection')
const hbs = require("hbs");
const Register = require('./models/rajesters')
const port = process.env.PORT || 3000
const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth')
app.use(express.static(static_path))
app.set("view engine", "hbs");
app.set("views", template_path)
hbs.registerPartials(partials_path);
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
//console.log(path.join(__dirname,"../public"));
app.get("/", (req, res) => {
    res.render('index')
})
app.get("/register", (req, res) => {
    res.render('register')
})
app.get("/login", (req, res) => {
    res.render('login')
})
app.get("/logout", auth, async (req, res) => {
    //res.render('logout')
    try {
        console.log(res.user);

        /* req.user.tokens = req.user.tokens.filter((crrElement)=>{
            return crrElement.token !== req.token
        }) */
        req.user.tokens = []
        res.clearCookie("jwt")
        console.log("logout sucsessfuly")

        await req.user.save();
         res.render("login")
    } catch (e) {
        res.status(500).send(e)
    }
})
app.get("/secret", auth, (req, res) => {
    res.render("secret")
    //console.log(`this is website cookes now u can eat ${req.cookies.jwt}`);
})
app.post('/register', async (req, res) => {
    try {

        /*    console.log(req.body.first_name);
           res.send(req.body.first_name) */
        const password = req.body.password
        const cpassword = req.body.cpassword
        if (password === cpassword) {
            const ragesterUsers = new Register({
                firstName: req.body.first_name,
                lastName: req.body.last_name,
                emailId: req.body.email,
                phoneNumber: req.body.Phone_number,
                gender: req.body.inlineRadioOptions,
                age: req.body.age,
                password: password,
                confirmPassword: cpassword
            })
            console.log(`data is hera ${ragesterUsers}`);

            const token = await ragesterUsers.generateAuthToken();
            console.log(`this is token part ${token}`);
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 3000),
                httpOnly: true
            });
            //console.log(cookie);


            const ragister = await ragesterUsers.save();
            res.status(201).render("regsucsessfull");


            console.log(ragister);
        } else {
            res.send('<h1>password are not macthing...</h1>')
        }

    } catch (e) {
        res.status(400).send(e);
    }
})
///login check
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "plz fill the data" })
        } console.log(`${email},${password}`);

        const userEmail = await Register.findOne({ email: email })
        const token = await userEmail.generateAuthToken();
        console.log(`this is token part ${token}`);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 60000),
            httpOnly: true,
            secure: true
        });
        // console.log(`this is website cookes now u can eat ${req.cookies.jwt}`);
        //console.log(cookie);
        /*   const isMatch = await bcrypt.compare(password, userEmail.password);
  
          console.log(userEmail.password, isMatch); */


        if (userEmail.password === password) {
            res.status(201).render("index")
            alert('loging sucssefully')

        } else {
            res.send("Sorry, your login incorrect. Please check your login detail.")
            //res.status(201).render("index")
        }

    } catch (e) {
        res.status(400).send(`invalid login details`)
        console.log(e);
    }
})

/* const craetetoken =async ()=>{
    const token = await jwt.sign({id:"62baa2be46d2cfa12e7e6c98"} ,"mynameisankushkumargupta")
    console.log(token);
}

craetetoken() */
//console.log(process.env.SECRET_KEY);

app.listen(port, () => {
    console.log(`surver is runing...at on ${port}`);
})