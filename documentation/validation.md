# Validation

For the validation process of routes I'm using zod v4 for it. The standard that I will adopt will be:

- create for every new route body received an \*Input interface;
- import this schema in the respect domain/\_-schemas and then infer the type for TS usage.

By following this simple rule I will establish an pattern for the process.
