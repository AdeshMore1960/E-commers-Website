const express = require('express');
const path = require('path');
var app = express();
const hbs = require("hbs");
const bcrypt = require('bcrypt');

require("./db/conn")
const Register = require("./models/registers");
const exp = require("constants");

const port = process.env.PORT || 2400;

const static_path = path.join(__dirname, "../src/public");
const template_path = path.join(__dirname, "../src/templates/views");
const partials_path = path.join(__dirname, "../src/templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine" , "hbs");
app.set("views" , template_path);
hbs.registerPartials(partials_path);

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/index' , (req ,res) => {
    res.render("index");
});

app.get('/login' , (req ,res) => {
    res.render("login");
});

app.get('/product' , (req ,res) => {
    res.render("product");
});

app.get('/about' , (req ,res) => {
    res.render("about");
});

app.get("/register",(req, res) => {
    res.render("register");
});

app.post("/register", async (req,res) =>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const registerCustomer = new Register({
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword
        })

        const registered = await registerCustomer.save();
        res.status(201).render("index");

    }catch(error){
        res.status(400).send(error);
    }
});

app.get("/login" ,(req , res) => {
    res.render("login");
});

app.post("/login" , async (req,res) =>{

    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await Register.findOne({ email: email });

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log('isPasswordValid', isPasswordValid);

            if (isPasswordValid) {
                res.status(201).render("index");
            } else {
                res.send("Invalid login details");
            }
        } else {
            res.send("Invalid login details");
        }
    } catch (error) {
        res.status(400).send("Invalid login details");
    }

});

// app.get('/profile', async (req, res) => {
//     try {
//         const userId = req.session.userId;
//         const user = await Register.findById(userId);

//         if (user) {
//             res.json({
//                 username: user.username,
//                 email: user.email
//             });
//         } else {
//             res.status(404).json({ message: 'User not found' });
//         }
//     } catch (error) {
//         console.error('Error fetching profile data:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

app.post('/checkout', async (req, res) => {
    try {
        const { username, cartItems } = req.body;

        // Find the user by username
        const user = await Register.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create product document with cart items
        const product = new Product({
            items: cartItems
        });

        // Save the product document
        await product.save();

        // Clear cartItems array (optional)
        // cartItems = [];

        res.status(201).json({ message: 'Items added to product collection successfully' });
    } catch (error) {
        console.error('Error adding items to product collection:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(port, () =>{
    console.log(`Server is running on ${port}`);
}); 