const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/** -------------
 * connect MongoDB database to the express server
 * ------------------ */
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/countProductsDB");
    console.log(`db's connected successfully`);
  } catch (error) {
    console.log(error);
    console.log(`db's not connected`);
    process.exit(1);
  }
};

/** -------------Schema------------------ */
const countProductsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

/** -------------Model------------------ */
const CountProduct = mongoose.model("countProducts", countProductsSchema);

/** -------------Home Route------------------ */
app.get("/", (req, res) => {
  res.send(`<h1>Home Route.</h1>`);
});

/** -------------create  Products data(post method)------------------ */
app.post("/countProduct", async (req, res) => {
  try {
    const { title, price, rating, description } = req.body;
    const newCountProducts = new CountProduct({
      title,
      price,
      rating,
      description,
    });
    const countProductData = await newCountProducts.save();
    if (countProductData) {
      res.status(201).send({
        success: true,
        message: `Products is added`,
        data: countProductData,
      });
    } else {
      res.status(404).send({
        success: false,
        message: `404 Not Added Products`,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});
/** -------------get Products data(get method)------------------ */
app.get("/countProduct", async (req, res) => {
  try {
    const { price, rating } = req.query;
    let countProducts;
    if (price && rating) {
      countProducts = await CountProduct.find({
        $or: [{ price: price }, { rating: rating }],
      }).sort({price:1}).select({price:1,title:1, _id:0});//accending order sort
    } else {
        countProducts = await CountProduct.find().sort({price:-1}).select({price:1, title:1, _id:0});//desending order sort
    }

    /**
     *          sort product base on price
    if (price && rating) {
      countProducts = await CountProduct.find({
        $or: [{ price: price }, { rating: rating }],
      }).sort({price:1});//accending order sort
    } else {
        countProducts = await CountProduct.find().sort({price:-1});//desending order sort
    }
    */

    /**
     *          count products number
     *
    if (price && rating) {
      countProducts = await CountProduct.find({
        $or: [{ price: price }, { rating: rating }],
      }).countDocuments(); //return product numbers
    } else {
        countProducts = await CountProduct.find().countDocuments();//return product numbers
    }
    */


    // const countProducts = await CountProduct.find();
    if (countProducts) {
      res.status(200).send({
        success: true,
        message: `Products is added`,
        data: countProducts,
      });
    } else {
      res.status(404).send({
        success: false,
        message: `404 Not Found Products`,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});
/** -------------get specific Products data(get method)------------------ */
app.get("/countProduct/:price", async (req, res) => {
  try {
    const price = req.params.price;
    const countProduct = await CountProduct.find({ price: price });
    if (countProduct) {
      res.status(200).send({
        success: true,
        message: `Products is added`,
        data: countProduct,
      });
    } else {
      res.status(404).send({
        success: false,
        message: `404 Not Found Specific Products`,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = {
  app,
  connectDB,
};
