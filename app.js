var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var reload = require("reload");
const axios = require("axios").default;
axios.defaults.headers.post["Content-Type"] = "application/json";

var indexRouter = require("./routes/index");

var app = express();

// view engine setup
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "views/incident"),
  path.join(__dirname, "views/pop"),
  path.join(__dirname, "views/cabinet"),
  path.join(__dirname, "views/cable"),
  path.join(__dirname, "views/connection"),
  path.join(__dirname, "views/customer"),
  path.join(__dirname, "views/olt"),
  path.join(__dirname, "views/odf"),
  path.join(__dirname, "views/mx"),
  path.join(__dirname, "views/splitter"),
  path.join(__dirname, "views/ui"),
]);
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
// reload(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("404", { title: "[IM]" });
});

module.exports = app;
