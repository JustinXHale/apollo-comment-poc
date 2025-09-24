import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from '@app/Dashboard/Dashboard';
import { Support } from '@app/Support/Support';
import { GeneralSettings } from '@app/Settings/General/GeneralSettings';
import { ProfileSettings } from '@app/Settings/Profile/ProfileSettings';
import { NotFound } from '@app/NotFound/NotFound';

// New components
import { Home } from '@app/Home/Home';
import { Projects } from '@app/Projects/Projects';
import { Catalog } from '@app/AIHub/Catalog/Catalog';
import { Registry } from '@app/AIHub/Registry/Registry';
import { Deployments } from '@app/AIHub/Deployments/Deployments';
import { AssetEndpoints } from '@app/GenAIStudio/AssetEndpoints/AssetEndpoints';
import { Playground } from '@app/GenAIStudio/Playground/Playground';
import { KnowledgeSources } from '@app/GenAIStudio/KnowledgeSources/KnowledgeSources';
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
    element: <Projects />,
    exact: true,
    label: 'Projects',
    path: '/projects',
    title: 'RHOAI 3.1 Console | Projects',
    icon: createFontAwesomeIcon('fa-light fa-folder'),
  },
  {
    label: 'AI hub',
    icon: createFontAwesomeIcon('fa-light fa-brain'),
    routes: [
      {
        element: <Catalog />,
        exact: true,
        label: 'Catalog',
        path: '/ai-hub/catalog',
        title: 'RHOAI 3.1 Console | AI Hub - Catalog',
      },
      {
        element: <Registry />,
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
        element: <AssetEndpoints />,
        exact: true,
        label: 'AI asset endpoints',
        path: '/gen-ai-studio/asset-endpoints',
        title: 'RHOAI 3.1 Console | Gen AI Studio - AI Asset Endpoints',
      },
      {
        element: <Playground />,
        exact: true,
        label: 'Playground',
        path: '/gen-ai-studio/playground',
        title: 'RHOAI 3.1 Console | Gen AI Studio - Playground',
      },
      {
        element: <KnowledgeSources />,
        exact: true,
        label: 'Knowledge sources',
        path: '/gen-ai-studio/knowledge-sources',
        title: 'RHOAI 3.1 Console | Gen AI Studio - Knowledge Sources',
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
        element: <APIKeys />,
        exact: true,
        label: 'API keys',
        path: '/settings/api-keys',
        title: 'RHOAI 3.1 Console | Settings - API Keys',
      },
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
    ],
  },
];

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

const AppRoutes = (): React.ReactElement => (
  <Routes>
    {flattenedRoutes.map(({ path, element }, idx) => (
      <Route path={path} element={element} key={idx} />
    ))}
    <Route element={<NotFound />} />
  </Routes>
);

export { AppRoutes, routes };
