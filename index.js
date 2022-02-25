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
    const AdminCollection = client.db("iFarmer").collection("admins");
    //User &  Authentication block
    app.post('/user_registration', (req, res) => {
        const newUser = req.body;
        const email = req.body.email;
        UsersCollections.find({ email }).toArray((err, documents) =>
            // console.log(documents)
            documents.length ? res.send({ isSuccess: false, message: 'User is already registered' }) : UsersCollections.insertOne(newUser).then(response => res.send({ isSuccess: true, message: 'User registered successfully' }))
        )
    })
    app.post('/make_admin', (req, res) => {
        // const email = req.body.email;
        // AdminCollection.insertOne(email).then(response => res.send({ isSuccess: true, message: 'Admin added successfully' }));

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

    // app.get('/myBookings', (req, res) => {
    //     bookingCollection.find({ email: req.query.email }).toArray((err, documents) => res.send(documents))
    // })
    // app.get('/HotelData', (req, res) => {
    //     roomsCollection.find({}).toArray((err, documents) => res.send(documents))
    // })
    // app.post('/isAdmin', (req, res) => {
    //     const email = req.body.email;
    //     AdminCollection.find({ email: email })
    //         .toArray((err, Admin) => {
    //             res.send(Admin.length > 0);
    //         })
    // });
    // app.post('/addRoom', (req, res) => {
    //     const file = req.files.file;
    //     const id = req.body.id;
    //     const name = req.body.name;
    //     const address = req.body.address;
    //     const bed = req.body.bed;
    //     const bath = req.body.bath;
    //     const price = req.body.price;
    //     const flatSize = req.body.flatSize;
    //     const location = req.body.location;
    //     const RoomType = req.body.RoomType;
    //     const TV = req.body.TV;
    //     const Wifi = req.body.Wifi;
    //     const Breakfast = req.body.Breakfast;
    //     const SwimmingPool = req.body.SwimmingPool;
    //     const Parking = req.body.Parking;
    //     const newImg = file.data;
    //     const encImg = newImg.toString('base64');

    //     var image = {
    //         contentType: file.mimetype,
    //         size: file.size,
    //         img: Buffer.from(encImg, 'base64')
    //     };
    //     roomsCollection.insertOne({
    //         image, name, id, address, bed, bath, price, flatSize, location,
    //         RoomType, TV, Wifi, Breakfast, SwimmingPool, Parking
    //     })
    //         .then(result => {
    //             res.send(result.insertedCount > 0);
    //         })
    // });
    // app.delete('/delete/:id', (req, res) => {
    //     const id = req.params.id;
    //     roomsCollection.deleteOne({ id })
    //         .then(result => {
    //             res.send(result.deletedCount > 0);
    //         })
    // });
    // app.patch('/update/:id', (req, res) => {
    //     const id = req.params.id;
    //     roomsCollection.updateOne({ id },
    //         {
    //             $set: { price: req.body.price }
    //         })
    //         .then(result => {
    //             res.send(result.modifiedCount > 0)
    //         })
    // })
});

app.get('/', (req, res) => {
    res.send('Congratulations! server is  running');
})

app.listen(process.env.PORT || port)