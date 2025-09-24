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
        element: <FeatureStore />,
        exact: true,
        label: 'Feature store',
        path: '/develop-train/feature-store',
        title: 'RHOAI 3.1 Console | Develop & Train - Feature Store',
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
    element: <Applications />,
    exact: true,
    label: 'Applications',
    path: '/applications',
    title: 'RHOAI 3.1 Console | Applications',
    icon: createFontAwesomeIcon('fa-light fa-code'),
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
