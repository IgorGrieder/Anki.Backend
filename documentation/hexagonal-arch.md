# Hexagonal Architecture (Ports & Adapters) Implementation Guide

## Overview

This guide explains how to implement **Hexagonal Architecture** (also known as **Ports & Adapters**) using a **functional programming approach** in TypeScript. This pattern provides clean separation of concerns, testability, and maintainability.

## 🏗️ Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                      │
│  ┌─────────────────┐  ┌─────────────────┐                │
│  │  HTTP Handlers  │  │  API Docs       │                │
│  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      CORE LAYER                           │
│  ┌─────────────────┐  ┌─────────────────┐                │
│  │  Entities       │  │  Use Cases      │                │
│  │  (Domain)       │  │  (Business)     │                │
│  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PORTS LAYER                             │
│  ┌─────────────────┐  ┌─────────────────┐                │
│  │  Driven Ports   │  │  Driving Ports  │                │
│  │  (Interfaces)   │  │  (Interfaces)   │                │
│  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  ADAPTERS LAYER                            │
│  ┌─────────────────┐  ┌─────────────────┐                │
│  │  Driven         │  │  Driving        │                │
│  │  Adapters       │  │  Adapters       │                │
│  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

## 📁 File Structure Template

```
src/modules/{module-name}/
├── core/
│   ├── {module}-entity.ts              # Domain entities
│   ├── {module}-module.ts              # Module factory
│   └── use-cases/
│       ├── {use-case-1}.ts             # Individual use case
│       ├── {use-case-2}.ts             # Individual use case
│       ├── use-cases.ts                 # Use case exports
│       └── dtos/                        # Data Transfer Objects
│           ├── create-{entity}-dto.ts
│           └── update-{entity}-dto.ts
├── port/
│   ├── driven/
│   │   └── {module}-repository.ts      # Repository interface
│   └── driving/
│       └── {module}-service.ts         # External service interface
├── adapter/
│   ├── driven/
│   │   ├── {module}-repository.ts      # Repository implementation
│   │   └── {database}/
│   │       └── {module}-model.ts       # Database model
│   └── driving/
│       ├── http-handlers.ts            # HTTP handlers
│       ├── swagger-docs.ts             # API documentation
│       └── routes.ts                   # Route exports
```

## 🎯 Implementation Steps

### Step 1: Define Domain Entities

```typescript
// src/modules/{module}/core/{module}-entity.ts
import { z } from "zod";

export const entitySchema = z.object({
  _id: z.any().transform((val) => val.toString()),
  // Define your entity properties
  name: z.string(),
  email: z.email(),
  created_at: z.date(),
  updated_at: z.date(),
});

type EntityTypeHolder = z.infer<typeof entitySchema>;
export type Entity = Readonly<EntityTypeHolder>;
```

### Step 2: Create DTOs

```typescript
// src/modules/{module}/core/use-cases/dtos/create-{entity}-dto.ts
import { z } from "zod";

export const createEntitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Please provide a valid email"),
});

export type CreateEntityDto = z.infer<typeof createEntitySchema>;
```

### Step 3: Define Ports (Interfaces)

```typescript
// src/modules/{module}/port/driven/{module}-repository.ts
import { CreateEntityDto } from "../../core/use-cases/dtos/create-{entity}-dto";
import { Entity } from "../../core/{module}-entity";

export interface IEntityRepository {
  createEntity(entity: CreateEntityDto): Promise<Entity | null>;
  findById(id: string): Promise<Entity | null>;
  findByEmail(email: string): Promise<Entity | null>;
  updateEntity(id: string, updates: Partial<Entity>): Promise<Entity | null>;
  deleteEntity(id: string): Promise<boolean>;
}
```

### Step 4: Create Use Cases (Functional Approach)

```typescript
// src/modules/{module}/core/use-cases/create-{entity}.ts
import { IEntityRepository } from "../../port/driven/{module}-repository";
import { CreateEntityDto } from "./dtos/create-{entity}-dto";
import {
  Result,
  GenericError,
  GenericSuccess,
} from "../../../../shared/types/types";
import { validateWithSchema } from "../../../../shared/utils/generic-schema-validator";
import { entitySchema, Entity } from "../{module}-entity";
import logger from "../../../../shared/logger/logger-module";
import {
  httpCodes,
  resMessages,
} from "../../../../shared/constants/constants-module";

interface Success extends GenericSuccess {
  entity: Entity;
}

export const createEntityUseCase =
  (entityRepository: IEntityRepository) =>
  async (entity: CreateEntityDto): Promise<Result<Success, GenericError>> => {
    try {
      const createdEntity = await entityRepository.createEntity(entity);

      if (!createdEntity) {
        return {
          kind: "error",
          error: {
            code: httpCodes.internalServerError,
            msg: resMessages.unexpectedError,
          },
        };
      }

      const data = validateWithSchema<Entity>(entitySchema, createdEntity);

      return {
        kind: "success",
        value: {
          code: httpCodes.created,
          entity: data,
        },
      };
    } catch (err: any) {
      logger.errorLogger("Error creating entity", err);
      return {
        kind: "error",
        error: {
          code: httpCodes.internalServerError,
          msg: resMessages.unexpectedError,
        },
      };
    }
  };
```

### Step 5: Implement Adapters

```typescript
// src/modules/{module}/adapter/driven/{module}-repository.ts
import { CreateEntityDto } from "../../core/use-cases/dtos/create-{entity}-dto";
import { Entity } from "../../core/{module}-entity";
import { IEntityRepository } from "../../port/driven/{module}-repository";
import { EntityModel } from "./{database}/{module}-model";

export const createEntityRepository = (): IEntityRepository => {
  return {
    async createEntity(entity: CreateEntityDto): Promise<Entity | null> {
      try {
        const createdEntity = await EntityModel.create(entity);
        return createdEntity.toObject();
      } catch (error) {
        return null;
      }
    },

    async findById(id: string): Promise<Entity | null> {
      try {
        const entity = await EntityModel.findById(id).lean();
        return entity;
      } catch (error) {
        return null;
      }
    },

    async findByEmail(email: string): Promise<Entity | null> {
      try {
        const entity = await EntityModel.findOne({ email }).lean();
        return entity;
      } catch (error) {
        return null;
      }
    },

    async updateEntity(
      id: string,
      updates: Partial<Entity>
    ): Promise<Entity | null> {
      try {
        const updatedEntity = await EntityModel.findByIdAndUpdate(id, updates, {
          new: true,
        }).lean();
        return updatedEntity;
      } catch (error) {
        return null;
      }
    },

    async deleteEntity(id: string): Promise<boolean> {
      try {
        const result = await EntityModel.findByIdAndDelete(id);
        return result !== null;
      } catch (error) {
        return false;
      }
    },
  };
};
```

### Step 6: Create Module Factory

```typescript
// src/modules/{module}/core/{module}-module.ts
import { createEntityUseCase } from "./use-cases/create-{entity}";
import { updateEntityUseCase } from "./use-cases/update-{entity}";
import { createEntityRepository } from "../adapter/driven/{module}-repository";
import { IEntityRepository } from "../port/driven/{module}-repository";

const entityRepository: IEntityRepository = createEntityRepository();

export const EntityUseCases = {
  createEntity: createEntityUseCase(entityRepository),
  updateEntity: updateEntityUseCase(entityRepository),
};

// Export the repository for testing or other uses
export const getEntityRepository = (): IEntityRepository => entityRepository;
```

### Step 7: Export Use Cases

```typescript
// src/modules/{module}/core/use-cases/use-cases.ts
// Export individual use cases
export { createEntityUseCase } from "./create-{entity}";
export { updateEntityUseCase } from "./update-{entity}";

// Export the EntityUseCases object from the module
export { EntityUseCases } from "../{module}-module";
```

### Step 8: Create Driving Adapters (Presentation Layer)

```typescript
// src/modules/{module}/adapter/driving/http-handlers.ts
import { Request, Response } from "express";
import { CreateEntityDto } from "../../core/use-cases/dtos/create-{entity}-dto";
import { EntityUseCases } from "../../core/{module}-module";

export const createEntityHandler = async (req: Request, res: Response) => {
  const createEntityDto: CreateEntityDto = req.body;
  const result = await EntityUseCases.createEntity(createEntityDto);

  if (result.kind === "success") {
    res.status(result.value.code).json({
      message: "Entity created successfully",
      entity: result.value.entity,
    });
    return;
  }

  res.status(result.error.code).json({
    message: result.error.msg,
  });
};
```

### Step 9: Set Up Routes

```typescript
// src/modules/{module}/adapter/driving/routes.ts
import { Router } from "express";
import * as EntityHandlers from "./http-handlers";
import { createEntitySchema } from "../../core/use-cases/dtos/create-{entity}-dto";
import { genericValidator } from "../../../../shared/middlewares/generic-validator";

export const entityRouter = Router();
export const path = "/api/{entity}";

entityRouter.post(
  `${path}/create`,
  genericValidator(createEntitySchema),
  EntityHandlers.createEntityHandler
);
```

## 🔧 Key Principles

### 1. **Dependency Inversion**

- Core business logic should not depend on infrastructure
- Dependencies flow inward toward the core
- Use interfaces (ports) to define contracts

### 2. **Functional Programming**

- Use pure functions with dependency injection
- Avoid classes and state
- Use higher-order functions for dependency injection

### 3. **Single Responsibility**

- Each use case in its own file
- Each adapter handles one external dependency
- Clear separation of concerns

### 4. **Testability**

- Easy to mock interfaces
- Pure functions are easier to test
- Dependency injection enables unit testing

## 🧪 Testing Strategy

### Unit Testing Use Cases

```typescript
import { createEntityUseCase } from "./create-entity";

describe("createEntityUseCase", () => {
  const mockRepository = {
    createEntity: jest.fn(),
  };

  const createEntity = createEntityUseCase(mockRepository);

  it("should create entity successfully", async () => {
    const mockEntity = { id: "1", name: "Test" };
    mockRepository.createEntity.mockResolvedValue(mockEntity);

    const result = await createEntity({ name: "Test" });

    expect(result.kind).toBe("success");
    expect(mockRepository.createEntity).toHaveBeenCalledWith({ name: "Test" });
  });
});
```

### Integration Testing

```typescript
import { EntityUseCases } from "./entity-module";

describe("EntityUseCases Integration", () => {
  it("should create and retrieve entity", async () => {
    const createResult = await EntityUseCases.createEntity({ name: "Test" });
    expect(createResult.kind).toBe("success");

    const entity = createResult.value.entity;
    const retrieveResult = await EntityUseCases.findById(entity._id);
    expect(retrieveResult.kind).toBe("success");
  });
});
```

## 🚀 Adding New Use Cases

### 1. Create Use Case File

```typescript
// src/modules/{module}/core/use-cases/delete-{entity}.ts
export const deleteEntityUseCase =
  (entityRepository: IEntityRepository) =>
  async (id: string): Promise<Result<Success, GenericError>> => {
    // Implementation
  };
```

### 2. Add to Module

```typescript
// src/modules/{module}/core/{module}-module.ts
export const EntityUseCases = {
  createEntity: createEntityUseCase(entityRepository),
  updateEntity: updateEntityUseCase(entityRepository),
  deleteEntity: deleteEntityUseCase(entityRepository), // ✅ New use case
};
```

### 3. Export from Index

```typescript
// src/modules/{module}/core/use-cases/use-cases.ts
export { deleteEntityUseCase } from "./delete-{entity}";
```

### 4. Add Handler

```typescript
// src/modules/{module}/presentation/{module}-handlers.ts
export const deleteEntityHandler = async (req: Request, res: Response) => {
  const result = await EntityUseCases.deleteEntity(req.params.id);
  // Handle response
};
```

## 📋 Checklist for New Modules

- [ ] Create domain entities with Zod schemas
- [ ] Define DTOs for input validation
- [ ] Create repository interface (port)
- [ ] Implement repository adapter
- [ ] Create individual use case files
- [ ] Set up module factory with dependency injection
- [ ] Export use cases from index
- [ ] Create HTTP handlers (driving adapters)
- [ ] Set up routes (driving adapters)
- [ ] Add API documentation
- [ ] Write unit tests
- [ ] Write integration tests

## 🎯 Benefits

1. **Maintainability**: Clear separation of concerns
2. **Testability**: Easy to mock dependencies
3. **Flexibility**: Easy to swap implementations
4. **Scalability**: Easy to add new features
5. **Type Safety**: Full TypeScript support
6. **Functional**: Pure functions with no side effects

This architecture provides a solid foundation for building maintainable, testable, and scalable applications! 🎉
