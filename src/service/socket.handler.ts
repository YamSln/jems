import { Server, Socket } from "socket.io";
import { JoinType } from "../auth/join.type";
import { FORBIDDEN, NOT_FOUND, UNAUTHORIZED } from "../error/error.util";
import { GameEvent } from "../event/game.event";
import { JoinEvent } from "../event/join.event";
import { CreateGamePayload } from "../model/create-game.payload";
import { JoinPayload } from "../model/join.payload";
import { WordClicked } from "../model/word.clicked.payload";
import handler from "./game.handler";

const onConnection = (socket: Socket, io: Server) => {
  console.log(`${socket.id} connected!`);
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
    try {
      const wordClicked: WordClicked | null = handler.onWordClick(
        wordIndex,
        socket.id,
        room
      ); // Emit received event
      if (wordClicked) {
        io.to(room).emit(GameEvent.WORD_CLICK, wordClicked);
      }
    } catch (err) {
      socket.emit("err", err);
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
    const player = handler.onTeamChange(socket.id, room);
    // Emit player changed team event
    io.to(room).emit(GameEvent.TEAM_CHANGE, player);
  });

  socket.on(GameEvent.TIME_SET, (timeSpan: number) => {
    // Get socket room
    const room = getSocketRoom(socket);
    // Set new timer time span
    const time = handler.onTimerSet(room, timeSpan);
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

  socket.on(GameEvent.DISCONNECT_SELF, () => {
    disconnect(socket);
  });

  socket.on(GameEvent.DISCONNECTING, () => {
    const room = getSocketRoom(socket);
    // Disconnect player from its room
    const playerAction = handler.onDisconnectGame(socket.id, room);
    // Emit player disconnected event
    if (playerAction) {
      io.to(room).emit(GameEvent.PLAYER_DISCONNECTED, playerAction);
    }
  });
};

const joinGame = (socket: Socket, joinPayload: JoinPayload) => {
  try {
    const event: JoinEvent = handler.onJoinGame(socket.id, joinPayload);
    socket.join(joinPayload.room);
    socket.emit(
      GameEvent.JOIN_GAME,
      event.state,
      joinPayload.room,
      event.joined
    );
    socket.broadcast.to(joinPayload.room).emit(GameEvent.PLAYER_JOINED, {
      nick: event.joined.nick,
      updatedPlayers: event.state.participants,
    });
  } catch (err) {
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
  } catch (err) {
    disconnect(socket, err.message);
  }
};

const disconnect = (socket: Socket, message?: string) => {
  socket.emit("error", message);
  socket.disconnect(true);
};

const getSocketRoom = (socket: Socket): string => {
  let rooms = Array.from(socket.rooms);
  return rooms.filter((room) => room != socket.id)[0];
};

export default { onConnection };
