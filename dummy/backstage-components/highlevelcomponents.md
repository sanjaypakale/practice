High-Level Architecture Diagram
Your architecture diagram should include the following components:

Users → Access the Backstage UI (React-based)
Keycloak → Handles authentication & authorization
Backstage Backend (Node.js API Server)
Communicates with PostgreSQL Database
Fetches data from Version Control (GitHub, GitLab, Bitbucket)
Integrates with CI/CD tools, SonarQube, JIRA, Kubernetes
Renders documentation via TechDocs
External Systems → Connected via plugins (e.g., Jenkins, Kubernetes, SonarQube)
