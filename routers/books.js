const express=require("express");
const {books}=require("../data/books.json");
const {users}=require("../data/users.json");
const router=express.Router();

/* 
Route: /
Method: GET
Description: Get all users details
Access: Public
Parameters: none
*/
router.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"books available",
        data:books
    })
})

/* 
Route: /books/issued
Method: GET
Description: Get all issued books
Access: Public
Parameters: none
*/
router.get("/issued/by-user",(req,res)=>{
    const userwithIssuedBook=users.filter((each) =>{
        if(each.issuedBook) return each;
    });
    const issuedBooks=[];
    userwithIssuedBook.forEach((each) => {
        const book=books.find((book)=>(book.id == each.issuedBook))
        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(book);
    });
    if(issuedBooks.length===0){
        return res.status(404).json({
            success:false,
            messege:"No Book have Been issued yet.."
        });
    }
    return res.status(200).json({
        success:true,
        messege:"users with the issued books..",
        data:issuedBooks,
    })

})


/* 
Route: /:id
Method: GET
Description: Get user details with id
Access: Public
Parameters: id
*/

router.get("/:id",(req,res)=>{
    const {id}=req.params;
    const book=books.find((each)=> each.id===id);
    if(!book){
        return res.status(404).json({
            success:false,
            messege:"Book is not available",
        })
    }
    return res.status(200).json({
        success:true,
        messege:"book exist",
        data:book,
    })
})


/* 
Route: /
Method: POST
Description: Create/Add new user
Access: Public
Parameters: id, name, author, genre, price, publisher
*/

router.post("/", (req,res)=>{
    const {data}=req.body;;
    if(!data){
        return res.status(400).json({
            success:false,
            messege:"No data To Add a book" 
        })  
    }
    const book=books.find((each)=>each.id === data.id);
    if(book){
        return res.status(404).json({
            success:false,
            messege:"Id already exists",
        })
    }
    const allBooks={ ...books,data};
    return res.status(201).json({
        success:true,
        messege:"Added Book Successfully",
        data:allBooks,
    })
})
/*
Route: /:id
Method: PUT
Description: Updating a book by their ID
Access: Public
Parameters: Id
data: id, name, author, genre, price, publisher
*/

router.put("/:id",(req,res)=>{
    const {id}= req.params;
    const {data}=req.body;

    const book=books.find((each)=> each.id===id);
    if(!book){
        return res.status(400).json({
            success:false,
            messege:"book not found"
        })
    }
    const updateBookData=books.map((each)=>{
        if(each.id==id){
            return{
                ...each,
                ...data
            };
        }
        return each;
    })
    return res.status(200).json({
        success:true,
        messege:"data is updated",
        data:updateBookData,
    })
})




module.exports = router;