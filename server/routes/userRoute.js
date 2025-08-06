const express=require('express');
const router=express.Router();


router.get("/full-ptofile",getFullProfile);
router.delete("/delete-user",deleteUser);

module.exports=router;