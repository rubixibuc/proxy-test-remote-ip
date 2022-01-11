const express = require("express");
const router = express.Router();

router.get("/:id", async (req, res) => {
  res.status(500).send(req.params.id);
});

router.post("/", async (req, res) => {
  res.status(200).json(req.body);
});

module.exports = router;
