const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@smartcarservices.gwnkybs.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const productCollection = client.db('emaJhon').collection('products');
    

    app.get('/products',async(req,res)=>{
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log(page,size);
      const query = {}
      const cursor = productCollection.find(query);
      const products = await cursor.skip(page*size).limit(size).toArray();
      const count = await productCollection.estimatedDocumentCount();
      res.send({count,products});
    })

    app.post('/productsByIds',async(req,res)=>{
      const ids = req.body;
      console.log(ids);
      const objectIds = ids.map(id=> new ObjectId(id))
      const query = {_id: {$in: objectIds}};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    })
  } finally {
    
  }
}
run().catch(err=> console.error(err));



app.get('/',(req,res)=>{
    res.send('"Server online"');
})
app.listen(port,()=>{
    console.log(`Port ${port} activated!`);
})