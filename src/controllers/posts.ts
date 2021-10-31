import {MongoClient} from "mongodb"

import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';


type Episode ={ 
    name: string,
    episode: string;    // formato "S0E2"
}

//episode: [
    //     { 
    //         name: "nombre episodio 1",
    //         episode: "S0E1"
    //     },
    //     { 
    //         name: "nombre episodio 2",
    //         episode: "S0E2"
    //     }
    //]

type Character ={
    id: string,
    name: string,
    status: string
    species:string,
    episode: Episode[];         
}
type CharacterFind ={
    
    id: string,
    name: string,
    status: string
    //sin especie
    episode: Episode[];         
}





const uri = "mongodb+srv://Mateo:hG28d7HHpi4MK2C@ClusterMateo.xarym.mongodb.net/pruebaDB?retryWrites=true&w=majority";
const client = new MongoClient(uri);
client.connect();







const getCharacters = async (req: Request, res: Response, next: NextFunction) => { //http..../characters
    
    //client.connect().then(async() => {  //aun no me atrevo a hacer la conexion con await
        //console.log("Me he conectado a la base de datos");
       
        let result = await client.db("pruebaDB").collection("rickroll").find().toArray();

        let arrSimple:Character[] = await Promise.all(result.map(async (char) => {
            
            return {
                id: char.id,
                name: char.name,
                status: char.status,
                species: char.species,
                episode: char.episodes.map((epi:Episode) =>{ 
                    return{
                        name: epi.name,
                        episode: epi.episode,
                    }
                })

            }
        } ));

        //let persojanes = result;
        return res.status(200).json({
            body: arrSimple
        });
    //});
    //client.close();
};

// getting a single post && queremos id name y status
const getID = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from the req
    //client.connect().then(async() => {
    //let id: string = req.params.id; 
    let id:number = +req.params.id; //conversion
    // get the post
    let result = await client.db("pruebaDB").collection("rickroll").find({ id:id }).sort({ id:1 }).toArray();
    
    let arrSimple:CharacterFind[] = await Promise.all(result.map(async (char) => {
            
        return {
            id: char.id,
            name: char.name,
            status: char.status,
            //sin especie
            episode: char.episodes.map((epi:Episode) =>{ 
                return{
                    name: epi.name,
                    episode: epi.episode,
                }
            })

        }
    } ));

        
    return res.status(200).json({
        body: arrSimple
        });
    //});
    
};

// updating a post
const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
   
    let id:number = +req.params.id; //conversion
    //let result = await client.db("pruebaDB").collection("rickroll").find({id:id}).toArray();
    if(await client.db("pruebaDB").collection("rickroll").find({id:id}).count() === 0){
        return res.status(404).json({
            Status: 404,
            Body: "Not Found"
        });
    }
    if( await client.db("pruebaDB").collection("rickroll").find({id:id, status: "Alive" }).count() === 1 ){
        try{client.db("pruebaDB").collection("rickroll").updateOne({id:id}, {$set:{ status: "Dead"} }); 
     }catch(e)  { console.log(e);    }
    }                                         
    
    else{
        try{client.db("pruebaDB").collection("rickroll").updateOne({id:id}, {$set:{ status: "Alive"} }); 
    }catch(e)  { console.log(e);    }
    }    

    let result = await client.db("pruebaDB").collection("rickroll").find({id:id}).toArray();
    let arrSimple:CharacterFind[] = await Promise.all(result.map(async (char) => {
            
        return {
            id: char.id,
            name: char.name,
            status: char.status,
            //sin especie
            episode: char.episodes.map((epi:Episode) =>{ 
                return{
                    name: epi.name,
                    episode: epi.episode,
                }
            })

        }
    } ));

        
    return res.status(200).json({
        body: arrSimple
        });
    //});
};


// deleting a post
const deleteChar = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from req.params
    let id:number = +req.params.id; //conversion
    //let result = await client.db("pruebaDB").collection("rickroll").find({id:id}).toArray();
    if(await client.db("pruebaDB").collection("rickroll").find({id:id}).count() === 0){
        return res.status(404).json({
            Status: 404,
            Body: "Not Found"
        });
    }
    await client.db("pruebaDB").collection("rickroll").deleteOne({id:id})
    // return response
    return res.status(200).json({
        Body: "OK"
    });
};

// adding a post
const serverReady = async (req: Request, res: Response, next: NextFunction) => {

    let prueba:string = "OKProgramacion-I";
    try {

        await client.connect();


    } catch (error) {

        prueba = 'Failed to connect to MongoDB server';

        throw error;

    }

    // return response

    return res.status(200).json({
        Body: prueba
    });
};

export default { getCharacters, getID, updateStatus, deleteChar, serverReady };