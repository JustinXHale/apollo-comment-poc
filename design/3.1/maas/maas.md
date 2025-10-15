# Models-as-a-Service (MaaS)

Target version: 3.1
UXD Orientation doc: https://docs.google.com/document/d/10IIWRpETdRIDzQiPIvHSzCBj3bwq02fE0mGOEtVwjBw/edit?tab=t.0
NotebookLM: https://notebooklm.google.com/notebook/7c5d493a-85b8-438d-b1d9-aeab507c63a7
Journey map: https://miro.com/app/board/uXjVIgQDVWw=/

## Design TODOs

- In the Endpoints popover, display Internal Endpoint optionally with less emphasis, default to External endpoint and API key toggle, also include link button to view code examples in various languages
- Add the ability to connect an external model provider's API endpoint as an AI Asset potentially
- Integration of multiple API Keys in the AI Assets area
- Tiers
- Add "Make available as AI Asset" to the Model Deployments area
- Add baseline Tiers out of the box (e.g. Tier 0, Tier 1)
- Show quota total remaining for a key
- Add support for throttling after the quota

## Jira-based Design TODOs

Based on Jira issues RHOAISTRAT-638, RHOAIUX-996, RHOAISTRAT-639, RHAIRFE-151, RHAIRFE-608, RHOAISTRAT-703, RHAIRFE-244, RHAIRFE-138, and RHOAISTRAT-650:

### Platform Admin Experience (RHOAISTRAT-638, RHAIRFE-138, RHOAIUX-996)
1. **Tenant/User Management Dashboard** - Interface to onboard tenants, assign quotas, and manage user access
2. **Model Catalog Management** - Add, remove, and update models in the public catalog with immediate availability
3. **System-Wide Monitoring Dashboard** - Real-time view of platform health, total requests, token consumption, error rates
4. **System-Level Policies Configuration** - Interface for default quota limits, access controls, and system policies
5. **RBAC Management Interface** - Create/manage roles (model-consumer, model-owner), assign users/groups to roles, visualize permissions per model
6. **Audit Trail Visualization** - Clear audit trail of changes to model permissions and system configurations

### AI Engineer Experience - AI Available Assets (RHAIRFE-151, RHAIRFE-608)
1. **AI Available Assets Page** - Unified discovery page for models and MCP servers with tabs for each asset type
2. **Model Endpoint Discovery** - Display internal/external API endpoints, service tokens, LLS registration status, use cases, and actions
3. **MCP Server Endpoint Discovery** - Display MCP server name, source, endpoints, tools, registration status, use cases
4. **LLS Registration Workflow** - Register models/MCP servers with Llama Stack Server, wizard to configure LLS in project namespace
5. **AI Playground Integration** - Token pass-through from assets to playground for seamless interaction
6. **MaaS Model Toggle in Deployments** - Admin toggle to make model available as MaaS (globally accessible across projects)
7. **Project/Namespace Scoping** - Filter assets by selected project, with future support for global cluster-wide view
8. **Add Asset Functionality** - "Add Asset" button to add external models, model deployments, or MCP servers

### API Keys Management (RHAIRFE-244, RHAIRFE-138)
1. **API Keys List Page** - Table with columns for Name, Status, API Key (masked), Assets, Owner, Last Used, Expiration Date
2. **Create API Key Modal** - Form with Name, Description, Owner selection, Limits/Policies section (token/rate limits, budget, expiration)
3. **API Key Details Page** - Five tabs: Details, Assets, Metrics, Policies, Settings
4. **Details Tab** - Display key metadata (name, description, dates, key value with copy)
5. **Assets Tab** - Collapsible sections for Models, MCP Servers, Vector Databases, Agents with endpoints
6. **Metrics Tab** - Charts for Total Requests, Success Rate, Total Tokens, Total Cost with time range selector and Perses link
7. **Policies Tab** - Table of applied policies with Name, ID, Description, and Type columns (AuthPolicy, RateLimitPolicy, TLSPolicy, DNSPolicy)
8. **Settings Tab** - Danger zone with delete functionality and confirmation modal
9. **API Key Actions** - Dropdown menu with "View details" and "Delete API key" options
10. **Status Labels** - Active (green), Expired (red), Disabled (grey)
11. **ISV Key Storage** - Store third-party ISV keys for MCP server authentication (GitHub, Atlassian, Asana, etc.)

### Policies Management (RHAIRFE-244, RHOAISTRAT-639)
1. **Policies List Page** - Table with Name, Description, Status, Targets, Rules columns
2. **Create Policy Modal** - Fields for Name, Description, Available Assets (Models/MCP dropdowns), Limits (Token/Rate/Time), Targets (Groups/Users/Service Accounts)
3. **Policy Details Page** - Details tab displaying all policy configuration
4. **Policy Actions** - View, Edit, Activate/Deactivate, Delete
5. **Policy Types** - Support for AuthPolicy, RateLimitPolicy, TLSPolicy, DNSPolicy (Kuadrant.io types)
6. **Rate Limiting Enforcement** - Token-based rate limiting, request-based rate limiting
7. **RBAC Integration** - Model-level RBAC, user/group access controls

### Observability & Monitoring (RHOAISTRAT-650)
1. **Unified Platform Dashboard** - Cluster-level and model-level metrics with cross-runtime consistency
2. **Model Inventory Overview** - Table showing all deployed models with status, resources, performance metrics
3. **Model-Level Performance Analysis** - Per-model request volumes, latency distributions, error rates, resource consumption
4. **Platform Health Summary** - Overall error rates, service availability, performance KPIs, alert status
5. **API Key-Filtered Dashboard** - AI Engineer view filtered by specific API keys showing performance and usage
6. **Usage Tracking Metrics** - Requests per time period, tokens per user/group/key, top consumers
7. **Reference Grafana Implementation** - Initial delivery as Grafana dashboards, future embedded UI
8. **Perses Dashboard Integration** - Link to view detailed dashboards in Perses

### MaaS Integration (RHOAISTRAT-639, RHAIRFE-608)
1. **API Gateway Support** - Token validation, rate limiting, security enforcement through RHCL or alternative gateways
2. **MaaS Dev Preview Toggle** - Checkbox in Deploy Model Wizard: "Make this deployment available globally for models as a service"
3. **External Model Provider Support** - Ability to add external AI providers (OpenAI, Anthropic) as AI Assets
4. **Usage Quota Management** - Track and enforce token consumption limits per user/key
5. **Global vs Project Scope** - MaaS models visible globally across all projects, non-MaaS scoped to namespace
6. **Generate/Regenerate API Keys** - Feature flag for API key generation in model endpoint modals
7. **Chargeback/Cost Tracking** - Track costs per token, per user, per model for billing purposes

## Remaining Jira-based Design TODOs

### ✅ IMPLEMENTED (Present in Prototype)

#### AI Available Assets Page (RHAIRFE-151, RHAIRFE-608)
- ✅ AI Available Assets page with Models and MCP Servers tabs (`/gen-ai-studio/asset-endpoints`)
- ✅ Model endpoint discovery with internal/external endpoints, tokens, and copyable values
- ✅ MCP server endpoint discovery with tools and descriptions
- ✅ Project/namespace scoping with project selector dropdown
- ✅ "Add Asset" button functionality
- ✅ Search and filter capabilities for models and MCP servers
- ✅ Integration with AI Playground (token pass-through)
- ✅ Status indicators (registered vs not-registered for LLS)

#### API Keys Management (RHAIRFE-244, RHAIRFE-138)
- ✅ API Keys list page (`/gen-ai-studio/api-keys`) with proper column structure
- ✅ Status column with Active/Expired/Disabled labels (green/red/grey)
- ✅ Last Used column with relative time display
- ✅ Expiration Date column
- ✅ API Key column with masked values (sk-1234...)
- ✅ Assets column showing badge counts for Models, MCP, Vector DBs, Agents
- ✅ Owner column displaying owner type (User/Group/Service Account)
- ✅ Actions dropdown with "View details" and "Delete API key" options
- ✅ Create API Key modal with Name, Description, Owner, Limits, AI Asset Access sections
- ✅ API Key Details page with five tabs (Details, Assets, Metrics, Policies, Settings)
- ✅ Details tab with description list of key metadata
- ✅ Assets tab with collapsible sections for Models, MCP Servers, Vector DBs, Agents
- ✅ Metrics tab with usage cards (Total Requests, Success Rate, Total Tokens, Total Cost) and time range selector
- ✅ Policies tab with table showing Policy Name, ID, Description, Type
- ✅ Settings tab with Danger Zone and delete confirmation modal
- ✅ Delete API Key modal following PatternFly 6 patterns with name confirmation

#### Policies Management (RHAIRFE-244, RHOAISTRAT-639)
- ✅ Policies list page (`/settings/policies`) with proper table structure
- ✅ Columns for Name, Status, Targets (Groups/Users/Service Accounts), Rules
- ✅ Create Policy modal with Name, Description, Available Assets, Limits, Targets sections
- ✅ Policy Details page (`/settings/policies/:id`) with Details tab
- ✅ Policy actions: View details, Edit, Activate/Deactivate, Delete
- ✅ Badge displays for target counts and rule summaries

#### Model Deployments (RHOAISTRAT-639, RHAIRFE-608)
- ✅ Deploy Model Wizard (`/ai-hub/deployments/deploy`)
- ✅ "Make available as AI asset" checkbox (Tech Preview label)
- ✅ "Make available globally for models as a service" checkbox (Developer Preview label)
- ✅ Advanced settings section in wizard
- ✅ Deployments list page (`/ai-hub/deployments`)

#### Observability (RHOAISTRAT-650)
- ✅ Observe & Monitor Dashboard (`/observe-monitor/dashboard`) with multiple tabs
- ✅ Usage (MaaS) tab with model deployment table
- ✅ Model-level metrics display (requests, latency, error rates)
- ✅ Charts for usage trends and top consumers
- ✅ API Key column in model deployment table
- ✅ MaaS badge/tag on deployments
- ✅ Platform health metrics (Total Requests, Error Rate, Avg Latency, Total Cost, Total Tokens)

### ✅ Completed work items (All items completed!)

#### API Keys (4/4 - RHAIRFE-244)
- ✅ Added "Personal Key" as first item in API Keys List  
- ✅ Added expired status key to API keys list
- ✅ Added "Disable/Enable API key" action to kebab menu
- ✅ Added "Usage Example" section with curl sample in API Key Details

#### AI Playground (1/1)
- ✅ Added "API key" dropdown to AI Playground sidebar with "Playground key (free)" as default

#### Policies (11/11 - RHAIRFE-244, RHOAISTRAT-639)
- ✅ Added "Type" column to Policies table with Kuadrant.io types (AuthPolicy, RateLimitPolicy, TLSPolicy, DNSPolicy)
- ✅ Added "Git source" field to Policy Details tab with hyperlink or "None"
- ✅ Added info alert for git-managed policies  
- ✅ Made action kebab menu openable with "View details", "Disable/Enable policy", "Edit policy", and "Delete policy" options
- ✅ Added "Edit policy" modal (editing disabled for git-managed policies)
- ✅ Added "Delete policy" confirmation modal with name verification
- ✅ Displayed number of keys that the policy applies to in Details page
- ✅ Added "YAML" tab to Policy Details page displaying full Kuadrant.io YAML
- ✅ Displayed rate limit and quota for RateLimitPolicy on Details page
- ✅ Added "Quota renewal schedule" setting for RateLimitPolicies with modal for configuration
- ✅ Added "Over-limit behavior" setting for RateLimitPolicies (Hard/Soft with throttle percentage)

#### AI Assets (6/6)
- ✅ Changed column from "Model deployment name" to "Model name"
- ✅ Added "Model ID" column after "Model name"
- ✅ Added action kebabs with "Remove asset" option to AI Assets list
- ✅ Updated "Add asset" modal to support Internal (on-cluster) or External model providers
- ✅ External providers include OpenAI and Anthropic with API key input and model selection
- ✅ Removed numbers from AI Assets tab titles (Models, MCP servers)
- ✅ Removed "Models as a service" tab entirely along with its list

#### Model Deployments (2/2 - RHAIRFE-151)
- ✅ Added "Publish as AI Asset" option to Model Deployments kebab menu
- ✅ Removed "Make this deployment available globally for models as a service" option and "Tech Preview" badge from Deploy wizard

### Summary
**All 24 work items have been successfully completed!**



#### Later
- ❌ **Micro UI for Quick Key Creation** - No embedded key creation widget in AI Playground or AI Available Assets
- ❌ **Per-Asset Key Generation** - No quick "Generate Key for this Asset" action on asset cards
- ❌ **Quality Tiers Implementation** - No tier-based policies (Tier 0, Tier 1, etc.)
- ❌ **Rate Limiting Enforcement** - Rate limits displayed but not enforced
- ❌ **Chargeback/Cost Calculation** - Cost metrics shown but no actual cost calculation engine
- ❌ **Quota Management UI** - No interface to set/view/manage quotas for users/groups/keys
- ❌ **Admin "Make Available as MaaS" Toggle** - Toggle exists in wizard but no way to edit existing deployments





## Sources

### Notebooks

source: https://notebooklm.google.com/notebook/7c5d493a-85b8-438d-b1d9-aeab507c63a7
- description: UXD Orientation NotebookLM for Models-as-a-Service (MaaS)

### Slack

source: https://redhat.enterprise.slack.com/archives/C091QD3C3QT
- name: #maas-update Slack channel
- description: Channel for all MaaS-related updates
source: https://redhat.enterprise.slack.com/archives/C094HF5KD6E
- name: #wg-maas Slack channel
- description: Channel for the team developing MaaS for RHAI

### Docs

source: https://docs.google.com/document/d/1JhZ7jcBJH71nzvYWYCHk_EXEtxMFKkSyvkblmDL_KtU/edit
- title: Refinement - RHOAISTRAT-639
- description: contains a bunch of details for what's in and out of scope for 3.0, some of which is likely 3.2/3.3
source: https://docs.google.com/document/d/142X3mx_SIdSWMvgf3ppSW83J__ZtQ4EDmOiF0IKZYJc/edit?pli=1&tab=t.grnrd6dljv81
- title: Models-as-a-Service Worksheet
- description: Contains PM's source of truth for MaaS roadmap items, requirements, and more.
source: https://docs.google.com/document/d/12oZzzPyfrxiajvgfUsc4xPMwZFckGwC9Qqoi7u4DKK8/edit?tab=t.0#heading=h.djbgpzpj5t69
- title: Notes - llm-d in RHOAI model deployment wizard
source: https://docs.google.com/document/d/1ZZiSG58daRtUGcsofDU-Q5n8c-FzqxUXVx05Sil3p5M/edit?tab=t.0
- title: MaaS Stakeholders Sync
- description: Contains notes from our weekly MaaS Stakeholder meeting
source: https://docs.google.com/document/d/1iXOtTwmXhm582L3nYpFdaMXyZN8EEL_xMmCcgwpkGxk/edit?tab=t.0
- title: PRD Gen AI Studio - API Key UI
- description: Includes problem statement, user narrative, and an outline of features for the API Key area of the UI

### Decks

source: https://docs.google.com/presentation/d/1ORtU9uYWKxlOngo1Xj7atkLPYdUMUTZrua5v0OOtdOY/edit?slide=id.g2e86baf0a21_0_0#slide=id.g2e86baf0a21_0_0
- title: RHAI MaaS Master Deck
- date: 2025-08-01
- descrption: PM slide deck covering MaaS
source: https://docs.google.com/presentation/d/1ms_my1WI4l_-zBe6wBCAoeUA2dNnQAViZQYlgUkFlCY/edit?slide=id.p#slide=id.p
- title: MaaS: path to DevPreview
- date: 2025-09-03
- description: Summary of Dev Preview strategy and plan for MaaS in RHOAI, confirms that group filtering of models is a thing for the future and by default we can list models to everyone

### Repositories

source: https://github.com/opendatahub-io/maas-billing/tree/main
- title: ODH - Models as a Service with Policy Management
- description: Core GitHub repository for all MaaS-related infrastructure code (config, components)
source: https://github.com/rh-aiservices-bu/litemaas
- description Repository for LiteMaaS, helpful as a reference implementation of MaaS functionality, created by the CAI team

### Jira

source: https://issues.redhat.com/browse/RHAIRFE-476
- title: AI Available Assets -  Implement Quota Management and Visibility for Model Deployments
source: https://issues.redhat.com/browse/RHOAISTRAT-638
- title: MaaS UI for Admin
source: https://issues.redhat.com/browse/RHOAIUX-996
- title: User Experience For MaaS Admin
source: https://issues.redhat.com/browse/RHOAISTRAT-639
- title: Initial MaaS Offering (3.0)
source: https://issues.redhat.com/browse/RHAIRFE-151
- title: AI Available Assets - LLS Deployed Models, MCP Servers (via ConfigMap) - MVP
source: https://issues.redhat.com/browse/RHAIRFE-608
- title: AI Available Assets - MaaS Dev Preview Integration
source: https://issues.redhat.com/browse/RHOAISTRAT-703
- title: MaaS Offering Fast Follow
source: https://issues.redhat.com/browse/RHAIRFE-244
- title: API Keys UI - to enable API Endpoint consumption for Gen AI Studio components
source: https://issues.redhat.com/browse/RHAIRFE-138
- title: MaaS UI for Admin
source: https://issues.redhat.com/browse/RHOAISTRAT-650
- title: Observability for MaaS v1.0
source: https://issues.redhat.com/browse/RHAIRFE-137
- title: Basic Chargeback & Showback ($$$) Reporting for MaaS
- description: Not in scope for 3.0, but possibly 3.2 or 3.3

### Other

source: https://www.redhat.com/rhdc/managed-files/ma-models-as-a-service-overview-2669809OM-202509-en.pdf
- description: Introductory guide to Models-as-a-Service, customer-facing
source: https://maas.apps.prod.rhoai.rh-aiservices-bu.com
- title: Parasol MaaS
- description: MaaS UI powered by 3scale for internal Red Hat usage
source: https://litemaas-litemaas.apps.prod.rhoai.rh-aiservices-bu.com/home
- title: LiteMaaS
- description: MaaS demo UI powered by LiteLLM and created by the AI Customer Adoption and Innovation Team (CAI)
source: http://18.223.29.178:3000
- description: MaaS demo UI for policy management and observability, created by Noy
source: https://miro.com/app/board/uXjVIh6zvD0=/
- description: MaaS Architecture diagrams

## Open Questions

In 3.2 we intend to make the Models tab only include endpoints that are "gated" by an API Key. But this requires and assumes an API Gateway is involved, particularly RHCL. Is it okay to approach it this way?
- Yes

- (ENG/PM) Will we support Perses dashboards in 3.2?
- (USER) Should our platform allow AIEs to add and bring their own API key to the Playground and elsewhere?

## Design History

2025-10-13
- Fix the Delete API Key modal to follow PatternFly 6 modal documentation patterns
- On the API Keys page, display a PatternFly 6 dropdown very similar to the ones in the Registry page with options to "View details" or "Delete API key" (which should activate the same Delete API Key modal)
- Add a column for "last used" to the API Keys page (as the last column) to show the last time the key was used
- Add a column for "status" to the API Keys page (in the second position, right after name) with status options for Active, Expired, or Disabled
- In the Policies tab of API Key Details pages, add a column to the table for "Type" and include examples for the various policy types of Kuadrant.io (AuthPolicy, RateLimitPolicy, TLSPolicy, DNSPolicy)

2025-10-07
- Added navigation icons to left nav, some may need adjustments

2025-10-05
- Created initial design for Policy management, based on Noy's work so far

2025-10-02
- RH AI UX Field Feedback Call
- Recording: https://drive.google.com/file/d/16zKWm_Av_zUmsJIdTIJ043o0jS5To-DZ/view
- Gemini notes: https://docs.google.com/document/d/1CafyfZI28WSV75R-IMszxjaOSFV4QzmkYMKtlwIBqmU/edit?tab=t.9in1b8lmc9l4
- API Gateway vs. Direct VLM Access - Andy Braren discussed the future of API gateways and their integration with OpenShift AI, anticipating that keys and tracking will be integrated. Brian Ball pointed out that some customers prefer not to use API gateways due to extra configuration, utilizing a vLLM middleware solution for logging instead. Andy Braren inquired whether most customers would lean towards API gateways or the direct VLM method.
- Distinction Between Models and Models as a Service - Andy Braren initiated a discussion about simplifying the user experience by potentially removing the distinction between "models" and "models as a service" in future versions, aiming for a single "models" tab where all models are available as a service, ideally behind an API gateway. Li Ming Tsai supported this simplification, stating that from a user's perspective, it's just a model, and the "mass" (models as a service) is an implementation detail.
- Namespace Scope and User Permissions - Danielle Jett questioned the real-world use cases for namespace-scoped models, suggesting that perhaps all models in AI assets should exclusively use "models as a service". Brian Ball countered that namespaces still serve to organize workloads, even with API gateways, and emphasized the need for granular access controls to ensure users can only interact with models they are authorized to use.

2025-10-01
- GenAI UXD Stakeholder meeting
- Recording: https://drive.google.com/file/d/12xsK-eEHY17jKlL1dhIt_GFZXjg3-4H4/view
- Gemini notes: https://docs.google.com/document/d/1Z4Zk-PNg24z1immh4eK6fJyYKuALc0CbB3-leUKc82s/edit?tab=t.9ca9a4kc68ub
- After some discussion there seems to be general agreement that in 3.2 we'll try to move in the direction of everything in AI Assets being available as a service and operate behind an API Gateway, rather than 3.0's experience where non-gateway'd models are also technically "available" but perhaps not with the same level of control or observability that provides the best experience to AI Engineers who simply want to consume model endpoints to their heart's content. Guiding GUI users to adopt an API Key-based approach has security, management, and observability implications that are worth encouraging. There may be a subset of use cases where a user might want to share a model endpoint within the same namespace without publishing it for others to discover and consume, but an opinionated AI Assets area doesn't prevent users with the know-how from navigating to the Model Deployment Details pages of the ones they have access to and getting the raw endpoints from there.
- We also discussed allowing admins to bring in their own external AI inference providers (e.g. OpenAI) into the platform for others to consume. This would likely be done using either the existing Connections mechanism or from the AI Assets page in a new "Add Asset" form/wizard. API Keys from the API gateway could then sit in front of that endpoint, providing more granular per-user and per-group controls and visibility.

2025-10-01
- AI Engineer Research Readout Prioritization discussion
- Recording: https://drive.google.com/file/d/1lDn2g3zpsfXSYHaxFmTYE31EpSBMWVZO/view
- Miro: https://miro.com/app/board/uXjVJHTHUYI=/
- 14:00 we have an open issue around cost management / chargeback for that need. This would require one key per user per model though to be able to do that kind of cost tracking. NVIDIA operator supports some cost estimation with GPUs. Rob believes it's a dangerous game for us, maybe showing total cost of ownership over a longer time period is better, SaaS providers are currently eating costs, dollar values can be difficult. Cost per token and things is possible though.
- 23:00 AI Engineers desire to bring their own key to the AI Playground from external model providers. We still have an open question around whether AI Platform Engineers would allow this given the risk of data exfiltration. This would probably be done somewhere within the AI Assets area.


2025-10-01
- Red Hat AI What's New / What's Next
- https://redhat-internal.slack.com/archives/C069RL35Q6R/p1759333775691449?thread_ts=1759332632.294329&cid=C069RL35Q6R
- Confirmation that RHCL will be included with RHOAI for the MaaS use cases specifically to provide the integrated user experience being designed here. Using RHCL for other things will require its own subscription. We'll support using external third party gateways with documentation based on customer demand in Q1 2026.

2025-09-24
- https://drive.google.com/file/d/1_fN9-v_M_7xrsn_zGOFa-VCyMbt8zarG/view
- AI Engineering All Hands demo of Citi Bank's AI-related needs, including items around MaaS, Carl Mes walked through many topics

2025-09-24
- Created the first iteration of this design using the blank PatternFly starter codebase.
- During the MaaS Stakeholder meeting we discussed whether API Keys should really be found within the Settings nav item, and folks wondered whether the "Gen AI Studio" as a whole should really even be in RHOAI to begin with. Andy moved API Keys into the Gen AI Studio section for now to see what people think of it there. Even though keys can be used for Admin-ey actions, they can also be used by AIEs who want to easily find and manage their keys for their various apps and services. The ability to see which Assets are available to a key, and easily accessing the endpoints for every Asset from within the Key Details page, also seems to be valuable and what alternatives like LiteLLM focus on. This area feels worth moving outside of Settings for those reasons.





## PRD

### Features

- API Gateway
-- Support external AI providers (e.g. OpenAI, Anthropic)
-- Support internal model inference server endpoint providers
- Token Validation
- API Keys list
-- One key can span multiple models, assets
-- One key might be scoped to a single model too (unsure)
-- Key management (list with columns for name, secret key value, date created, date last used, created by user, permissions)
- Usage Tracking
-- Requests per time period (1 hour, 24 hours, 7 days, 30 days, 1 year, custom range)
-- Tokens per user
-- Tokens per group
-- Tokens per key
-- Top consumers (per key)
- Observability
-- Link to view more detailed dashboards in Perses
-- Runtime: latency, GPU utilization, tokens per second
- Rate Limiting
-- Max tokens per minute
-- Max responses per minute
-- Max tokens per time period
- Security Enforcement
- Perses-based dashboards
- Administration User Interface
- Chargeback
- SLO-based workload management (dynamic routing using llm-d's intelligent scheduler)
-- Tenant Management
-- Usage Analytics / Observability
- Governance
-- Policies
--- Quality tiers
--- Over-limit behavior (soft throttle, hard throttle)
--- Date-based quota renewals
-- RBAC-based access to users/groups
-- Audit trails
-- Tenancy model that security team trusts
- GitOps configuration

### API Assets Features

- New "Add Asset" button to add a model

## Design

### Design Philosophy

The AI Assets area contains all “as‑a‑service” offerings that are available through the platform. It targets engineers and developers who need a quick, safe, ready‑to‑consume endpoint without having to understand the underlying infrastructure. The UI is intentionally simple for non‑experts but encourages best practices: every MaaS endpoint is routed through an API gateway that enforces API‑key authentication, provides observability, monitoring, and chargeback, and allows key revocation if a compromise occurs. This cautious default can be extended to future services such as MCP servers and Agents-as-a-Service, ensuring consistent security and operational controls across the AI Assets catalog.

### API Keys page

The API keys page is located within the Settings area of the left nav above User management.

The page title is "API keys" wiht a description of "Browse endpoints for available models and MCP servers."

The page includes a primary action button of "Create API key" and then a table showing all API keys. The table has columns for Name, API Key (e.g. sk-1234...), Assets (e.g. model names), and Owner (e.g. User, Service Account, Group).

Clicking "Create API key" reveals a modal with a form inside it to create a new API key. The form has fields for:
* Name (required)
* Description (freeform text box to "Describe the key's purpose)
* Owner (dropdown for User/Group/Service Account, and a dropdown to the right of it to select an actual username/group name/service account name)

It also includes a collapsible section (collapsed by default) for "Limits and Policies. When expanded this section has options to set:
* Token rate limit (tokens per minute)
* Request rate limit (requests per minute)
* Budget limit
* Expiration date

The last section of the modal for "AI Asset Access" provides a few multi-select dropdowns to let users select from lists of:
* Model Endpoints
* MCP Servers & tools
* Vector Databaes
* Agents

### API Key Details page

The API key details page has the name of the key at the top and a partially-hidden key that's copyable below it.

The page has five tabs:
* Details
* Assets
* Metrics
* Policies
* Settings

#### Details tab

The Details tab has a Description List that includes the key's:
* Name
* Description
* API key (partially-hidden and copyable)
* Date created
* Date last used

#### Assets tab

The Assets tab includes collapsible sections for the AI Assets that the API key enables access to. Each section has a table showing the assets of that type that are available:
* Models (with columns for Name, ID, and Endpoint)
* MCP Servers & tools (with columns for Name, Tools, and Endpoint)
* Vector Databases (with columns for Name and Size)
* Agents (with columns for Name and Endpoint)

For the models list, include examples like gpt-oss-20b and granite-3.1b.

For the MCP servers list, include examples like OpenShift, RHEL, Ansible.

#### Metrics tab

The Metrics tab includes various metrics and charts that help the API key owner better understand how the key is being used.

The top of the tab includes a controls area with a dropdown for "Time range" (e.g. 24 hours, 7 days, 30 days) and a link to "View Perses Dashboard"

Below those controls are cards (in a flexbox row) for:
* Total Requests
* Success rate (e.g. 98.2%)
* Total Tokens
* Total Cost

Below these cards is a fulldwidth card with a graph showing the "Total Requests."

#### Policies tab

This tab includes all policies, limits, controls, and constraints that are imposed on the API key.

It includes a table with the Names, IDs, and Descriptions of policies that have been applied by the Platform team. Policy IDs should be all lowercase with dashes for spaces like "devs-rate-limit-standard" and "devs-budget-standard."

#### Settings tab

This tab includes a "Danger Zone" card with a red action button to permanently delete the API key. If a user clicks the delete button a modal should appear to confirm that they want to delete the key, with a text field to type in the key's name manually and then "Confirm" to delete the key.

### Policies page

The Policies list/table page should be located in "Settings" in the left nav, below "User management." It should be a table page similar to the others, with columns for Name, Description, Status (Active or Inactive), Targets (e.g. Group names) and Rules (e.g. Token limit, Rate limit, Time limit).

### Create policy

A primary button to "Create policy" should be available on the Policies list page. Clicking it should display a PatternFly 6 modal similar to the others.

The modal should include fields for Name (required) and Description (optional).

Then a section heading for "Available assets" should have dropdowns similar to the ones from the "Create API key" modal for "Models" and "MCP Servers & tools". By default both dropdowns should be set to "All" (meaning they aren't restricting anything).

Then a section heading for "Limits" should display fields for

- Token limit (i.e. # tokens per # [time range like minute, hour, day]
- Rate limit (i.e. # requests per # [time range like minute, hour, day])
- Time limit (i.e. None or Start & End time controls)

Then a section heading for "Targets" that has multi-select dropdowns for "Groups" and "Users" and "Service Accounts" with some options in each.

The descriptive text for the Groups dropdown should say "This policy will apply to all users in these groups."

#### Policy Details page

The Policy Details page should have a tab for Details, which displays all of the details that were captured in the "Create policy" modal.

## Remaining Design TODOS

- Add the ability to Delete an API key with a caution that this is irreversible and make them type the name again
- Add the ability to connect an external model provider's API endpoint as an AI Asset potentially
- Column for "last used" in the API Keys list to show the last time it was used
- Column for "status" of the key, whether it's active or revoked or suspended or throttled or whatever
- Add a show/eye icon to reveal the API key, copy icon too
- Integration of multiple API Keys in the AI Assets area
- Tiers





## Implementation Details

### Routing
- API Keys list page: `/settings/api-keys`
- API Key details page: `/settings/api-keys/:keyId`
- API Key details with tab: `/settings/api-keys/:keyId/:tab` (optional, defaults to Details tab)

### Data Management
- Use mock/dummy data for prototype
- Use appropriate local state management (React hooks/context as needed)
- No external API integration required

### User Experience
- After creating an API key, navigate user to the newly created key details page
- Delete confirmation modal should show the exact key name in plain text above the input field for easy copy/paste
- Use PatternFly Victory charts for the Metrics tab visualizations

### Mock Data Requirements
- Create realistic sample data for models (include examples like gpt-oss-20b, granite-3.1b)
- Create realistic sample data for MCP servers (include examples like OpenShift, RHEL, Ansible)
- Create realistic mock policy data for API gateway/MaaS policies in the Policies tab
- Include appropriate sample metrics data for charts and statistics