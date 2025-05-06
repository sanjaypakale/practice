CREATE TABLE "application_ear"(
    "id" BIGINT NOT NULL,
    "appCode" VARCHAR(255) NOT NULL,
    "applicationName" VARCHAR(255) NOT NULL,
    "l2Code" VARCHAR(255) NOT NULL,
    "l2Name" VARCHAR(255) NOT NULL,
    "l3Code" VARCHAR(255) NOT NULL,
    "l3Name" VARCHAR(255) NOT NULL,
    "division" VARCHAR(255) NOT NULL,
    "createdby" VARCHAR(50) NOT NULL,
    "createdDate" DATETIME2 NOT NULL,
    "modifiedby" VARCHAR(50) NULL,
    "modifiedDate" DATETIME2 NULL,
    "isActive" BIT NOT NULL
);
ALTER TABLE
    "application_ear" ADD CONSTRAINT "application_ear_id_primary" PRIMARY KEY("id");
CREATE UNIQUE INDEX "application_ear_appcode_unique" ON
    "application_ear"("appCode");
ALTER TABLE
    "application_ear" ADD CONSTRAINT "application_ear_id_primary" PRIMARY KEY("id");
CREATE TABLE "users"(
    "id" BIGINT NOT NULL,
    "lanId" VARCHAR(10) NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "createdby" VARCHAR(50) NOT NULL,
    "createdDate" DATETIME2 NOT NULL,
    "modifiedBy" VARCHAR(50) NULL,
    "modifiedDate" DATETIME2 NULL,
    "lastLoggedIn" DATETIME2 NULL,
    "isActive" BIT NOT NULL
);
ALTER TABLE
    "users" ADD CONSTRAINT "users_id_primary" PRIMARY KEY("id");
ALTER TABLE
    "users" ADD CONSTRAINT "users_id_primary" PRIMARY KEY("id");
CREATE TABLE "user_app_mapping"(
    "id" BIGINT NOT NULL,
    "app_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "isActive" BIT NOT NULL
);
ALTER TABLE
    "user_app_mapping" ADD CONSTRAINT "user_app_mapping_id_primary" PRIMARY KEY("id");
ALTER TABLE
    "user_app_mapping" ADD CONSTRAINT "user_app_mapping_id_primary" PRIMARY KEY("id");
CREATE TABLE "role_master"(
    "id" BIGINT NOT NULL,
    "roleName" VARCHAR(100) NOT NULL,
    "roleCode" VARCHAR(50) NOT NULL,
    "createdBy" VARCHAR(50) NOT NULL,
    "createdDate" DATETIME2 NOT NULL,
    "modifiedBy" VARCHAR(50) NULL,
    "modifiedDate" DATETIME2 NOT NULL,
    "isActive" BIT NOT NULL
);
ALTER TABLE
    "role_master" ADD CONSTRAINT "role_master_id_primary" PRIMARY KEY("id");
ALTER TABLE
    "role_master" ADD CONSTRAINT "role_master_id_primary" PRIMARY KEY("id");
CREATE TABLE "user_role_mapping"(
    "id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "role_id" BIGINT NOT NULL
);
ALTER TABLE
    "user_role_mapping" ADD CONSTRAINT "user_role_mapping_id_primary" PRIMARY KEY("id");
ALTER TABLE
    "user_role_mapping" ADD CONSTRAINT "user_role_mapping_id_primary" PRIMARY KEY("id");
CREATE TABLE "devops_onboarding"(
    "id" BIGINT NOT NULL,
    "app_id" BIGINT NOT NULL,
    "module_name" VARCHAR(100) NOT NULL,
    "bitbucket_project_key" VARCHAR(50) NOT NULL,
    "bitbucket_repository_name" NVARCHAR(255) NOT NULL,
    "sonarqube_project_key" VARCHAR(200) NOT NULL,
    "createdBy" VARCHAR(50) NOT NULL,
    "createdDate" DATETIME2 NOT NULL,
    "modifiedBy" VARCHAR(50) NULL,
    "modifiedDate" DATETIME2 NULL,
    "isActive" BIT NOT NULL
);
ALTER TABLE
    "devops_onboarding" ADD CONSTRAINT "devops_onboarding_id_primary" PRIMARY KEY("id");
ALTER TABLE
    "devops_onboarding" ADD CONSTRAINT "devops_onboarding_id_primary" PRIMARY KEY("id");
CREATE TABLE "sonarqube_app_mapping"(
    "id" BIGINT NOT NULL,
    "app_id" BIGINT NOT NULL,
    "sonarqube_project_key" VARCHAR(200) NOT NULL,
    "createdBy" VARCHAR(50) NOT NULL,
    "createdDate" DATETIME2 NOT NULL,
    "modifiedBy" VARCHAR(50) NULL,
    "modifiedDate" DATETIME2 NULL,
    "isActive" BIT NOT NULL
);
ALTER TABLE
    "sonarqube_app_mapping" ADD CONSTRAINT "sonarqube_app_mapping_id_primary" PRIMARY KEY("id");
CREATE TABLE "artifactory_app_mapping"(
    "id" BIGINT NOT NULL,
    "app_id" BIGINT NOT NULL,
    "artifactory_repository" VARCHAR(100) NOT NULL,
    "createdBy" VARCHAR(50) NOT NULL,
    "createdDate" DATETIME2 NOT NULL,
    "modifiedBy" VARCHAR(50) NULL,
    "modifiedDate" DATETIME2 NULL,
    "isActive" BIT NOT NULL
);
ALTER TABLE
    "artifactory_app_mapping" ADD CONSTRAINT "artifactory_app_mapping_id_primary" PRIMARY KEY("id");
CREATE TABLE "app_devtools_mapping"(
    "id" BIGINT NOT NULL,
    "app_id" BIGINT NOT NULL,
    "jenkins_instance" VARCHAR(100) NOT NULL,
    "sonar_instance" VARCHAR(100) NOT NULL,
    "artifactory_instance" VARCHAR(100) NOT NULL,
    "veracode_instance" VARCHAR(100) NOT NULL,
    "bitbucket_instance" VARCHAR(100) NOT NULL,
    "createdBy" VARCHAR(50) NOT NULL,
    "createdDate" DATETIME2 NOT NULL,
    "modifiedBy" VARCHAR(50) NULL,
    "modifiedDate" DATETIME2 NULL,
    "isActive" BIT NOT NULL
);
ALTER TABLE
    "app_devtools_mapping" ADD CONSTRAINT "app_devtools_mapping_id_primary" PRIMARY KEY("id");
ALTER TABLE
    "app_devtools_mapping" ADD CONSTRAINT "app_devtools_mapping_id_primary" PRIMARY KEY("id");
CREATE TABLE "bitbucket_app_mapping"(
    "id" BIGINT NOT NULL,
    "app_id" BIGINT NOT NULL,
    "bitbucket_project_key" VARCHAR(100) NOT NULL,
    "createdBy" VARCHAR(50) NOT NULL,
    "createdDate" DATETIME2 NOT NULL,
    "modifiedBy" VARCHAR(50) NULL,
    "modifiedDate" DATETIME2 NULL,
    "isActive" BIT NOT NULL
);
CREATE INDEX "bitbucket_app_mapping_id_index" ON
    "bitbucket_app_mapping"("id");
ALTER TABLE
    "bitbucket_app_mapping" ADD CONSTRAINT "bitbucket_app_mapping_id_primary" PRIMARY KEY("id");
CREATE TABLE "selfservice_request"(
    "id" BIGINT NOT NULL,
    "request_id" uniqueidentifier NOT NULL,
    "request_json" NVARCHAR(1000) NOT NULL,
    "status" VARCHAR(100) NOT NULL,
    "approver_lanId" VARCHAR(50) NOT NULL,
    "createdBy" VARCHAR(50) NOT NULL,
    "createdDate" DATETIME2 NOT NULL,
    "modifedBy" VARCHAR(50) NOT NULL,
    "modifiedDate" DATETIME2 NOT NULL,
    "isActive" BIT NOT NULL
);
ALTER TABLE
    "selfservice_request" ADD CONSTRAINT "selfservice_request_id_primary" PRIMARY KEY("id");
CREATE TABLE "jenkins_agent"(
    "id" BIGINT NOT NULL,
    "app_id" BIGINT NOT NULL,
    "agentName" VARCHAR(200) NOT NULL,
    "createdBy" VARCHAR(50) NOT NULL,
    "createdDate" DATETIME2 NOT NULL,
    "modifiedBy" VARCHAR(50) NULL,
    "modifiedDate" DATETIME2 NULL,
    "isActive" BIT NOT NULL
);
ALTER TABLE
    "jenkins_agent" ADD CONSTRAINT "jenkins_agent_id_primary" PRIMARY KEY("id");
ALTER TABLE
    "jenkins_agent" ADD CONSTRAINT "jenkins_agent_id_primary" PRIMARY KEY("id");
