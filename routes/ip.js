const express = require("express");
const router = express.Router();
const forwarded = require("forwarded");
const requestIp = require("request-ip");

router.get("/", async (req, res) => {
  res.status(200).send({
    forwardedFor: forwarded(req),
    ip: req.ip,
    requestIP: requestIp.getClientIp(req),
  });
});

module.exports = router;
