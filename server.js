const dotenvExpand = require("dotenv-expand");
dotenvExpand(require("dotenv").config());

const express = require("express");

const app = express();
const http = require("http").Server(app);

if (process.env.TRUST_PROXY) {
  app.set("trust proxy", process.env.TRUST_PROXY);
}

const rateLimit = require("express-rate-limit");
const ip = require("./routes/ip");

app.use(
  rateLimit({
    max: parseInt(process.env.RATE_LIMIT_MAX, 10),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10),
  })
);
app.use("/v1/ip", ip);

http.listen(process.env.PORT, () => {
  console.log("listening...");
});
