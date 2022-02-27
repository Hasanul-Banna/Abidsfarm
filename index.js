const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

require('dotenv').config()

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// app.use(express.static('Rooms'));
app.use(fileUpload());

const port = 5000;
const uri = "mongodb+srv://abid:2a9KdKtmumDF98ij@cluster0.ytswv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    // Database collections 
    const UsersCollections = client.db("iFarmer").collection("users");
    const SeedCollections = client.db("iFarmer").collection("seed_bank");
    const CropCollections = client.db("iFarmer").collection("ecommerce");
    const UpcomingCollections = client.db("iFarmer").collection("upcoming_product");

    //User &  Authentication block starts
    app.post('/user_registration', (req, res) => {
        const newUser = req.body;
        const email = req.body.email;
        UsersCollections.find({ email }).toArray((err, documents) =>
            // console.log(documents)
            documents.length ? res.send({ isSuccess: false, message: 'User is already registered' }) : UsersCollections.insertOne(newUser).then(response => res.send({ isSuccess: true, message: 'User registered successfully' }))
        )
    })
    app.post('/make_admin', (req, res) => {
        const _id = req.body.id;
        UsersCollections.updateOne({ _id: ObjectID(_id) },
            {
                $set: { role: req.body.role }
            })
            .then(result => {
                res.send({ isSuccess: result.modifiedCount > 0 })
            })
    })
    app.post('/login', (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        UsersCollections.find({ email, password }).toArray((err, documents) =>
            documents.length ? res.send({ isSuccess: true, message: 'Login success', role: documents[0].role, user_info: documents[0] }) : res.send({ isSuccess: false, message: 'User is not registered or password is incorrect' })
        )
    })
    app.get('/users', (req, res) => {
        // res.send('users');
        UsersCollections.find({}).toArray((err, documents) => res.send(documents))
    })
    //User &  Authentication block ends

    // seed  bank block starts
    app.post('/add_new_seed', (req, res) => {
        const name = req.body.name;
        const category = req.body.category;
        const stock = req.body.stock;
        const quantity = req.body.quantity;

        const file = req.files.file;
        const newImg = file.data;
        const encImg = newImg.toString('base64');
        var image = { contentType: file.mimetype, size: file.size, img: Buffer.from(encImg, 'base64') };

        SeedCollections.insertOne({ name, category, stock, quantity, image }).then(response => res.send({ isSuccess: true, message: 'seed is successfully added' }))
    })

    app.get('/all_seeds', (req, res) => {
        SeedCollections.find({}).toArray((err, documents) => res.send(documents))
    })

    app.post('/delete_seed', (req, res) => {
        const _id = req.body.id;
        SeedCollections.deleteOne({ _id: ObjectID(_id) }).then(result => {
            res.send({ isSuccess: result.deletedCount > 0 });
        })
    })

    app.post('/update_seed_info', (req, res) => {
        const _id = req.body.id;
        const name = req.body.name;
        const category = req.body.category;
        const stock = req.body.stock;
        const quantity = req.body.quantity;

        SeedCollections.updateOne({ _id: ObjectID(_id) },
            {
                $set: { name, category, stock, quantity }
            })
            .then(result => {
                res.send({ isSuccess: result.modifiedCount > 0 })
            })
    })
    // seed  bank block ends

    // CROPS block starts
    app.post('/add_new_crop', (req, res) => {
        const name = req.body.name;
        const category = req.body.category;
        const stock = req.body.stock;
        const quantity = req.body.quantity;

        const file = req.files.file;
        const newImg = file.data;
        const encImg = newImg.toString('base64');
        const image = { contentType: file.mimetype, size: file.size, img: Buffer.from(encImg, 'base64') };

        CropCollections.insertOne({ ...req.body, image }).then(response => res.send({ isSuccess: true, message: 'crop is successfully added' }))
    })

    app.get('/all_crops', (req, res) => {
        CropCollections.find({}).toArray((err, documents) => res.send(documents))
    })

    app.post('/delete_crop', (req, res) => {
        const _id = req.body.id;
        CropCollections.deleteOne({ _id: ObjectID(_id) }).then(result => {
            res.send({ isSuccess: result.deletedCount > 0 });
        })
    })

    app.post('/update_crop_info', (req, res) => {
        const _id = req.body.id;
        const name = req.body.name;
        const category = req.body.category;
        const stock = req.body.stock;
        const quantity = req.body.quantity;

        CropCollections.updateOne({ _id: ObjectID(_id) },
            {
                $set: { ...req.body }
            })
            .then(result => {
                res.send({ isSuccess: result.modifiedCount > 0 })
            })
    })
    // CROPS  bank block ends

    // Upcoming Collections block starts
    app.post('/add_new_upcoming_product', (req, res) => {
       
        const file = req.files.file;
        const newImg = file.data;
        const encImg = newImg.toString('base64');
        const image = { contentType: file.mimetype, size: file.size, img: Buffer.from(encImg, 'base64') };

        UpcomingCollections.insertOne({ ...req.body, image }).then(response => res.send({ isSuccess: true, message: 'product is successfully added' }))
    })

    app.get('/all_upcoming_products', (req, res) => {
        UpcomingCollections.find({}).toArray((err, documents) => res.send(documents))
    })

    app.post('/delete_upcoming_product', (req, res) => {
        const _id = req.body.id;
        UpcomingCollections.deleteOne({ _id: ObjectID(_id) }).then(result => {
            res.send({ isSuccess: result.deletedCount > 0 });
        })
    })

    app.post('/update_upcoming_product_info', (req, res) => {
        const _id = req.body.id;

        UpcomingCollections.updateOne({ _id: ObjectID(_id) },
            {
                $set: { ...req.body }
            })
            .then(result => {
                res.send({ isSuccess: result.modifiedCount > 0 })
            })
    })
    //Upcoming Collections  block ends

});

app.get('/', (req, res) => {
    res.send('Congratulations! server is  running');
})

app.listen(process.env.PORT || port)