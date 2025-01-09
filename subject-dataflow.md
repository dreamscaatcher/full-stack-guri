# Subject Data Flow Diagram

```mermaid
graph TD
    %% Frontend Components
    subgraph "Frontend Layer"
        SF[SubjectForm.tsx]
        FM[FormModal.tsx]
        style SF fill:#e1f5fe
        style FM fill:#e1f5fe
    end

    %% Validation & Server Actions
    subgraph "Server Layer"
        VS[formValidationSchemas.ts]
        AC[actions.ts]
        style VS fill:#fff3e0
        style AC fill:#fff3e0
    end

    %% Database Layer
    subgraph "Database Layer"
        PS[Prisma Schema]
        DB[(PostgreSQL DB)]
        style PS fill:#e8f5e9
        style DB fill:#e8f5e9
    end

    %% Data Flow Connections
    SF -->|"1. Form Data"| VS
    VS -->|"2. Validates Data"| AC
    AC -->|"3. Prisma Client"| PS
    PS -->|"4. SQL Queries"| DB
    DB -->|"5. Data Response"| AC
    AC -->|"6. Success/Error"| SF

    %% Function Names
    subgraph "Key Functions"
        direction LR
        F1["SubjectForm Component:
        - onSubmit()
        - handleSubmit()"]
        F2["Validation:
        - subjectSchema
        - SubjectSchema type"]
        F3["Server Actions:
        - createSubject()
        - updateSubject()
        - deleteSubject()"]
        F4["Database Model:
        - Subject {
            id: Int
            name: String
            teachers: Teacher[]
          }"]
    end

    %% Relationships
    SF -.->|"Uses"| F1
    VS -.->|"Defines"| F2
    AC -.->|"Implements"| F3
    PS -.->|"Defines"| F4
```

## Data Flow Description

1. **Frontend Layer**
   - `SubjectForm.tsx` handles form input and submission
   - Uses React Hook Form for form state management
   - Communicates with server through form actions

2. **Validation Layer**
   - `formValidationSchemas.ts` defines Zod schema
   - Validates subject name and teacher relationships
   - Ensures data integrity before server processing

3. **Server Actions Layer**
   - `actions.ts` contains server-side functions
   - Handles CRUD operations (Create, Read, Update, Delete)
   - Manages database transactions through Prisma

4. **Database Layer**
   - Prisma schema defines Subject model
   - Handles many-to-many relationship with Teachers
   - Stores data in PostgreSQL database

## Key Functions and Their Roles

### Frontend Functions (SubjectForm.tsx)
- `onSubmit`: Handles form submission
- `handleSubmit`: React Hook Form submission handler
- Uses `useFormState` for server action state management

### Validation (formValidationSchemas.ts)
```typescript
export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1),
  teachers: z.array(z.string())
});
```

### Server Actions (actions.ts)
```typescript
export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  // Creates new subject with teacher connections
}

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  // Updates existing subject and teacher relationships
}

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  // Deletes subject and removes relationships
}
```

### Database Schema (schema.prisma)
```prisma
model Subject {
  id       Int       @id @default(autoincrement())
  name     String    @unique
  teachers Teacher[]
  lessons  Lesson[]
}
