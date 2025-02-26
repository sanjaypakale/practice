### **Updated Access Control Workflow with EAR System Integration**  

Since **Backstage will be integrated with the Enterprise Access Request (EAR) system**, the access workflow should align with EAR’s **registered applications and tagged Application Owners (AOs)**.  

---

## **1. Access Control Design**  
### **Roles & Responsibilities**  
- **Developers** – Can request access to applications registered in EAR.  
- **Application Owners (AO)** – Approve or reject access requests for apps they own.  
- **EAR System** – Maintains **app registry, AO mapping, and access control policies**.  
- **Backstage** – Provides a **self-service UI** for managing access requests.  

### **Access Levels**
| **Level** | **Description** |
|-----------|---------------|
| **No Access** | Developers have no access by default. |
| **Requestable Access** | Developers can see and request access to apps based on EAR. |
| **Approved Access** | Once AOs approve, Backstage grants access and logs the action. |
| **Time-Limited Access** | Option to grant access for a fixed period (e.g., 7, 30 days). |

---

## **2. Approval Workflow**
1. **Developer Logs into Backstage**
   - Backstage fetches **available applications** and **AOs** from EAR.
   - Developer sees **only requestable apps** based on EAR policies.

2. **Developer Requests Access**
   - Selects an app and submits a request with a **justification**.
   - Backstage sends a **notification to the AO** for approval.

3. **AO Approval via Backstage**
   - AO receives **notification (Email, Teams, Backstage UI)**.
   - AO approves or rejects the request **inside Backstage**.

4. **Backstage Assigns Access & Logs Audit**
   - If approved, Backstage assigns access and logs the action.
   - If rejected, the developer receives a **notification**.

---

## **3. System Integration**
### **Data Flow**
```plaintext
Backstage → Fetch Apps & AOs → EAR System
Developer → Request Access → Backstage
Backstage → Send Notification to AO → Email/Teams
AO → Approve/Revoke Access → Backstage
Backstage → Assign Access & Log Audit → Database
```

### **Integration Points**
| **Feature** | **Source System** | **Integration Approach** |
|------------|------------------|--------------------------|
| **App Registry** | EAR System | REST API/GraphQL |
| **AO Mapping** | EAR System | Sync via API |
| **Request Submission** | Backstage | Internal Workflow |
| **Approval Processing** | Backstage UI | AO Action |
| **Access Assignment** | Backstage | Database Update |
| **Audit Logging** | Backstage | PostgreSQL / Logging System |

---

## **4. Automated Notifications**
### **Channels & Triggers**
| **Event** | **Recipient** | **Channels** |
|----------|-------------|--------------|
| Access Request Submitted | AO | Email, Teams, Backstage |
| Request Approved | Developer | Email, Teams, Backstage |
| Request Rejected | Developer | Email, Teams, Backstage |
| Access Expiry Reminder | Developer, AO | Email, Backstage |

### **Implementation Approach**
- **Email**: SMTP or Notification Service  
- **Microsoft Teams**: Incoming Webhooks  
- **Backstage UI Notifications**: Plugin with PostgreSQL  

---

## **5. Enhancements**
1. **Auto-Revoke Expired Access**  
   - Backstage can enforce automatic revocation after expiry.  
2. **Audit Logging**  
   - Store approval logs in Backstage and expose them via UI.  
3. **RBAC Enforcement**  
   - Developers only see **apps they are allowed to request** based on EAR policies.  
4. **ChatOps Integration**  
   - Allow access requests/approvals via **Slack or Teams bot**.

---

## **Final Outcome**
✅ **Seamless EAR Integration** – Single source of truth for applications & approvals.  
✅ **Automated Workflows** – Reduced manual approval overhead.  
✅ **Secure & Compliant** – Full audit trail and role-based access control.

Would you like a **detailed API design for Backstage-EAR integration**? 🚀


### Current Design
- Developers request access to applications manually.
- All applications are manually added in the Developer Portal.
- No L4 mapping in the Developer Portal.
- Once a developer requests access to an application code, a Jira ticket is created under the **DCICD Jira project**.
- Anyone in the **reviewer group** within DCICD can approve the ticket.
- A Jira webhook is integrated with the Developer Portal.
- After approval of the Jira ticket, the request is processed or rejected.

### Limitations of the Current Flow
1. **Manual Application Management**: Applications must be manually added to the Developer Portal, increasing administrative overhead.
2. **No Direct Integration with EAR**: Applications and their respective Application Owners (AOs) are not dynamically fetched from the Enterprise Access Request (EAR) system.
3. **No Role-Based Mapping**: Lack of L4 mapping in the Developer Portal results in unclear access control.
4. **Jira-Based Approval Bottlenecks**: Approval is tied to Jira workflows, which may introduce delays and dependencies on reviewer groups.
5. **Limited Automation**: While webhooks exist, there is no automated access assignment or real-time synchronization with EAR.
6. **Scalability Concerns**: Managing approvals via Jira may not scale well with an increasing number of applications and users.

### Proposed Flow (Backstage + EAR Integration)
- Backstage fetches applications and AOs dynamically from EAR.
- Developers send access requests from Backstage by selecting EAR-registered apps.
- Backstage sends a notification to the respective AO for approval or rejection.
- Upon approval, Backstage assigns access and logs the action for auditing.
- Improved automation and reduced dependency on Jira for access management.



