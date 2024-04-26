const express = require("express");
const cors = require("cors");
// const ObjectId = require('mongodb').ObjectId;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tm2i0ga.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const itemCollection = client.db("express").collection("item");

    app.get("/allitems", async (req, res) => {
      const query = {};
      const cursor = itemCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });
    app.get("/items", async (req, res) => {
      const query = {};
      const cursor = itemCollection.find(query);
      const items = await cursor.limit(6).toArray();
      res.send(items);
    });

    app.post("/item", async (req, res) => {
      const newItem = req.body;
      console.log(newItem);
      const result = await itemCollection.insertOne(newItem);
      res.send(result);
    });

    app.delete("/item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await itemCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await itemCollection.findOne(query);
      res.send(result);
    });
    app.put("/item/:id", async (req, res) => {
      const id = req.params.id;
      const updatedItem = req.body;
      const filter = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          quantity: updatedItem.quantity,
        },
      };
      const result = await itemCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.post("/myitems", async (req, res) => {
      const userEmail = req.body;
      const query = { email: { $in: userEmail } };
      const cursor = itemCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Bismillah");
});
app.get("/testing", (req, res) => {
  res.send("runing ok");
});

app.listen(port, () => console.log("Hoise" + " " + port));
