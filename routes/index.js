var express = require("express");
var router = express.Router();
const axios = require("axios").default;
axios.defaults.headers.post["Content-Type"] = "application/json";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Trang chủ" });
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "Đăng nhập" });
});

router.get("/pops", function (req, res, next) {
  res.render("pops", { title: "POPs" });
});

router.get("/device-management/managed-pops", function (req, res, next) {
  res.render("managed-pops");
});

router.get("/mangxong", function (req, res, next) {
  res.render("mangxong", { title: "MXs" });
});

router.get("/cabinet", function (req, res, next) {
  res.render("cabinet", { title: "Cabinet" });
});
router.get("/cabinetlv1", function (req, res, next) {
  res.render("cabinetlv1", { title: "Cabinet Lv1" });
});
router.get("/cabinetlv2", function (req, res, next) {
  res.render("cabinetlv2", { title: "Cabinet Lv2" });
});

router.get("/cable", function (req, res, next) {
  res.render("cable", { title: "Cables" });
});

router.get("/olt", function (req, res, next) {
  res.render("olt", { title: "OLTs" });
});

router.get("/odf", function (req, res, next) {
  res.render("odf", { title: "ODFs" });
});

router.get("/incident", function (req, res, next) {
  res.render("incident", { title: "Incident" });
});

router.get("/device-management/managed-cabinets", function (req, res, next) {
  res.render("managed-cabinets");
});
router.get("/device-management/managed-cabinets-lv1", function (
  req,
  res,
  next
) {
  res.render("managed-cabinets-lv1");
});
router.get("/device-management/managed-cabinets-lv2", function (
  req,
  res,
  next
) {
  res.render("managed-cabinets-lv2");
});

router.get("/device-management/managed-cables/tt", function (req, res, next) {
  res.render("managed-cables-tt");
});

router.get("/connection-management/managed-core-connects/tt", function (
  req,
  res,
  next
) {
  res.render("managed-connects-tt", { title: "Kết nối TT" });
});

router.get("/device-management/managed-cables/tn", function (req, res, next) {
  res.render("managed-cables-tn");
});

module.exports = router;
