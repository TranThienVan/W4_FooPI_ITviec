const express = require("express");
const app = express();
app.use(express.json())

const port = 5000;

const logger = require("morgan")

app.use(logger("dev"));

let {foos} = require('./foos.json')

require("dotenv").config();

const cors = require("cors");

app.use(cors());

// For data.json 
let data = require('./data.json')

// 


// CRUD FOOS

// CREATE
app.post("/foos", (req, res) => {
    // Console log to see the body of the request 
    console.log(req.body)
    // Adding the create to the foos.json
    foos.push({...req.body})

    // Response to user when the foos.push finish the work, else it will alway sending request
    res.send("Successfully Created!")
});
  

// READ
app.get("/foos", (req, res) => {
    console.log(req.params)
    res.send(foos);
});

// UPDATE
app.patch("/foos/:id", (req, res) => {
    let idx = foos.findIndex(f => {
        return f.id == parseInt(req.params.id);
    })
    
    const foo = foos[idx]

    foos[idx] = {
        ...foo, ...req.body
    }
    console.log(req.params)
    res.send(foos);
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// DELETE FOO
app.delete("/foos/:id", (req, res) => {
    foos = foos.filter(f =>{
        return f.id !== parseInt(req.params.id);
    })
    console.log(req.params.id)
    res.send(foos);
})

// <--------- COMPLETE --------->


// DATA.JSON

// READ
app.get("/jobs", (req, res) =>{
    // // Response to user when the foos.push finish the work, else it will alway sending request
    let jobs_list = []
    for (let index in data.jobs) {
        jobs_list.push(data.jobs[index]);
        
    }

    if(req.query.order == "desc"){
        jobs_list = jobs_list.sort()
    }

    else if(req.query.order == "asc"){
        jobs_list = jobs_list.reverse()
    }
    else if (req.query.city === "Paris"){
        jobs_list = jobs_list.filter((job) => job.city === "Paris")
    }
    console.log(req.query)

    res.send(jobs_list)
})

// META
app.get("/jobs/meta", (req, res) =>{
    let jobs_list = []
    for (let index in data) {
        jobs_list.push(data[index]);
        
    }

    res.send(jobs_list)
})



// Handle errors
app.use((req, res, next) => {
    const error = new Error("Resource Not Found");
    error.statusCode = 404;
    next(error);
});

function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(err.statusCode || 500);
    res.send(err.message);
}
  
app.use(errorHandler);