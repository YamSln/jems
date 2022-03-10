import { HttpStatusCode } from "../util/http-status-code";

export class ClientError {
  private timeStamp: string;

  constructor(private message: string, private statusCode: HttpStatusCode) {
    this.timeStamp = new Date().toISOString();
  }
}
