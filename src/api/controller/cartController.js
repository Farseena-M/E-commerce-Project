const asyncErrorHandler = require('../utils/asyncErrorHandler')
const cart = require('../model/cartSchema')
const products = require('../model/productSchema');
const { getProductById } = require('./productController');

const addProductToCart = asyncErrorHandler(async(req,res)=>{
    const userId = req.params.id;
    const productId = req.body.product;
    const checkProduct = await products.findById(productId);
    if(!checkProduct){ 
      res.status(404).json({message:'Product not found'})
    }
    const existingCart = await cart.findOne({User:userId})
    if(existingCart){
         const existingProductCart = existingCart.Product.indexOf(productId)
         if(existingProductCart!==-1){
            res.status(404).json({message:'Product already exist'})
         }else{
        existingCart.Product.push(productId)
        existingCart.TotalPrice += checkProduct.price
        existingCart.save();
        res.status(200).json({
            status:'Success',
            data:{
                existingCart:existingCart
            }
        })
    }
    }else{
        const newCart = await cart.create({User:userId,Product:[productId]})
        res.status(200).json({
            status:'Success',
            data:{
                newCart:newCart
            }
        })
    }
})


const getCartProduct = asyncErrorHandler(async(req,res)=>{
    const userId = req.params.id
    const getCart = await cart.findOne({User:userId})
    console.log(getCart);
    res.status(200).json({
        status:'Success',
        data:{
            getCart
        }
    })
})



const deleteProductCart = asyncErrorHandler(async(req,res)=>{
    const userId = req.params.id
    const productId = req.body.product
    const getCartUser = await cart.findOne({User:userId})
    if(!getCartUser){
        res.status(404).json({message:`${cart} is not found`})
    }else{
        const deleteIndex = getCartUser.Product.indexOf(productId)
        const deleteProduct = getCartUser.Product[deleteIndex]
        getCartUser.Product.splice(deleteIndex,1)
        await getCartUser.save()
        res.status(200).json({
            status:'Success'
        })
    }
})


module.exports = {
    addProductToCart,
    getCartProduct,
    deleteProductCart
  
}