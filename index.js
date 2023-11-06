const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ucoarqa.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // collections-----------------------------------
    const AssignmentCollections=client.db('AssignmentDB').collection('assignments')
    const MysubmissionCollection=client.db('AssignmentDB').collection('myassignment')


// get methods------------------------------------------
app.get('/assignments', async (req, res) => {
  const page = parseInt(req.query.page) || 0; // Default to page 0 if not specified
  const size = parseInt(req.query.size) || 10; // Default to a size of 10 if not specified

  const cursor = AssignmentCollections.find()
  .sort({ _id: -1 })
    .skip(page * size)
    .limit(size);

  const result = await cursor.toArray();
  res.send(result);
});

  app.get('/assignmentcount',async (req,res)=>{
   
    const count = await AssignmentCollections.estimatedDocumentCount()
   console.log('count',count);
    res.send({count});
    
    
    })
   



    app.get('/assignments/:_id', async (req, res) => {
      const _id = req.params._id; // Use req.params._id to get the _id parameter
      const query = { _id: new ObjectId(_id) }; // Use ObjectId to create the query
      const result = await AssignmentCollections.findOne(query);
      res.send(result);
    });
// post methods---------------------------------
app.post('/assignments',async(req,res)=>{
  const newassignment=req.body
  const result=await AssignmentCollections.insertOne(newassignment)
  res.send(result)
})



app.post('/mysub',async(req,res)=>{
  const myassignment=req.body
  const result=await MysubmissionCollection.insertOne(myassignment)
  res.send(result)
})



// put methods------------------------------
app.put('/assignments/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) }
  const options = { upsert: true }
  const updateProduct = req.body;
  const product = {
    $set: {
      photo: updateProduct.photo,
      name: updateProduct.name,
      email: updateProduct.email,
      type: updateProduct.type,
      dueDate: updateProduct.dueDate,
      description: updateProduct.description,
      rating: updateProduct.rating,
    }
  }

  const result=await AssignmentCollections.updateOne(filter,
    product,options)
  res.send(result)
})






// deletation-----------------------

app.delete('/assignments/:id', async (req, res) => {
  const id = req.params.id;
  console.log('id from delete', id);
  const query = { _id: new ObjectId(id) };
  const result = await AssignmentCollections.deleteOne(query);
  res.send(result);
});

























    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);











app.get('/', (req, res) =>{
  res.send('A_A is is workign')
})

app.listen(port, () =>{
  console.log(`A_A server is running on port: ${port}`);
})