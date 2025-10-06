import * as React from 'react';
import { 
  Badge, 
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  EmptyState,
  EmptyStateBody,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Grid,
  GridItem,
  Label,
  LabelGroup,
  MenuToggle,
  MenuToggleElement,
  Modal,
  ModalVariant,
  PageSection,
  Progress,
  Select,
  SelectList,
  SelectOption,
  MenuToggle as SelectToggle,
  Tab,
  TabTitleText,
  Tabs,
  TextArea,
  TextInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core';
import { 
  BookIcon, 
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  CubeIcon,
  DatabaseIcon,
  EditIcon,
  EllipsisVIcon,
  FileIcon,
  FolderIcon,
  GlobeIcon,
  HelpIcon,
  InfoCircleIcon,
  LinkIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  UploadIcon,
  UsersIcon
} from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { useFeatureFlags } from '@app/utils/FeatureFlagsContext';
import { useNavigate } from 'react-router-dom';

interface KnowledgeSource {
  id: string;
  name: string;
  description: string;
  type: 'document' | 'web' | 'database' | 'api' | 'vector_db';
  status: 'active' | 'processing' | 'error' | 'inactive';
  size: string;
  documents: number;
  lastUpdated: string;
  createdBy: {
    name: string;
    avatar: string;
  };
  usedByAgents: number;
  usedByModels: number;
  tags: string[];
  vectorStore?: string;
  endpoint?: string;
}

const KnowledgeSources: React.FunctionComponent = () => {
  useDocumentTitle("Knowledge Sources");
  
  const { flags, agentBuilder, updateAgentBuilder } = useFeatureFlags();
  const navigate = useNavigate();
  const [projectDropdownOpen, setProjectDropdownOpen] = React.useState(false);
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [typeFilterOpen, setTypeFilterOpen] = React.useState(false);
  const [statusFilterOpen, setStatusFilterOpen] = React.useState(false);
  const [actionMenus, setActionMenus] = React.useState<{ [key: string]: boolean }>({});
  const [addSourceModalOpen, setAddSourceModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string | number>(0);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);

  // Form states for new knowledge source
  const [newSourceType, setNewSourceType] = React.useState('document');
  const [newSourceName, setNewSourceName] = React.useState('');
  const [newSourceDescription, setNewSourceDescription] = React.useState('');
  const [newSourceUrl, setNewSourceUrl] = React.useState('');
  const [typeSelectOpen, setTypeSelectOpen] = React.useState(false);

  // Mock data for knowledge sources
  const knowledgeSources: KnowledgeSource[] = [
    {
      id: '1',
      name: 'Product Documentation',
      description: 'Complete product documentation including user guides, API docs, and troubleshooting',
      type: 'document',
      status: 'active',
      size: '45.2 MB',
      documents: 127,
      lastUpdated: '2 hours ago',
      createdBy: { name: 'You', avatar: 'https://github.com/yusufhilmi.png' },
      usedByAgents: 8,
      usedByModels: 3,
      tags: ['documentation', 'product', 'support'],
      vectorStore: 'OpenAI Embeddings'
    },
    {
      id: '2',
      name: 'Company Knowledge Base',
      description: 'Internal company policies, procedures, and knowledge articles',
      type: 'web',
      status: 'active',
      size: '23.8 MB',
      documents: 89,
      lastUpdated: '1 day ago',
      createdBy: { name: 'Admin', avatar: 'https://github.com/admin.png' },
      usedByAgents: 12,
      usedByModels: 5,
      tags: ['internal', 'policies', 'hr'],
      endpoint: 'https://kb.company.com/api'
    },
    {
      id: '3',
      name: 'Customer FAQ Database',
      description: 'Frequently asked questions and customer support responses',
      type: 'database',
      status: 'processing',
      size: '12.1 MB',
      documents: 456,
      lastUpdated: '3 hours ago',
      createdBy: { name: 'Support Team', avatar: 'https://github.com/support.png' },
      usedByAgents: 5,
      usedByModels: 2,
      tags: ['faq', 'support', 'customers']
    },
    {
      id: '4',
      name: 'Legal Documents Archive',
      description: 'Contract templates, legal policies, and compliance documentation',
      type: 'document',
      status: 'active',
      size: '67.3 MB',
      documents: 234,
      lastUpdated: '5 days ago',
      createdBy: { name: 'Legal Team', avatar: 'https://github.com/legal.png' },
      usedByAgents: 3,
      usedByModels: 1,
      tags: ['legal', 'compliance', 'contracts']
    },
    {
      id: '5',
      name: 'Research Papers',
      description: 'Collection of AI/ML research papers and technical documentation',
      type: 'document',
      status: 'error',
      size: '156.7 MB',
      documents: 78,
      lastUpdated: '1 week ago',
      createdBy: { name: 'Research Team', avatar: 'https://github.com/research.png' },
      usedByAgents: 2,
      usedByModels: 4,
      tags: ['research', 'ai', 'ml', 'papers']
    },
    {
      id: '6',
      name: 'Sales Playbook',
      description: 'Sales strategies, objection handling, and product information',
      type: 'web',
      status: 'active',
      size: '8.9 MB',
      documents: 34,
      lastUpdated: '2 days ago',
      createdBy: { name: 'Sales Team', avatar: 'https://github.com/sales.png' },
      usedByAgents: 6,
      usedByModels: 2,
      tags: ['sales', 'strategy', 'playbook']
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileIcon />;
      case 'web':
        return <GlobeIcon />;
      case 'database':
        return <DatabaseIcon />;
      case 'api':
        return <LinkIcon />;
      case 'vector_db':
        return <CubeIcon />;
      default:
        return <FileIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'processing':
        return 'blue';
      case 'error':
        return 'red';
      case 'inactive':
        return 'grey';
      default:
        return 'grey';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'document':
        return 'Document';
      case 'web':
        return 'Web Source';
      case 'database':
        return 'Database';
      case 'api':
        return 'API';
      case 'vector_db':
        return 'Vector DB';
      default:
        return 'Unknown';
    }
  };

  const toggleActionMenu = (sourceId: string) => {
    setActionMenus(prev => ({
      ...prev,
      [sourceId]: !prev[sourceId]
    }));
  };

  const handleAddSource = () => {
    setAddSourceModalOpen(true);
  };

  const handleSaveSource = () => {
    // Simulate upload/processing
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setAddSourceModalOpen(false);
          // Reset form
          setNewSourceName('');
          setNewSourceDescription('');
          setNewSourceUrl('');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };



  const resetModal = () => {
    setNewSourceType('document');
    setNewSourceName('');
    setNewSourceDescription('');
    setNewSourceUrl('');
    setUploadProgress(0);
    setIsUploading(false);
  };

  // Handle adding/removing knowledge sources from the agent
  const handleAddToAgent = (sourceName: string) => {
    const currentSources = agentBuilder.selectedKnowledgeSources;
    const isAlreadyAdded = currentSources.includes(sourceName);
    
    if (isAlreadyAdded) {
      // Remove source from agent
      updateAgentBuilder({ 
        selectedKnowledgeSources: currentSources.filter(name => name !== sourceName) 
      });
    } else {
      // Add source to agent
      updateAgentBuilder({ 
        selectedKnowledgeSources: [...currentSources, sourceName] 
      });
    }
    
    // Navigate back to Agent Builder if in agent builder mode
    if (flags.agentBuilderMode) {
      navigate('/gen-ai-studio/ai-playground');
    }
  };

  const filteredSources = knowledgeSources.filter(source =>
    source.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    source.description.toLowerCase().includes(searchValue.toLowerCase()) ||
    source.tags.some(tag => tag.toLowerCase().includes(searchValue.toLowerCase()))
  );

  return (
    <>
      {/* Header with Project and Workspace Selectors */}
      {flags.showProjectWorkspaceDropdowns && (
        <PageSection padding={{ default: 'noPadding' }}>
          <Toolbar>
            <ToolbarContent style={{ padding: '1rem' }}>
              <ToolbarGroup>
                <ToolbarItem>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>
                      <span className="pf-v5-u-font-size-sm pf-v5-u-font-weight-bold">Project:</span>
                    </FlexItem>
                    <FlexItem>
                      <Dropdown
                        isOpen={projectDropdownOpen}
                        onSelect={() => setProjectDropdownOpen(false)}
                        onOpenChange={(isOpen: boolean) => setProjectDropdownOpen(isOpen)}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle
                            ref={toggleRef}
                            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                            isExpanded={projectDropdownOpen}
                            variant="secondary"
                            size="sm"
                          >
                            <FolderIcon style={{ marginRight: '0.5rem' }} />
                            Default Project
                          </MenuToggle>
                        )}
                      >
                        <DropdownList>
                          <DropdownItem key="default">Default Project</DropdownItem>
                          <DropdownItem key="project2">AI Research Project</DropdownItem>
                          <DropdownItem key="project3">Production Models</DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    </FlexItem>
                  </Flex>
                </ToolbarItem>
                <ToolbarItem>
                  <Button variant="plain" aria-label="Help" icon={<HelpIcon />} />
                </ToolbarItem>
                <ToolbarItem>
                  <Divider orientation={{ default: 'vertical' }} />
                </ToolbarItem>
                <ToolbarItem>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>
                      <span className="pf-v5-u-font-size-sm pf-v5-u-font-weight-bold">Workspace:</span>
                    </FlexItem>
                    <FlexItem>
                      <Dropdown
                        isOpen={workspaceDropdownOpen}
                        onSelect={() => setWorkspaceDropdownOpen(false)}
                        onOpenChange={(isOpen: boolean) => setWorkspaceDropdownOpen(isOpen)}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle
                            ref={toggleRef}
                            onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
                            isExpanded={workspaceDropdownOpen}
                            variant="secondary"
                            size="sm"
                          >
                            <UsersIcon style={{ marginRight: '0.5rem' }} />
                            Private Workspace
                          </MenuToggle>
                        )}
                      >
                        <DropdownList>
                          <DropdownItem key="private">Private Workspace</DropdownItem>
                          <DropdownItem key="team">Team Workspace</DropdownItem>
                          <DropdownItem key="shared">Shared Workspace</DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    </FlexItem>
                  </Flex>
                </ToolbarItem>
              </ToolbarGroup>
            </ToolbarContent>
          </Toolbar>
        </PageSection>
      )}

      {/* Page Header */}
      <PageSection padding={{ default: 'noPadding' }}>
        <Toolbar>
          <ToolbarContent style={{ padding: '1rem' }}>
            <ToolbarGroup>
              <ToolbarItem>
                <Title headingLevel="h1" size="xl">Knowledge Sources</Title>
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarGroup align={{ default: 'alignEnd' }}>
              <ToolbarItem>
                <div style={{ position: 'relative', width: '16rem', marginRight: '1rem' }}>
                  <SearchIcon style={{ 
                    position: 'absolute', 
                    left: '0.625rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    fontSize: '1rem',
                    color: 'var(--pf-v5-global--Color--200)'
                  }} />
                  <TextInput
                    value={searchValue}
                    onChange={(_event, value) => setSearchValue(value)}
                    placeholder="Search knowledge sources..."
                    style={{ paddingLeft: '2rem' }}
                  />
                </div>
              </ToolbarItem>
              <ToolbarItem>
                <Button variant="primary" icon={<PlusIcon />} onClick={handleAddSource}>
                  Add Knowledge Source
                </Button>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </PageSection>

      {/* Filter Bar */}
      <PageSection>
        <Card>
          <CardBody>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0.5rem 0'
            }}>
              {/* Left side - Source count */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                  {filteredSources.length} Knowledge Sources
                </div>
              </div>

              {/* Right side - Filters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--pf-v5-global--Color--200)' }}>
                  Filters:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                  {/* Type Filter */}
                  <Dropdown
                    isOpen={typeFilterOpen}
                    onSelect={() => setTypeFilterOpen(false)}
                    onOpenChange={(isOpen: boolean) => setTypeFilterOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setTypeFilterOpen(!typeFilterOpen)}
                        isExpanded={typeFilterOpen}
                        variant="secondary"
                        size="sm"
                        style={{
                          border: '1px dashed #d2d2d2',
                          fontSize: '0.75rem',
                          height: '2rem',
                          paddingLeft: '0.75rem',
                          paddingRight: '0.75rem'
                        }}
                      >
                        Type
                        <ChevronDownIcon style={{ marginLeft: '0.25rem' }} />
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem>All Types</DropdownItem>
                      <DropdownItem>Document</DropdownItem>
                      <DropdownItem>Web Source</DropdownItem>
                      <DropdownItem>Database</DropdownItem>
                      <DropdownItem>API</DropdownItem>
                      <DropdownItem>Vector DB</DropdownItem>
                    </DropdownList>
                  </Dropdown>

                  {/* Status Filter */}
                  <Dropdown
                    isOpen={statusFilterOpen}
                    onSelect={() => setStatusFilterOpen(false)}
                    onOpenChange={(isOpen: boolean) => setStatusFilterOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setStatusFilterOpen(!statusFilterOpen)}
                        isExpanded={statusFilterOpen}
                        variant="secondary"
                        size="sm"
                        style={{
                          border: '1px dashed #d2d2d2',
                          fontSize: '0.75rem',
                          height: '2rem',
                          paddingLeft: '0.75rem',
                          paddingRight: '0.75rem'
                        }}
                      >
                        Status
                        <ChevronDownIcon style={{ marginLeft: '0.25rem' }} />
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem>All Status</DropdownItem>
                      <DropdownItem>Active</DropdownItem>
                      <DropdownItem>Processing</DropdownItem>
                      <DropdownItem>Error</DropdownItem>
                      <DropdownItem>Inactive</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Tabs */}
        <div style={{ marginTop: '1rem' }}>
          <Tabs
            activeKey={activeTab}
            onSelect={(event, tabIndex) => setActiveTab(tabIndex)}
            isBox={false}
          >
            <Tab eventKey={0} title={<TabTitleText>All Sources ({knowledgeSources.length})</TabTitleText>} />
            <Tab eventKey={1} title={<TabTitleText>Documents ({knowledgeSources.filter(s => s.type === 'document').length})</TabTitleText>} />
            <Tab eventKey={2} title={<TabTitleText>Web Sources ({knowledgeSources.filter(s => s.type === 'web').length})</TabTitleText>} />
            <Tab eventKey={3} title={<TabTitleText>Databases ({knowledgeSources.filter(s => s.type === 'database').length})</TabTitleText>} />
          </Tabs>
        </div>
      </PageSection>

      {/* Knowledge Sources Grid */}
      <PageSection>
        {filteredSources.length === 0 ? (
          <EmptyState>
            <BookIcon style={{ fontSize: '3rem', color: 'var(--pf-v5-global--Color--200)', marginBottom: '1rem' }} />
            <Title headingLevel="h2" size="lg">
              No knowledge sources found
            </Title>
            <EmptyStateBody>
              {searchValue ? 'Try adjusting your search criteria.' : 'Create your first knowledge source to get started with RAG capabilities.'}
            </EmptyStateBody>
            {!searchValue && (
              <Button variant="primary" icon={<PlusIcon />} onClick={handleAddSource}>
                Add Knowledge Source
              </Button>
            )}
          </EmptyState>
        ) : (
          <Grid hasGutter>
            {filteredSources.map((source) => (
              <GridItem key={source.id} lg={4} md={6} sm={12}>
                <Card 
                  isFullHeight
                >
                  <CardHeader>
                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
                      <FlexItem flex={{ default: 'flex_1' }}>
                        <Flex direction={{ default: 'column' }}>
                          <FlexItem>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                              <FlexItem>
                                {getTypeIcon(source.type)}
                              </FlexItem>
                              <FlexItem>
                                <CardTitle>
                                  <Title headingLevel="h2" size="lg">{source.name}</Title>
                                </CardTitle>
                              </FlexItem>
                            </Flex>
                          </FlexItem>
                          <FlexItem>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                              <FlexItem>
                                <Badge color={getStatusColor(source.status)}>
                                  {getStatusText(source.status)}
                                </Badge>
                              </FlexItem>
                              <FlexItem>
                                <span style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                                  {getTypeText(source.type)}
                                </span>
                              </FlexItem>
                            </Flex>
                          </FlexItem>
                        </Flex>
                      </FlexItem>
                      <FlexItem>
                        <Dropdown
                          isOpen={actionMenus[source.id] || false}
                          onSelect={() => setActionMenus({})}
                          onOpenChange={(isOpen: boolean) => 
                            setActionMenus(prev => ({ ...prev, [source.id]: isOpen }))
                          }
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => toggleActionMenu(source.id)}
                              variant="plain"
                              aria-label="Actions"
                            >
                              <EllipsisVIcon />
                            </MenuToggle>
                          )}
                        >
                          <DropdownList>
                            <DropdownItem icon={<EditIcon />}>
                              Edit
                            </DropdownItem>
                            <DropdownItem icon={<UploadIcon />}>
                              Reindex
                            </DropdownItem>
                            <DropdownItem icon={<InfoCircleIcon />}>
                              View Details
                            </DropdownItem>
                            <DropdownItem icon={<TrashIcon />}>
                              Delete
                            </DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </FlexItem>
                    </Flex>
                  </CardHeader>
                  
                  <CardBody style={{ paddingTop: 0, paddingBottom: '0.5rem', flexGrow: 1 }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                        {source.description}
                      </p>
                    </div>
                    
                    <Grid hasGutter>
                      <GridItem span={6}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--pf-v5-global--Color--200)', marginBottom: '0.25rem' }}>
                          Size
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                          {source.size}
                        </div>
                      </GridItem>
                      <GridItem span={6}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--pf-v5-global--Color--200)', marginBottom: '0.25rem' }}>
                          Documents
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                          {source.documents.toLocaleString()}
                        </div>
                      </GridItem>
                      <GridItem span={6}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--pf-v5-global--Color--200)', marginBottom: '0.25rem' }}>
                          Used by Agents
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                          {source.usedByAgents}
                        </div>
                      </GridItem>
                      <GridItem span={6}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--pf-v5-global--Color--200)', marginBottom: '0.25rem' }}>
                          Used by Models
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                          {source.usedByModels}
                        </div>
                      </GridItem>
                    </Grid>

                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--pf-v5-global--Color--200)', marginBottom: '0.5rem' }}>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                          <FlexItem>
                            <ClockIcon />
                          </FlexItem>
                          <FlexItem>
                            Last updated: {source.lastUpdated}
                          </FlexItem>
                        </Flex>
                      </div>
                      {source.vectorStore && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--pf-v5-global--Color--200)' }}>
                          Vector Store: {source.vectorStore}
                        </div>
                      )}
                      {source.endpoint && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--pf-v5-global--Color--200)' }}>
                          Endpoint: {source.endpoint}
                        </div>
                      )}
                    </div>
                  </CardBody>
                  
                  <div style={{ padding: '1.5rem', paddingTop: '0.5rem', paddingBottom: '1rem' }}>
                    <LabelGroup>
                      {source.tags.slice(0, 3).map((tag, index) => (
                        <Label key={index} color="blue" variant="outline">
                          {tag}
                        </Label>
                      ))}
                      {source.tags.length > 3 && (
                        <Label color="grey" variant="outline">
                          +{source.tags.length - 3}
                        </Label>
                      )}
                    </LabelGroup>
                  </div>

                  <CardFooter>
                    {flags.agentBuilderMode ? (
                      // In Agent Builder mode, check if this source is in the selected knowledge sources
                      agentBuilder.selectedKnowledgeSources.includes(source.name) ? (
                        <Button variant="secondary" isBlock icon={<CheckIcon />} onClick={() => handleAddToAgent(source.name)}>
                          Added to Agent
                        </Button>
                      ) : (
                        <Button variant="primary" isBlock icon={<PlusIcon />} onClick={() => handleAddToAgent(source.name)}>
                          Add to Agent
                        </Button>
                      )
                    ) : (
                      // In normal mode, show a generic add button
                      <Button variant="primary" isBlock icon={<PlusIcon />}>
                        Add to Workspace
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </GridItem>
            ))}
          </Grid>
        )}
      </PageSection>

      {/* Add Knowledge Source Modal */}
      <Modal
        variant={ModalVariant.medium}
        title="Add Knowledge Source"
        isOpen={addSourceModalOpen}
        onClose={() => {
          setAddSourceModalOpen(false);
          resetModal();
        }}
      >
        <Form>
          <FormGroup
            label="Source Type"
            isRequired
            fieldId="source-type"
          >
            <Select
              isOpen={typeSelectOpen}
              selected={newSourceType}
              onSelect={(event, selection) => {
                setNewSourceType(selection as string);
                setTypeSelectOpen(false);
              }}
              onOpenChange={(isOpen) => setTypeSelectOpen(isOpen)}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <SelectToggle ref={toggleRef} onClick={() => setTypeSelectOpen(!typeSelectOpen)}>
                  {getTypeText(newSourceType)}
                </SelectToggle>
              )}
            >
              <SelectList>
                <SelectOption value="document">Document Upload</SelectOption>
                <SelectOption value="web">Web Source</SelectOption>
                <SelectOption value="database">Database Connection</SelectOption>
                <SelectOption value="api">API Endpoint</SelectOption>
                <SelectOption value="vector_db">Vector Database</SelectOption>
              </SelectList>
            </Select>
          </FormGroup>

          <FormGroup
            label="Name"
            isRequired
            fieldId="source-name"
          >
            <TextInput
              isRequired
              type="text"
              id="source-name"
              value={newSourceName}
              onChange={(_event, value) => setNewSourceName(value)}
              placeholder="Enter knowledge source name"
            />
          </FormGroup>

          <FormGroup
            label="Description"
            fieldId="source-description"
          >
            <TextArea
              id="source-description"
              value={newSourceDescription}
              onChange={(_event, value) => setNewSourceDescription(value)}
              placeholder="Describe what this knowledge source contains"
              rows={3}
            />
          </FormGroup>

          {newSourceType === 'document' && (
            <FormGroup
              label="Document Path"
              fieldId="file-path"
            >
              <TextInput
                type="text"
                id="file-path"
                placeholder="Enter file paths or drag and drop files here"
              />
              <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)', marginTop: '0.5rem' }}>
                Supported formats: PDF, DOCX, TXT, MD, HTML
              </div>
            </FormGroup>
          )}

          {(newSourceType === 'web' || newSourceType === 'api') && (
            <FormGroup
              label={newSourceType === 'web' ? 'Website URL' : 'API Endpoint'}
              isRequired
              fieldId="source-url"
            >
              <TextInput
                isRequired
                type="text"
                id="source-url"
                value={newSourceUrl}
                onChange={(_event, value) => setNewSourceUrl(value)}
                placeholder={newSourceType === 'web' ? 'https://example.com' : 'https://api.example.com/endpoint'}
              />
            </FormGroup>
          )}

          {newSourceType === 'database' && (
            <>
              <FormGroup
                label="Database Connection String"
                isRequired
                fieldId="db-connection"
              >
                <TextInput
                  isRequired
                  type="text"
                  id="db-connection"
                  placeholder="postgresql://user:password@host:port/database"
                />
              </FormGroup>
              <FormGroup
                label="Query"
                fieldId="db-query"
              >
                <TextArea
                  id="db-query"
                  placeholder="SELECT content FROM knowledge_base WHERE active = true"
                  rows={3}
                />
              </FormGroup>
            </>
          )}

          {newSourceType === 'vector_db' && (
            <>
              <FormGroup
                label="Vector Database Endpoint"
                isRequired
                fieldId="vector-endpoint"
              >
                <TextInput
                  isRequired
                  type="text"
                  id="vector-endpoint"
                  placeholder="https://vector-db.example.com"
                />
              </FormGroup>
              <FormGroup
                label="Collection Name"
                isRequired
                fieldId="collection-name"
              >
                <TextInput
                  isRequired
                  type="text"
                  id="collection-name"
                  placeholder="my-knowledge-collection"
                />
              </FormGroup>
            </>
          )}

          {isUploading && (
            <FormGroup fieldId="upload-progress">
              <Progress
                value={uploadProgress}
                title="Processing knowledge source..."
                size="lg"
              />
              <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)', marginTop: '0.5rem' }}>
                {uploadProgress < 50 ? 'Uploading files...' : 
                 uploadProgress < 80 ? 'Processing documents...' : 
                 'Creating embeddings...'}
              </div>
            </FormGroup>
          )}
        </Form>
        
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Button
            variant="link"
            onClick={() => {
              setAddSourceModalOpen(false);
              resetModal();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveSource}
            isDisabled={!newSourceName || isUploading}
            isLoading={isUploading}
          >
            {isUploading ? 'Processing...' : 'Create Knowledge Source'}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export { KnowledgeSources }; 