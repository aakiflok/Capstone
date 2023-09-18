const invoiceItemModel= new mongoose.Schema({
    invoice_item_id: { type: Number, required: true, unique: true, autoIncrement: true },
    invoice_id: { type: Number, required: true },
    product_id: Number,
    quantity: { type: Number, required: true },
  });
  
  const Invoice_Item = mongoose.model('Invoice_Item', invoiceItemModel);
  module.exports = Invoice_Item;
