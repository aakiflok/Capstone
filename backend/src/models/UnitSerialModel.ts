const unitSerialSchema = new mongoose.Schema({
    Unit_Serial_id: { type: Number, required: true, unique: true, autoIncrement: true },
    stock_id: { type: Number, required: true },
    serial_number: { type: String, required: true },
  });
const Unit_Serial = mongoose.model('Unit_Serial', unitSerialSchema );

module.exports =  Unit_Serial;
