# Validation

For the validation process of routes I'm using zod v4 for it. The standard that I will adopt will be:

- create for every new route body received an \*Input interface;
- import this schema in the respect domain/\_-schemas and then infer the type for TS usage.

By following this simple rule I will establish an pattern for the process.

## General recomendation

I will always use zod for any communication between the solution components, such as HTTP Requests, job datas, database returns, stripe returns etc. Because zod is an actual runtime check it will always throw an error when something doesn't match.
