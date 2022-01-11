const dotenvExpand = require("dotenv-expand");
dotenvExpand(require("dotenv").config());

const express = require("express");
const redis = require("redis");
const redisAdapter = require("socket.io-redis");

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  adapter: redisAdapter({
    pubClient: redis.createClient(process.env.REDIS_URL),
    subClient: redis.createClient(process.env.REDIS_URL),
  }),
});

app.set("trust proxy", 1);
app.set("redis", redis.createClient(process.env.REDIS_URL));
app.set("io", io);

io.of("/v1/entity");

const cors = require("cors");
const RedisStore = require("rate-limit-redis");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const entity = require("./routes/entity");

app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGINS.split(" "),
  })
);
app.use(
  rateLimit({
    max: parseInt(process.env.RATE_LIMIT_MAX, 10),
    store: new RedisStore({
      client: redis.createClient(process.env.REDIS_URL),
      expiry: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) / 1000,
      resetExpiryOnChange: true,
    }),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10),
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/v1/entity", entity);

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
  retryWrites: false,
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  http.listen(process.env.PORT, () => {
    console.log("listening...");
  });
});
