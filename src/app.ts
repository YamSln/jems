import express, { NextFunction, Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { GameEvent } from "./event";
import { jwtManager } from "./auth";
import { socketHandler } from "./service";
import { gameRoutes } from "./routes";
import { handleErrors } from "./error";
import morgan from "morgan";
import path from "path";
import { env, serverConfig } from "./config";
import { optionsMiddleware } from "./middleware";
import { HttpHeader } from "./util/http.header";

export const app: express.Express = express();

// CORS and options request
app.disable(HttpHeader.X_POWERED_BY);
app.use(optionsMiddleware.options);

// Body and url parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Http endpoint
app.use("/", gameRoutes);

if (env.DEV_ENV) {
  // Morgan logging
  app.use(morgan("combined"));
  app.use("/", express.static(__dirname + "/client/dist/jems-web-client"));
  app.use("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "/client/dist/jems-web-client/index.html"),
    );
  });
} else {
  // Static app root endpoint
  app.use("/", express.static(__dirname + "/client"));
  app.use("*", (req, res) => {
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
const server: http.Server = http.createServer(app);
// Socket io endpoint
const io: Server = new Server(server, serverConfig.ioOptions);
// Socket connection authentication
io.use(jwtManager.verifyJwt);
// Socket connection event
io.on(GameEvent.CONNECT, (socket: Socket) =>
  socketHandler.onConnection(socket, io),
);

export default server;
