const express = require("express");
const cors = require("cors");
const Url = require("./models/url");
const db = require("./controllers/db");

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

db.connect();

app.get("/", (req, res) => {
    console.log("Request body for / =", req.body);
    console.log("Request params", req.params);
    const result = db.getUrls();
    result.then((urls) => {
        console.log(urls);
        res.send(urls);
    });
});

app.post("/url", (req, res) => {
    console.log("Request body for /url =", req.body);
    const result = db.createUrl(req.body);
    result.then((url) => {
        console.log(url);
        res.send(url);
    });
});

app.delete("/delete/:id", (req, res) => {
    console.log("Request body for /url/:id =", req.body);
    console.log("Delete params", req.params);
    const result = db.deleteUrl(req.params.id);
    result
        .then((url) => {
            console.log(url);
            res.send(url);
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        });
});

app.get("/:shortUrl", (req, res) => {
    console.log("Request body for /:shortUrl =", req.body);
    console.log("Request params", req.params);

    const result = db.getUrl(req.params.shortUrl);
    result.then((url) => {
        console.log(url);
        db.updateCount(url).then((url) => {
            console.log(url);
            res.redirect(url.originalUrl);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
