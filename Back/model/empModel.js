const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  dailyWage: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  attendance: {
    type: Map,
    of: Boolean,
    default: {},
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Employee', employeeSchema);