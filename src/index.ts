import { server } from "./app";
import log from "./config/log";
import serverConfig from "./config/server-config";

const REQUESTOR = "SERVER";
const port = serverConfig.port;
const serverVersion = process.env.npm_package_version;

server.listen(port, () => {
  const serverArt = String.raw`
     ___  _______  __   __  _______ 
    |   ||       ||  |_|  ||       |
    |   ||    ___||       ||  _____|   ____
    |   ||   |___ |       || |_____   /\__/\
 ___|   ||    ___||       ||_____  | /_/  \_\
|       ||   |___ | ||_|| | _____| | \ \__/ /
|_______||_______||_|   |_||_______|  \/__\/  __ver ${serverVersion}
 `;
  console.log(serverArt);
  log.info(REQUESTOR, `Server started on port ${port}`);
});
