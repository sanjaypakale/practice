@startuml
actor DevOpsEngineer as Dev
actor L4Approver as L4
participant Backstage_UI as UI
participant Backstage_Backend as Backend
participant SonarQube

Dev -> UI : Login
Dev -> UI : Select App Code,\nSelect SonarQube Projects,\nEnter LAN ID
Dev -> UI : Submit Request
UI -> Backend : Store request with status 'Pending'
Backend -> L4 : Send Notification
Backend -> Dev : Send Notification (Request Submitted)

L4 -> UI : Login
L4 -> UI : View Pending Requests
L4 -> UI : Approve / Reject

alt Approved
    UI -> Backend : Process Approval (Request ID)
    Backend -> SonarQube : Add user to respective group
    SonarQube --> Backend : Success response
    Backend -> Dev : Send Notification (Approved)
else Rejected
    UI -> Backend : Process Rejection (Request ID)
    Backend -> Dev : Send Notification (Rejected)
end
@enduml
