//const { readSync } = require("fs");
const express = require("express"),
expressSanitizer = require("express-sanitizer");
methodOverride = require("method-override");
bodyParser = require("body-parser"),
moongoose = require("mongoose"),
app = express();

// Configuraciones APP
moongoose.connect("mongodb://localhost/blog-app", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

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

//Ruta INDEX
app.get("/blogs", (req,res)=>{
    blog.find({},(err, blogs)=>{
        if(err){
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

//Create rute

app.post("/blogs", (req, res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.create(req.body.blog, (err, newBlog)=>{
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

//Ruta nueva Post (NEW)

app.get("/blogs/new", (req,res)=>{
    res.render("new");
});

//Ruta mostrar post (SHOW)

app.get("/blogs/:id", (req,res)=>{
    blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("show", {blog: foundBlog});
        }
    });
});

//Ruta editar (EDIT)

app.get("/blogs/:id/edit", (req, res)=>{
    blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

//Ruta actualizar (update)

app.put("/blogs/:id", (req,res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog)=>{
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// Eliminar ruta (DELETE)

app.delete("/blogs/:id", (req,res)=>{
    blog.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs");
        }
    });
});

//Puerto de escucha (server)

app.listen(3000, ()=>{
    console.log("ServerUp!");
});