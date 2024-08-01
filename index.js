const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
// app.use(cors());
const corsConfig = {
  origin: '',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))

app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2vsxcvm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const userCollection = client.db("artCraftDB").collection("users");
    const craftCollection = client.db("artCraftDB").collection("craft");

    
    app.get("/users", async(req,res)=>{
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post("/users", async(req, res)=>{
      const newUser = req.body;
      console.log(newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    })


    

    app.get("/craft", async(req,res)=>{
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get("/craft/:id", async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await craftCollection.findOne(query);
      res.send(result);
    })

    app.post("/craft", async(req, res)=>{
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    })

    app.put("/craft/:id", async(req,res)=>{
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCraft= req.body;

      const craft = {
        $set:{
            title: updateCraft.title,
            description: updateCraft.description,
            price: updateCraft.price,
            category: updateCraft.category,
            image: updateCraft.image
        }
      }
      const result = await craftCollection.updateOne(filter, craft, options);
      res.send(result);
    })

    app.delete("/craft/:id", async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
