flowchart TD
    %% Main Components
    Form[SubjectForm.tsx]
    Schema[Subject Schema]
    Actions[Server Actions]
    DB[(Database)]

    %% Data Flow with Function Names
    Form -->|"1. handleSubmit()\nonSubmit()"| Schema
    Schema -->|"2. subjectSchema\nvalidation"| Actions
    Actions -->|"3. createSubject()\nupdateSubject()\ndeleteSubject()"| DB
    DB -->|"4. Query Results"| Actions
    Actions -->|"5. Success/Error"| Form

    %% Styling
    classDef frontend fill:#b3e0ff,stroke:#333,stroke-width:2px
    classDef validation fill:#ffe0b3,stroke:#333,stroke-width:2px
    classDef backend fill:#b3ffb3,stroke:#333,stroke-width:2px
    classDef database fill:#ffb3b3,stroke:#333,stroke-width:2px

    class Form frontend
    class Schema validation
    class Actions backend
    class DB database

    %% Data Structure
    subgraph "Subject Data"
        direction TB
        data[/"name: string
        teachers: string[]"/]
    end
