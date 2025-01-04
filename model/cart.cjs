const mongoose = require("mongoose");
const { default: user } = require("./user.cjs");
const cartSchema = mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  OrderedQuantity: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  dimensions: {
    type: Object,
    required: true,
    properties: {
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      depth: {
        type: Number,
        required: true,
      },
    },
  },
  warrantyInformation: {
    type: String,
    required: true,
  },
  shippingInformation: {
    type: String,
    require: String,
  },
  availabilityStatus: {
    type: String,
    required: true,
  },
  reviews: {
    type: [Object],
    required: true,
    properties: {
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      reviewerName: {
        type: String,
        required: true,
      },
      reviewerEmail: {
        type: String,
        required: true,
      },
    },
  },
  returnPolicy: {
    type: String,
    required: true,
  },
  minimumOrderQuantity: {
    type: Number,
    required: true,
  },
  meta: {
    type: Object,
    properties: {
      createdAt: {
        type: Date,
        required: true,
      },
      updatedAt: {
        type: Date,
        required: true,
      },
      barcode: {
        type: String,
        required: true,
      },
      qrCode: {
        type: String,
        required: true,
      },
    },
  },
  images: {
    type: [String],
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("carts", cartSchema);
