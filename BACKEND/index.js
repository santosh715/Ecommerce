const express=require("express")

const app=express()

const axios=require('axios')

const cors=require('cors')

app.use(cors())

app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Hello World")
})

app.get('/about',(req,res)=>{
    res.send("Hello Im About")
})
app.get('/home',(req,res)=>{
    res.send("Hello Im home")
})

app.get('/contact',(req,res)=>{
    res.send("https://reqres.in/api/users?page=2")
})

//MONGODB CONNECTION


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://root:root@cluster0.pgy8lku.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    const productColletcion=client.db("ProductInventory").collection("products")
    const bookCollection=client.db("BookInventory").collection("Books")
    app.post('/uploadproduct',async(req,res)=>{
        const data=req.body
        const result=await productColletcion.insertOne(data)
        res.send(result)
    })
    app.post('/uploadbook',async(req,res)=>{
      const data=req.body
      const result=await bookCollection.insertMany(data)
      res.send(result)
  })
  app.get('/all-books',async(req,res)=>{
    const books=bookCollection.find()
    const result=await books.toArray()
    res.send(result)
})

app.get("/filterbook/:category", async(req,res)=>{
    const category=req.params.category
    const book=bookCollection.find({bookCatogory:category})
    const result=await book.toArray()
    res.send(result)
})

app.delete("/deletebook/:id",async (req,res)=>{
  const id=req.params.id
  const result=bookCollection.deleteOne({_id:new ObjectId(id)})
  res.send(result)
})
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


//CONNECTION END

app.listen(5000,()=>{
    console.log("Listening to port 5000")
})