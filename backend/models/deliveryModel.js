const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
  customer: {
    type: String,
    required: true
  },
  plan: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  apartmentFloor: {
    type: String,
    required: false  // Assuming this is optional
  },
  driver: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],  // Example statuses
    default: 'Pending'
  }
});

const DeliveryTimingSchema = new Schema({
  city: {
    type: String,
    required: true,
    trim: true
  },
  timings: [
    {
      title: {
        type: String,
        required: true,
        trim: true
      },
      from: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            // Validate if the value is in HH:mm format
            return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
          },
          message: 'Invalid time format for `from`. Use HH:mm (24-hour format).'
        }
      },
      until: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            // Validate if the value is in HH:mm format
            return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
          },
          message: 'Invalid time format for `until`. Use HH:mm (24-hour format).'
        }
      }
    }
  ],
  daysoff: {
    monday: { type: Boolean, default: false },
    tuesday: { type: Boolean, default: false },
    wednesday: { type: Boolean, default: false },
    thursday: { type: Boolean, default: false },
    friday: { type: Boolean, default: false },
    saturday: { type: Boolean, default: false },
    sunday: { type: Boolean, default: false }
  }

}, { timestamps: true });

const DeliveryVehicleSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  plateNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true, 
  },
  issueDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  images: {
    type: [String],
    validate: [arrayLimit, "Exceeds the limit of 5 images"], 
  },
});

// Optional validator to limit image array size
function arrayLimit(val) {
  return val.length <= 5;
}

const DeliveryZoneSchema = new Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  districts: { type: String, required: true },
  description: { type: String },
  imageLink: { type: String },
});



const DeliveryDriverSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  shift: {
    type: String,
    required: true
  },
  license: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryVehicle',
    required: true
  },
  zones: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryZone'
  }],
  profile: {
    type: String,
    required: false
  },
  licenseFront: {
    type: String,
    required: false
  },
  licenseRear: {
    type: String,
    required: false
  }
}, { timestamps: true });

const Delivery = mongoose.model('Delivery', DeliverySchema);
const DeliveryTiming = mongoose.model('DeliveryTiming', DeliveryTimingSchema);
const DeliveryVehicle = mongoose.model("DeliveryVehicle", DeliveryVehicleSchema);
const DeliveryZone = mongoose.model("DeliveryZone", DeliveryZoneSchema);
const DeliveryDriver = mongoose.model('DeliveryDriver', DeliveryDriverSchema);

module.exports = {Delivery,DeliveryTiming,DeliveryVehicle,DeliveryZone,DeliveryDriver};
