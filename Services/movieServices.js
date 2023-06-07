const { MongoClient, ObjectId } = require('mongodb');
const uri = process.env.URI;

class movieService {

    constructor() { }

     Create


     READ

    async find() {
        const client = new MongoClient(uri);
        try {
            await client.connect();
            const resultado = await client.db("sample_mflix").collection("movies").find({}).limit(10).toArray();
            return resultado;
        } catch (e) {
            console.log(e);
        } finally {
            await client.close();
        }
    }

    UPDATE
    async updateOne(id, title, year){
        const client = new MongoClient(uri);    
        try{
            await client.connect();
            const resultado = await client.db('sample_mflix').collection('movies').updateOne({
                "_id": new ObjectId(id)
            },{
                $set:{
                    title: title, 
                    year: year
                }});    
                return resultado;
        }catch(e){
            console.error(e);
        }finally{
            await client.close();
        }        
    }
}


module.exports = movieService;