const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true },
    count: { type: Number, default: 0 },
});

const Url = mongoose.model("url-shortener", urlSchema);
module.exports = Url;
