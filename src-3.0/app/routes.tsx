import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from '@app/Dashboard/Dashboard';
import { Models } from '@app/AIAssets/Models/Models';
import { ModelCatalog } from '@app/AIAssets/Models/ModelCatalog';
import { ModelRegistry } from '@app/AIAssets/Models/ModelRegistry';
import RegisterModel from '@app/AIAssets/Models/RegisterModel';
import { Deployments } from '@app/AIAssets/Deployments/Deployments';
import { DeployModelWizard } from '@app/AIAssets/Deployments/DeployModelWizard';
import { MVPServers } from '@app/AIAssets/MVPServers/MVPServers';
import { MCPServerDetails } from '@app/AIAssets/MVPServers/MCPServerDetails';
import { SearchResults } from '@app/AIAssets/MVPServers/SearchResults';
import { CreateGuardrail } from '@app/AIAssets/Guardrails/CreateGuardrail';
import AvailableAIAssets from '@app/AIAssets/AvailableAIAssets/AvailableAIAssets';
import ModelDetails from '@app/AIAssets/Models/ModelDetails';
import { ModelPlayground } from '@app/GenAIStudio/ModelPlayground/ModelPlayground';
import { AgentBuilder } from '@app/GenAIStudio/AgentBuilder/AgentBuilder';
import { MyAgents } from '@app/GenAIStudio/MyAgents/MyAgents';
import { PromptEngineering } from '@app/GenAIStudio/PromptEngineering/PromptEngineering';
import { KnowledgeSources } from '@app/GenAIStudio/KnowledgeSources/KnowledgeSources';
import { Tracing } from '@app/Observability/Tracing/Tracing';
import { RAG } from '@app/Observability/RAG/RAG';
import { FeatureFlags } from '@app/FeatureFlags/FeatureFlags';
import { NotFound } from '@app/NotFound/NotFound';
import { useFeatureFlags } from '@app/utils/FeatureFlagsContext';

export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  /* eslint-disable @typescript-eslint/no-explicit-any */
  element: React.ReactElement;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  exact?: boolean;
  path: string;
  title: string;
  routes?: undefined;
  techPreview?: boolean; // Add tech preview label to nav item
  disabled?: boolean; // Add disabled state for nav items
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
  disabled?: boolean; // Add disabled state for nav groups
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

// AI Playground route definition
const agentBuilderRoute: IAppRoute = {
  element: <AgentBuilder />,
  exact: true,
  label: 'Playground',
  path: '/gen-ai-studio/ai-playground',
  title: 'PatternFly Seed | Playground',
  techPreview: true,
};

interface MVPFlags {
  enableMVPMode: boolean;
  enableEvals: boolean;
  enableKnowledge: boolean;
  enableMCP: boolean;
  enableGuardrailsCatalog: boolean;
  enableAdvancedPromptEngineering: boolean;
  enableAdvancedAgentManagement: boolean;
  showDiscoverAssets: boolean;
}

const getRoutes = (agentBuilderMode: boolean, mvpFlags: MVPFlags): AppRouteConfig[] => {
  // If MVP mode is enabled, show streamlined navigation
  if (mvpFlags.enableMVPMode) {
    const mvpRoutes: AppRouteConfig[] = [
      {
        element: <Dashboard />,
        exact: true,
        label: 'Home',
        path: '/',
        title: 'PatternFly Seed | Home',
        disabled: true,
      },
      {
        element: <Dashboard />,
        exact: true,
        label: 'Projects',
        path: '/projects',
        title: 'PatternFly Seed | Projects',
        disabled: true,
      },
      {
        label: 'AI hub',
        routes: [
          {
            element: <ModelCatalog />,
            exact: true,
            label: 'Catalog',
            path: '/ai-hub/catalog',
            title: 'PatternFly Seed | Catalog',
          },
          {
            element: <ModelRegistry />,
            exact: true,
            label: 'Registry',
            path: '/ai-hub/registry',
            title: 'PatternFly Seed | Registry',
          },
          {
            element: <Deployments />,
            exact: true,
            label: 'Deployments',
            path: '/ai-hub/deployments',
            title: 'PatternFly Seed | Deployments',
          },
        ],
      },
    ];

    // Add deploy model wizard route (not in nav)
    mvpRoutes.push({
      element: <DeployModelWizard />,
      exact: true,
      path: '/ai-hub/deployments/deploy',
      title: 'PatternFly Seed | Deploy Model',
    });

    // Add register model route (not in nav)
    mvpRoutes.push({
      element: <RegisterModel />,
      exact: true,
      path: '/ai-hub/registry/new-model',
      title: 'PatternFly Seed | Register Model',
    });





    // Add Generative AI Studio dropdown navigation
    mvpRoutes.push({
      label: 'Generative AI studio',
      routes: [
        {
          element: <AvailableAIAssets />,
          exact: true,
          label: 'AI asset endpoints',
          path: '/ai-assets/available',
          title: 'PatternFly Seed | Available AI Assets',
          techPreview: true,
        },
        agentBuilderRoute,
      ],
    });

    // Add new top-level navigation items
    mvpRoutes.push(
      {
        label: 'Develop & train',
        disabled: true,
        routes: [
          {
            element: <Dashboard />,
            exact: true,
            label: 'Pipelines',
            path: '/develop-train/pipelines',
            title: 'PatternFly Seed | Pipelines',
            disabled: true,
          },
          {
            element: <Dashboard />,
            exact: true,
            label: 'Evaluations',
            path: '/develop-train/evaluations',
            title: 'PatternFly Seed | Evaluations',
            disabled: true,
          },
          {
            element: <Dashboard />,
            exact: true,
            label: 'Experiments',
            path: '/develop-train/experiments',
            title: 'PatternFly Seed | Experiments',
            disabled: true,
          },
        ],
      },
      {
        label: 'Observe & monitor',
        disabled: true,
        routes: [
          {
            element: <Dashboard />,
            exact: true,
            label: 'Workload metrics',
            path: '/observe-monitor/workload-metrics',
            title: 'PatternFly Seed | Workload metrics',
            disabled: true,
          },
          {
            element: <Dashboard />,
            exact: true,
            label: 'Training jobs',
            path: '/observe-monitor/training-jobs',
            title: 'PatternFly Seed | Training jobs',
            disabled: true,
          },
        ],
      },
      {
        element: <Dashboard />,
        exact: true,
        label: 'Learning resources',
        path: '/learning-resources',
        title: 'PatternFly Seed | Learning resources',
        disabled: true,
      },
      {
        element: <Dashboard />,
        exact: true,
        label: 'Applications',
        path: '/applications',
        title: 'PatternFly Seed | Applications',
        disabled: true,
      },
      {
        element: <Dashboard />,
        exact: true,
        label: 'Settings',
        path: '/settings',
        title: 'PatternFly Seed | Settings',
        disabled: true,
      }
    );

    // Add Available Assets group - always visible in MVP mode
    const aiAssets: IAppRoute[] = [
      {
        element: <Models />,
        exact: true,
        label: 'Models',
        path: '/ai-assets/models',
        title: 'PatternFly Seed | Models',
      }
    ];

    // Add conditionally enabled AI Assets
    if (mvpFlags.enableKnowledge) {
      aiAssets.push({
        element: <KnowledgeSources />,
        exact: true,
        label: 'RAG',
        path: '/gen-ai-studio/knowledge-sources',
        title: 'PatternFly Seed | Knowledge Sources',
      });
    }

    if (mvpFlags.enableMCP) {
      aiAssets.push({
        element: <MVPServers />,
        exact: true,
        label: 'MCP servers',
        path: '/ai-assets/mvp-servers',
        title: 'PatternFly Seed | MCP Servers',
      });
    }


    if (mvpFlags.showDiscoverAssets) {
      mvpRoutes.push({
        label: 'Discover assets',
        routes: aiAssets,
      });
    }

    // Add individual MVP features as first-level nav items

    if (mvpFlags.enableAdvancedPromptEngineering) {
      mvpRoutes.push({
        element: <PromptEngineering />,
        exact: true,
        label: 'Prompt engineering',
        path: '/gen-ai-studio/prompt-engineering',
        title: 'PatternFly Seed | Prompt Engineering',
        disabled: true,
      });
    }

    if (mvpFlags.enableAdvancedAgentManagement) {
      mvpRoutes.push({
        element: <MyAgents />,
        exact: true,
        label: 'My agents',
        path: '/gen-ai-studio/my-agents',
        title: 'PatternFly Seed | My Agents',
      });
    }

    // Always include core routes
    mvpRoutes.push(
      {
        element: <FeatureFlags />,
        exact: true,
        // No label - accessible but not in nav
        path: '/feature-flags',
        title: 'PatternFly Seed | Feature Flags',
      },
      {
        element: <CreateGuardrail />,
        exact: true,
        // No label - accessible but not in nav
        path: '/ai-assets/guardrails/create',
        title: 'PatternFly Seed | Create Guardrail',
      },
      {
        element: <MCPServerDetails />,
        exact: true,
        // No label - accessible but not in nav
        path: '/ai-assets/mvp-servers/:serverSlug',
        title: 'PatternFly Seed | MCP Server Details',
      },
      {
        element: <SearchResults />,
        exact: true,
        // No label - accessible but not in nav
        path: '/ai-assets/mvp-servers/search',
        title: 'PatternFly Seed | Search Results',
      },
      {
        element: <ModelDetails />,
        exact: true,
        // No label - accessible but not in nav
        path: '/ai-assets/models/:modelSlug',
        title: 'PatternFly Seed | Model Details',
      }
    );

    return mvpRoutes;
  }

  // Default full navigation when MVP mode is disabled
  const fullRoutes: AppRouteConfig[] = [
    {
      element: <Dashboard />,
      exact: true,
      label: 'Home',
      path: '/',
      title: 'PatternFly Seed | Home',
    },
    {
      element: <Dashboard />,
      exact: true,
      label: 'Projects',
      path: '/projects',
      title: 'PatternFly Seed | Projects',
    },
    {
      element: <Dashboard />,
      exact: true,
      label: 'AI Hub',
      path: '/ai-hub',
      title: 'PatternFly Seed | AI Hub',
    },

    {
      label: 'Generative AI studio',
      routes: [
        {
          element: <AvailableAIAssets />,
          exact: true,
          label: 'AI asset endpoints',
          path: '/ai-assets/available',
          title: 'PatternFly Seed | Available AI Assets',
          techPreview: true,
        },
        agentBuilderRoute,
      ],
    },
    {
      label: 'Develop & train',
      disabled: true,
      routes: [
        {
          element: <Dashboard />,
          exact: true,
          label: 'Workbenches',
          path: '/develop-train/workbenches',
          title: 'PatternFly Seed | Workbenches',
          disabled: true,
        },
        {
          element: <Dashboard />,
          exact: true,
          label: 'Model customization',
          path: '/develop-train/model-customization',
          title: 'PatternFly Seed | Model customization',
          disabled: true,
        },
        {
          element: <Dashboard />,
          exact: true,
          label: 'Experiments',
          path: '/develop-train/experiments',
          title: 'PatternFly Seed | Experiments',
          disabled: true,
        },
        {
          element: <Dashboard />,
          exact: true,
          label: 'Artifacts',
          path: '/develop-train/artifacts',
          title: 'PatternFly Seed | Artifacts',
          disabled: true,
        },
      ],
    },
    {
      element: <Dashboard />,
      exact: true,
      label: 'Observe & monitor',
      path: '/observe-monitor',
      title: 'PatternFly Seed | Observe & monitor',
      disabled: true,
    },
    {
      element: <Dashboard />,
      exact: true,
      label: 'Learning resources',
      path: '/learning-resources',
      title: 'PatternFly Seed | Learning resources',
    },
    {
      element: <Dashboard />,
      exact: true,
      label: 'Applications',
      path: '/applications',
      title: 'PatternFly Seed | Applications',
    },
    {
      element: <Dashboard />,
      exact: true,
      label: 'Settings',
      path: '/settings',
      title: 'PatternFly Seed | Settings',
    }
  ];

  // Add Discover Assets section conditionally
  if (mvpFlags.showDiscoverAssets) {
    fullRoutes.push({
      label: 'Discover assets',
      routes: [
        {
          element: <Models />,
          exact: true,
          label: 'Models',
          path: '/ai-assets/models',
          title: 'PatternFly Seed | Models',
        },
        {
          element: <MVPServers />,
          exact: true,
          label: 'MCP servers',
          path: '/ai-assets/mvp-servers',
          title: 'PatternFly Seed | MCP Servers',
        },
        {
          element: <CreateGuardrail />,
          exact: true,
          path: '/ai-assets/guardrails/create',
          title: 'PatternFly Seed | Create Guardrail',
        },
        {
          element: <MCPServerDetails />,
          exact: true,
          path: '/ai-assets/mvp-servers/:serverSlug',
          title: 'PatternFly Seed | MCP Server Details',
        },
        {
          element: <SearchResults />,
          exact: true,
          path: '/ai-assets/mvp-servers/search',
          title: 'PatternFly Seed | Search Results',
        },
        {
          element: <ModelDetails />,
          exact: true,
          path: '/ai-assets/models/:modelSlug',
          title: 'PatternFly Seed | Model Details',
        },
      ],
    });
  }

  // Always include core routes that need to be accessible
  fullRoutes.push(
    {
      element: <DeployModelWizard />,
      exact: true,
      path: '/ai-hub/deployments/deploy',
      title: 'PatternFly Seed | Deploy Model',
    },
    {
      element: <RegisterModel />,
      exact: true,
      path: '/ai-hub/registry/new-model',
      title: 'PatternFly Seed | Register Model',
    },
    {
      element: <CreateGuardrail />,
      exact: true,
      path: '/ai-assets/guardrails/create',
      title: 'PatternFly Seed | Create Guardrail',
    },
    {
      element: <MCPServerDetails />,
      exact: true,
      path: '/ai-assets/mvp-servers/:serverSlug',
      title: 'PatternFly Seed | MCP Server Details',
    },
    {
      element: <SearchResults />,
      exact: true,
      path: '/ai-assets/mvp-servers/search',
      title: 'PatternFly Seed | Search Results',
    },
    {
      element: <ModelDetails />,
      exact: true,
      path: '/ai-assets/models/:modelSlug',
      title: 'PatternFly Seed | Model Details',
    }
  );

  fullRoutes.push(
    {
      label: 'Generative AI Studio',
      routes: [
        {
          element: <ModelPlayground />,
          exact: true,
          label: 'Model playground',
          path: '/gen-ai-studio/model-playground',
          title: 'PatternFly Seed | Model Playground',
        },
        {
          element: <MyAgents />,
          exact: true,
          label: 'My agents',
          path: '/gen-ai-studio/my-agents',
          title: 'PatternFly Seed | My Agents',
        },
        {
          element: <PromptEngineering />,
          exact: true,
          label: 'Prompt engineering',
          path: '/gen-ai-studio/prompt-engineering',
          title: 'PatternFly Seed | Prompt Engineering',
          disabled: true,
        },
        {
          element: <KnowledgeSources />,
          exact: true,
          label: 'RAG',
          path: '/gen-ai-studio/knowledge-sources',
          title: 'PatternFly Seed | Knowledge Sources',
        },
      ],
    },
    {
      label: 'Observability',
      routes: [
        {
          element: <Tracing />,
          exact: true,
          label: 'Tracing',
          path: '/observability/tracing',
          title: 'PatternFly Seed | Tracing',
        },
        {
          element: <RAG />,
          exact: true,
          label: 'RAG',
          path: '/observability/rag',
          title: 'PatternFly Seed | RAG',
        },
      ],
    },
    {
      element: <FeatureFlags />,
      exact: true,
      // No label - accessible but not in nav
      path: '/feature-flags',
      title: 'PatternFly Seed | Feature Flags',
    }
  );

  return fullRoutes;
};

// Hook to get routes based on feature flags
const useRoutes = (): AppRouteConfig[] => {
  const { flags } = useFeatureFlags();
  
  const mvpFlags: MVPFlags = React.useMemo(() => ({
    enableMVPMode: flags.enableMVPMode,
    enableEvals: flags.enableEvals,
    enableKnowledge: flags.enableKnowledge,
    enableMCP: flags.enableMCP,
    enableGuardrailsCatalog: flags.enableGuardrailsCatalog,
    enableAdvancedPromptEngineering: flags.enableAdvancedPromptEngineering,
    enableAdvancedAgentManagement: flags.enableAdvancedAgentManagement,
    showDiscoverAssets: flags.showDiscoverAssets,
  }), [
    flags.enableMVPMode,
    flags.enableEvals,
    flags.enableKnowledge,
    flags.enableMCP,
    flags.enableGuardrailsCatalog,
    flags.enableAdvancedPromptEngineering,
    flags.enableAdvancedAgentManagement,
    flags.showDiscoverAssets
  ]);

  return React.useMemo(() => getRoutes(flags.agentBuilderMode, mvpFlags), [
    flags.agentBuilderMode, 
    mvpFlags
  ]);
};

const AppRoutes = (): React.ReactElement => {
  const routes = useRoutes();
  const flattenedRoutes: IAppRoute[] = routes.reduce(
    (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
    [] as IAppRoute[],
  );

  return (
    <Routes>
      {flattenedRoutes.map(({ path, element }, idx) => (
        <Route path={path} element={element} key={idx} />
      ))}
      <Route element={<NotFound />} />
    </Routes>
  );
};

// Export the hook for navigation use
export { AppRoutes, useRoutes };
