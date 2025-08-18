import express from 'express'
import { addProduct, listProduct, productDetails, updateProduct, deleteProduct } from '../controller/productController.js'
import upload from '../middleware/multer.js'
import adminAuth from "../middleware/adminAuth.js"


let productRoutes = express.Router()

import isAuth from '../middleware/isAuth.js'

productRoutes.post("/addproduct", isAuth, adminAuth, upload.fields([
    {name:"image1",maxCount:1},
    {name:"image2",maxCount:1},
    {name:"image3",maxCount:1},
    {name:"image4",maxCount:1}
]), addProduct)
productRoutes.get("/list",listProduct)
productRoutes.get("/details/:id",productDetails)
productRoutes.put("/update/:id", isAuth, adminAuth, upload.fields([
    {name:"image1",maxCount:1},
    {name:"image2",maxCount:1},
    {name:"image3",maxCount:1},
    {name:"image4",maxCount:1}
]), updateProduct)
productRoutes.delete("/delete/:id", isAuth, adminAuth, deleteProduct)


export default productRoutes