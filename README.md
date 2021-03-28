# @lindorm-io/axios
Axios Request Handler for lindorm.io packages.

## Installation
```shell script
npm install --save @lindorm-io/axios
```

### Peer Dependencies
This package has the following peer dependencies:
* [@lindorm-io/winston](https://www.npmjs.com/package/@lindorm-io/winston)

## Usage

### Axios
Creates a wrapper around the axios package that makes it somewhat easier to perform some standard requests.

```typescript
const axios = new Axios({
  baseUrl: "https://lindorm.io",
  basicAuth: { username: "secret", password: "secret" },
  bearerAuth: "jwt.jwt.jwt",
  logger: winston,
  middleware: [],
  name: "Client Name",
});

const response = await axios.get("/path", { params: { param_1: "value" }});
const response = await axios.post("/path", { data: 1 });
const response = await axios.put("/path", { data: 1 });
const response = await axios.patch("/path", { data: 1 });
const response = await axios.delete("/path");
```

### Middleware
With middleware you are able to add handlers that enhance or validate your request/response/error before the Promise is resolved.

```typescript
const middleware = {
  request: (request: IAxiosRequest): IAxiosRequest => {
    // enhance request
    return request
  },
  response: (response: IAxiosResponse): IAxiosResponse => {
    // enhance response
    return response
  },
  error: (error: IAxiosError): IAxiosError => {
    // enhance error
    return error
  },
}
```

### Case Switching
Axios automatically converts all object keys on the request data to snake_case right before the request is made. Axios will also automatically convert all object keys on response data to camelCase.

### Logging
Axios will automatically log prudent response data with the help of lindorm-io/winston.
