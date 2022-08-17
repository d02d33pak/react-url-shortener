const mongoose = require("mongoose");
const joi = require("joi");
const Url = require("../models/url");
const shortid = require("shortid");

const generateShortUrl = () => {
    return shortid.generate();
};

const uri =
    "mongodb+srv://deepaktalan:deepaktalan@cluster0.btjga.mongodb.net/mernAppDB?retryWrites=true&w=majority";

exports.connect = async () => {
    try {
        await mongoose.connect(
            uri,
            () => {
                console.log("Connected to MongoDB");
            },
            (error) => {
                console.error(error);
            }
        );
    } catch (error) {
        console.log(error);
    }
};

exports.validateUrl = (url) => {
    url.shortUrl = generateShortUrl();
    console.log("Validating Url");
    const urlSchema = joi.object({
        originalUrl: joi.string().required(),
        shortUrl: joi.string().required(),
        count: joi.number().default(0),
    });
    return urlSchema.validate(url);
};

exports.createUrl = async (url) => {
    const { error } = exports.validateUrl(url);
    console.log("Adding Url");
    if (error) {
        throw new Error(error.details[0].message);
    }
    const urlExists = await Url.findOne({ originalUrl: url.originalUrl });
    if (urlExists) {
        console.log(urlExists);
        return urlExists;
    }
    const newUrl = new Url(url);
    const result = await newUrl.save();
    console.log(result);
    return result;
};

exports.getUrl = async (shortUrl) => {
    console.log("Getting Url");
    const url = await Url.findOne({ shortUrl: shortUrl });
    if (!url) {
        throw new Error("Url not found");
    }
    return url;
};

exports.getUrls = async () => {
    console.log("Getting Urls");
    const urls = await Url.find();
    return urls;
};

exports.updateCount = async (url) => {
    console.log("Updating Count");
    const updatedUrl = await Url.findOneAndUpdate(
        { shortUrl: url.shortUrl },
        { $inc: { count: 1 } }
    );
    return updatedUrl;
};

exports.deleteUrl = async (id) => {
    console.log("Deleting URL");
    const url = await Url.findOneAndDelete({ _id: id });
    if (!url) {
        throw new Error("URL not found");
    }
    return url;
}
