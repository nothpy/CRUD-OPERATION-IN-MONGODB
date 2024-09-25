const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL = 'mongodb://127.0.0.1:27017/wonderlust';
main().then((res) => {
    console.log("connection succesfully created");
}).catch(err => console.log(err));
async function main() {
    await mongoose.connect(MONGO_URL);
}


app.get("/", (req, res) => {
    res.send("Server working at this route");
});

/** 
app.get("/testlisting", async (req, res)=>{
    let sampleListing = new Listing({
        title:"My new villa",
        description:"by the beach",
        price:12200,
        location:"Mumbai",
        country: "India"
    });
    await sampleListing.save();
    console.log("sample data saved");
    res.send("successful testing")
});*/

//index Route 
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

// new Route 
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
});

//show Route--> it show individual listings data 
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

// Create route 
app.post("/listings", async (req, res, next) => {
    // let {title, description, price, location, country} = req.body; reither tha we can use it
    // let listing = req.body.listing;
    try{
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    }
    catch(err){
        next(err);
    }

});

// Edit Route 
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });

});

// update route

app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

// Delete Route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

// Error Handling middleware 
app.use((err, req, res, next)=>{
    res.send("Something went wrong!");
});

app.listen(port, () => {
    console.log(`server running on port: ${port}`);
});