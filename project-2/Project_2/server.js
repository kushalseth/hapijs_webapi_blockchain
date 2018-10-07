/* ======================== HapiJS init fle ==========================|
|  Learn more: level: https://github.com/Level/level                  |
|  ==================================================================*/

const { Blockchain } = require('./simpleChain');
const { Block } = require('./block');
const blockchain = new Blockchain();

'use strict';

const Hapi=require('hapi');


/* ============================ create a server ===============================|
|  - Create a server with a host and port                                      | 
|  ===========================================================================*/
const server=Hapi.server({
    host:'localhost',
    port:8000
});



/* ========================== create default Path =============================|
|  - Default path of http://localhost:8000/                                    | 
|  ===========================================================================*/
server.route({
    method:'GET',
    path:'/',
    handler:function(request,h) {

        var obj = {
            result: 'WELCOME!! RESTful Web API [HapiJS] with Node.js Framework Project'
        };

        return obj;
    }
});


/* =========================== GET Block Endpoint =============================|
|  - The web API contains a GET endpoint that responds to a request using a    | 
|    URL path with a block height parameter or properly handles an error       |
|    if the height parameter is out of bounds.                                 |
|  ===========================================================================*/
server.route({
    method:'GET',
    path:'/block/{height?}',
    handler:function(request,h) {        
        return new Promise(function(resolve, reject) {
            blockchain.getBlock(request.params.height)
            .then(function(data) {
                console.log("IT's a Success");
                return resolve(JSON.parse(data));
            })
            .catch((error) => {
                console.log(error);
                return resolve(error);
            });            
        });
    }
});


/* =========================== POST Block Endpoint ============================|
|  - Post a new block with data payload option to add data to the block body.  | 
|    The block body should support a string of text.The response for the       |
|    endpoint should provide block object in JSON format.                      |
|  ===========================================================================*/
server.route({
    method: 'POST',
    path: '/block',
    handler: function (request, h) {
        var payload = typeof payload == "string" ?  decodeURIComponent(request.payload) : request.payload;
        var payload_obj = typeof payload == "string" ? JSON.parse(payload) : payload;
        console.log("Payload is:", typeof payload_obj);

        if(payload_obj && typeof(payload_obj.body) !== "undefined" 
            && payload_obj.body && payload_obj.body.trim().length > 0)
        {
            console.log(typeof(payload_obj.body));
            return new Promise(function(resolve, reject) {
                //var payload_obj = JSON.parse(payload.body);
                console.log(payload_obj.body);
                blockchain.addBlock(new Block(payload_obj.body.trim()))
                .then(function(data) {
                    console.log("IT's a Success");
                    return resolve(JSON.parse(data));
                })
                .catch((error) => {
                    console.log(error);
                    return resolve(JSON.parse(error));
                });            
            });
        }
        else {
            var err = { 
                error: "Please add proper value of body as key in method payload"
            }; 
            console.log(err);
            return(err);
        }
    }
});

// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();