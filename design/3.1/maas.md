# Models-as-a-Service (MaaS)

Target version: 3.1
UXD Orientation doc: https://docs.google.com/document/d/10IIWRpETdRIDzQiPIvHSzCBj3bwq02fE0mGOEtVwjBw/edit?tab=t.0
NotebookLM: https://notebooklm.google.com/notebook/7c5d493a-85b8-438d-b1d9-aeab507c63a7
Journey map: https://miro.com/app/board/uXjVIgQDVWw=/

## Context

### Docs

link: https://docs.google.com/document/d/142X3mx_SIdSWMvgf3ppSW83J__ZtQ4EDmOiF0IKZYJc/edit?pli=1&tab=t.grnrd6dljv81
title: Models-as-a-Service Worksheet
description: Contains PM's source of truth for MaaS roadmap items, requirements, and more.

### Jira

link: https://issues.redhat.com/browse/RHAIRFE-151
title: AI Available Assets - LLS Deployed Models, MCP Servers (via ConfigMap) - MVP

link: https://docs.google.com/document/d/12oZzzPyfrxiajvgfUsc4xPMwZFckGwC9Qqoi7u4DKK8/edit?tab=t.0#heading=h.djbgpzpj5t69
title: Notes - llm-d in RHOAI model deployment wizard

## Open Questions

In 3.2 we intend to make the Models tab only include endpoints that are "gated" by an API Key. But this requires and assumes an API Gateway is involved, particularly RHCL. Is it okay to approach it this way?

## History

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
- After some discussion there seems to be general agreement that in 3.x we'll try to move in the direction of everything in AI Assets being available as a service and operate behind an API Gateway, rather than 3.0's experience where non-gateway'd models are also technically "available" but perhaps not with the same level of control or observability that provides the best experience to AI Engineers who simply want to consume model endpoints to their heart's content. Guiding GUI users to adopt an API Key-based approach has security, management, and observability implications that are worth encouraging. There may be a subset of use cases where a user might want to share a model endpoint within the same namespace without publishing it for others to discover and consume, but an opinionated AI Assets area doesn't prevent users with the know-how from navigating to the Model Deployment Details pages of the ones they have access to and getting the raw endpoints from there.
- We also discussed allowing admins to bring in their own external AI inference providers (e.g. OpenAI) into the platform for others to consume. This would likely be done using either the existing Connections mechanism or from the AI Assets page in a new "Add Asset" form/wizard. API Keys from the API gateway could then sit in front of that endpoint, providing more granular per-user and per-group controls and visibility.

2025-09-24
- https://drive.google.com/file/d/1_fN9-v_M_7xrsn_zGOFa-VCyMbt8zarG/view
- AI Engineering All Hands demo of Citi Bank's AI-related needs, including items around MaaS, Carl Mes walked through many topics

2025-09-24
- Created the first iteration of this design using the blank PatternFly starter codebase.
- During the MaaS Stakeholder meeting we discussed whether API Keys should really be found within the Settings nav item, and folks wondered whether the "Gen AI Studio" as a whole should really even be in RHOAI to begin with. Andy moved API Keys into the Gen AI Studio section for now to see what people think of it there. Even though keys can be used for Admin-ey actions, they can also be used by AIEs who want to easily find and manage their keys for their various apps and services. The ability to see which Assets are available to a key, and easily accessing the endpoints for every Asset from within the Key Details page, also seems to be valuable and what alternatives like LiteLLM focus on. This area feels worth moving outside of Settings for those reasons.

## Design

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

### Policies

This tab includes all policies, limits, controls, and constraints that are imposed on the API key.

It includes a table with the Names, IDs, and Descriptions of policies that have been applied by the Platform team. Policy IDs should be all lowercase with dashes for spaces like "devs-rate-limit-standard" and "devs-budget-standard."

### Settings

This tab includes a "Danger Zone" card with a red action button to permanently delete the API key. If a user clicks the delete button a modal should appear to confirm that they want to delete the key, with a text field to type in the key's name manually and then "Confirm" to delete the key.

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