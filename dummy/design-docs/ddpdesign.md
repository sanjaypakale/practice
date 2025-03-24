Here’s a **PlantUML visual diagram** that represents the high-level architecture of how **Backstage** connects with your existing **Spring Boot APIs** and **MS SQL Server**:

---

### 📊 **PlantUML Diagram: Backstage Integration with Developer Portal DB**

```plantuml
@startuml
skinparam componentStyle rectangle

actor Developer as Dev

rectangle "Backstage Developer Portal" {
    [UI Plugin / Frontend] --> [Backend Plugin / Router]
}

rectangle "Java Spring Boot Service" {
    [Backend Plugin / Router] --> [REST API Layer]
    [REST API Layer] --> [Business Logic Layer]
    [Business Logic Layer] --> [MS SQL Repository]
}

database "MS SQL Server" as DB

Dev --> [UI Plugin / Frontend] : Initiate Request
[MS SQL Repository] --> DB : Query / Update Data
DB --> [MS SQL Repository] : Results
[MS SQL Repository] --> [Business Logic Layer]
[Business Logic Layer] --> [REST API Layer]
[REST API Layer] --> [Backend Plugin / Router]
[Backend Plugin / Router] --> [UI Plugin / Frontend] : JSON Response

@enduml
```

---

### 💡 How to Render

You can paste this into any PlantUML editor or renderer like:

- [PlantUML Online Server](https://www.plantuml.com/plantuml/)
- IntelliJ plugin for PlantUML
- VSCode PlantUML extension

---

Let me know if you want to include authentication flows (e.g., OAuth, JWT), CI/CD interactions, or extend this diagram for plugin-specific architecture (frontend + backend plugin separation).
