const fs = require('fs');

class Data {
    students;
    courses;
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

const initialize = function() {
    return new Promise(function(resolve, reject) {
        fs.readFile("./data/students.json", "utf8", function(err,  dataFromStudent) {
            if(err){
                reject(err);
                return;
            }
            let dataStudent = JSON.parse(dataFromStudent);
            fs.readFile("./data/courses.json", "utf8", function(err,  dataFromCourse) {
                if(err){
                    reject(err);
                    return;
                }
                let courseData = JSON.parse(dataFromCourse);
                dataCollection = new Data(dataStudent, courseData);
                resolve();
            });
        });
    });
}

let getAllStudents = function() {
    return new Promise(function(resolve, reject)  {
        if(dataCollection == null){
            reject("Data has not been initialize");
            return;
        }
        else if (dataCollection.students.length == 0) {
            reject(new Error("no results returned"));
        }
        else {
            resolve(dataCollection.students);
        }
    });
};

let getTAs = function() {
    return new Promise(function(resolve, reject)  {
        if (dataCollection == null) {
            reject("Data has not been initialized");
            return;
          }
          else {
            const TAs = dataCollection.students.filter(
                function(student){
                    return(student.TA == true);
                }
              );
              if (TAs.length == 0) {
                reject("No results returned");
                return;
              } else {
                resolve(TAs);
              }
          }
    });
};

let getCourses = function() {
    return new Promise(function(resolve, reject)  {
        if (dataCollection == null) {
            reject("Data has not been initialized");
            return;
        }
        else if (dataCollection.courses.length == 0) {
            reject("no results returned");
            return;
        }
        else {
            resolve(dataCollection.courses);
        }
    });
};

let getStudentsByCourse = function(course){
    return new Promise(function(resolve, reject){
        const varCourse = dataCollection.students.filter(
            function(CID){
                return(CID.course == course);
            }
            );
            if(varCourse.length == 0){
                reject("no results returned");
                return;
            }
            else{
                resolve(varCourse);
            }
    });
}

let getStudentByNum = function(num){
    return new Promise(function(resolve, reject){
        const sNum = [];
        for(let i=0; i<dataCollection.students.length; i++){
            if(dataCollection.students[i].studentNum == num){
                sNum.push(dataCollection.students[i]);
            }
        }
        if(sNum.length == 0){
            reject("no results returned");
            return;
        }
        resolve(sNum);
    });
}

let addStudent = function(studentData){
    // console.log(dataCollection.students.length+1);
    // console.log(studentData);
    
    return new Promise(function(resolve, reject){
        var TA;
        if(studentData.TA == "on"){
            TA=true;
        }
        else{
            TA=false
        }
        var addData = {
            "studentNum": (dataCollection.students.length+1),
            "firstName": studentData.firstName,
            "lastName": studentData.lastName,
            "email": studentData.email,
            "addressStreet": studentData.addressStreet,
            "addressCity": studentData.addressCity,
            "addressProvince": studentData.addressProvince,
            "TA": TA,
            "status": studentData.status,
            "course": studentData.course
        }
        dataCollection.students.push(addData);
        resolve();
    });
}

module.exports = {
    initialize,
    getAllStudents,
    getTAs,
    getCourses,
    getStudentsByCourse,
    getStudentByNum,
    addStudent
};