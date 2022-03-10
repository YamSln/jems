import { HttpStatusCode } from "../util/http-status-code";
import { ClientError } from "./client.error";

export class ClientValidationError extends ClientError {
  constructor(
    message: string,
    statusCode: HttpStatusCode,
    private errors: string[]
  ) {
    super(message, statusCode);
  }
}
