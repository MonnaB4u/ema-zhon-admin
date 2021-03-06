const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dyvn0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()
app.use(bodyParser.json());
app.use(cors());
const port = 5000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {

  const productsCollection = client.db("EmaZhon").collection("products");
  const ordersCollection = client.db("EmaZhon").collection("orders");

  console.log("port is" + { port } + "Db Connected")

  //for send data in data base from the fakedata

  ////For Add Product
  app.post('/addProduct', (req, res) => {
    const product = req.body;
    productsCollection.insertOne(product)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount)
      })
  })


  app.get('/products', (req, res) => {
    productsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })


  ///Show Data By Key Wise

  app.get('/product/:key', (req, res) => {
    productsCollection.find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({ key: { $in: productKeys } })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  ///////Add Order




  app.post('/addOrder', (req, res) => {
    const transportall = req.body;
    ordersCollection.insertOne(transportall)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount)
      })
  })

  app.get('/allOrder', (req, res) => {
    ordersCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

 






})

app.listen(port)