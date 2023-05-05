import server from "./app";
import { log } from "./log";
import { serverConfig } from "./config";

const REQUESTOR = "SERVER";
const port = serverConfig.port;
const serverVersion = serverConfig.version;

server.listen(port, () => {
  const serverArt = String.raw`
               ___  _______  __   __  _______ 
   ____       |   ||       ||  |_|  ||       |    ____
  /\__/\      |   ||    ___||       ||  _____|   /\__/\
 /_/  \_\     |   ||   |___ |       || |_____   /_/  \_\
 \ \__/ /  ___|   ||    ___||       ||_____  |  \ \__/ /
  \/__\/  |       ||   |___ | ||_|| | _____| |   \/__\/
          |_______||_______||_|   |_||_______|           __ver ${serverVersion}
 `;
  console.log(serverArt);
  log.info(REQUESTOR, `Server started on port ${port}`);
});
