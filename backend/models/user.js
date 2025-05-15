const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  isBpPatient: { type: String },
  isDiabetic: { type: String },
  foodPreference: { type: String }
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)
