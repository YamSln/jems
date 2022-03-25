import { Server, Socket } from "socket.io";
import { JoinType } from "../auth/join.type";
import {
  FORBIDDEN,
  NOT_FOUND,
  TEAM_FULL,
  UNAUTHORIZED,
} from "../error/error.util";
import { GameEvent } from "../event/game.event";
import { JoinEvent } from "../event/join.event";
import { CreateGamePayload } from "../model/create-game.payload";
import { JoinPayload } from "../model/join.payload";
import { WordClicked } from "../model/word.clicked.payload";
import handler from "./game.handler";
import log from "../config/log";

const REQUESTOR = "SOCKET_HANDLER";

const onConnection = (socket: Socket, io: Server) => {
  log.debug(REQUESTOR, `${socket.id} connected!`);
  // On socket connection
  const auth: CreateGamePayload = socket.handshake.auth as CreateGamePayload;
  const joinType = socket.handshake.query.join;
  if (!auth) {
    disconnect(socket, UNAUTHORIZED);
  } // Check join type
  if (!joinType) {
    disconnect(socket, FORBIDDEN);
  } // Create / Join
  switch (joinType) {
    case JoinType.CREATE:
      createGame(socket, auth);
      break;
    case JoinType.JOIN:
      joinGame(socket, auth);
      break;
    default:
      disconnect(socket, NOT_FOUND);
  }

  socket.on(GameEvent.WORD_CLICK, (wordIndex: number) => {
    // Get socket room
    const room = getSocketRoom(socket);
    // Handle word click event
    const wordClicked: WordClicked | null = handler.onWordClick(
      wordIndex,
      socket.id,
      room
    ); // Emit received event
    if (wordClicked) {
      io.to(room).emit(GameEvent.WORD_CLICK, wordClicked);
    }
  });

  socket.on(GameEvent.ROLE_CHANGE, () => {
    // Get socket room
    const room = getSocketRoom(socket);
    // Change player role
    const player = handler.onRoleChange(socket.id, room);
    // Emit player changed role event
    io.to(room).emit(GameEvent.ROLE_CHANGE, player);
  });

  socket.on(GameEvent.TEAM_CHANGE, () => {
    // Get socket room
    const room = getSocketRoom(socket);
    // Change player team
    try {
      const player = handler.onTeamChange(socket.id, room);
      io.to(room).emit(GameEvent.TEAM_CHANGE, player);
    } catch (err: any) {
      sendError(socket, TEAM_FULL);
    }
    // Emit player changed team event
  });

  socket.on(GameEvent.TIME_SET, (timeSpan: number) => {
    // Get socket room
    const room = getSocketRoom(socket);
    // Set new timer time span
    const time = handler.onTimerSet(room, timeSpan, io);
    // Emit timer time span set event
    io.to(room).emit(GameEvent.TIME_SET, time);
  });

  socket.on(GameEvent.NEW_GAME, () => {
    // Get socket room
    const room = getSocketRoom(socket);
    // Get new game state
    const newGame = handler.onNewGame(room);
    // Emit new game state
    io.to(room).emit(GameEvent.NEW_GAME, newGame);
  });

  socket.on(GameEvent.END_TURN, () => {
    // Get socket room
    const room = getSocketRoom(socket);
    // Get new game state
    const next = handler.onEndTurn(socket.id, room);
    // Emit new game state
    io.to(room).emit(GameEvent.CHANGE_TURN, next);
  });

  socket.on(GameEvent.DISCONNECT_SELF, () => {
    disconnect(socket);
  });

  socket.on(GameEvent.DISCONNECTING, () => {
    const room = getSocketRoom(socket);
    // Disconnect player from its room
    const playerAction = handler.onDisconnectGame(socket.id, room);
    // Emit player disconnected event
    if (playerAction) {
      socket.broadcast
        .to(room)
        .emit(GameEvent.PLAYER_DISCONNECTED, playerAction);
    }
  });
};

const joinGame = (socket: Socket, joinPayload: JoinPayload) => {
  try {
    const event: JoinEvent = handler.onJoinGame(socket.id, joinPayload);
    socket.join(joinPayload.room);
    socket.emit(
      GameEvent.JOIN_GAME,
      { ...event.state, turnInterval: "" },
      joinPayload.room,
      event.joined
    );
    socket.broadcast.to(joinPayload.room).emit(GameEvent.PLAYER_JOINED, {
      nick: event.joined.nick,
      updatedPlayers: event.state.participants,
    });
  } catch (err: any) {
    handler.onDisconnectGame(socket.id, joinPayload.room);
    disconnect(socket, err.message);
  }
};

const createGame = (socket: Socket, payload: CreateGamePayload) => {
  try {
    const game = handler.onCreateGame(socket.id, payload);
    socket.emit(
      GameEvent.CREATE_GAME,
      game,
      payload.room,
      game.participants[0]
    );
    socket.join(payload.room);
  } catch (err: any) {
    handler.onDisconnectGame(socket.id, payload.room);
    disconnect(socket, err.message);
  }
};

const disconnect = (socket: Socket, message?: string) => {
  if (message) {
    sendError(socket, message);
    log.error(
      REQUESTOR,
      `Client id: ${socket.id} - ${socket.handshake.address} disconnected due to and error - ${message}`
    );
  }
  socket.disconnect(true);
};

const sendError = (socket: Socket, message: string) => {
  socket.emit("error", message);
};

const getSocketRoom = (socket: Socket): string => {
  let rooms = Array.from(socket.rooms);
  return rooms.filter((room) => room != socket.id)[0];
};

export default { onConnection };
