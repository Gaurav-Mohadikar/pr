const mongoose = require ('mongoose')

const connectDB = async ()=>{
    try {
        // await mongoose.connect ('mongodb://localhost:27017/pipes')
        await mongoose.connect ('mongodb+srv://gaurav:gaurav@123@cluster0.y1lp2.mongodb.net')
        console.log('mongo connected successfully');
        
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = connectDB