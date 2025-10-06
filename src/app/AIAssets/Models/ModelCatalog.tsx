import * as React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  Grid,
  GridItem,
  InputGroup,
  InputGroupItem,
  Label,
  LabelGroup,
  MenuToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  PageSection,
  SearchInput,
  Sidebar,
  SidebarContent,
  SidebarPanel,
  Switch,
  Tab,
  TabTitleText,
  Tabs,
  Title,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Tooltip
} from '@patternfly/react-core';
import {
  AngleLeftIcon,
  AngleRightIcon,
  CubeIcon,
  FilterIcon,
  MonitoringIcon,
  OutlinedQuestionCircleIcon,
} from '@patternfly/react-icons';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import { useFeatureFlags } from '../../utils/FeatureFlagsContext';
import ValidatedModelIcon from '@app/assets/validated-model.svg';
import RedHatIcon from '@app/assets/the-hat.svg';
import GenericModelSvgIcon from '@app/assets/generic-model-icon.svg';
import ModelCatalogIcon from '@app/assets/orig-model-catalog-icon.svg';

interface ModelCard {
  id: string;
  name: string;
  description: string;
  accuracy?: string;
  hardware?: string;
  rps?: string;
  ttft?: string;
  benchmarks?: number;
  validated?: boolean;
  provider: string;
  task: string[];
  additionalTasks?: string[];
  license: string;
  language: string[];
}

const ModelCatalog: React.FunctionComponent = () => {
  useDocumentTitle('Model Catalog');
  const { flags } = useFeatureFlags();

  // State for filters
  const [selectedTasks, setSelectedTasks] = React.useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = React.useState<string[]>([]);
  const [selectedLicenses, setSelectedLicenses] = React.useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState<string | number>(0);
  const [activeFilterTab, setActiveFilterTab] = React.useState<string | number>(0);
  const [performanceFiltersEnabled, setPerformanceFiltersEnabled] = React.useState(false);

  // Filter dropdown state
  const [filterDropdownOpen, setFilterDropdownOpen] = React.useState(false);
  const [filterAttribute, setFilterAttribute] = React.useState<'name' | 'keyword' | 'description'>('keyword');
  const [filterInput, setFilterInput] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState<{
    name: string[];
    keyword: string[];
    description: string[];
  }>({
    name: [],
    keyword: [],
    description: []
  });
  const [showAllTasks, setShowAllTasks] = React.useState(false);
  
  // Search state for filter categories
  const [taskSearch, setTaskSearch] = React.useState('');
  const [providerSearch, setProviderSearch] = React.useState('');
  const [licenseSearch, setLicenseSearch] = React.useState('');
  const [languageSearch, setLanguageSearch] = React.useState('');
  
  // State to track which cards show expanded tasks
  const [expandedTaskCards, setExpandedTaskCards] = React.useState<Set<string>>(new Set());
  
  // State to track current benchmark index for each model
  const [benchmarkIndices, setBenchmarkIndices] = React.useState<Record<string, number>>({});
  
  // Modal state for benchmark information
  const [isBenchmarkModalOpen, setIsBenchmarkModalOpen] = React.useState(false);
  
  // Modal state for feature not available
  const [isFeatureModalOpen, setIsFeatureModalOpen] = React.useState(false);

  // Model name click handler
  const handleModelNameClick = () => {
    setIsFeatureModalOpen(true);
  };

  // Mock data for model cards
  const mockModels: ModelCard[] = [
    // Red Hat AI validated models (4 models)
    {
      id: '1',
      name: 'Qwen2.5-7B-Instruct',
      description: 'Quantized version of DeepSeek-R1-Distill-Llama-8B',
      accuracy: '53.9%',
      hardware: 'H100-80',
      rps: '1',
      ttft: '1428 ms',
      benchmarks: 1,
      validated: true,
      provider: 'Red Hat',
      task: ['Text generation'],
      additionalTasks: ['Summarization', 'Translation', 'Code generation'],
      license: 'Apache-2.0',
      language: ['English']
    },
    {
      id: '2',
      name: 'Llama-3.1-8B-Instruct',
      description: 'Meta Llama 3.1 instruction-tuned model optimized for dialogue use cases',
      accuracy: '61.2%',
      hardware: 'H100-80',
      rps: '2',
      ttft: '1120 ms',
      benchmarks: 1,
      validated: true,
      provider: 'Red Hat',
      task: ['Text generation', 'Question answering'],
      additionalTasks: ['Conversation', 'Reasoning', 'Content creation'],
      license: 'llama3',
      language: ['English']
    },
    {
      id: '3',
      name: 'Mistral-7B-Instruct-v0.3',
      description: 'Mistral 7B Instruct model fine-tuned for instruction following',
      accuracy: '58.7%',
      hardware: 'A100-40',
      rps: '1',
      ttft: '980 ms',
      benchmarks: 1,
      validated: true,
      provider: 'Red Hat',
      task: ['Text generation'],
      additionalTasks: ['Instruction following', 'Multi-language', 'Fine-tuning'],
      license: 'Apache-2.0',
      language: ['English', 'Spanish']
    },
    {
      id: '4',
      name: 'CodeLlama-7B-Instruct',
      description: 'Code Llama model specialized for code generation and understanding',
      accuracy: '45.8%',
      hardware: 'H100-80',
      rps: '1',
      ttft: '1250 ms',
      benchmarks: 1,
      validated: true,
      provider: 'Red Hat',
      task: ['Text generation'],
      additionalTasks: ['Code completion', 'Bug fixing', 'Documentation'],
      license: 'llama3',
      language: ['English']
    },
    // Red Hat AI models (non-validated, 4 models)
    {
      id: '5',
      name: 'prometheus-8x7b-v2-0',
      description: 'Prometheus 2 is an alternative of GPT-4 evaluation when doing fine-grained evaluation',
      provider: 'Red Hat',
      task: ['Text generation'],
      additionalTasks: ['Model evaluation', 'Performance analysis', 'Benchmarking'],
      license: 'llama3',
      language: ['English']
    },
    {
      id: '6',
      name: 'Red Hat Enterprise AI Base',
      description: 'Red Hat proprietary foundation model for enterprise applications',
      provider: 'Red Hat',
      task: ['Text generation', 'Question answering'],
      additionalTasks: ['Enterprise support', 'Custom training', 'Integration'],
      license: 'Apache-2.0',
      language: ['English']
    },
    {
      id: '7',
      name: 'RHAI-Granite-13B',
      description: 'Red Hat AI Granite model optimized for enterprise workloads',
      provider: 'Red Hat',
      task: ['Text generation'],
      additionalTasks: ['Enterprise optimization', 'Scalability', 'Security'],
      license: 'Apache-2.0',
      language: ['English']
    },
    {
      id: '8',
      name: 'OpenShift AI Assistant',
      description: 'Specialized model for OpenShift and Kubernetes operations assistance',
      provider: 'Red Hat',
      task: ['Question answering'],
      additionalTasks: ['DevOps support', 'Troubleshooting', 'Configuration'],
      license: 'Apache-2.0',
      language: ['English']
    },
    // Community and custom models (4 models)
    {
      id: '9',
      name: 'DeepSeek-R1-Distill-Llama-8B-FP8-dynamic',
      description: 'Quantized version of DeepSeek-R1-Distill-Llama-8B',
      provider: 'Community',
      task: ['Text generation', 'Question answering'],
      additionalTasks: ['Code review', 'Data analysis', 'Creative writing'],
      license: 'MIT',
      language: ['Chinese', 'English']
    },
    {
      id: '10',
      name: 'Vicuna-13B-v1.5',
      description: 'Open-source chatbot trained by fine-tuning LLaMA on user-shared conversations',
      provider: 'Community',
      task: ['Text generation'],
      additionalTasks: ['Conversation', 'Roleplay', 'Creative writing'],
      license: 'Apache-2.0',
      language: ['English']
    },
    {
      id: '11',
      name: 'WizardCoder-15B-V1.0',
      description: 'Code generation model trained on diverse programming tasks',
      provider: 'Community',
      task: ['Text generation'],
      additionalTasks: ['Algorithm design', 'Code optimization', 'Testing'],
      license: 'MIT',
      language: ['English']
    },
    {
      id: '12',
      name: 'Alpaca-7B',
      description: 'Instruction-following model fine-tuned from LLaMA base model',
      provider: 'Community',
      task: ['Text generation', 'Question answering'],
      additionalTasks: ['Instruction tuning', 'Educational content', 'Research'],
      license: 'Apache-2.0',
      language: ['English']
    }
  ];

  // Filter options
  const taskOptions = ['Text generation', 'Any-to-Any', 'Image-Text-to-Text', 'Image-to-Text', 'Image-to-Image', 'Question answering', 'Text classification', 'Summarization', 'Translation'];
  const providerOptions = ['Red Hat', 'Google', 'Meta', 'Deepseek', 'Salesforce'];
  const licenseOptions = ['Apache-2.0', 'llama3', 'MIT'];
  const languageOptions = ['English', 'Japanese', 'Spanish', 'Chinese'];

  // Helper functions to filter options based on search
  const getFilteredTasks = () => {
    const filtered = taskOptions.filter(task => 
      task.toLowerCase().includes(taskSearch.toLowerCase())
    );
    return showAllTasks ? filtered : filtered.slice(0, 6);
  };

  const getFilteredProviders = () => {
    return providerOptions.filter(provider => 
      provider.toLowerCase().includes(providerSearch.toLowerCase())
    );
  };

  const getFilteredLicenses = () => {
    return licenseOptions.filter(license => 
      license.toLowerCase().includes(licenseSearch.toLowerCase())
    );
  };

  const getFilteredLanguages = () => {
    return languageOptions.filter(language => 
      language.toLowerCase().includes(languageSearch.toLowerCase())
    );
  };


  // Filter functions
  const getFilteredModels = () => {
    return mockModels.filter(model => {
      // Check active text filters
      const matchesNameFilters = activeFilters.name.length === 0 ||
        activeFilters.name.some(filter => model.name.toLowerCase().includes(filter.toLowerCase()));
      
      const matchesKeywordFilters = activeFilters.keyword.length === 0 ||
        activeFilters.keyword.some(filter => 
          model.name.toLowerCase().includes(filter.toLowerCase()) ||
          model.description.toLowerCase().includes(filter.toLowerCase()) ||
          model.task.some(task => task.toLowerCase().includes(filter.toLowerCase()))
        );
      
      const matchesDescriptionFilters = activeFilters.description.length === 0 ||
        activeFilters.description.some(filter => model.description.toLowerCase().includes(filter.toLowerCase()));
      
      // Check sidebar filters
      const matchesTask = selectedTasks.length === 0 || 
        selectedTasks.some(task => model.task.includes(task));
      
      const matchesProvider = selectedProviders.length === 0 || 
        selectedProviders.includes(model.provider);
      
      const matchesLicense = selectedLicenses.length === 0 || 
        selectedLicenses.includes(model.license);
      
      const matchesLanguage = selectedLanguages.length === 0 || 
        selectedLanguages.some(lang => model.language.includes(lang));

      return matchesNameFilters && matchesKeywordFilters && matchesDescriptionFilters && 
             matchesTask && matchesProvider && matchesLicense && matchesLanguage;
    });
  };

  const getValidatedModels = () => getFilteredModels().filter(model => model.validated);
  const getRedHatModels = () => getFilteredModels().filter(model => model.provider === 'Red Hat' && !model.validated);
  const getCommunityModels = () => getFilteredModels().filter(model => model.provider !== 'Red Hat');

  // Filter handlers
  const handleTaskFilter = (task: string, checked: boolean) => {
    setSelectedTasks(prev => 
      checked ? [...prev, task] : prev.filter(t => t !== task)
    );
  };

  const handleProviderFilter = (provider: string, checked: boolean) => {
    setSelectedProviders(prev => 
      checked ? [...prev, provider] : prev.filter(p => p !== provider)
    );
  };

  const handleLicenseFilter = (license: string, checked: boolean) => {
    setSelectedLicenses(prev => 
      checked ? [...prev, license] : prev.filter(l => l !== license)
    );
  };

  const handleLanguageFilter = (language: string, checked: boolean) => {
    setSelectedLanguages(prev => 
      checked ? [...prev, language] : prev.filter(l => l !== language)
    );
  };

  // Filter management functions
  const addFilter = (attribute: 'name' | 'keyword' | 'description', value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [attribute]: [...prev[attribute], value]
    }));
  };

  const removeFilter = (attribute: 'name' | 'keyword' | 'description', value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [attribute]: prev[attribute].filter(item => item !== value)
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({
      name: [],
      keyword: [],
      description: []
    });
  };

  const getFilterPlaceholder = () => {
    switch (filterAttribute) {
      case 'name':
        return 'Filter by name';
      case 'keyword':
        return 'Filter by keyword';
      case 'description':
        return 'Filter by description';
      default:
        return 'Filter by keyword';
    }
  };

  // Function to toggle expanded tasks for a specific card
  const toggleExpandedTasks = (modelId: string) => {
    setExpandedTaskCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(modelId)) {
        newSet.delete(modelId);
      } else {
        newSet.add(modelId);
      }
      return newSet;
    });
  };

  // Functions to handle benchmark navigation
  const getCurrentBenchmarkIndex = (modelId: string) => {
    return benchmarkIndices[modelId] || 1; // Default to 1
  };

  const handleBenchmarkNavigation = (modelId: string, direction: 'left' | 'right') => {
    setBenchmarkIndices(prev => {
      const currentIndex = prev[modelId] || 1;
      let newIndex = currentIndex;
      
      if (direction === 'right') {
        newIndex = currentIndex < 3 ? currentIndex + 1 : 1; // Wrap to 1 after 3
      } else {
        newIndex = currentIndex > 1 ? currentIndex - 1 : 3; // Wrap to 3 before 1
      }
      
      return {
        ...prev,
        [modelId]: newIndex
      };
    });
  };

  // Render model card
  const renderModelCard = (model: ModelCard) => (
    <GridItem key={model.id} xl={3} lg={3} md={6} sm={12}>
      <Card isCompact style={{ height: '100%' }}>
        <CardHeader style={{ paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {model.validated ? (
              <div 
                style={{ width: '20px', height: '20px' }}
                dangerouslySetInnerHTML={{ __html: ValidatedModelIcon }}
              />
            ) : model.provider === 'Red Hat' ? (
              <div 
                style={{ width: '20px', height: '20px' }}
                dangerouslySetInnerHTML={{ __html: RedHatIcon }}
              />
            ) : (
              <div 
                style={{ width: '20px', height: '20px' }}
                dangerouslySetInnerHTML={{ __html: GenericModelSvgIcon }}
              />
            )}
            {model.validated ? (
              <Label variant="filled" color="purple">
                Validated
              </Label>
            ) : model.provider === 'Red Hat' ? (
              <Label variant="filled" color="grey">
                Red Hat
              </Label>
            ) : null}
          </div>
        </CardHeader>
        <CardBody style={{ paddingTop: '1.5rem' }}>
          <Button
            variant="link"
            isInline
            onClick={handleModelNameClick}
            style={{ 
              fontSize: '0.875rem', 
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              padding: '0.25rem 0',
              textAlign: 'left',
              height: 'auto',
              lineHeight: '1.2',
              textDecoration: 'none'
            }}
          >
            {model.name}
          </Button>
          {!model.validated && (
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#6a6e73', 
              marginBottom: '1rem',
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {model.description}
            </p>
          )}
          
          {model.accuracy && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {model.validated && <MonitoringIcon style={{ fontSize: model.validated ? '0.875rem' : '1.25rem', color: '#6a6e73' }} />}
                  <span style={{ fontSize: model.validated ? '0.875rem' : '1.25rem', fontWeight: 'bold' }}>{model.accuracy}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6a6e73' }}>Average accuracy</span>
                  <Tooltip content="microcopy coming soon">
                    <OutlinedQuestionCircleIcon style={{ fontSize: '0.75rem', color: '#6a6e73' }} />
                  </Tooltip>
                </div>
              </div>
              
              {model.validated && (
                <hr style={{ 
                  border: 'none', 
                  borderTop: '1px solid #d2d2d2', 
                  margin: '0.75rem 0',
                  width: '100%'
                }} />
              )}
              
              {getCurrentBenchmarkIndex(model.id) === 1 ? (
                <>
                  <div style={{ display: 'flex', fontSize: '0.75rem', color: '#6a6e73' }}>
                    <span style={{ flex: '1', minWidth: '80px' }}><strong>8 x {model.hardware}</strong></span>
                    <span style={{ flex: '1', minWidth: '60px' }}><strong>1</strong></span>
                    <span style={{ flex: '1', minWidth: '60px' }}><strong>{model.ttft}</strong></span>
                  </div>
                  <div style={{ display: 'flex', fontSize: '0.75rem', color: '#6a6e73' }}>
                    <span style={{ flex: '1', minWidth: '80px' }}>Hardware</span>
                    <span style={{ flex: '1', minWidth: '60px' }}>RPS/rep</span>
                    <span style={{ flex: '1', minWidth: '60px' }}>TTFT</span>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '2.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6a6e73' }}>
                    benchmark {getCurrentBenchmarkIndex(model.id)}
                  </span>
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: 'auto' }}>
            {model.benchmarks && (
              <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: '#6a6e73' }}>
                  {getCurrentBenchmarkIndex(model.id)} of 3 <Button variant="link" isInline style={{ fontSize: '0.75rem', padding: 0, textDecoration: 'underline' }} onClick={() => setIsBenchmarkModalOpen(true)}>benchmarks</Button>
                </span>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <Button 
                    variant="plain" 
                    style={{ padding: '0.125rem', minWidth: 'auto', height: 'auto' }}
                    onClick={() => handleBenchmarkNavigation(model.id, 'left')}
                  >
                    <AngleLeftIcon style={{ fontSize: '0.75rem' }} />
                  </Button>
                  <Button 
                    variant="plain" 
                    style={{ padding: '0.125rem', minWidth: 'auto', height: 'auto' }}
                    onClick={() => handleBenchmarkNavigation(model.id, 'right')}
                  >
                    <AngleRightIcon style={{ fontSize: '0.75rem' }} />
                  </Button>
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              {model.provider === 'Red Hat' && !model.validated && (
                <Label variant="filled" color="orange">LAB judge</Label>
              )}
              {model.provider !== 'Red Hat' ? (
                <>
                  <Label variant="outline">Text generation</Label>
                  <Label variant="outline">Question answering</Label>
                  <Label variant="outline">Chinese</Label>
                </>
              ) : (
                <>
                  <Label variant="outline">Task_name</Label>
                  <Label variant="outline">Provider</Label>
                </>
              )}
              {model.additionalTasks && !expandedTaskCards.has(model.id) && !(model.provider === 'Red Hat' && !model.validated) && (
                <Button 
                  variant="link" 
                  isInline 
                  style={{ fontSize: '0.75rem', padding: '0.125rem 0.25rem', height: 'auto', minHeight: 'auto' }}
                  onClick={() => toggleExpandedTasks(model.id)}
                >
                  3 more
                </Button>
              )}
              {model.additionalTasks && expandedTaskCards.has(model.id) && (
                <>
                  {model.additionalTasks.map((task, index) => (
                    <Label key={index} variant="outline">{task}</Label>
                  ))}
                  <Button 
                    variant="link" 
                    isInline 
                    style={{ fontSize: '0.75rem', padding: '0.125rem 0.25rem', height: 'auto', minHeight: 'auto' }}
                    onClick={() => toggleExpandedTasks(model.id)}
                  >
                    Show less
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </GridItem>
  );

  return (
    <PageSection isFilled style={{ padding: 0 }}>
      {/* Header */}
      <div style={{ padding: '1rem', paddingBottom: '0' }}>
        <Title headingLevel="h1" size="2xl" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ background: '#daf2f2', borderRadius: '20px', padding: '4px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div 
              style={{ width: '2.25em', height: '2.25em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              dangerouslySetInnerHTML={{ __html: ModelCatalogIcon }}
            />
          </div>
          Catalog
        </Title>
        <p style={{ color: '#6A6E73', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Discover models provided by Red Hat and other providers that are available for your organization to register, deploy, and customize.
        </p>
      </div>
      
      <Sidebar>
        <SidebarPanel 
          width={{ default: 'width_25' }}
          style={{ 
            borderRight: '1px solid #d2d2d2',
            flex: '0 0 240px',
            maxWidth: '240px'
          }}
        >
          {/* Filter Sidebar */}
          <div style={{ padding: '0 1rem 1rem 1rem' }}>
            {/* Explore model performance card */}
            {flags.modelPerformanceInCatalog && (
              <div style={{ 
                backgroundColor: '#f8f9fa',
                border: '1px solid #d2d2d2',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CubeIcon style={{ fontSize: '1rem', color: '#6366f1' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
                      Explore model performance
                    </span>
                  </div>
                  <Switch
                    id="performance-filters"
                    isChecked={performanceFiltersEnabled}
                    onChange={(_event, checked) => setPerformanceFiltersEnabled(checked)}
                    aria-label="Enable performance filters"
                  />
                </div>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280', 
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  Enable performance filters and show only models with benchmark data
                </p>
              </div>
            )}

            {/* Filter Tabs */}
            {flags.modelPerformanceInCatalog ? (
              <Tabs 
                activeKey={activeFilterTab} 
                onSelect={(_event, tabIndex) => setActiveFilterTab(tabIndex)}
              >
              <Tab eventKey={0} title={<TabTitleText>Global</TabTitleText>}>
                <div>
                  {/* Task Filter */}
                  <div style={{ marginBottom: '1.5rem' }}>
              <Title headingLevel="h4" size="md" style={{ marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                Task
              </Title>
              <SearchInput
                placeholder="Search for tasks"
                value={taskSearch}
                onChange={(_event, value) => setTaskSearch(value)}
                onClear={() => setTaskSearch('')}
                style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}
              />
              {getFilteredTasks().map(task => (
                <div key={task} style={{ marginBottom: '0.5rem' }}>
                  <Checkbox
                    id={`task-${task}`}
                    label={task}
                    isChecked={selectedTasks.includes(task)}
                    onChange={(_event, checked) => handleTaskFilter(task, checked)}
                  />
                </div>
              ))}
              {taskOptions.length > 6 && (
                <Button 
                  variant="link" 
                  isInline 
                  style={{ fontSize: '0.875rem', padding: 0 }}
                  onClick={() => setShowAllTasks(!showAllTasks)}
                >
                  {showAllTasks ? 'Show less' : 'Show more'}
                </Button>
              )}
            </div>

            <Divider style={{ marginBottom: '1rem' }} />

            {/* Provider Filter */}
            <div style={{ marginBottom: '1.5rem' }}>
              <Title headingLevel="h4" size="md" style={{ marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                Provider
              </Title>
              <SearchInput
                placeholder="Search for providers"
                value={providerSearch}
                onChange={(_event, value) => setProviderSearch(value)}
                onClear={() => setProviderSearch('')}
                style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}
              />
              {getFilteredProviders().map(provider => (
                <div key={provider} style={{ marginBottom: '0.5rem' }}>
                  <Checkbox
                    id={`provider-${provider}`}
                    label={provider}
                    isChecked={selectedProviders.includes(provider)}
                    onChange={(_event, checked) => handleProviderFilter(provider, checked)}
                  />
                </div>
              ))}
            </div>

            <Divider style={{ marginBottom: '1rem' }} />

            {/* License Filter */}
            <div style={{ marginBottom: '1.5rem' }}>
              <Title headingLevel="h4" size="md" style={{ marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                License
              </Title>
              <SearchInput
                placeholder="Search for licenses"
                value={licenseSearch}
                onChange={(_event, value) => setLicenseSearch(value)}
                onClear={() => setLicenseSearch('')}
                style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}
              />
              {getFilteredLicenses().map(license => (
                <div key={license} style={{ marginBottom: '0.5rem' }}>
                  <Checkbox
                    id={`license-${license}`}
                    label={license}
                    isChecked={selectedLicenses.includes(license)}
                    onChange={(_event, checked) => handleLicenseFilter(license, checked)}
                  />
                </div>
              ))}
            </div>

            <Divider style={{ marginBottom: '1rem' }} />

            {/* Language Filter */}
            <div style={{ marginBottom: '1.5rem' }}>
              <Title headingLevel="h4" size="md" style={{ marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                Language
              </Title>
              <SearchInput
                placeholder="Search for languages"
                value={languageSearch}
                onChange={(_event, value) => setLanguageSearch(value)}
                onClear={() => setLanguageSearch('')}
                style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}
              />
              {getFilteredLanguages().map(language => (
                <div key={language} style={{ marginBottom: '0.5rem' }}>
                  <Checkbox
                    id={`language-${language}`}
                    label={language}
                    isChecked={selectedLanguages.includes(language)}
                    onChange={(_event, checked) => handleLanguageFilter(language, checked)}
                  />
                </div>
              ))}
                  </div>
                </div>
              </Tab>
              
              {flags.modelPerformanceInCatalog && (
                <Tab eventKey={1} title={<TabTitleText>Performance</TabTitleText>}>
                  {/* Performance filters content - empty for now */}
                  <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
                    Performance filters coming soon
                  </div>
                </Tab>
              )}
              </Tabs>
            ) : (
              /* Show filters directly without tabs when performance feature is off */
              <div>
                {/* Task Filter */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <Title headingLevel="h4" size="md" style={{ marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                    Task
                  </Title>
                  <SearchInput
                    placeholder="Search for tasks"
                    value={taskSearch}
                    onChange={(_event, value) => setTaskSearch(value)}
                    onClear={() => setTaskSearch('')}
                    style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}
                  />
                  {getFilteredTasks().map(task => (
                    <div key={task} style={{ marginBottom: '0.5rem' }}>
                      <Checkbox
                        id={`task-${task}`}
                        label={task}
                        isChecked={selectedTasks.includes(task)}
                        onChange={(_event, checked) => handleTaskFilter(task, checked)}
                      />
                    </div>
                  ))}
                  {taskOptions.length > 6 && (
                    <Button 
                      variant="link" 
                      isInline 
                      style={{ fontSize: '0.875rem', padding: 0 }}
                      onClick={() => setShowAllTasks(!showAllTasks)}
                    >
                      {showAllTasks ? 'Show less' : 'Show more'}
                    </Button>
                  )}
                </div>

                <Divider style={{ marginBottom: '1rem' }} />

                {/* Provider Filter */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <Title headingLevel="h4" size="md" style={{ marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                    Provider
                  </Title>
                  <SearchInput
                    placeholder="Search for providers"
                    value={providerSearch}
                    onChange={(_event, value) => setProviderSearch(value)}
                    onClear={() => setProviderSearch('')}
                    style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}
                  />
                  {getFilteredProviders().map(provider => (
                    <div key={provider} style={{ marginBottom: '0.5rem' }}>
                      <Checkbox
                        id={`provider-${provider}`}
                        label={provider}
                        isChecked={selectedProviders.includes(provider)}
                        onChange={(_event, checked) => handleProviderFilter(provider, checked)}
                      />
                    </div>
                  ))}
                </div>

                <Divider style={{ marginBottom: '1rem' }} />

                {/* License Filter */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <Title headingLevel="h4" size="md" style={{ marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                    License
                  </Title>
                  <SearchInput
                    placeholder="Search for licenses"
                    value={licenseSearch}
                    onChange={(_event, value) => setLicenseSearch(value)}
                    onClear={() => setLicenseSearch('')}
                    style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}
                  />
                  {getFilteredLicenses().map(license => (
                    <div key={license} style={{ marginBottom: '0.5rem' }}>
                      <Checkbox
                        id={`license-${license}`}
                        label={license}
                        isChecked={selectedLicenses.includes(license)}
                        onChange={(_event, checked) => handleLicenseFilter(license, checked)}
                      />
                    </div>
                  ))}
                </div>

                <Divider style={{ marginBottom: '1rem' }} />   

                {/* Language Filter */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <Title headingLevel="h4" size="md" style={{ marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                    Language
                  </Title>
                  <SearchInput
                    placeholder="Search for languages"
                    value={languageSearch}
                    onChange={(_event, value) => setLanguageSearch(value)}
                    onClear={() => setLanguageSearch('')}
                    style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}
                  />
                  {getFilteredLanguages().map(language => (
                    <div key={language} style={{ marginBottom: '0.5rem' }}>
                      <Checkbox
                        id={`language-${language}`}
                        label={language}
                        isChecked={selectedLanguages.includes(language)}
                        onChange={(_event, checked) => handleLanguageFilter(language, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SidebarPanel>

        <SidebarContent>
          {/* Main Content */}
          <div style={{ padding: '1.5rem' }}>
            {/* Search and Filters */}
            <div style={{ marginBottom: '1.5rem' }}>
              <Toolbar>
                <ToolbarContent>
                  <ToolbarGroup>
                    <ToolbarItem>
                      <InputGroup>
                        <InputGroupItem>
                          <Dropdown
                            isOpen={filterDropdownOpen}
                            onSelect={() => setFilterDropdownOpen(false)}
                            onOpenChange={(isOpen: boolean) => setFilterDropdownOpen(isOpen)}
                            toggle={(toggleRef: React.Ref<HTMLButtonElement>) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                                isExpanded={filterDropdownOpen}
                                style={{
                                  minWidth: '120px',
                                  backgroundColor: '#f0f0f0',
                                  borderRight: 'none',
                                  borderTopRightRadius: 0,
                                  borderBottomRightRadius: 0
                                }}
                              >
                                <FilterIcon style={{ marginRight: '0.5rem' }} />
                                {filterAttribute === 'name' && 'Name'}
                                {filterAttribute === 'keyword' && 'Keyword'}
                                {filterAttribute === 'description' && 'Description'}
                              </MenuToggle>
                            )}
                          >
                            <DropdownList>
                              <DropdownItem 
                                key="name"
                                onClick={() => {
                                  setFilterAttribute('name');
                                  setFilterInput('');
                                }}
                              >
                                Name
                              </DropdownItem>
                              <DropdownItem 
                                key="keyword"
                                onClick={() => {
                                  setFilterAttribute('keyword');
                                  setFilterInput('');
                                }}
                              >
                                Keyword
                              </DropdownItem>
                              <DropdownItem 
                                key="description"
                                onClick={() => {
                                  setFilterAttribute('description');
                                  setFilterInput('');
                                }}
                              >
                                Description
                              </DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </InputGroupItem>
                        <InputGroupItem isFill>
                          <SearchInput
                            placeholder={getFilterPlaceholder()}
                            value={filterInput}
                            onChange={(_event, value) => setFilterInput(value)}
                            onSearch={() => {
                              if (filterInput.trim()) {
                                addFilter(filterAttribute, filterInput.trim());
                                setFilterInput('');
                              }
                            }}
                            onClear={() => setFilterInput('')}
                            style={{ 
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0,
                              minWidth: '300px'
                            }}
                          />
                        </InputGroupItem>
                      </InputGroup>
                    </ToolbarItem>
                  </ToolbarGroup>

                  {/* Active Filters Row */}
                  {(activeFilters.name.length > 0 || activeFilters.keyword.length > 0 || activeFilters.description.length > 0) && (
                    <ToolbarGroup>
                      <ToolbarItem variant="label-group">
                        <LabelGroup
                          categoryName="Active filters"
                          isClosable={false}
                          numLabels={activeFilters.name.length + activeFilters.keyword.length + activeFilters.description.length}
                        >
                          {activeFilters.name.map(filter => (
                            <Label 
                              key={`name-${filter}`}
                              variant="outline"
                              onClose={() => removeFilter('name', filter)}
                            >
                              {filter}
                            </Label>
                          ))}
                          {activeFilters.keyword.map(filter => (
                            <Label 
                              key={`keyword-${filter}`}
                              variant="outline"
                              onClose={() => removeFilter('keyword', filter)}
                            >
                              {filter}
                            </Label>
                          ))}
                          {activeFilters.description.map(filter => (
                            <Label 
                              key={`description-${filter}`}
                              variant="outline"
                              onClose={() => removeFilter('description', filter)}
                            >
                              {filter}
                            </Label>
                          ))}
                        </LabelGroup>
                        <Button 
                          variant="link" 
                          onClick={() => clearAllFilters()}
                          size="sm"
                        >
                          Clear filters
                        </Button>
                      </ToolbarItem>
                    </ToolbarGroup>
                  )}
                </ToolbarContent>
              </Toolbar>
            </div>

            {/* Filter Toggle Group */}
            <ToggleGroup 
              style={{ 
                marginBottom: '1.5rem'
              }}
              aria-label="Model category filter"
            >
              <ToggleGroupItem
                buttonId="all-models"
                isSelected={activeTab === 0}
                text="All models"
                onClick={() => setActiveTab(0)}
              />
              <ToggleGroupItem
                buttonId="validated-models"
                isSelected={activeTab === 1}
                text="Red Hat AI validated models"
                onClick={() => setActiveTab(1)}
              />
              <ToggleGroupItem
                buttonId="redhat-models"
                isSelected={activeTab === 2}
                text="Red Hat AI models"
                onClick={() => setActiveTab(2)}
              />
              <ToggleGroupItem
                buttonId="community-models"
                isSelected={activeTab === 3}
                text="Community and custom models"
                onClick={() => setActiveTab(3)}
              />
            </ToggleGroup>

            {/* Red Hat AI validated models section */}
            {(activeTab === 0 || activeTab === 1) && getValidatedModels().length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <Title headingLevel="h2" size="lg">
                    Red Hat AI validated models
                  </Title>
                  <Button variant="link" onClick={handleModelNameClick}>
                    Show all Red Hat AI validated models →
                  </Button>
                </div>
                <p style={{ color: '#6A6E73', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Third-party models benchmarked for performance and quality by Red Hat using leading open-source evaluation datasets.
                </p>
                <Grid hasGutter>
                  {getValidatedModels().slice(0, 4).map(renderModelCard)}
                </Grid>
              </div>
            )}

            {/* Red Hat AI models section */}
            {(activeTab === 0 || activeTab === 2) && getRedHatModels().length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <Title headingLevel="h2" size="lg">
                    Red Hat AI models
                  </Title>
                  <Button variant="link" onClick={handleModelNameClick}>
                    Show all Red Hat AI models →
                  </Button>
                </div>
                <p style={{ color: '#6A6E73', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Red Hat models with full support and legal indemnification.
                </p>
                <Grid hasGutter>
                  {getRedHatModels().slice(0, 4).map(renderModelCard)}
                </Grid>
              </div>
            )}

            {/* Community and custom models section */}
            {(activeTab === 0 || activeTab === 3) && getCommunityModels().length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <Title headingLevel="h2" size="lg">
                    Community and custom models
                  </Title>
                  <Button variant="link" onClick={handleModelNameClick}>
                    Show all community and custom models →
                  </Button>
                </div>
                <p style={{ color: '#6A6E73', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  A broad collection of third-party, community, and admin-configured models.
                </p>
                <Grid hasGutter>
                  {getCommunityModels().slice(0, 4).map(renderModelCard)}
                </Grid>
              </div>
            )}
          </div>
        </SidebarContent>
      </Sidebar>
      
      {/* Benchmark Information Modal */}
      <Modal
        variant={ModalVariant.small}
        title="Benchmark Information"
        isOpen={isBenchmarkModalOpen}
        onClose={() => setIsBenchmarkModalOpen(false)}
        style={{ height: '350px' }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          textAlign: 'center'
        }}>
          <p>Benchmark information coming soon</p>
        </div>
      </Modal>

      {/* Feature Not Available Modal */}
      <Modal
        variant={ModalVariant.small}
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
      >
        <ModalHeader title="Not shown" />
        <ModalBody>
          <p>This interaction is out of scope for this prototype.</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setIsFeatureModalOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </PageSection>
  );
};

export { ModelCatalog };