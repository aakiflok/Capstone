      import mongoose from "mongoose";
      const invoiceItemModel= new mongoose.Schema({
          invoice_id: {    type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
          product_id: {   type: mongoose.Schema.Types.ObjectId, ref: 'Product', required:true},
          quantity: { type: Number, required: true },
          final_price: { type: Number, required: true }
        });
        
        const Invoice_Item = mongoose.model('Invoice_Item', invoiceItemModel);
        export{Invoice_Item};
