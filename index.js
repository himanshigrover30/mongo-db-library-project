const express= require("express"); // import express module here

const userRouter = require("./routers/users")
const booksRouter = require("./routers/books")
const app=express();  // initialize express with constant variable

const PORT = 8081;

app.use(express.json());  // define we use the application in json format

app.get("/",(req,res)=>{
    res.status(200).json({
        messege:"server is up and running :-)"
    })
})

app.use("/users", userRouter);
app.use("/books", booksRouter);

app.get("*",(req,res)=>{
    res.status(404).json({
        messege:"This route doesn't exist"
    })
})

app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
});