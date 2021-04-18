var express = require("express");
var mongoose = require("mongoose");

var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const uri = process.env.DB_URI;
//const uri = "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.naxwu.mongodb.net/sample_restaurants?retryWrites=true&w=majority"

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true },(err)=>{
  if(err)return console.log(err)
  console.log("Mongoose connected!")
});

  const restaurants = mongoose.model("Restaurant", {
    name: String,
    cuisine: String,
    borough: String
  });

  app.get("/",(req,res)=>{
    res.send("Use Api commands in the url:<br>\"/api/getall\"<br>\"/api/id\"<br>\"/api/add\"<br>\"/api/update"+
    "/id\"<br>\"api/delete/id\"");
  });

  app.get("/api/getall", (req,res)=> {
    restaurants.find({},(err,results)=>{
      if(err) return console.error(err)
      res.status(200).json(results)
  });
 
});
  app.get("/api/:id",(req,res)=>{
    restaurants.findById({_id: req.params.id},(err,results)=>{
      res.status(200).json(results)
    })
  });

  app.post("/api/add",(req,res)=>{
    var newRestaurant = new restaurants({
      name: req.body.name,
      cuisine: req.body.cuisine,
       borough: req.body.borough
    });
     newRestaurant.save(function(err, result) {
    if (err) console.log(err);
    console.log("Tallennettu: " + result);
    res.status(200).json("Lisattiin: " + result)
  });
  });

  app.put("/api/update/:id", (req,res)=>{

    if(req.body.name!=null){
    restaurants.findByIdAndUpdate({_id: req.params.id},{name:req.body.name},{cuisine:req.body.cuisine},(err,results)=>{
      if(err) return console.error(err);
    })} if(req.body.cuisine!=null){
    restaurants.findByIdAndUpdate({_id: req.params.id},{cuisine:req.body.cuisine},(err,results)=>{
      if(err) return console.error(err);
    })} if(req.body.borough!=null){
    restaurants.findByIdAndUpdate({_id: req.params.id},{borough:req.body.borough},(err,results)=>{
      if(err) return console.error(err);
    })}
    restaurants.findById({_id:req.params.id},(err,results)=>{
      if(err)return console.log(err)
      res.status(200).json(results);
    })
  });

  app.delete("/api/delete/:id",(req,res)=>{
    restaurants.findByIdAndDelete(req.params.id,(err,docs)=>{
      if (err) return console.log(err)
      res.status(200).json("Deleted: " + docs)
    })
  });

  app.listen(PORT, function () {
    console.log("Server is running!")
});