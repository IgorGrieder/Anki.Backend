# Architecture

I will describe my architecture approach for the project in a simple way. I've chosen to use a modular + layered architecture in a more functional way just for preference, without such an strong OOP in the application core. I will try to enforce immutability overall during data manipulation to void side-effects. I will try to stick for the FP pattern to have one function (excluding possible helpers) per file. For the controller's files, just for the sake of debugging and grouping related code, I will keep all of the route handlers in they're respective \*\-controller.js file. I will have one repository too for each collection interaction, but I think I will regret it in the future.

## Layers

After an quick explanation here's the layers I've chosen to use:

- Domain
- Infra
- Application
- Presentation

## Modules

Each section of the application will be in it's respective folder. I will have an global folder for truly shared code.
