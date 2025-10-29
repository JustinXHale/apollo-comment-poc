import * as React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Support } from '@app/Support/Support';
import { GeneralSettings } from '@app/Settings/General/GeneralSettings';
import { ProfileSettings } from '@app/Settings/Profile/ProfileSettings';
import { NotFound } from '@app/NotFound/NotFound';
import { useFeatureFlags } from '@app/utils/FeatureFlagsContext';

// New components
import { Home } from '@app/Home/Home';
import { DataScienceProjects } from '@app/DataScienceProjects/DataScienceProjects';
import { DataScienceProjectDetail } from '@app/DataScienceProjects/DataScienceProjectDetail';

// AIAssets - imported from migrated src-3.0
import { Models } from '@app/AIAssets/Models/Models';
import { ModelCatalog } from '@app/AIAssets/Models/ModelCatalog';
import { ModelRegistry } from '@app/AIAssets/Models/ModelRegistry';
import RegisterModel from '@app/AIAssets/Models/RegisterModel';
import ModelDetails from '@app/AIAssets/Models/ModelDetails';
import { Deployments } from '@app/AIAssets/Deployments/Deployments';
import { DeployModelWizard } from '@app/AIAssets/Deployments/DeployModelWizard';
import { MVPServers } from '@app/AIAssets/MVPServers/MVPServers';
import { MCPServerDetails } from '@app/AIAssets/MVPServers/MCPServerDetails';
import { SearchResults } from '@app/AIAssets/MVPServers/SearchResults';
import { CreateGuardrail } from '@app/AIAssets/Guardrails/CreateGuardrail';
import { Guardrails } from '@app/AIAssets/Guardrails/Guardrails';
import AvailableAIAssets from '@app/AIAssets/AvailableAIAssets/AvailableAIAssets';

// GenAIStudio - imported from migrated src-3.0
import { AgentBuilder } from '@app/GenAIStudio/AgentBuilder/AgentBuilder';
import { ModelPlayground } from '@app/GenAIStudio/ModelPlayground/ModelPlayground';
import { MyAgents } from '@app/GenAIStudio/MyAgents/MyAgents';
import { PromptEngineering } from '@app/GenAIStudio/PromptEngineering/PromptEngineering';
import { KnowledgeSources } from '@app/GenAIStudio/KnowledgeSources/KnowledgeSources';

// Observability - imported from migrated src-3.0
import { Tracing } from '@app/Observability/Tracing/Tracing';
import { RAG } from '@app/Observability/RAG/RAG';
import { Evaluations as ObservabilityEvaluations } from '@app/Observability/Evaluations/Evaluations';

// FeatureFlags - imported from migrated src-3.0
import { FeatureFlags } from '@app/FeatureFlags/FeatureFlags';

import { Workbenches } from '@app/DevelopTrain/Workbenches/Workbenches';
import { FeatureStore } from '@app/DevelopTrain/FeatureStore/FeatureStore';
import { Overview } from '@app/DevelopTrain/FeatureStore/Overview/Overview';
import { Entities } from '@app/DevelopTrain/FeatureStore/Entities/Entities';
import { DataSources } from '@app/DevelopTrain/FeatureStore/DataSources/DataSources';
import { DataSets } from '@app/DevelopTrain/FeatureStore/DataSets/DataSets';
import { Features } from '@app/DevelopTrain/FeatureStore/Features/Features';
import { FeatureViews } from '@app/DevelopTrain/FeatureStore/FeatureViews/FeatureViews';
import { FeatureServices } from '@app/DevelopTrain/FeatureStore/FeatureServices/FeatureServices';
import { PipelineDefinitions } from '@app/DevelopTrain/Pipelines/PipelineDefinitions/PipelineDefinitions';
import { Runs } from '@app/DevelopTrain/Pipelines/Runs/Runs';
import { Artifacts } from '@app/DevelopTrain/Pipelines/Artifacts/Artifacts';
import { Executions } from '@app/DevelopTrain/Pipelines/Executions/Executions';
import { Evaluations } from '@app/DevelopTrain/Evaluations/Evaluations';
import { Experiments } from '@app/DevelopTrain/Experiments/Experiments';
import { Dashboard } from '@app/ObserveMonitor/Dashboard/Dashboard';
import { WorkloadMetrics } from '@app/ObserveMonitor/WorkloadMetrics/WorkloadMetrics';
import { TrainingJobs } from '@app/ObserveMonitor/TrainingJobs/TrainingJobs';
import { LearningResources } from '@app/LearningResources/LearningResources';
import { Applications } from '@app/Applications/Applications';
import { Enabled } from '@app/Applications/Enabled/Enabled';
import { Explore } from '@app/Applications/Explore/Explore';
import { ClusterSettings } from '@app/Settings/ClusterSettings/ClusterSettings';
import { StorageClasses } from '@app/Settings/ClusterSettings/StorageClasses/StorageClasses';
import { EnvironmentSetup } from '@app/Settings/EnvironmentSetup/EnvironmentSetup';
import { WorkbenchImages } from '@app/Settings/EnvironmentSetup/WorkbenchImages/WorkbenchImages';
import { HardwareProfiles } from '@app/Settings/EnvironmentSetup/HardwareProfiles/HardwareProfiles';
import { ConnectionTypes } from '@app/Settings/EnvironmentSetup/ConnectionTypes/ConnectionTypes';
import { ModelResources } from '@app/Settings/ModelResources/ModelResources';
import { ServingRuntimes } from '@app/Settings/ModelResources/ServingRuntimes/ServingRuntimes';
import { ModelRegistrySettings } from '@app/Settings/ModelResources/ModelRegistrySettings/ModelRegistrySettings';
import { UserManagement } from '@app/Settings/UserManagement/UserManagement';
import { APIKeys } from '@app/Settings/APIKeys/APIKeys';
import { APIKeyDetails } from '@app/Settings/APIKeys/APIKeyDetails';
import { Policies } from '@app/Settings/Policies/Policies';
import { PolicyDetails } from '@app/Settings/Policies/PolicyDetails';

// Icons
import { createFontAwesomeIcon } from '@app/utils/IconHelper';

export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  /* eslint-disable @typescript-eslint/no-explicit-any */
  element: React.ReactElement;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  exact?: boolean;
  path: string;
  title: string;
  routes?: undefined;
  icon?: React.ComponentType;
  featureFlag?: keyof import('@app/utils/FeatureFlagsContext').FeatureFlags;
}

export interface IAppRouteGroup {
  label: string;
  routes: AppRouteConfig[];
  icon?: React.ComponentType;
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    element: <Home />,
    exact: true,
    label: 'Home',
    path: '/',
    title: 'RHOAI 3.1 Console | Home',
    icon: createFontAwesomeIcon('fa-light fa-house'),
  },
  {
    element: <DataScienceProjects />,
    exact: true,
    label: 'Data science projects',
    path: '/projects',
    title: 'RHOAI 3.1 Console | Data Science Projects',
    icon: createFontAwesomeIcon('fa-light fa-folder'),
  },
  {
    element: <DataScienceProjectDetail />,
    exact: true,
    path: '/projects/:projectName',
    title: 'RHOAI 3.1 Console | Project Detail',
  },
  {
    label: 'AI hub',
    icon: createFontAwesomeIcon('fa-light fa-brain'),
    routes: [
      {
        element: <ModelCatalog />,
        exact: true,
        label: 'Catalog',
        path: '/ai-hub/catalog',
        title: 'RHOAI 3.1 Console | AI Hub - Catalog',
      },
      {
        element: <ModelRegistry />,
        exact: true,
        label: 'Registry',
        path: '/ai-hub/registry',
        title: 'RHOAI 3.1 Console | AI Hub - Registry',
      },
      {
        element: <Deployments />,
        exact: true,
        label: 'Deployments',
        path: '/ai-hub/deployments',
        title: 'RHOAI 3.1 Console | AI Hub - Deployments',
      },
    ],
  },
  {
    label: 'Gen AI studio',
    icon: createFontAwesomeIcon('fa-light fa-brain'),
    routes: [
      {
        element: <AvailableAIAssets />,
        exact: true,
        label: 'AI asset endpoints',
        path: '/gen-ai-studio/asset-endpoints',
        title: 'RHOAI 3.1 Console | Gen AI Studio - AI Asset Endpoints',
      },
      {
        element: <AgentBuilder />,
        exact: true,
        label: 'Playground',
        path: '/gen-ai-studio/playground',
        title: 'RHOAI 3.1 Console | Gen AI Studio - Playground',
      },
      {
        element: <ModelPlayground />,
        exact: true,
        label: 'Model playground',
        path: '/gen-ai-studio/model-playground',
        title: 'RHOAI 3.1 Console | Gen AI Studio - Model Playground',
        featureFlag: 'enableModelPlaygroundPage',
      },
      {
        element: <MyAgents />,
        exact: true,
        label: 'My agents',
        path: '/gen-ai-studio/my-agents',
        title: 'RHOAI 3.1 Console | Gen AI Studio - My Agents',
        featureFlag: 'enableMyAgentsPage',
      },
      {
        element: <PromptEngineering />,
        exact: true,
        label: 'Prompt engineering',
        path: '/gen-ai-studio/prompt-engineering',
        title: 'RHOAI 3.1 Console | Gen AI Studio - Prompt Engineering',
        featureFlag: 'enablePromptEngineeringPage',
      },
      {
        element: <KnowledgeSources />,
        exact: true,
        label: 'Knowledge sources',
        path: '/gen-ai-studio/knowledge-sources',
        title: 'RHOAI 3.1 Console | Gen AI Studio - Knowledge Sources',
        featureFlag: 'enableKnowledgeSourcesPage',
      },
      {
        element: <APIKeys />,
        exact: true,
        label: 'API keys',
        path: '/gen-ai-studio/api-keys',
        title: 'RHOAI 3.1 Console | Gen AI Studio - API Keys',
      },
      {
        element: <APIKeyDetails />,
        exact: true,
        path: '/gen-ai-studio/api-keys/:keyId',
        title: 'RHOAI 3.1 Console | Gen AI Studio - API Key Details',
      },
      {
        element: <APIKeyDetails />,
        exact: true,
        path: '/gen-ai-studio/api-keys/:keyId/:tab',
        title: 'RHOAI 3.1 Console | Gen AI Studio - API Key Details',
      },
    ],
  },
  {
    label: 'Develop & train',
    icon: createFontAwesomeIcon('fa-light fa-flask'),
    routes: [
      {
        element: <Workbenches />,
        exact: true,
        label: 'Workbenches',
        path: '/develop-train/workbenches',
        title: 'RHOAI 3.1 Console | Develop & Train - Workbenches',
      },
      {
        label: 'Feature store',
        routes: [
          {
            element: <Overview />,
            exact: true,
            label: 'Overview',
            path: '/develop-train/feature-store/overview',
            title: 'RHOAI 3.1 Console | Feature Store - Overview',
          },
          {
            element: <Entities />,
            exact: true,
            label: 'Entities',
            path: '/develop-train/feature-store/entities',
            title: 'RHOAI 3.1 Console | Feature Store - Entities',
          },
          {
            element: <DataSources />,
            exact: true,
            label: 'Data sources',
            path: '/develop-train/feature-store/data-sources',
            title: 'RHOAI 3.1 Console | Feature Store - Data Sources',
          },
          {
            element: <DataSets />,
            exact: true,
            label: 'Data sets',
            path: '/develop-train/feature-store/data-sets',
            title: 'RHOAI 3.1 Console | Feature Store - Data Sets',
          },
          {
            element: <Features />,
            exact: true,
            label: 'Features',
            path: '/develop-train/feature-store/features',
            title: 'RHOAI 3.1 Console | Feature Store - Features',
          },
          {
            element: <FeatureViews />,
            exact: true,
            label: 'Feature views',
            path: '/develop-train/feature-store/feature-views',
            title: 'RHOAI 3.1 Console | Feature Store - Feature Views',
          },
          {
            element: <FeatureServices />,
            exact: true,
            label: 'Feature services',
            path: '/develop-train/feature-store/feature-services',
            title: 'RHOAI 3.1 Console | Feature Store - Feature Services',
          },
        ],
      },
      {
        label: 'Pipelines',
        routes: [
          {
            element: <PipelineDefinitions />,
            exact: true,
            label: 'Pipeline definitions',
            path: '/develop-train/pipelines/definitions',
            title: 'RHOAI 3.1 Console | Pipelines - Definitions',
          },
          {
            element: <Runs />,
            exact: true,
            label: 'Runs',
            path: '/develop-train/pipelines/runs',
            title: 'RHOAI 3.1 Console | Pipelines - Runs',
          },
          {
            element: <Artifacts />,
            exact: true,
            label: 'Artifacts',
            path: '/develop-train/pipelines/artifacts',
            title: 'RHOAI 3.1 Console | Pipelines - Artifacts',
          },
          {
            element: <Executions />,
            exact: true,
            label: 'Executions',
            path: '/develop-train/pipelines/executions',
            title: 'RHOAI 3.1 Console | Pipelines - Executions',
          },
        ],
      },
      {
        element: <Evaluations />,
        exact: true,
        label: 'Evaluations',
        path: '/develop-train/evaluations',
        title: 'RHOAI 3.1 Console | Develop & Train - Evaluations',
      },
      {
        element: <Experiments />,
        exact: true,
        label: 'Experiments',
        path: '/develop-train/experiments',
        title: 'RHOAI 3.1 Console | Develop & Train - Experiments',
      },
    ],
  },
  {
    label: 'Observe & monitor',
    icon: createFontAwesomeIcon('fa-light fa-magnifying-glass'),
    routes: [
      {
        element: <Dashboard />,
        exact: true,
        label: 'Dashboard',
        path: '/observe-monitor/dashboard',
        title: 'RHOAI 3.1 Console | Observe & Monitor - Dashboard',
      },
      {
        element: <WorkloadMetrics />,
        exact: true,
        label: 'Workload metrics',
        path: '/observe-monitor/workload-metrics',
        title: 'RHOAI 3.1 Console | Observe & Monitor - Workload Metrics',
      },
      {
        element: <TrainingJobs />,
        exact: true,
        label: 'Training jobs',
        path: '/observe-monitor/training-jobs',
        title: 'RHOAI 3.1 Console | Observe & Monitor - Training Jobs',
      },
    ],
  },
  {
    element: <LearningResources />,
    exact: true,
    label: 'Learning resources',
    path: '/learning-resources',
    title: 'RHOAI 3.1 Console | Learning Resources',
    icon: createFontAwesomeIcon('fa-light fa-book'),
  },
  {
    label: 'Applications',
    icon: createFontAwesomeIcon('fa-light fa-code'),
    routes: [
      {
        element: <Enabled />,
        exact: true,
        label: 'Enabled',
        path: '/applications/enabled',
        title: 'RHOAI 3.1 Console | Applications - Enabled',
      },
      {
        element: <Explore />,
        exact: true,
        label: 'Explore',
        path: '/applications/explore',
        title: 'RHOAI 3.1 Console | Applications - Explore',
      },
    ],
  },
  {
    label: 'Settings',
    icon: createFontAwesomeIcon('fa-light fa-gear'),
    routes: [
      {
        label: 'Cluster settings',
        routes: [
          {
            element: <ClusterSettings />,
            exact: true,
            label: 'General settings',
            path: '/settings/cluster/general',
            title: 'RHOAI 3.1 Console | Cluster Settings - General',
          },
          {
            element: <StorageClasses />,
            exact: true,
            label: 'Storage classes',
            path: '/settings/cluster/storage-classes',
            title: 'RHOAI 3.1 Console | Cluster Settings - Storage Classes',
          },
        ],
      },
      {
        label: 'Environment setup',
        routes: [
          {
            element: <WorkbenchImages />,
            exact: true,
            label: 'Workbench images',
            path: '/settings/environment/workbench-images',
            title: 'RHOAI 3.1 Console | Environment Setup - Workbench Images',
          },
          {
            element: <HardwareProfiles />,
            exact: true,
            label: 'Hardware profiles',
            path: '/settings/environment/hardware-profiles',
            title: 'RHOAI 3.1 Console | Environment Setup - Hardware Profiles',
          },
          {
            element: <ConnectionTypes />,
            exact: true,
            label: 'Connection types',
            path: '/settings/environment/connection-types',
            title: 'RHOAI 3.1 Console | Environment Setup - Connection Types',
          },
        ],
      },
      {
        label: 'Model resources and operations',
        routes: [
          {
            element: <ServingRuntimes />,
            exact: true,
            label: 'Serving runtimes',
            path: '/settings/model-resources/serving-runtimes',
            title: 'RHOAI 3.1 Console | Model Resources - Serving Runtimes',
          },
          {
            element: <ModelRegistrySettings />,
            exact: true,
            label: 'Model registry settings',
            path: '/settings/model-resources/registry-settings',
            title: 'RHOAI 3.1 Console | Model Resources - Registry Settings',
          },
        ],
      },
      {
        element: <UserManagement />,
        exact: true,
        label: 'User management',
        path: '/settings/user-management',
        title: 'RHOAI 3.1 Console | Settings - User Management',
      },
      {
        element: <Policies />,
        exact: true,
        label: 'Policies',
        path: '/settings/policies',
        title: 'RHOAI 3.1 Console | Settings - Policies',
      },
    ],
  },
  // Additional routes not in navigation
  {
    element: <DeployModelWizard />,
    exact: true,
    path: '/ai-hub/deployments/deploy',
    title: 'RHOAI 3.1 Console | Deploy Model',
  },
  {
    element: <RegisterModel />,
    exact: true,
    path: '/ai-hub/registry/new-model',
    title: 'RHOAI 3.1 Console | Register Model',
  },
  {
    element: <ModelDetails />,
    exact: true,
    path: '/ai-assets/models/:modelSlug',
    title: 'RHOAI 3.1 Console | Model Details',
  },
  {
    element: <Models />,
    exact: true,
    path: '/ai-assets/models',
    title: 'RHOAI 3.1 Console | Models',
  },
  {
    element: <MVPServers />,
    exact: true,
    path: '/ai-assets/mvp-servers',
    title: 'RHOAI 3.1 Console | MCP Servers',
  },
  {
    element: <MCPServerDetails />,
    exact: true,
    path: '/ai-assets/mvp-servers/:serverSlug',
    title: 'RHOAI 3.1 Console | MCP Server Details',
  },
  {
    element: <SearchResults />,
    exact: true,
    path: '/ai-assets/mvp-servers/search',
    title: 'RHOAI 3.1 Console | Search Results',
  },
  {
    element: <CreateGuardrail />,
    exact: true,
    path: '/ai-assets/guardrails/create',
    title: 'RHOAI 3.1 Console | Create Guardrail',
  },
  {
    element: <Guardrails />,
    exact: true,
    path: '/ai-assets/guardrails',
    title: 'RHOAI 3.1 Console | Guardrails',
  },
  {
    element: <Tracing />,
    exact: true,
    path: '/observability/tracing',
    title: 'RHOAI 3.1 Console | Observability - Tracing',
  },
  {
    element: <RAG />,
    exact: true,
    path: '/observability/rag',
    title: 'RHOAI 3.1 Console | Observability - RAG',
  },
  {
    element: <ObservabilityEvaluations />,
    exact: true,
    path: '/observability/evaluations',
    title: 'RHOAI 3.1 Console | Observability - Evaluations',
  },
  {
    element: <FeatureFlags />,
    exact: true,
    path: '/feature-flags',
    title: 'RHOAI 3.1 Console | Feature Flags',
  },
  {
    element: <PolicyDetails />,
    exact: true,
    path: '/settings/policies/:policyId',
    title: 'RHOAI 3.1 Console | Settings - Policy Details',
  },
  {
    element: <PolicyDetails />,
    exact: true,
    path: '/settings/policies/:policyId/:tab',
    title: 'RHOAI 3.1 Console | Settings - Policy Details',
  },
];

const filterRoutesByFlags = (routes: AppRouteConfig[], flags: any): AppRouteConfig[] => {
  return routes.map((route) => {
    if ('routes' in route && route.routes) {
      // This is a group, recursively filter its routes
      const filteredSubRoutes = filterRoutesByFlags(route.routes, flags);
      // Only include the group if it has at least one visible route
      if (filteredSubRoutes.length > 0) {
        return { ...route, routes: filteredSubRoutes };
      }
      return null;
    } else if ('element' in route) {
      // This is a route, check if it should be shown
      if (route.featureFlag) {
        return flags[route.featureFlag] ? route : null;
      }
      return route;
    }
    return route;
  }).filter((route): route is AppRouteConfig => route !== null);
};

const flattenRoutes = (routes: AppRouteConfig[]): IAppRoute[] => {
  const flattened: IAppRoute[] = [];
  
  routes.forEach((route) => {
    if ('routes' in route && route.routes) {
      // This is a group, recursively flatten its routes
      flattened.push(...flattenRoutes(route.routes));
    } else if ('element' in route) {
      // This is a route, add it directly
      flattened.push(route);
    }
  });
  
  return flattened;
};

const flattenedRoutes: IAppRoute[] = flattenRoutes(routes);

const AppRoutes = (): React.ReactElement => {
  // This component doesn't use feature flags for routing - that's handled in AppLayout
  // We keep all routes available so direct navigation works
  return (
    <Routes>
      {flattenedRoutes.map(({ path, element }, idx) => (
        <Route path={path} element={element} key={idx} />
      ))}
      <Route element={<NotFound />} />
    </Routes>
  );
};

export { AppRoutes, routes, filterRoutesByFlags };
