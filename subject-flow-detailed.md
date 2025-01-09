graph TD
    %% Components with specific functions
    Form["SubjectForm.tsx
    ------------------
    onSubmit()
    handleSubmit()"]
    
    Schema["Subject Schema
    ------------------
    name: string
    teachers: string[]"]
    
    Actions["Server Actions
    ------------------
    createSubject()
    updateSubject()
    deleteSubject()"]
    
    DB["PostgreSQL
    ------------------
    Subject Table
    - id: Int
    - name: String
    - teachers: Teacher[]"]

    %% Data flow with specific payloads
    Form -->|"Form Data
    {
      name: string,
      teachers: string[]
    }"| Schema
    
    Schema -->|"Validated Data
    {
      name: string,
      teachers: string[]
    }"| Actions
    
    Actions -->|"Prisma Query
    subject.create({
      data: {
        name,
        teachers: { connect }
      }
    })"| DB
    
    DB -->|"Database Response
    {
      id: number,
      name: string,
      teachers: Teacher[]
    }"| Actions
    
    Actions -->|"Response State
    {
      success: boolean,
      error: boolean
    }"| Form

    %% Styling
    classDef component fill:#f9f9f9,stroke:#333,stroke-width:2px
    classDef data fill:#e1f5fe,stroke:#333,stroke-width:2px
    
    class Form,Schema,Actions,DB component
    class Form data
