const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sccpwsm.mongodb.net/?retryWrites=true&w=majority`;

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

        const categoryCollection = client.db('petDB').collection('petCategory');
        const allPetsCollection = client.db('petDB').collection('allPetsCollection');
        const adoptCollection = client.db('petDB').collection('adoptCollection')
        const userCollection = client.db('petDB').collection('userCollection');
        const donationCollection = client.db('petDB').collection('donationCollection');
        const loggedUserCollection = client.db('petDB').collection('loggedUserCollection')



        app.get('/categories', async (req, res) => {
            const cursor = categoryCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/allPets', async (req, res) => {
            const cursor = allPetsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/allPets/:id', async (req, res) => {
            const id = req.params.id
            const option = { _id: new ObjectId(id) }
            const result = await allPetsCollection.findOne(option);
            res.send(result)
        })

        app.post('/adopts', async (req, res) => {
            const data = req.body;
            const result = await adoptCollection.insertOne(data)
            res.send(result)

        })

        app.get('/adopts', async (req, res) => {
            const cursor = adoptCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.post('/userInfos', async (req, res) => {
            const { name, email, photo } = req.body;
            const query = { email: email }
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exist', insertedId: null })
            }
            const result = await userCollection.insertOne({ name, email, photo, role: 'user' })
            res.send(result)
        })

        app.patch('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await userCollection.updateOne(query, updatedDoc)
            res.send(result)
        })

        app.get('/userInfos', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/donations', async (req, res) => {
            const cursor = donationCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/donations/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await donationCollection.findOne(query);
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const data = req.body;
            const result = await loggedUserCollection.insertOne(data);
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Pet shop is working well')
});

app.listen(port, () => {
    console.log(`Pet shop running ok: ${port}`)
})