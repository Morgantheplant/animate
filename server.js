var express = require("express");
var app = express();
var http = require("http").Server(app);
var port = process.env.PORT || 5000;
var path = require("path");

app
  .use("/static", express.static("public"))
  .use("/images", express.static("public/images"))
  .use("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
  });

http.listen(port, function() {
  console.log("Listening on port " + port);
});
