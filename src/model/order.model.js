import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId:{type:String, required: true},
    orderId:{type:String, required: true},
    products: 
      [{
       productId:{type:String, required: true},
       title:{type:String, required: true},
       price:{type:Number, required: true},
       thumbnail:{type:String, required: true},
       quantity:{type:Number, required: true},
      }]
      
    ,
    totalAmount: { type: Number, required: true },
    paymentMethod:{type:String,default:"cod"},
    orderStatus: { type: String, default: 'Processing' },
    deliveryInformation: {
      address: {type:String, required: true},
      contact:{type:String, required: true},
      username: {type:String, required: true},
     }

  
  },{timestamps:true});
  
 const Order = mongoose.model('Order', orderSchema);
 export default Order;  