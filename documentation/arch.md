# Architecture

I will describe my architecture approach for the project in a simple way. I've chosen to use a modular + layered architecture in a more functional way just for preference, without such an strong OOP in the application core. I will try to enforce immutability overall during data manipulation to void side-effects. I will try to stick for the FP pattern to have one function (excluding possible helpers) per file. For the controller's files, just for the sake of debugging and grouping related code, I will keep all of the route handlers in they're respective \*-handler.js file.

## Layers

After an quick explanation here's the layers I've chosen to use:

- Domain
- Infra
- Application
- Presentation

## Types & Schemas Layer

To clarify the separation of concerns regarding types and schemas:

- **Domain Layer:** Contains only the canonical business model and Zod schemas for core business logic and invariants (e.g., the `User` type and its schema). It does not contain DTOs or use-case-specific input/output schemas.
- **Application Layer:** Contains DTOs (Data Transfer Objects) for use case inputs/outputs, which are Zod schemas and types shaped by the needs of the API or use case. These are not part of the core business model, but are used for input/output validation and orchestration.
- **Infra Layer:** Contains database-specific types (e.g., Mongoose interfaces) and Zod schemas that represent the shape of data as stored in the database. These may differ from the domain types if the persistence model is not a 1:1 match with the business model.

This separation ensures that business logic is decoupled from both the API and the database, making the codebase more maintainable, testable, and adaptable to change.

## Modules

Each section of the application will be in it's respective feature folder. I will have an global folder for truly shared code.
