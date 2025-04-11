@startuml
|DevOps Engineer / Developer|
start
:Login to Backstage;
:Navigate to Self-Service -> SonarQube;
:Select App Code;
:Select SonarQube Project;
:Add LAN ID(s);
:Submit Request;

|Backstage Plugin|
:Send request to backend;
:Call EAR API to get L4 approver;
:Store request in DB;
:Send email notification to L4 and Requestor;

|L4 / Delegate L4|
:Login to Backstage;
:Navigate to My Approvals;
:View Pending Request;
:Approve or Reject Request;

|Backstage Backend|
if (Approved?) then (yes)
  :Call SonarQube API to add LAN ID(s) to group;
  :Update request status to APPROVED;
  :Send approval notification to Requestor;
else
  :Update request status to REJECTED;
  :Send rejection notification to Requestor;
endif

stop
@enduml
