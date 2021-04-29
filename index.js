
//Tämä on ravintolatietokannan REST Api

//tuodaan tarvittavat moduulit ja alustetaan ne
var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");

var app = express();
//app.use(cors());

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

//portti ja salasana muuttuja herokua varten
const PORT = process.env.PORT || 3000;
const uri = process.env.DB_URI;


//yhdistetään tietokantaan
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true },(err)=>{
  if(err)return console.log(err)
  console.log("Mongoose connected!")
});

//luodaan restaurants skeema, joka kuvaa tietorakenteiden mallin
  const restaurants = mongoose.model("Restaurant", {
    name: String,
    cuisine: String,
    borough: String
  });

  //reitit

  //"/api/getall" reitti lähettää käyttäjälle kaikki dokumentit tietokannassa
  app.get("/api/getall", (req,res)=> {
    restaurants.find({},(err,results)=>{
      if(err) return console.error(err)
      res.status(200).json(results)
  });
});

//"/api/:id" reitti lähettää käyttäjän antaman id:n omistavan dokumentin sisällön
  app.get("/api/:id",(req,res)=>{
    restaurants.findById({_id: req.params.id},(err,results)=>{
      res.status(200).json(results)
    })
  });

  //reitti "/api/add" luo tietokantaan dokumentin käyttäjän syöttämillä tiedoilla
  // ja lähettää käyttäjälle lisätyn dokumentin
  app.post("/api/add",(req,res)=>{
    var newRestaurant = new restaurants({
      name: req.body.name,
      cuisine: req.body.cuisine,
       borough: req.body.borough
    });
     newRestaurant.save(function(err, result) {
    if (err) console.log(err);
    console.log("Tallennettu: " + result);
    res.status(200).json("Lisattiin: " + result + "hahaaaaa" + "nii: " + req.body.name)
  });
  });

  // "/api/update/:id" reitti päivittää tietokannassa olevan dokumentin sisältöä
  // ja lähetetään käyttäjälle muutetun dokumentin sisältö
  app.put("/api/update/:id", (req,res)=>{
    // ehtolauseilla muutetaan vain sisältöä, jolle käyttäjä lähettää muutoksen
    if(req.body.name!=null){
    restaurants.findByIdAndUpdate({_id: req.params.id},{name:req.body.name},(err,results)=>{
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

  // reitti "/api/delete/:id" poistaa tietokannasta dokumentin, jolla on käyttäjän antama id
  // ja lähettää käyttäjälle poistetun dokumentin sisällön
  app.delete("/api/delete/:id",(req,res)=>{
    restaurants.findByIdAndDelete(req.params.id,(err,docs)=>{
      if (err) return console.log(err)
      res.status(200).json("Deleted: " + docs)
    })
  });

  // muut reitit vievät sivulle, joka kertoo reitit, joilla api toimii
  app.get("*",(req,res)=>{
    res.send("Use Api commands in the url:<br>\"/api/getall\"<br>\"/api/id\"<br>\"/api/add\"<br>\"/api/update"+
    "/id\"<br>\"api/delete/id\"");
  });

  // kuunneltava portti
  app.listen(PORT, function () {
    console.log("Server is running!")
});