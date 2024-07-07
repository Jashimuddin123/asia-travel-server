const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3tcc9mo.mongodb.net/?appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    // Set user collection
    const addCollection = client.db('addTourist').collection('add');
       
    // Post method
    app.post('/touristSpots', async (req, res) => {
      const newAdd = req.body;
      console.log(newAdd);
      const result = await addCollection.insertOne(newAdd);
      res.send(result);
    });

    //  get method  for touris sport
    app.get('/touristSpots' , async (req, res)=>{
      const cursor = addCollection.find()
      const result = await cursor.toArray()
      res.send(result)
  })
    
  // get method by _id
  app.get("/touristSpots/:id", async(req, res)=>{
    const id = req.params.id;
    console.log(id);
    const filter = {_id: new ObjectId(id)}
    const result = await addCollection.findOne(filter);
    res.send(result)
  }) 
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}

run().catch(console.dir);

// GET METHOD
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
