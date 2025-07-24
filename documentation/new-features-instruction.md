# new-features-instruction.md

## How to Add a New Feature

This guide explains the conventions, folder structure, and best practices for adding a new feature to this codebase. It is designed for both human developers and AI assistants.

---

### 1. **Folder Structure**

Each feature lives in its own folder under `src/features/`.
Inside each feature folder, use the following subfolders:

```
src/features/<feature-name>/
  application/
    dtos/
      <use-case>-dto.ts
    <use-case>.ts
  domain/
    <feature>-types.ts
  infra/
    persistance/
      <feature>-model.ts
      <feature>-types.ts
  presentation/
    index.ts
    <feature>-handlers.ts
    <feature>-swagger.ts
```

---

### 2. **Layer Responsibilities**

- **Domain:**
  - Contains the canonical business model and invariants (Zod schemas, types).
  - No DTOs or use-case-specific input/output schemas.

- **Application:**
  - Contains use case orchestration logic (one file per use case).
  - Contains DTOs (Zod schemas/types) for use case input/output in `dtos/`.

- **Infra:**
  - Contains persistence logic (Mongoose models, DB-specific types/interfaces).
  - All DB schemas and interfaces go in `persistance/`.

- **Presentation:**
  - Contains HTTP route handlers, route registration (`index.ts`), and Swagger docs.
  - Route handlers should be grouped by feature.

---

### 3. **Step-by-Step: Adding a New Feature**

#### **A. Create the Feature Folder**

- Create a new folder under `src/features/` named after your feature (e.g., `cards`).

#### **B. Domain Layer**

- In `domain/`, define the core business types and Zod schemas for your feature.
  - Example: `card-types.ts` with `CardSchema` and `Card` type.

#### **C. Application Layer**

- In `application/`, create a file for each use case (e.g., `create-card.ts`).
- In `application/dtos/`, define Zod schemas and types for each use case input/output (e.g., `create-card-dto.ts`).

#### **D. Infra Layer**

- In `infra/persistance/`, define your Mongoose model (e.g., `card-model.ts`) and DB-specific interfaces (e.g., `card-types.ts`).

#### **E. Presentation Layer**

- In `presentation/`, create:
  - `<feature>-handlers.ts`: All route handler functions.
  - `index.ts`: Register your routes using Express’ `Router`.
  - `<feature>-swagger.ts`: Swagger/OpenAPI docs for your endpoints.

#### **F. Register the Feature**

- Import and use your feature’s router in the main app (e.g., in `src/app.ts`).

---

### 4. **Naming Conventions**

- Use kebab-case for files (e.g., `create-card-dto.ts`).
- Use PascalCase for types and schemas (e.g., `CardSchema`, `CreateCardInput`).
- Use singular for feature folder names (e.g., `card`, `user`), unless the feature is inherently plural.

---

### 5. **Validation and Types**

- **Business logic types/schemas:** Only in `domain/`.
- **DTOs for use cases:** Only in `application/dtos/`.
- **DB types/interfaces:** Only in `infra/persistance/`.

---

### 6. **Example: Adding a "Card" Feature**

```
src/features/cards/
  application/
    dtos/
      create-card-dto.ts
    create-card.ts
  domain/
    card-types.ts
  infra/
    persistance/
      card-model.ts
      card-types.ts
  presentation/
    index.ts
    card-handlers.ts
    card-swagger.ts
```

---

### 7. **General Rules**

- Keep each file focused: one function or schema per file.
- Never mix business logic with persistence or HTTP concerns.
- Always validate incoming data with DTO schemas before passing to use cases.
- Use dependency injection for repositories/services where possible.
- Document your endpoints in Swagger.

---

### 8. **Checklist for New Features**

- [ ] Created feature folder and subfolders.
- [ ] Defined business types/schemas in domain.
- [ ] Defined DTOs and use cases in application.
- [ ] Defined Mongoose model and DB types in infra.
- [ ] Implemented route handlers and registered routes in presentation.
- [ ] Added Swagger docs.
- [ ] Registered the feature’s router in the main app.
- [ ] Don't leave strings in the code, use constants
