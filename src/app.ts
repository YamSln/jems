import express, { NextFunction, Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { GameEvent } from "./event/game.event";
import socketHandler from "./service/socket.handler";
import gameRoutes from "./routes/game.route";
import jwtManager from "./auth/jwt.manager";
import { handleErrors } from "./error/error.handler";
import morgan from "morgan";
import serverConfig from "./config/server-config";
import path from "path";
import env from "./config/env";
import { options } from "./middleware/options.middleware";

export const app = express();

// CORS and options request
// CORS and options request
app.disable("x-powered-by");
app.use(options);

// Body and url parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Http endpoint
app.use("/", gameRoutes);

if (env.DEV_ENV) {
  // Morgan logging
  app.use(morgan("combined"));
  app.use("/", express.static(__dirname + "/client/dist/jems-web-client"));
  app.use("*", function (req, res) {
    res.sendFile(
      path.join(__dirname, "/client/dist/jems-web-client/index.html"),
    );
  });
} else {
  // Static app root endpoint
  app.use("/", express.static(__dirname + "/client"));
  app.use("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/client/index.html"));
  });
}

// Error handling
app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    handleErrors(request, err, response);
  },
);

// Http server creation
export const server = http.createServer(app);
// Socket io endpoint
const io = new Server(server, serverConfig.ioOptions);
// Socket connection authentication
io.use(jwtManager.verifyJwt);
// Socket connection event
io.on(GameEvent.CONNECT, (socket: Socket) =>
  socketHandler.onConnection(socket, io),
);
