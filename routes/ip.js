const express = require("express");
const router = express.Router();
const forwarded = require("forwarded");

router.get("/", async (req, res) => {
  res.status(200).send({
    APPNAME: process.env.HEROKU_APP_NAME,
    forwardedFor: forwarded(req),
    ip: req.ip,
  });
});

module.exports = router;
