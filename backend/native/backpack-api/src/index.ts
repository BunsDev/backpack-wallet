import type { NextFunction,Request, Response } from "express";
import express from "express";
import { ZodError } from "zod";

import authenticateRouter from "./routes/v1/authenticate";
import chatRouter from "./routes/v1/chats";
import friendsRouter from "./routes/v1/friends";
import inboxRouter from "./routes/v1/inbox";
import notificationRoutes from "./routes/v1/notifications";
import preferenceRoutes from "./routes/v1/preferences";
import proxyRouter from "./routes/v1/proxy";
import usersRouter from "./routes/v1/users";
import { zodErrorToString } from "./util";

const app = express();
// eslint-disable-next-line
const bodyParser = require("body-parser");
// eslint-disable-next-line
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "application/json" }));
app.use("/authenticate", authenticateRouter);
app.use("/chat", chatRouter);
app.use("/notifications/", notificationRoutes);
app.use("/preferences", preferenceRoutes);
app.use("/proxy", proxyRouter);
app.use("/chat", chatRouter);
app.use("/inbox", inboxRouter);
app.use("/friends", friendsRouter);
app.use("/users", usersRouter);

// @ts-ignore
app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: zodErrorToString(err),
    });
  } else {
    return res.status(500).json(err);
  }
});

app.listen(process.env.PORT || 8080);

process.on("uncaughtException", function (err) {
  console.error(err);
  console.log("Caught exception: " + err);
});
