const express = require('express');
const fs = require('fs');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const BirthdayModel = require("./model/birthdaysModel");
const dotenv = require("dotenv");

dotenv.config();
mongoose.set("useFindAndModify", false);

// -- create server --
const app = express();

// -- use body parser middleware to parse the req body --
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


// --- connect to mongodb ---
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("Connected to mongoDB...");
});


// --- render html ---
app.get('/', function (req, res) {

  console.log("inside app.get:/");

  fs.readFile("index.html", function (err, data) {
    res.send(data.toString())
  })
});


// ----- search birthdays api -------
app.get('/api/search-birthdays', async (req, res) => {

  console.log("inside app.get:/api/search-birthdays");

  try {

    let birthdays = await BirthdayModel.find({}, null, { sort: {date: -1} });

    //console.log(`Birthdays: ${birthdays}`);
    res.send(birthdays);
    
  } catch (error) {

    console.log(`Search Birthdays Error: ${error}`);
    res.send(error);

  }
  
});


// ----- add birthdays api -------
app.post('/add-birthday',  async (req, res) => {
  //receive data from client
  console.log("inside app.post:/add-birthday");
  
  const birthday = req.body;
  //console.log(`Birthday by post: ${JSON.stringify(birthday)}`);
  try {

    const birthdaySchema = new BirthdayModel(birthday);
 
    await birthdaySchema.save();
 
    res.redirect("/api/search-birthdays");
 
  } catch (err) {
 
    res.redirect("/");
  
  }

});


// ----- update birthdays api -------
app.post(`/api/update-birthday`, async (req, res) => {

  //receive data from client
  console.log("inside /api/update-birthday");
  
  const birthday = req.body;
  //console.log(`Birthday by post: ${JSON.stringify(birthday)}`);

  try {

    await BirthdayModel.findByIdAndUpdate(birthday._id, { name: birthday.name, date: birthday.date });

    res.redirect("/api/search-birthdays");
     
  } catch (err) {
 
    console.log(`Update Error: ${err}`);
    
    res.redirect("/");
  
  }

});



// ----- remove birthdays api -------
app.post(`/api/delete-birthday`, async (req, res) => {

  //receive data from client
  console.log("inside /api/delete-birthday");
  
  const birthday = req.body;
  //console.log(`Birthday by post: ${JSON.stringify(birthday)}`);

  try {

    await BirthdayModel.findByIdAndRemove(birthday._id);

    res.redirect("/api/search-birthdays");
 
  } catch (err) {
    console.log(`Delete Error: ${err}`);
    res.redirect("/");
  
  }

});

//-----------Cancel Api-----------
app.get('/cancel', function (req, res) {
  res.redirect("/api/search-birthdays")
})


// --- start the server ---
const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}...`);
});



