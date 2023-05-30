const mongoose = require("mongoose");
mongoose.set("strictQuery",true)


exports.databaseconnection = async()=>{
try {
    await mongoose.connect(process.env.DB)
    console.log("db connected")
} catch (error) {
    console.log(error.message)
}

}