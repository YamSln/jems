import httpMocks from "node-mocks-http";
import options from "./options.middleware";

describe("Options Middleware Unit Tets", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should intercept options status and return 200 OK", () => {
    const request = httpMocks.createRequest({
      method: "OPTIONS",
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    options(request, response, next);

    expect(response.statusCode).toEqual(200);
    expect(response.getHeaderNames()).toEqual(
      expect.arrayContaining([
        "access-control-allow-origin",
        "access-control-allow-methods",
        "access-control-allow-headers",
      ]),
    );
  });
});
