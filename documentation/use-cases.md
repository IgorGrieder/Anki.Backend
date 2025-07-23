# Use cases

For each use case a.k.a service application I will have an separate file for it, exporting just one function. To implement a pattern I decided that every use case return will have an return as a value for the controller function, meaning that the controller only responsibility is to receive the codes, messages, values and return in the request.

To emphasize this expected behavior I created and generic type Result that will have two possible returns `success` and `error`. Depending on the specific controller return to the front end you must create an success and error type for each controller as needed.

## Example from the create user use case

```TS
export interface Success {
  code: number;
  token: string;
}

export interface Error {
  code: number;
  msg: string;
}
```

Generally the code will always be present and then the actual return can vary
