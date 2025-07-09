const express = require("express");
const mainRouter = require('./routes/index');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/", mainRouter.router);

app.listen(3000, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", 3000);
});
