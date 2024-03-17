const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    items: [
        {
            title: String,
            price: Number,
            img: String,
            quantity: Number
        }
    ]

});

const Product = new mongoose.model("Product" , ProductSchema);
module.exports = Product;