const express=require("express");
const {users}=require("../data/users.json");
const router=express.Router();
/* 
Route: /users
Method: GET
Description: Get all users
Access: Public
Parameters: None
*/


router.get("/",(req,res)=>{
    res.status(200).json({
        success: true,
        data: users,
    })
})

/* 
Route: /users/:id
Method: GET
Description: Get a user by id
Access: Public
Parameters: id
*/
router.get("/:id",(req,res)=>{
    const {id}=req.params;
    const user=users.find((each) =>each.id=== id);
    if(!user){
        return res.status(404).json({
            status:false,
            messege:"user does not exist"
        })
    }
        return res.status(200).json({
            status:true,
            messege:"user exist",
            data: user
        })
})

/* 
Route: /users
Method: POST
Description: Creating/Adding a new user
Access: Public
Parameters: None
*/

router.post("/",(req,res)=>{
    const {id,name,surname,email,subscriptionType,subscriptionDate}=req.body;
    const user=users.find((each)=>each.id === id);
    if(user){
        return res.status(404).json({
            status:false,
            messege:"user with this id already exist"
        })
    }
    users.push({
        id,
        name,
        surname,
        email,
        subscriptionType,
        subscriptionDate
    })
    return res.status(201).json({
        status:true,
        messege:"user added successfully",
        data:users
    })
})

/* 
Route: /users/:id
Method: PUT
Description: Updating a user by their ID
Access: Public
Parameters: Id
*/

router.put("/:id", (req,res)=>{
    const {id} =req.params;
    const {data}= req.body;
    const user=users.find((each)=>each.id===id);
    if(!user){
        return res.status(404).json({
            status:false,
            messege:"user with this id does not exist"
        })
    }
    const updateUserData=users.map((each)=>{
        if(each.id===id){
            return{
                ...each, //each element data present in json file
                ...data  // updated data
            };   
        }
        return each;
    })
    return res.status(200).json({
        status:true,
        messege:"User updated",
        data:updateUserData,
    })

})

/* 
Route: /users/:id
Method: DELETE
Description: Deleting a user by their ID
Access: Public
Parameters: Id
*/

router.delete("/users/:id",(req,res)=>{
    const {id}=req.params;
    const user=users.find((each)=>each.id===id);
    if(!user){
        return res.status(404).json({status:false, messege:"user with this id does not exist"});
    }
    const index=users.indexOf(user);
    users.splice(index,1);
    return res.status(200).json({status:true,messege:"user is deleted",data:users,});


    
})

/**
 * Route: /users/subscription-details/:id
 * Method: GET
 * Description: Get all user Subscription Details
 * Access: Public
 * Parameters: ID
 */
 router.get("/subscription-details/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);
  
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User With The ID Didnt Exist",
      });
    }
  
    const getDateInDays = (data = "") => {
      let date;
      if (data === "") {
        date = new Date();
      } else {
        date = new Date(data);
      }
      let days = Math.floor(date / (1000 * 60 * 60 * 24));
      return days;
    };
  
    const subscriptionType = (date) => {
      if (user.subscriptionType === "Basic") {
        date = date + 90;
      } else if (user.subscriptionType === "Standard") {
        date = date + 180;
      } else if (user.subscriptionType === "Premium") {
        date = date + 365;
      }
      return date;
    };
  
    // Jan 1 1970 UTC
    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);
  
    // console.log("returnDate ", returnDate);
    //   console.log("currentDate ", currentDate);
    //     console.log("subscriptionDate ", subscriptionDate);
    //       console.log("subscriptionExpiration ", subscriptionExpiration);
  
    const data = {
      ...user,
      isSubscriptionExpired: subscriptionExpiration < currentDate,
      daysLeftForExpiration:
        subscriptionExpiration <= currentDate
          ? 0
          : subscriptionExpiration - currentDate,
      fine:
        returnDate < currentDate
          ? subscriptionExpiration <= currentDate
            ? 100
            : 50
          : 0,
    };
    return res.status(200).json({
      success: true,
      message: "Subscription detail for the user is: ",
      data,
    });
  });
  
  


module.exports = router;