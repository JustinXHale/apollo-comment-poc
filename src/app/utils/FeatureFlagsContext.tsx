import * as React from 'react';

export interface FeatureFlags {
  showProjectWorkspaceDropdowns: boolean;
  agentBuilderMode: boolean;
  deploy: boolean;
  
  // Layout flags
  enableIDELayout: boolean;
  enableWorkflowLayout: boolean;
  
  // Agent Builder flags
  enableAgentTemplates: boolean;
  enableGuardrails: boolean;
  enableEvaluation: boolean;
  enableTracing: boolean;
  
  // Dashboard features
  enableModelPlaygroundCard: boolean;
  enablePromptEngineeringCard: boolean;
  enableMyAgentsCard: boolean;
  
  // MVP Mode flags
  enableMVPMode: boolean;
  enableEvals: boolean;
  enableKnowledge: boolean;
  enableMCP: boolean;
  enableGuardrailsCatalog: boolean;
  enableAdvancedPromptEngineering: boolean;
  enableAdvancedAgentManagement: boolean;
  showMcpFilters: boolean;
  showMcpConnectionUrl: boolean;
  
  // Navigation flags
  showDiscoverAssets: boolean;
  
  // Data persistence
  persistData: boolean;
  
  // API Key management
  enableGenerateApiKey: boolean;
  
  // Table columns
  showModelDescriptions: boolean;
  
  // View switchers
  enableCardTableViewSwitcher: boolean;
  
  // Model pages
  enableModelDescriptionPages: boolean;
  
  // MCP pages
  enableMcpDetailsPage: boolean;
  
  // Playground features
  firstTimePlayground: boolean;
  
  // Model catalog features
  modelPerformanceInCatalog: boolean;
  
  // Display features
  displayMode: boolean;
  
  // Gen AI Studio page access
  enableModelPlaygroundPage: boolean;
  enableMyAgentsPage: boolean;
  enablePromptEngineeringPage: boolean;
  enableKnowledgeSourcesPage: boolean;
}

interface AgentBuilderState {
  selectedModel: string;
  selectedMcpServers: string[];
  selectedKnowledgeSources: string[];
  selectedGuardrails: {
    input: string | null;
    output: string | null;
  };
}

interface FeatureFlagsContextType {
  flags: FeatureFlags;
  updateFlag: (key: keyof FeatureFlags, value: boolean) => void;
  enableAllLayoutFlags: () => void;
  disableAllLayoutFlags: () => void;
  enableAllMVPFlags: () => void;
  disableAllMVPFlags: () => void;
  resetFlags: () => void;
  agentBuilder: AgentBuilderState;
  updateAgentBuilder: (updates: Partial<AgentBuilderState>) => void;
  selectedProject: string;
  setSelectedProject: (project: string) => void;
}

const defaultFlags: FeatureFlags = {
  showProjectWorkspaceDropdowns: true,
  agentBuilderMode: true,
  deploy: false,
  
  // Layout flags - disabled by default
  enableIDELayout: false,
  enableWorkflowLayout: false,
  
  // Agent Builder flags - enable templates by default
  enableAgentTemplates: true,
  enableGuardrails: false,
  enableEvaluation: false,
  enableTracing: false,
  
  // Dashboard features - disabled by default
  enableModelPlaygroundCard: false,
  enablePromptEngineeringCard: false,
  enableMyAgentsCard: false,
  
  // MVP Mode flags - key features enabled by default
  enableMVPMode: true,
  enableEvals: false,
  enableKnowledge: false,
  enableMCP: true,
  enableGuardrailsCatalog: false,
  enableAdvancedPromptEngineering: false,
  enableAdvancedAgentManagement: false,
  showMcpFilters: false,
  showMcpConnectionUrl: true,
  
  // Navigation flags - disabled by default
  showDiscoverAssets: false,
  
  // Data persistence - disabled by default
  persistData: false,
  
  // API Key management - disabled by default
  enableGenerateApiKey: false,
  
  // Table columns - enabled by default
  showModelDescriptions: true,
  
  // View switchers - disabled by default
  enableCardTableViewSwitcher: false,
  
  // Model pages - disabled by default
  enableModelDescriptionPages: false,
  
  // MCP pages - disabled by default
  enableMcpDetailsPage: false,
  
  // Playground features - disabled by default
  firstTimePlayground: false,
  
  // Model catalog features - disabled by default
  modelPerformanceInCatalog: false,
  
  // Display features - disabled by default
  displayMode: false,
  
  // Gen AI Studio page access - disabled by default
  enableModelPlaygroundPage: false,
  enableMyAgentsPage: false,
  enablePromptEngineeringPage: false,
  enableKnowledgeSourcesPage: false,
};

const defaultAgentBuilder: AgentBuilderState = {
  selectedModel: 'Claude 3 Opus',
  selectedMcpServers: [],
  selectedKnowledgeSources: [],
  selectedGuardrails: {
    input: null,
    output: null,
  },
};

const FeatureFlagsContext = React.createContext<FeatureFlagsContextType | undefined>(undefined);

export const FeatureFlagsProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const [flags, setFlags] = React.useState<FeatureFlags>(() => {
    // Load from localStorage if available, otherwise use defaults
    const saved = localStorage.getItem('featureFlags');
    return saved ? { ...defaultFlags, ...JSON.parse(saved) } : defaultFlags;
  });

  const [agentBuilder, setAgentBuilder] = React.useState<AgentBuilderState>(() => {
    // Load from localStorage if available, otherwise use defaults
    const saved = localStorage.getItem('agentBuilderState');
    return saved ? { ...defaultAgentBuilder, ...JSON.parse(saved) } : defaultAgentBuilder;
  });

  const [selectedProject, setSelectedProjectState] = React.useState<string>(() => {
    // Load from localStorage if available, otherwise use default
    const saved = localStorage.getItem('selectedProject');
    return saved ? JSON.parse(saved) : 'Project X';
  });

  const updateFlag = React.useCallback((key: keyof FeatureFlags, value: boolean) => {
    setFlags(prev => {
      const newFlags = { ...prev, [key]: value };
      // Persist to localStorage
      localStorage.setItem('featureFlags', JSON.stringify(newFlags));
      return newFlags;
    });
  }, []);

  const updateAgentBuilder = React.useCallback((updates: Partial<AgentBuilderState>) => {
    setAgentBuilder(prev => {
      const newState = { ...prev, ...updates };
      // Persist to localStorage
      localStorage.setItem('agentBuilderState', JSON.stringify(newState));
      return newState;
    });
  }, []);

  const setSelectedProject = React.useCallback((project: string) => {
    setSelectedProjectState(project);
    // Persist to localStorage
    localStorage.setItem('selectedProject', JSON.stringify(project));
  }, []);

  const enableAllLayoutFlags = React.useCallback(() => {
    setFlags(prev => {
      const newFlags = { 
        ...prev, 
        enableIDELayout: true,
        enableWorkflowLayout: true,
        enableMVPMode: true
      };
      localStorage.setItem('featureFlags', JSON.stringify(newFlags));
      return newFlags;
    });
  }, []);

  const disableAllLayoutFlags = React.useCallback(() => {
    setFlags(prev => {
      const newFlags = { 
        ...prev, 
        enableIDELayout: false,
        enableWorkflowLayout: false,
        enableMVPMode: false
      };
      localStorage.setItem('featureFlags', JSON.stringify(newFlags));
      return newFlags;
    });
  }, []);

  const enableAllMVPFlags = React.useCallback(() => {
    setFlags(prev => {
      const newFlags = { 
        ...prev, 
        enableEvals: true,
        enableKnowledge: true,
        enableMCP: true,
        enableGuardrailsCatalog: true,
        enableAdvancedPromptEngineering: true,
        enableAdvancedAgentManagement: true,
      };
      localStorage.setItem('featureFlags', JSON.stringify(newFlags));
      return newFlags;
    });
  }, []);

  const disableAllMVPFlags = React.useCallback(() => {
    setFlags(prev => {
      const newFlags = { 
        ...prev, 
        enableEvals: false,
        enableKnowledge: false,
        enableMCP: false,
        enableGuardrailsCatalog: false,
        enableAdvancedPromptEngineering: false,
        enableAdvancedAgentManagement: false,
      };
      localStorage.setItem('featureFlags', JSON.stringify(newFlags));
      return newFlags;
    });
  }, []);

  const resetFlags = React.useCallback(() => {
    setFlags(defaultFlags);
    localStorage.setItem('featureFlags', JSON.stringify(defaultFlags));
  }, []);

  const contextValue = React.useMemo(() => ({
    flags,
    updateFlag,
    enableAllLayoutFlags,
    disableAllLayoutFlags,
    enableAllMVPFlags,
    disableAllMVPFlags,
    resetFlags,
    agentBuilder,
    updateAgentBuilder,
    selectedProject,
    setSelectedProject,
  }), [flags, updateFlag, enableAllLayoutFlags, disableAllLayoutFlags, enableAllMVPFlags, disableAllMVPFlags, resetFlags, agentBuilder, updateAgentBuilder, selectedProject, setSelectedProject]);

  return (
    <FeatureFlagsContext.Provider value={contextValue}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export const useFeatureFlags = (): FeatureFlagsContextType => {
  const context = React.useContext(FeatureFlagsContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
}; 