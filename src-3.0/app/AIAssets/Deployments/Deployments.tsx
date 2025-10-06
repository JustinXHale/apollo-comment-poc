import React from 'react';
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  InputGroup,
  InputGroupItem,
  Label,
  MenuToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  PageSection,
  Pagination,
  Popover,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  TextInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Tooltip,
} from '@patternfly/react-core';
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@patternfly/react-table';
import {
  CheckCircleIcon,
  CopyIcon,
  EllipsisVIcon,
  ExclamationCircleIcon,
  FilterIcon,
  OutlinedFolderIcon,
  OutlinedQuestionCircleIcon,
  SearchIcon,
} from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import { useFeatureFlags } from '../../utils/FeatureFlagsContext';
import DeploymentsBrainIcon from '../../../assets/deployments-brain.png';

// Mock data types
interface ModelDeployment {
  id: string;
  name: string;
  project: string;
  projectType: string;
  servingRuntime: string;
  inferenceEndpoint: string;
  apiProtocol: string;
  lastDeployed: string;
  status: 'Ready' | 'Failed' | 'Deploying' | 'Stopped' | 'Active';
}

// Mock data
const mockDeployments: ModelDeployment[] = [
  {
    id: '1',
    name: 'Llama-3.1-8B-Instruct',
    project: 'Project X',
    projectType: 'Single-model serving enabled',
    servingRuntime: 'Caikit Standalone ServingRuntime for KServe',
    inferenceEndpoint: 'Available',
    apiProtocol: 'Not defined',
    lastDeployed: 'Today',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Mistral-7B-Instruct-v0.3',
    project: 'Project X',
    projectType: 'Single-model serving enabled',
    servingRuntime: 'Caikit Standalone ServingRuntime for KServe',
    inferenceEndpoint: 'Available',
    apiProtocol: 'REST',
    lastDeployed: 'Today',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Qwen2.5-7B-Instruct',
    project: 'Project X',
    projectType: 'Single-model serving enabled',
    servingRuntime: 'Unknown',
    inferenceEndpoint: 'Not available',
    apiProtocol: 'REST',
    lastDeployed: '-',
    status: 'Failed',
  },
  {
    id: '4',
    name: 'Llama-3.1-8B-Instruct',
    project: 'Project Y',
    projectType: 'Single-model serving enabled',
    servingRuntime: 'Caikit Standalone ServingRuntime for KServe',
    inferenceEndpoint: 'Available',
    apiProtocol: 'REST',
    lastDeployed: '2 hours ago',
    status: 'Ready',
  },
];

const Deployments: React.FunctionComponent = () => {
  useDocumentTitle('Deployments');
  const navigate = useNavigate();
  
  const { flags, selectedProject, setSelectedProject } = useFeatureFlags();
  const [sortBy, setSortBy] = React.useState<string>('name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [filterValue, setFilterValue] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [isProjectSelectOpen, setIsProjectSelectOpen] = React.useState(false);
  const [isNameSortOpen, setIsNameSortOpen] = React.useState(false);
  const [copiedItems, setCopiedItems] = React.useState<Set<string>>(new Set());
  const [openEndpointPopovers, setOpenEndpointPopovers] = React.useState<Set<string>>(new Set());
  const [isFeatureModalOpen, setIsFeatureModalOpen] = React.useState(false);
  const [openKebabMenus, setOpenKebabMenus] = React.useState<Set<string>>(new Set());

  // Copy handler with feedback
  const handleCopyWithFeedback = (text: string, itemId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItems(prev => new Set([...prev, itemId]));
    setTimeout(() => {
      setCopiedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 2000);
  };

  // Endpoint popover handlers
  const handleEndpointPopoverToggle = (deploymentId: string, isOpen: boolean) => {
    setOpenEndpointPopovers(prev => {
      const newSet = new Set(prev);
      if (isOpen) {
        newSet.add(deploymentId);
      } else {
        newSet.delete(deploymentId);
      }
      return newSet;
    });
  };

  // Model name click handler
  const handleModelNameClick = () => {
    setIsFeatureModalOpen(true);
  };

  // Stop button click handler
  const handleStopClick = () => {
    setIsFeatureModalOpen(true);
  };

  // Kebab menu handlers
  const toggleKebabMenu = (deploymentId: string) => {
    setOpenKebabMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(deploymentId)) {
        newSet.delete(deploymentId);
      } else {
        newSet.add(deploymentId);
      }
      return newSet;
    });
  };

  const handleEditDeployment = (deploymentId: string) => {
    setIsFeatureModalOpen(true);
    setOpenKebabMenus(new Set()); // Close all menus
  };

  const handleDeleteDeployment = (deploymentId: string) => {
    setIsFeatureModalOpen(true);
    setOpenKebabMenus(new Set()); // Close all menus
  };

  // Filter deployments based on search and project
  const getFilteredDeployments = () => {
    let filtered = [...mockDeployments];
    
    // Filter by selected project
    filtered = filtered.filter(d => d.project === selectedProject);
    
    // Filter by search term
    if (filterValue) {
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Sort deployments
  const getSortedDeployments = () => {
    const filtered = getFilteredDeployments();
    
    return filtered.sort((a, b) => {
      let compareResult = 0;
      
      switch (sortBy) {
        case 'name':
          compareResult = a.name.localeCompare(b.name);
          break;
        case 'project':
          compareResult = a.project.localeCompare(b.project);
          break;
        case 'lastDeployed':
          // For now, since they're all "-", we'll just maintain order
          compareResult = 0;
          break;
        default:
          compareResult = 0;
      }
      
      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
  };

  // Paginate deployments
  const getPaginatedDeployments = () => {
    const sorted = getSortedDeployments();
    const startIdx = (currentPage - 1) * perPage;
    const endIdx = startIdx + perPage;
    return sorted.slice(startIdx, endIdx);
  };

  const handleSort = (columnName: string) => {
    if (sortBy === columnName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnName);
      setSortDirection('asc');
    }
  };

  const renderStatusBadge = (status: ModelDeployment['status']) => {
    switch (status) {
      case 'Ready':
        return <Label color="green">Ready</Label>;
      case 'Active':
        return <Label color="green" icon={<CheckCircleIcon />}>Active</Label>;
      case 'Failed':
        return <Label color="red" icon={<ExclamationCircleIcon />}>Failed</Label>;
      case 'Deploying':
        return <Label color="blue">Deploying</Label>;
      case 'Stopped':
        return <Label color="grey">Stopped</Label>;
      default:
        return <Label color="grey">Unknown</Label>;
    }
  };

  const renderTable = () => {
    const deployments = getSortedDeployments();
    
    if (deployments.length === 0) {
      return (
        <EmptyState>
          <Title headingLevel="h4" size="lg">
            <SearchIcon className="pf-v5-u-mr-sm" />
            No deployments found
          </Title>
          <EmptyStateBody>
            {filterValue ? 
              'No deployments match your filter criteria.' :
              'No model deployments are currently available in this project.'
            }
          </EmptyStateBody>
          {filterValue && (
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button variant="link" onClick={() => setFilterValue('')}>
                  Clear filters
                </Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          )}
        </EmptyState>
      );
    }

    return (
      <>
        <Table aria-label="Model deployments table" variant="compact">
          <Thead>
            <Tr>
              <Th 
                width={25}
                sort={{
                  sortBy: { index: 0, direction: sortBy === 'name' ? sortDirection : undefined },
                  onSort: () => handleSort('name'),
                  columnIndex: 0
                }}
              >
                Model deployment name
              </Th>
              <Th 
                width={15}
                sort={{
                  sortBy: { index: 1, direction: sortBy === 'project' ? sortDirection : undefined },
                  onSort: () => handleSort('project'),
                  columnIndex: 1
                }}
              >
                Project
              </Th>
              <Th width={20}>Serving runtime</Th>
              <Th width={15}>Inference endpoints</Th>
              <Th width={10}>API protocol</Th>
              <Th 
                width={10}
                sort={{
                  sortBy: { index: 5, direction: sortBy === 'lastDeployed' ? sortDirection : undefined },
                  onSort: () => handleSort('lastDeployed'),
                  columnIndex: 5
                }}
              >
                Last deployed
              </Th>
              <Th width={15}>Status</Th>
              <Th width={5}></Th>
            </Tr>
          </Thead>
          <Tbody>
            {getPaginatedDeployments().map((deployment) => (
              <Tr key={deployment.id}>
                <Td dataLabel="Model deployment name">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Button
                      variant="link"
                      isInline
                      onClick={handleModelNameClick}
                      style={{ padding: 0, fontSize: 'inherit', fontWeight: 'bold', textDecoration: 'none' }}
                    >
                      {deployment.name}
                    </Button>
                    <Popover
                      bodyContent={
                        <div style={{ padding: '0.5rem', maxWidth: '300px' }}>
                          <div style={{ marginBottom: '1rem' }}>
                            Resource names and types are used to find your resources in OpenShift.
                          </div>
                          
                          <div style={{ marginBottom: '1rem' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                              Resource name
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <TextInput
                                value={`${deployment.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-version-1`}
                                readOnly
                                aria-label="Resource name"
                                style={{ fontSize: '0.75rem', height: '28px' }}
                              />
                              <Tooltip content={copiedItems.has(`resource-${deployment.id}`) ? 'Copied' : 'Copy resource name'}>
                                <Button
                                  variant="plain"
                                  size="sm"
                                  aria-label="Copy resource name"
                                  onClick={() => handleCopyWithFeedback(`${deployment.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-version-1`, `resource-${deployment.id}`)}
                                  style={{ padding: '4px' }}
                                >
                                  {copiedItems.has(`resource-${deployment.id}`) ? <CheckCircleIcon style={{ fontSize: '12px' }} /> : <CopyIcon style={{ fontSize: '12px' }} />}
                                </Button>
                              </Tooltip>
                            </div>
                          </div>

                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                              Resource type
                            </div>
                            <div>InferenceService</div>
                          </div>
                        </div>
                      }
                      position="right"
                    >
                      <Button variant="plain" aria-label="Deployment info" style={{ padding: '2px' }}>
                        <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: '#6A6E73' }} />
                      </Button>
                    </Popover>
                  </div>
                </Td>
                <Td dataLabel="Project">
                  <div>
                    <div>{deployment.project}</div>
                    <Badge isRead>{deployment.projectType}</Badge>
                  </div>
                </Td>
                <Td dataLabel="Serving runtime">
                  {deployment.servingRuntime}
                </Td>
                <Td dataLabel="Inference endpoints">
                  {deployment.inferenceEndpoint === 'Available' ? (
                    <Popover
                      bodyContent={
                        <div style={{ padding: '0.5rem', width: '300px', minWidth: '300px' }}>
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                              Inference endpoint
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <TextInput
                                value={`https://${deployment.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${deployment.project.toLowerCase().replace(/\s+/g, '-')}.apps.cluster.example.com`}
                                readOnly
                                aria-label="Inference endpoint"
                                style={{ fontSize: '0.75rem', height: '28px', fontFamily: 'monospace', width: '230px' }}
                              />
                              <Tooltip content={copiedItems.has(`endpoint-${deployment.id}`) ? 'Copied' : 'Copy endpoint'}>
                                <Button
                                  variant="plain"
                                  size="sm"
                                  aria-label="Copy endpoint"
                                  onClick={() => handleCopyWithFeedback(`https://${deployment.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${deployment.project.toLowerCase().replace(/\s+/g, '-')}.apps.cluster.example.com`, `endpoint-${deployment.id}`)}
                                  style={{ padding: '4px' }}
                                >
                                  {copiedItems.has(`endpoint-${deployment.id}`) ? <CheckCircleIcon style={{ fontSize: '12px' }} /> : <CopyIcon style={{ fontSize: '12px' }} />}
                                </Button>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      }
                      position="right"
                    >
                      <Button
                        variant="link"
                        isInline
                        style={{ padding: 0, textDecoration: 'none' }}
                      >
                        View
                      </Button>
                    </Popover>
                  ) : (
                    deployment.inferenceEndpoint
                  )}
                </Td>
                <Td dataLabel="API protocol">
                  {deployment.apiProtocol === 'REST' ? (
                    <Label color="yellow">REST</Label>
                  ) : (
                    <span style={{ color: 'var(--pf-v5-global--Color--200)' }}>
                      {deployment.apiProtocol}
                    </span>
                  )}
                </Td>
                <Td dataLabel="Last deployed">
                  {deployment.lastDeployed}
                </Td>
                <Td dataLabel="Status">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {renderStatusBadge(deployment.status)}
                    {(deployment.status === 'Active' || deployment.status === 'Ready') && (
                      <Button 
                        variant="link" 
                        isInline
                        onClick={handleStopClick}
                        style={{ padding: 0 }}
                      >
                        Stop
                      </Button>
                    )}
                  </div>
                </Td>
                <Td dataLabel="Actions" style={{ textAlign: 'right', width: '60px' }}>
                  <Dropdown
                    isOpen={openKebabMenus.has(deployment.id)}
                    onOpenChange={(isOpen) => {
                      if (!isOpen) {
                        setOpenKebabMenus(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(deployment.id);
                          return newSet;
                        });
                      }
                    }}
                    popperProps={{ position: 'right'}}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => toggleKebabMenu(deployment.id)}
                        variant="plain"
                        aria-label={`Actions for ${deployment.name}`}
                        isExpanded={openKebabMenus.has(deployment.id)}
                      >
                        <EllipsisVIcon />
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem
                        key="edit"
                        onClick={() => handleEditDeployment(deployment.id)}
                      >
                        Edit
                      </DropdownItem>
                      <DropdownItem
                        key="delete"
                        onClick={() => handleDeleteDeployment(deployment.id)}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Pagination
          itemCount={deployments.length}
          perPage={perPage}
          page={currentPage}
          onSetPage={(_event, pageNumber) => setCurrentPage(pageNumber)}
          onPerPageSelect={(_event, newPerPage) => {
            setPerPage(newPerPage);
            setCurrentPage(1);
          }}
          variant="bottom"
          perPageOptions={[
            { title: '5', value: 5 },
            { title: '10', value: 10 },
            { title: '20', value: 20 },
            { title: '50', value: 50 }
          ]}
        />
      </>
    );
  };

  return (
    <>
      <PageSection>
        <Title headingLevel="h1" size="2xl" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: 'var(--ai-model-server--BackgroundColor, #E7F1FA)', borderRadius: '20px', padding: '4px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={DeploymentsBrainIcon} 
              alt="Deployments brain icon" 
              style={{ width: '1.25em', height: '1.25em' }}
            />
          </div>
          Deployments
        </Title>
        <div style={{ color: 'var(--pf-v5-global--Color--200)', marginTop: '0.5rem' }}>
          Manage and view the health and performance of your deployed models.
        </div>
      </PageSection>

      {/* Project Selector */}
      {flags.showProjectWorkspaceDropdowns && (
        <PageSection style={{ paddingTop: '0.5rem', paddingBottom: '0.25rem' }}>
          <Toolbar>
            <ToolbarContent>
              <ToolbarGroup>
                <ToolbarItem>
                  <InputGroup>
                    <InputGroupItem>
                      <div className="pf-v6-c-input-group__text">
                        <OutlinedFolderIcon /> Project
                      </div>
                    </InputGroupItem>
                    <InputGroupItem>
                      <Select
                        isOpen={isProjectSelectOpen}
                        selected={selectedProject}
                        onSelect={(_event, value) => {
                          setSelectedProject(value as string);
                          setIsProjectSelectOpen(false);
                        }}
                        onOpenChange={(isOpen) => setIsProjectSelectOpen(isOpen)}
                        toggle={(toggleRef) => (
                          <MenuToggle
                            ref={toggleRef}
                            onClick={() => setIsProjectSelectOpen(!isProjectSelectOpen)}
                            isExpanded={isProjectSelectOpen}
                            style={{ width: '200px' }}
                          >
                            {selectedProject}
                          </MenuToggle>
                        )}
                        shouldFocusToggleOnSelect
                      >
                        <SelectList>
                          <SelectOption value="Project X">Project X</SelectOption>
                          <SelectOption value="Project Y">Project Y</SelectOption>
                        </SelectList>
                      </Select>
                    </InputGroupItem>
                  </InputGroup>
                </ToolbarItem>
              </ToolbarGroup>
            </ToolbarContent>
          </Toolbar>
        </PageSection>
      )}

      <PageSection style={{ paddingTop: '0.5rem' }}>
        <Toolbar id="deployments-toolbar">
          <ToolbarContent>
            <ToolbarGroup variant="filter-group">
              <ToolbarItem>
                <Dropdown
                  isOpen={isNameSortOpen}
                  onOpenChange={setIsNameSortOpen}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsNameSortOpen(!isNameSortOpen)}
                      isExpanded={isNameSortOpen}
                      icon={<FilterIcon />}
                    >
                      Name
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem key="name">Name</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
              <ToolbarItem>
                <InputGroup>
                  <InputGroupItem isFill>
                    <SearchInput
                      placeholder="Filter by name"
                      value={filterValue}
                      onChange={(_event, value) => setFilterValue(value)}
                      onClear={() => setFilterValue('')}
                      aria-label="Filter deployments"
                    />
                  </InputGroupItem>
                </InputGroup>
              </ToolbarItem>
              <ToolbarItem>
                <Button variant="primary" onClick={() => navigate('/ai-hub/deployments/deploy')}>
                  Deploy model
                </Button>
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarGroup align={{ default: 'alignEnd' }}>
              <ToolbarItem variant="pagination">
                <Pagination
                  itemCount={getSortedDeployments().length}
                  perPage={perPage}
                  page={currentPage}
                  onSetPage={(_event, pageNumber) => setCurrentPage(pageNumber)}
                  onPerPageSelect={(_event, newPerPage) => {
                    setPerPage(newPerPage);
                    setCurrentPage(1);
                  }}
                  variant="top"
                  isCompact
                  perPageOptions={[
                    { title: '5', value: 5 },
                    { title: '10', value: 10 },
                    { title: '20', value: 20 },
                    { title: '50', value: 50 }
                  ]}
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        {renderTable()}
      </PageSection>

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
    </>
  );
};

export { Deployments };

