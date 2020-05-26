// Cargamos el módulo de mongoose
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;

// Creamos el objeto del esquema con sus correspondientes campos
const MessageSchema = new Schema({
 transmitter: {
  type: Schema.Types.ObjectId,         
  ref: "User",
  trim: true,  
  required: true,
 },
 receiver: [{
  type: Schema.Types.ObjectId,         
  ref: "User",
  trim: true,
  required: true
 }],
 topic: {
  type: String,
  trim: true,
  required: true
 },
 content: {
  type: String,
  trim: true,
  required: true
 }, 
 statusReceived:{
   type: Boolean,
   trim: true,
 },
 statusDeleted:{
  type: Boolean,
  trim: true,
},
}, {
  timestamps: true
});

// Exportamos el modelo para usarlo en otros ficheros
module.exports = mongoose.model('Message', MessageSchema);