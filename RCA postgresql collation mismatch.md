Got it! Here’s the **polished and management-ready version of the RCA**, with the updated **Resolution (Temporary & Permanent Fix)**.

---

# **Root Cause Analysis (RCA)**

**Issue Title:**
Backstage failed to start in PROD due to PostgreSQL collation version mismatch during plugin database creation.

---

## 🔍 **Summary:**

During the deployment of a new version of Backstage in the **Production environment**, the application failed to start due to a **PostgreSQL collation version mismatch error** encountered while attempting to create a new plugin-specific database (`backstage_plugin_kubernetes`). This issue was not observed in SIT and UAT environments.

---

## 🧨 **Error Observed:**

```
CREATE DATABASE backstage_plugin_kubernetes template database "template1" has a collation version mismatch
```

---

## 🛠️ **Root Cause:**

* PostgreSQL uses `template1` as a base template for creating new databases.
* Each database stores a **collation version** (derived from the glibc/ICU of the OS) in its metadata at creation time.
* In **PROD**, the PostgreSQL instance was **upgraded from version 14.0 to 17.5** as part of a broader upgrade driven by the **Xray DB team**, as Backstage shares the same DB server.
* The PostgreSQL upgrade also brought in a **newer glibc collation version**.
* However, the existing `template1` database was **not refreshed post-upgrade**, resulting in a mismatch between its stored collation version and the system’s actual glibc version.
* PostgreSQL, as a safety mechanism, blocked the creation of new databases using the outdated `template1` template to prevent potential data inconsistencies.
* This issue was **not anticipated by the Backstage team**, as the PostgreSQL upgrade was executed independently by the Xray DB administrators.

---

## 🔎 **Why This Issue Did Not Occur in SIT/UAT:**

* SIT and UAT PostgreSQL environments were still running **PostgreSQL version 14.0**, aligned with the last deployed version of Backstage.
* The **PostgreSQL 17.5 upgrade** was applied **only in Production**.
* As SIT and UAT environments continued operating with the older glibc and `template1` versions, no collation version mismatches occurred.
* Additionally, SIT and UAT PostgreSQL servers are **dedicated instances for Backstage**, while Production PostgreSQL is a **shared DB server (Xray & Backstage)**, which introduced this dependency gap.

---

## ✅ **Resolution:**

### 🔧 **Temporary Fix (Hotfix):**

* A **Change Request (CR)** was raised for the Xray Production DB server to execute the following PostgreSQL command:

  ```sql
  ALTER DATABASE template1 REFRESH COLLATION VERSION;
  ```

  * This command refreshed the `datcollversion` metadata of `template1` to match the current glibc version.
  * Post-execution, Backstage was able to create the required plugin database successfully.
  * This fix allowed the immediate Production deployment to proceed.

### 🏗️ **Permanent Fix (Long-term Solution):**

* A strategic decision was made to provision a **dedicated PostgreSQL Production DB server exclusively for Backstage**.
* The Backstage application will be **migrated to this new dedicated DB server**, ensuring:

  * Isolation from other applications’ DB operations (e.g., Xray).
  * Full control over PostgreSQL upgrades, configurations, and maintenance.
  * Elimination of environment drift issues due to shared infrastructure dependencies.
* The migration plan to the new DB server is in progress, with necessary change management and validation processes.

---

## 🧪 **Impact:**

| Impact Area           | Description                                |
| --------------------- | ------------------------------------------ |
| Affected Environments | Production only                            |
| Services Down         | Backstage Developer Portal failed to start |
| Data Loss             | ❌ No data loss                             |
| Security Risk         | ❌ None                                     |

---

## 📦 **Preventive Actions:**

1. **Decouple shared infrastructure dependencies** for critical applications by provisioning dedicated DB resources.
2. Incorporate **PostgreSQL Collation Version Health Checks** in deployment validations.
3. Automate pre-deployment collation audits using:

   ```sql
   SELECT datname, datcollversion FROM pg_database;
   ```
4. Establish a **joint change governance framework** for shared infrastructure components.
5. Standardize PostgreSQL and OS versions across **SIT, UAT, and PROD** to minimize environment drift.
6. Document the **Collation Refresh Procedure** as part of PostgreSQL upgrade runbooks.
7. Build **infra observability dashboards** for DB version, glibc, and collation metadata tracking.

---

## 📅 **Timeline:**

| Time (SGT) | Event                                                                     |
| ---------- | ------------------------------------------------------------------------- |
| T+0 mins   | Backstage deployment started in PROD                                      |
| T+2 mins   | Application failed with collation version mismatch error                  |
| T+30 mins  | Issue analyzed and root cause identified                                  |
| T+40 mins  | Change Request raised to refresh collation version on PROD DB             |
| T+45 mins  | `ALTER DATABASE template1 REFRESH COLLATION VERSION;` executed            |
| T+50 mins  | Backstage Developer Portal started successfully                           |
| T+1 Day    | Decision to provision a dedicated PROD PostgreSQL DB server for Backstage |

---

## 🧠 **Lessons Learned:**

* PostgreSQL collation version tracking, introduced in 13+, requires **explicit post-upgrade maintenance actions** (e.g., refreshing templates).
* Shared DB environments increase cross-team dependency risks if not governed properly.
* Infrastructure upgrades (OS, PostgreSQL, glibc) must be **assessed holistically across all dependent applications**.
* Lower environments must mirror Production infra to ensure **reliable pre-production validations**.
* Establishing **dedicated DB resources** for critical applications like Backstage eliminates such environment drift risks in the future.

---

### ➡️ Next Steps:

1. Proceed with Backstage Production DB migration to a **dedicated PostgreSQL server**.
2. Establish automated collation and infra health checks across environments.
3. Incorporate collation version refresh into DB upgrade SOPs.

---

Would you like me to also provide a **Management PPT Slide Deck** summarizing this RCA in a presentation format?
