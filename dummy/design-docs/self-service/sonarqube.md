Here’s a **design document** for the **Backstage Self-Service Automation for DevSecOps Tool Access**, covering the use case you described:

---

## 📄 Design Document: Self-Service Automation for DevSecOps Tool Access in Backstage

### 📌 Objective

To provide a unified self-service platform in Backstage for DevOps Engineers and Developers to request access to various DevSecOps tools — **SonarQube**, **Bitbucket**, **JFrog Artifactory**, and **Jenkins** — with automated approvals and access provisioning via integration with the **Enterprise Access Request (EAR)** system.

---

### 🧩 Scope

This document focuses on automating access requests for **SonarQube**. Future enhancements will cover Bitbucket, Artifactory, and Jenkins in a similar pattern.

---

### 👤 User Roles

| Role             | Description |
|------------------|-------------|
| DevOps Engineer / Developer | Requestor who submits access requests |
| L4 Approver       | Application Owner who approves/rejects requests |
| System            | Backstage plugin, EAR integration, and tool-specific service handlers |

---

### 🧭 User Journey

1. **Login** to Backstage.
2. Navigate to **Self-Service** section from the left navigation panel.
3. Select the **SonarQube Access Request** tool.
4. Enter required details:
   - **App Code** (select from dropdown)
   - **SonarQube Project Key** (selectable/autocomplete)
   - **LAN ID(s)** of user(s) needing access
5. Click **Submit Request**.
6. Backstage triggers:
   - **Email Notification** to both Requestor and L4 Approver.
   - **EAR API call** to fetch L4 approver for the selected App Code.
7. L4 Approver logs into Backstage and navigates to **My Approvals**.
8. Approver **Accepts or Rejects** the request.
9. On approval:
   - Access is provisioned to SonarQube.
   - Notification is sent to the requestor.

---

### 🧱 High-Level Architecture

```plaintext
@startuml
start

:DevOps Engineer / Developer logs into Backstage;
:Navigate to 'Self-Service' -> 'SonarQube';

:Select App Code;
:Select SonarQube Project;
:Add LAN ID(s);
:Submit Request;

:Backstage Plugin sends Request to Backend;
:Backend calls EAR API to fetch L4 Approver;
:Store Request in DB;
:Send Email Notification to L4 and Requestor;

stop

== Approval Flow ==

start

:L4 / Delegate L4 logs into Backstage;
:Navigate to 'My Approvals';
:Review Pending Request;

if (Approve?) then (Yes)
    :Backstage Plugin calls Backend with Request ID & APPROVE;
    :Backend calls SonarQube API to grant access;
    :Update request status to 'APPROVED';
    :Send Approval Notification to Requestor;
else (No)
    :Backstage Plugin calls Backend with Request ID & REJECT;
    :Update request status to 'REJECTED';
    :Send Rejection Notification to Requestor;
endif

stop
@enduml

```

---

### 🛠️ Plugin Components

#### 1. **Frontend (React)**
- **Route**: `/self-service/sonarqube`
- **Form Fields**:
  - App Code (dropdown)
  - Project Key (autocomplete or dropdown)
  - LAN ID(s) (table input)
- **Submit Button**
- Displays request status after submission

#### 2. **Backend Plugin (Node.js / TypeScript)**
- **API Endpoints**:
  - `POST /sonarqube/access-request`
  - `GET /approvals` (for L4)
  - `POST /approvals/:id/approve`
  - `POST /approvals/:id/reject`
- **Responsibilities**:
  - Validate inputs
  - Call EAR API to fetch L4 approver
  - Store request in DB
  - Trigger emails
  - Call SonarQube API on approval

---

### 🔒 Security & Authentication

- Use Backstage Identity API to get logged-in user identity
- Role-based access for different routes:
  - DevOps/Developer: Submit requests
  - L4: View & process approvals

---

### 📨 Notifications

- Email sent on request submission and approval/rejection
- Template includes:
  - Requestor name
  - App Code
  - Project Key
  - LAN ID(s)
  - Action (Request/Approval/Rejection)

---

### 🔄 Integration Points

| System     | Purpose |
|------------|---------|
| **EAR API** | Fetch L4 approver based on App Code |
| **SonarQube API** | Grant access to user(s) on approval |
| **Email Service** | Notify users on events |

---

### 📦 Data Model

#### AccessRequest
```json
{
  "id": "UUID",
  "appCode": "APP123",
  "projectKey": "sample-key",
  "lanIds": ["lan1", "lan2"],
  "requestor": "john.doe",
  "approver": "jane.l4",
  "status": "PENDING / APPROVED / REJECTED",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

### 🧪 Testing

- Unit tests for backend endpoints and utility functions
- Integration tests with mock EAR and SonarQube APIs
- E2E test using Cypress for form submission flow

---

### 🚀 Future Enhancements

- Support access requests for:
  - **Bitbucket** (repo-level access)
  - **JFrog Artifactory** (repo & permission targets)
  - **Jenkins** (job-level and folder-level permissions)
- Role-based dynamic forms
- Request history and audit log view

---

Would you like this to be converted into a Markdown file or be turned into a Backstage plugin scaffolding plan next?
