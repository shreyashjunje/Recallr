const express=require('express');
const router=express.Router();

const {getFullProfile,deleteUser,editUser} = require("../controllers/userController")
router.get("/full-profile",getFullProfile);
router.delete("/delete-user",deleteUser);
router.patch("/edit-profile",editUser);

module.exports=router;