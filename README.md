# The ideia

The project idea is to basically build an AI powered Anki Cards solution. This idea is built on top of the principles of the book `Make it Stick` and it's a personal project to expand my skills as an Node.js developer.

In the project I will have a documentation folder that will contain my main decisions during development. This can be used for general AI usage in the repository.

# How to run

To run the application you must run the following docker-compose command to setup redis and the application itself:

```bash
docker-compose up -d
```

To stop the contianers

```bash
docker-compose down
```

If changes in the dependencies where made it's necessary to build again the images

```bash
docker-compose up -d --build
```
