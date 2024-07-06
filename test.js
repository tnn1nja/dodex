var fs = require("fs");

fs.rm("webpages", { recursive: true }, (err) => {});
fs.mkdir("webpages", { recursive: false }, (err) => {});