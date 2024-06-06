import express from "express"
import cors from 'cors'
import { connectDB } from "./config/db.js"
import productRouter from "./routes/ProductRoute.js"


//app config
const app = express()
const port = 8010

//middleware
app.use(express.json())
app.use(cors())

//db connect
connectDB(); 

//api
app.use("/api/product", productRouter)
app.use("/images", express.static('uploads'))

app.get("/" , (req,res) => {
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`)
})

//mongodb+srv://ducpvps26267:soldout@database1.4wi40ec.mongodb.net/?retryWrites=true&w=majority&appName=database1