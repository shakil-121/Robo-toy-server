const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

//Middlewair
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bfdmw9d.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toyCollection = client.db("ToyDB").collection("ToyCollection");

   // Creating index on two fields
  //  const indexKeys = { name: 1, category: 1 }; // Replace field1 and field2 with your actual field names
  //  const indexOptions = { namecategory: "name" }; // Replace index_name with the desired index name
  //  const result = await toyCollection.createIndex(indexKeys, indexOptions);
  //  console.log(result); 

   app.get("/gettoys/:text", async (req, res) => {
    const text = req.params.text;
    const result = await toyCollection
      .find({
        $or: [
          { name: { $regex: text, $options: "i" } },
          { category: { $regex: text, $options: "i" } },
        ],
      })
      .toArray();
    res.send(result);
  });


    app.get("/toys", async (req, res) => {
      const coursor = toyCollection.find();
      const result = await coursor.toArray();
      res.send(result);
    });

    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(quary);
      res.send(result);
    });
    
    app.get('/category/:text',async(req,res)=>{ 
      const text=req.params.text; 
      const quary={category:text};
      const result=await toyCollection.find(quary).toArray()
      res.send(result)
    })

    app.post("/toys", async (req, res) => {
      const toy = req.body;
      console.log(toy);
      const result = await toyCollection.insertOne(toy);
      res.send(result);
    });

    app.get("/mytoys/:email", async (req, res) => {
      const result = await toyCollection
        .find({ selleremail: req.params.email })
        .toArray();
      res.send(result);
    });

    app.delete("/mytoys/:id", async (req, res) => {
      const id = req.params.id; 
      const quary={_id:new ObjectId(id)} 
      const result=await toyCollection.deleteOne(quary) 
      res.send(result)
    });  

    app.put('/toys/:id',async(req,res)=>{
      const id=req.params.id; 
      const toy=req.body; 
      const filter={_id:new ObjectId(id)}; 
      const options={upsert:true}; 
      const updateToy={
        $set:{
           name:toy.name,
           sellername:toy.sellername,
           selleremail:toy.selleremail,
           category:toy.category,
           subcategory:toy.subcategory,
           price:toy.price,
           picture_url:toy.picture_url,
           rating:toy.rating,
           quantity:toy.quantity,
           detail_description:toy.detail_description
          } 
        }
        const result=await toyCollection.updateOne(filter,updateToy,options);
        res.send(result)
    })

    // app.get("/mytoy",async(req,res)=>{
    //   let quary={}
    //   if(req.quary?.selleremail){
    //     {
    //       quary={
    //         selleremail:req.quary.selleremail
    //       }
    //     }
    //     const result=await toyCollection.find(quary).toArray()
    //     res.send(result)
    //   }
    // })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("ROBO TOY SERVER RUNNING......");
});

app.listen(port, () => {
  console.log(`ROBO TOY SERVER on port ${port}`);
});
