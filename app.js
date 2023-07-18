import dotenv from 'dotenv';
import express from 'express';
import {SignJWT, jwtVerify} from 'jose';
dotenv.config();
const appExpress = express();

appExpress.get("/:id/:nombre", async(req,res)=>{

    let json = {
        id: req.params.id,
        nombre: req.params.nombre
    }

    const encoder = new TextEncoder();
    const jwtconsructor = new SignJWT({json});
    const jwt = await jwtconsructor
    .setProtectedHeader({alg:"HS256", typ:"JWT"})
    .setIssuedAt()
    .setExpirationTime("60s")
    .sign(encoder.encode(process.env.JWT_PRIVATE_KEY));
    res.send({jwt})
});

appExpress.post("/", async(req, res)=>{
    const {authorization} = req.headers;
    if(!authorization) return res.status(401).send({token: ":("});
    try {
        const encoder = new TextEncoder();
        const jwtData = await jwtVerify(
            authorization,
            encoder.encode(process.env.JWT_PRIVATE_KEY)
        );
        res.send(jwtData);
    } catch (error) {
        res.status(401).send({token: "Algo Salio Mal :("})
    }
})

appExpress.listen(5010, ()=>{
    console.log('http://localhost:5010/');
})