/*********************************************************************************
 * WEB700 – Assignment 04
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source 
 * (including 3rd party web sites) or distributed to other students.
 
 * Name: Dilip Singh Kunwar
 * Student ID: 136052214
 * Date: 02/13/2023
 * Online (Cyclic) Link: https://dskunwar.cyclic.app
 * ********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path = require("path");
var app = express();
const collegeData = require("./modules/collegeData.js");
const bodyParser=require("body-parser");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./views/home.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
});

app.get("/students/add", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/addStudent.html"));
});

app.post("/students/add", (req, res) => {
    const studentData = req.body;
    collegeData.addStudent(studentData).then(()=>{
        res.redirect('/students');
    }).catch(function(err){
        console.log(err);
    });
});

app.get("/students", (req, res) => {
    // http://localhost:8080/students?course=value
    if(req.query.course){
        collegeData.getStudentsByCourse(req.query.course).then(function(data){
            //console.log("Students: " + data.length + " in course: " + req.query.course );
            res.json(data);
        }).catch(function(err){
            res.json({Message: err})
        });
    }
    else if (!req.query.course){    
        collegeData.getAllStudents().then(function(data){
            //console.log("All students: " + data.length);
            res.json(data);
        }).catch(function(err){
            res.json({Message: err});
        });
    }
});

app.get("/tas", (req, res) => {
    collegeData.getTAs().then(function(TAs){
        //console.log("True TAs: " + TAs.length);
        res.json(TAs);
    }).catch(function(err){
        res.json(err);
    });
});

app.get("/courses", (req, res) => {
    collegeData.getCourses().then((data) => {
        //console.log("Total courses: "+data.length);
        res.json(data);
    }).catch((err) => {
        res.json({message:"no results"});
    });
});

app.get("/student/:num", (req,res) => {
    //console.log(req.params.num);
    collegeData.getStudentByNum(req.params.num).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

app.use((req, res, next)=>{
    res.status(404).send("404: Page Not Found");
});
  
collegeData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log("server listening at port: " + HTTP_PORT);
    });
}).catch((err) => {
    console.log(err);
});