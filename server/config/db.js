const mongoose=require('mongoose');

const connectDb= async ()=>{
    try{

       await mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser:true, //Makes the parser more reliable.
        useUnifiedTopology: true //Makes the parser more reliable.
       })

    console.log("✅ MongoDB connected successfully");

    }catch(err){
        console.error("Database connection error:", err.message);
        process.exit(1); //stop the server if connection fails
    }
}

module.exports=connectDb;
