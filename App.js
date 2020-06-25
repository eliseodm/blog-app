const { readSync } = require("fs");

const express = require("express"),
bodyParser = require("body-parser"),
moongoose = require("mongoose"),
app = express();

// Configuraciones APP
moongoose.connect("mongodb://localhost/blog-app", {useNewUrlParser: true, useUnifiedTopology: true} );
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//Mogoose - Configuracion de Modelo
var blogSchema = new moongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
const blog = moongoose.model("blog", blogSchema);

//Rutas RESTFUL

app.get("/", (req,res)=>{
    res.redirect("/blogs");
});

app.get("/blogs", (req,res)=>{
    blog.find({},(err, blogs)=>{
        if(err){
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

app.listen(3000, ()=>{
    console.log("ServerUp!");
});