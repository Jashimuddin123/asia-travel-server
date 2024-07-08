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
      const queryEmail = req.query.email;
      if(queryEmail){
        const filter = {email:queryEmail};
        const result = await addCollection.find(filter).toArray()
        return res.send(result)
      }
      const cursor = addCollection.find()
      const result = await cursor.toArray()
      return res.send(result)
  })

    
  // get method by _id
  app.get("/touristSpots/:id", async(req, res)=>{
    const id = req.params.id;
    console.log(id);
    const filter = {_id: new ObjectId(id)}
    const result = await addCollection.findOne(filter);
    res.send(result)
  }) 
  // delete method
  app.delete('/touristSpots/:id', async(req, res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await addCollection.deleteOne(query);
    res.send(result)
  } )
// update method using put
app.put('/touristSpots/:id', async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const filter = { _id: new ObjectId(id) };
  const option = { upsert: true };
  const updateDoc = {
      $set: {
          tourist_spot_name: body.tourist_spot_name,
          country_name: body.country_name,
          location: body.location,
          average_cost: body.average_cost,
          seasonality: body.seasonality,
          photo_url: body.photo_url,
          travel_time: body.travel_time,
          total_visitors: body.total_visitors,
          short_description: body.short_description,
      },
  };
  const result = await addCollection.updateOne(filter, updateDoc, option);
  res.send(result);
});

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
