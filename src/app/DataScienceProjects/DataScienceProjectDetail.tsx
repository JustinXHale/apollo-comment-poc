import * as React from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  AlertActionCloseButton,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardTitle,
  Content,
  ContentVariants,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Divider,
  ExpandableSection,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Icon,
  MenuToggle,
  PageSection,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  Tab,
  Tabs,
  TabTitleText,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import {
  WrenchIcon,
  CogIcon,
  CubesIcon,
  DatabaseIcon,
  ConnectedIcon,
  UsersIcon,
  InfoCircleIcon,
  OutlinedQuestionCircleIcon,
  ExclamationTriangleIcon,
  SyncAltIcon,
  TrashIcon,
} from '@patternfly/react-icons';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ActionsColumn,
  IAction,
  ExpandableRowContent
} from '@patternfly/react-table';
import { Label, Tooltip, Popover, List, ListItem } from '@patternfly/react-core';
import { CreateWorkbenchWizard } from './CreateWorkbenchWizard';
import MigrationAssistWizard, { LegacyWorkbenchConfig } from '../DevelopTrain/Workbenches/MigrationAssistWizard';

const DataScienceProjectDetail: React.FunctionComponent = () => {
  const { projectName = 'emptyProject' } = useParams<{ projectName: string }>();
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [isTrainExpanded, setIsTrainExpanded] = React.useState(true);
  const [isServeExpanded, setIsServeExpanded] = React.useState(true);
  const [isConfigExpanded, setIsConfigExpanded] = React.useState(true);
  const [expandedWorkbenches, setExpandedWorkbenches] = React.useState<string[]>([]);
  const [isCreateWizardOpen, setIsCreateWizardOpen] = React.useState(false);
  
  // Migration-related state
  const [selectedWorkbenchIds, setSelectedWorkbenchIds] = React.useState<string[]>([]);
  const [showMigrationBanner, setShowMigrationBanner] = React.useState(true);
  const [templatesAvailable] = React.useState(true); // Simulate Joel's template readiness
  const migrationDeadline = '2025-12-31';

  // Filtering state
  const [searchValue, setSearchValue] = React.useState('');
  const [statusFilters, setStatusFilters] = React.useState<string[]>([]);
  const [versionFilters, setVersionFilters] = React.useState<string[]>([]);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = React.useState(false);
  const [isVersionFilterOpen, setIsVersionFilterOpen] = React.useState(false);

  // Migration wizard state
  const [isMigrationWizardOpen, setIsMigrationWizardOpen] = React.useState(false);
  const [selectedWorkbenchesForMigration, setSelectedWorkbenchesForMigration] = React.useState<LegacyWorkbenchConfig[]>([]);

  // Mock workbench data with migration status
  const mockWorkbenches = [
    {
      id: 'wb-1',
      name: 'code server test',
      resourceName: 'code-server-test',
      resourceType: 'Notebook',
      image: 'Code Server | Data Science | CPU | Python 3.11',
      imageVersion: '2025.1 (e332806)',
      isDeprecated: true,
      isLegacyV1: true,
      hardwareProfile: '',
      status: 'Stopped',
      clusterStorage: '',
      packages: ['Boto3 v1.37', 'Kafka-Python-ng v2.2', 'Matplotlib v3.10', 'Numpy v2.2', 'Pandas v2.2', 'Scikit-learn v1.6', 'Scipy v1.15', 'Sklearn-onnx v1.18', 'ipykernel v6.29', 'Kubeflow-Training v1.9'],
      limits: '2 CPU, 8GiB Memory listed',
      requests: '1 CPU, 8GiB Memory requested',
      migrationStatus: 'in-progress' as const,
      migratedToWorkbenchId: 'wb-1-v2'
    },
    {
      id: 'wb-2',
      name: 'de',
      resourceName: 'de',
      resourceType: 'Notebook',
      image: 'Jupyter | Minimal | CPU | Python 3.11',
      imageVersion: '2024.2 (be38cca)',
      isDeprecated: true,
      isLegacyV1: true,
      hardwareProfile: '',
      status: 'Stopped',
      clusterStorage: '',
      packages: [],
      limits: '',
      requests: '',
      migrationStatus: 'completed' as const,
      migratedToWorkbenchId: 'wb-2-v2'
    },
    {
      id: 'wb-3',
      name: 'example',
      resourceName: 'example',
      resourceType: 'Notebook',
      image: 'Jupyter | Data Science | CPU | Python 3.11',
      imageVersion: '2024.2 (be38cca)',
      isDeprecated: true,
      isLegacyV1: true,
      hardwareProfile: '',
      status: 'Stopped',
      clusterStorage: '',
      packages: [],
      limits: '',
      requests: '',
      migrationStatus: 'not-requested' as const
    },
    {
      id: 'wb-4',
      name: 'ffd',
      resourceName: 'ffd',
      resourceType: 'Notebook',
      image: 'Jupyter | PyTorch | CUDA | Python 3.11',
      imageVersion: '2024.2 (be38cca)',
      isDeprecated: true,
      isLegacyV1: true,
      hardwareProfile: '',
      status: 'Failed',
      statusMessage: 'Failed to scale-up',
      clusterStorage: '',
      packages: [],
      limits: '',
      requests: '',
      migrationStatus: 'not-requested' as const
    },
    {
      id: 'wb-5',
      name: 'kyle',
      resourceName: 'kyle',
      resourceType: 'Notebook',
      image: 'Code Server | Data Science | CPU | Python 3.11',
      imageVersion: '2025.1 (e332806)',
      isDeprecated: true,
      isLegacyV1: true,
      hardwareProfile: '',
      status: 'Stopped',
      clusterStorage: '',
      packages: [],
      limits: '',
      requests: '',
      migrationStatus: 'not-requested' as const
    },
    {
      id: 'wb-6',
      name: 'Next workbench',
      resourceName: 'next-workbench',
      resourceType: 'Notebook',
      image: 'Jupyter | TrustyAI | CPU | Python 3.11',
      imageVersion: '2024.2 (be38cca)',
      isDeprecated: false,
      isLegacyV1: false,
      hardwareProfile: '',
      status: 'Stopped',
      clusterStorage: '',
      packages: [],
      limits: '',
      requests: ''
    },
    {
      id: 'wb-7',
      name: 'Test workbench',
      resourceName: 'test-workbench',
      resourceType: 'Notebook',
      image: 'Jupyter | Data Science | CPU | Python 3.11',
      imageVersion: '2024.2 (be38cca)',
      isDeprecated: true,
      isLegacyV1: true,
      hardwareProfile: '',
      status: 'Running',
      clusterStorage: '',
      packages: [],
      limits: '',
      requests: '',
      migrationStatus: 'in-progress' as const,
      migratedToWorkbenchId: 'wb-7-v2'
    },
    {
      id: 'wb-8',
      name: 'UXDPOC6',
      description: 'Workbench that connects to an Object Storage and has a simple model saved there.',
      resourceName: 'uxdpoc6',
      resourceType: 'Notebook',
      image: 'Jupyter | TensorFlow | CUDA | Python 3.11',
      imageVersion: '2024.2 (be38cca)',
      isDeprecated: true,
      isLegacyV1: true,
      hardwareProfile: '',
      status: 'Stopped',
      clusterStorage: '',
      packages: [],
      limits: '',
      requests: '',
      migrationStatus: 'not-requested' as const
    }
  ];

  // Filtered workbenches based on search and filters
  const filteredWorkbenches = React.useMemo(() => {
    return mockWorkbenches.filter((workbench) => {
      // Search filter (name)
      const matchesSearch =
        searchValue === '' ||
        workbench.name.toLowerCase().includes(searchValue.toLowerCase());

      // Status filter
      const matchesStatus = statusFilters.length === 0 || 
        statusFilters.includes(workbench.status) ||
        (workbench.migrationStatus === 'in-progress' && statusFilters.includes('Migrating'));

      // Version filter
      const versionLabel = workbench.isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant';
      const matchesVersion = versionFilters.length === 0 || versionFilters.includes(versionLabel);

      return matchesSearch && matchesStatus && matchesVersion;
    });
  }, [mockWorkbenches, searchValue, statusFilters, versionFilters]);

  // Helper function to render compliance label (matches Joel's admin view pattern)
  const renderComplianceLabel = (isLegacyV1: boolean) => (
    <Tooltip 
      content={
        isLegacyV1 
          ? "Legacy V1 workbenches use deprecated images and should be migrated to NB 2.0" 
          : "This workbench is using the latest NB 2.0 compliant image"
      }
    >
      <Label color={isLegacyV1 ? 'grey' : 'blue'} id={`compliance-label-${isLegacyV1 ? 'v1' : 'v2'}`}>
        {isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant'}
      </Label>
    </Tooltip>
  );

  const toggleWorkbenchExpansion = (workbenchId: string) => {
    setExpandedWorkbenches(prev => 
      prev.includes(workbenchId) 
        ? prev.filter(id => id !== workbenchId)
        : [...prev, workbenchId]
    );
  };

  // Calculate deprecated workbench count
  const deprecatedCount = mockWorkbenches.filter(wb => wb.isDeprecated).length;

  // Selection helpers
  const isWorkbenchSelected = (id: string) => selectedWorkbenchIds.includes(id);
  
  const onSelectWorkbench = (id: string, isSelecting: boolean) => {
    setSelectedWorkbenchIds(prev => 
      isSelecting ? [...prev, id] : prev.filter(i => i !== id)
    );
  };

  const onSelectAllWorkbenches = (_event: React.FormEvent<HTMLInputElement>, isSelecting: boolean) => {
    setSelectedWorkbenchIds(isSelecting ? filteredWorkbenches.map(wb => wb.id) : []);
  };

  const areAllWorkbenchesSelected = filteredWorkbenches.length > 0 && 
    filteredWorkbenches.every(wb => selectedWorkbenchIds.includes(wb.id));

  // Count selected deprecated workbenches for bulk migration
  const selectedDeprecatedCount = filteredWorkbenches.filter(
    wb => wb.isDeprecated && selectedWorkbenchIds.includes(wb.id)
  ).length;

  // Count total selected for delete button
  const selectedCount = selectedWorkbenchIds.length;

  // Handle bulk migration action - opens the MigrationAssistWizard
  const handleBulkMigration = () => {
    const selected = filteredWorkbenches
      .filter((wb) => wb.isLegacyV1 && selectedWorkbenchIds.includes(wb.id))
      .map((wb, index) => {
        // Vary the conflicts to demonstrate unique env var counting
        let env: Record<string, string> | undefined;
        
        if (index % 3 === 0) {
          env = { SAMPLE_ENV: 'VALUE', ANOTHER_VAR: 'test' };
        } else if (index % 5 === 0) {
          env = { CUDA_VERSION: '12.1' };
        } else {
          env = undefined;
        }
        
        return {
          id: wb.id,
          name: wb.name,
          project: projectName,
          env
        };
      });
    setSelectedWorkbenchesForMigration(selected);
    setIsMigrationWizardOpen(true);
  };

  const handleTabClick = (
    _event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <>
      {/* Breadcrumb */}
      <PageSection padding={{ default: 'noPadding' }}>
        <Flex
          direction={{ default: 'column' }}
          spaceItems={{ default: 'spaceItemsNone' }}
        >
          <FlexItem>
            <Breadcrumb id="project-detail-breadcrumb">
              <BreadcrumbItem to="#/projects">Data Science Projects</BreadcrumbItem>
              <BreadcrumbItem to="#" isActive>
                {projectName}
              </BreadcrumbItem>
            </Breadcrumb>
          </FlexItem>
        </Flex>
      </PageSection>

      {/* Page Title Section */}
      <PageSection padding={{ default: 'noPadding' }}>
        <Flex
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
          alignItems={{ default: 'alignItemsCenter' }}
        >
          <FlexItem>
            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <Icon size="lg" id="project-icon">
                  <CubesIcon />
                </Icon>
              </FlexItem>
              <FlexItem>
                <Title headingLevel="h1" size="2xl" id="project-title">
                  {projectName}
                </Title>
              </FlexItem>
              <FlexItem>
                <Button
                  variant="plain"
                  aria-label="Project information"
                  id="project-info-button"
                >
                  <InfoCircleIcon />
                </Button>
              </FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem>
            <Button variant="primary" id="project-actions-button">
              Actions
            </Button>
          </FlexItem>
        </Flex>
      </PageSection>

      {/* Tabs Navigation */}
      <PageSection type="tabs" padding={{ default: 'noPadding' }}>
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          usePageInsets
          id="project-detail-tabs"
        >
          <Tab eventKey={0} title={<TabTitleText>Overview</TabTitleText>} tabContentId="overview-tab-content" />
          <Tab eventKey={1} title={<TabTitleText>Workbenches</TabTitleText>} tabContentId="workbenches-tab-content" />
          <Tab eventKey={2} title={<TabTitleText>Pipelines</TabTitleText>} tabContentId="pipelines-tab-content" />
          <Tab eventKey={3} title={<TabTitleText>Models</TabTitleText>} tabContentId="models-tab-content" />
          <Tab eventKey={4} title={<TabTitleText>Cluster storage</TabTitleText>} tabContentId="storage-tab-content" />
          <Tab eventKey={5} title={<TabTitleText>Connections</TabTitleText>} tabContentId="connections-tab-content" />
          <Tab eventKey={6} title={<TabTitleText>Permissions</TabTitleText>} tabContentId="permissions-tab-content" />
          <Tab eventKey={7} title={<TabTitleText>Settings</TabTitleText>} tabContentId="settings-tab-content" />
        </Tabs>
      </PageSection>

      {/* Overview Tab Content */}
      <PageSection>
        {activeTabKey === 0 && (
          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
            {/* Train models section */}
            <FlexItem>
              <ExpandableSection
                toggleText="Train models"
                onToggle={(_event, isExpanded) => setIsTrainExpanded(isExpanded)}
                isExpanded={isTrainExpanded}
                isIndented
                id="train-models-section"
              >
                <Grid hasGutter span={6}>
                  {/* Workbenches Card */}
                  <GridItem>
                    <Card isFullHeight id="workbenches-card">
                      <CardTitle>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <Icon id="workbenches-icon">
                              <WrenchIcon />
                            </Icon>
                          </FlexItem>
                          <FlexItem>
                            Workbenches
                          </FlexItem>
                          <FlexItem>
                            <Button
                              variant="plain"
                              aria-label="Workbenches information"
                              id="workbenches-info-button"
                            >
                              <InfoCircleIcon />
                            </Button>
                          </FlexItem>
                        </Flex>
                      </CardTitle>
                      <CardBody>
                        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
                          <FlexItem>
                            <img
                              src="/assets/workbench-illustration.svg"
                              alt="Workbench illustration"
                              style={{ maxWidth: '200px', margin: '0 auto', display: 'block' }}
                            />
                          </FlexItem>
                          <FlexItem>
                            <Content component={ContentVariants.p}>
                              A workbench is an isolated area where you can work with models in your preferred IDE, such as
                              a Jupyter notebook. You can add accelerators and connections, create pipelines, and configure
                              cluster storage in your workbench.
                            </Content>
                          </FlexItem>
                <FlexItem>
                  <Button variant="primary" id="create-workbench-button" onClick={() => setIsCreateWizardOpen(true)}>
                    Create a workbench
                  </Button>
                </FlexItem>
                        </Flex>
                      </CardBody>
                    </Card>
                  </GridItem>

                  {/* Pipelines Card */}
                  <GridItem>
                    <Card isFullHeight id="pipelines-card">
                      <CardTitle>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <Icon id="pipelines-icon">
                              <CogIcon />
                            </Icon>
                          </FlexItem>
                          <FlexItem>
                            Pipelines
                          </FlexItem>
                          <FlexItem>
                            <Button
                              variant="plain"
                              aria-label="Pipelines information"
                              id="pipelines-info-button"
                            >
                              <InfoCircleIcon />
                            </Button>
                          </FlexItem>
                        </Flex>
                      </CardTitle>
                      <CardBody>
                        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
                          <FlexItem>
                            <Content component={ContentVariants.p}>
                              To create or use pipelines, you must first configure a pipeline server in this project. A pipeline server provides the infrastructure
                              necessary for the pipeline to execute steps, track results, and manage runs.
                            </Content>
                          </FlexItem>
                          <FlexItem>
                            <Button variant="link" isInline id="configure-pipeline-server-link">
                              Configure pipeline server
                            </Button>
                          </FlexItem>
                        </Flex>
                      </CardBody>
                    </Card>
                  </GridItem>
                </Grid>
              </ExpandableSection>
            </FlexItem>

            {/* Serve models section */}
            <FlexItem>
              <ExpandableSection
                toggleText="Serve models"
                onToggle={(_event, isExpanded) => setIsServeExpanded(isExpanded)}
                isExpanded={isServeExpanded}
                isIndented
                id="serve-models-section"
              >
                <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
                  <FlexItem>
                    <Content component={ContentVariants.p}>
                      Select the type of model serving platform to be used when deploying models from this project.
                    </Content>
                  </FlexItem>
                  <FlexItem>
                    <Grid hasGutter span={6}>
                      {/* Single-model serving platform Card */}
                      <GridItem>
                        <Card isSelectable isFullHeight id="single-model-serving-card">
                          <CardTitle>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <FlexItem>
                                <Icon id="single-model-icon">
                                  <CubesIcon />
                                </Icon>
                              </FlexItem>
                              <FlexItem>
                                Single-model serving platform
                              </FlexItem>
                            </Flex>
                          </CardTitle>
                          <CardBody>
                            <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
                              <FlexItem>
                                <Content component={ContentVariants.p}>
                                  Each model is deployed on its own model server. Choose this option when you want to deploy a large model such as a large language
                                  model (LLM).
                                </Content>
                              </FlexItem>
                              <FlexItem>
                                <Button variant="link" isInline id="select-single-model-link">
                                  Select single-model
                                </Button>
                              </FlexItem>
                            </Flex>
                          </CardBody>
                        </Card>
                      </GridItem>

                      {/* Multi-model serving platform Card */}
                      <GridItem>
                        <Card isSelectable isFullHeight id="multi-model-serving-card">
                          <CardTitle>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <FlexItem>
                                <Icon id="multi-model-icon">
                                  <CubesIcon />
                                </Icon>
                              </FlexItem>
                              <FlexItem>
                                Multi-model serving platform
                              </FlexItem>
                            </Flex>
                          </CardTitle>
                          <CardBody>
                            <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
                              <FlexItem>
                                <Content component={ContentVariants.p}>
                                  Multiple models can be deployed on one shared model server. Choose this option when you want to deploy a number of small or
                                  medium-sized models that can share the server resources.
                                </Content>
                              </FlexItem>
                              <FlexItem>
                                <Button variant="link" isInline id="select-multi-model-link">
                                  Select multi-model
                                </Button>
                              </FlexItem>
                            </Flex>
                          </CardBody>
                        </Card>
                      </GridItem>
                    </Grid>
                  </FlexItem>
                  <FlexItem>
                    <Card id="serving-platform-warning-card">
                      <CardBody>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <Icon status="info" id="warning-icon">
                              <InfoCircleIcon />
                            </Icon>
                          </FlexItem>
                          <FlexItem>
                            <Content component={ContentVariants.p}>
                              You can change the model serving type before the first model is deployed from this project. After deployment, switching types requires deleting all models and servers.
                            </Content>
                          </FlexItem>
                        </Flex>
                      </CardBody>
                    </Card>
                  </FlexItem>
                </Flex>
              </ExpandableSection>
            </FlexItem>

            {/* Project configuration section */}
            <FlexItem>
              <ExpandableSection
                toggleText="Project configuration"
                onToggle={(_event, isExpanded) => setIsConfigExpanded(isExpanded)}
                isExpanded={isConfigExpanded}
                isIndented
                id="project-config-section"
              >
                <Grid hasGutter md={4}>
                  {/* Cluster storage Card */}
                  <GridItem>
                    <Card isFullHeight id="cluster-storage-card">
                      <CardBody>
                        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
                          <FlexItem>
                            <Icon size="xl" id="cluster-storage-icon">
                              <DatabaseIcon />
                            </Icon>
                          </FlexItem>
                          <FlexItem>
                            <Title headingLevel="h3" size="lg" id="cluster-storage-title">
                              Cluster storage
                            </Title>
                          </FlexItem>
                          <FlexItem>
                            <Content component={ContentVariants.p}>
                              To save your project data, you can add cluster storage and optionally connect the
                              storage to a workbench.
                            </Content>
                          </FlexItem>
                        </Flex>
                      </CardBody>
                    </Card>
                  </GridItem>

                  {/* Connections Card */}
                  <GridItem>
                    <Card isFullHeight id="connections-card">
                      <CardBody>
                        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
                          <FlexItem>
                            <Icon size="xl" id="connections-icon">
                              <ConnectedIcon />
                            </Icon>
                          </FlexItem>
                          <FlexItem>
                            <Title headingLevel="h3" size="lg" id="connections-title">
                              Connections
                            </Title>
                          </FlexItem>
                          <FlexItem>
                            <Content component={ContentVariants.p}>
                              Connections enable you to store and retrieve information that typically should not be
                              stored in code. For example, you can store details (including credentials) for object
                              storage, databases, and more. You can then attach the connections to artifacts in
                              your project such as workbenches and model servers.
                            </Content>
                          </FlexItem>
                        </Flex>
                      </CardBody>
                    </Card>
                  </GridItem>

                  {/* Permissions Card */}
                  <GridItem>
                    <Card isFullHeight id="permissions-card">
                      <CardBody>
                        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
                          <FlexItem>
                            <Icon size="xl" id="permissions-icon">
                              <UsersIcon />
                            </Icon>
                          </FlexItem>
                          <FlexItem>
                            <Title headingLevel="h3" size="lg" id="permissions-title">
                              Permissions
                            </Title>
                          </FlexItem>
                          <FlexItem>
                            <Content component={ContentVariants.p}>
                              Add users and groups to share access to your project.
                            </Content>
                          </FlexItem>
                        </Flex>
                      </CardBody>
                    </Card>
                  </GridItem>
                </Grid>
              </ExpandableSection>
            </FlexItem>
          </Flex>
        )}

        {/* Workbenches Tab Content */}
        {activeTabKey === 1 && (
          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
            {/* Title with Deprecation Badge */}
            <FlexItem>
              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                <FlexItem>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>
                      <Title headingLevel="h2" id="workbenches-tab-title">
                        Workbenches
                      </Title>
                    </FlexItem>
                    {deprecatedCount > 0 && (
                      <FlexItem>
                        <Label color="orange" icon={<ExclamationTriangleIcon />} id="deprecated-count-badge">
                          {deprecatedCount} using deprecated images
                        </Label>
                      </FlexItem>
                    )}
                  </Flex>
                </FlexItem>
              </Flex>
            </FlexItem>

            {/* Admin Migration Banner */}
            {showMigrationBanner && deprecatedCount > 0 && (
              <FlexItem>
                <Alert 
                  variant="warning" 
                  isInline 
                  title="Action required: Migrate deprecated workbenches"
                  actionClose={<AlertActionCloseButton onClose={() => setShowMigrationBanner(false)} />}
                  id="migration-banner"
                >
                  Your administrator requires all workbenches to be migrated to v2.0 by {migrationDeadline}.
                  You have {deprecatedCount} workbench{deprecatedCount !== 1 ? 'es' : ''} that need migration.
                  Select workbenches below and click &quot;Migrate to New Version.&quot;
                </Alert>
              </FlexItem>
            )}

            {/* Filtering Toolbar */}
            <FlexItem>
              <Toolbar id="workbenches-toolbar" inset={{ default: 'insetNone' }} clearAllFilters={() => {
                setSearchValue('');
                setStatusFilters([]);
                setVersionFilters([]);
              }}>
                <ToolbarContent>
                  <ToolbarGroup variant="filter-group">
                    <ToolbarItem>
                      <SearchInput
                        placeholder="Filter by name"
                        value={searchValue}
                        onChange={(_event, value) => setSearchValue(value)}
                        onClear={() => setSearchValue('')}
                        id="workbenches-search"
                      />
                    </ToolbarItem>
                    <ToolbarItem>
                      <Select
                        isOpen={isStatusFilterOpen}
                        onOpenChange={(isOpen) => setIsStatusFilterOpen(isOpen)}
                        onSelect={(_event, value) => {
                          const status = value as string;
                          setStatusFilters(
                            statusFilters.includes(status)
                              ? statusFilters.filter((s) => s !== status)
                              : [...statusFilters, status]
                          );
                        }}
                        selected={statusFilters}
                        toggle={(toggleRef) => (
                          <MenuToggle
                            ref={toggleRef}
                            onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                            isExpanded={isStatusFilterOpen}
                            id="status-filter-toggle"
                          >
                            Status
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          <SelectOption hasCheckbox isSelected={statusFilters.includes('Running')} value="Running">
                            Running
                          </SelectOption>
                          <SelectOption hasCheckbox isSelected={statusFilters.includes('Stopped')} value="Stopped">
                            Stopped
                          </SelectOption>
                          <SelectOption hasCheckbox isSelected={statusFilters.includes('Failed')} value="Failed">
                            Failed
                          </SelectOption>
                          <SelectOption hasCheckbox isSelected={statusFilters.includes('Migrating')} value="Migrating">
                            Migrating
                          </SelectOption>
                        </SelectList>
                      </Select>
                    </ToolbarItem>
                    <ToolbarItem>
                      <Select
                        isOpen={isVersionFilterOpen}
                        onOpenChange={(isOpen) => setIsVersionFilterOpen(isOpen)}
                        onSelect={(_event, value) => {
                          const version = value as string;
                          setVersionFilters(
                            versionFilters.includes(version)
                              ? versionFilters.filter((v) => v !== version)
                              : [...versionFilters, version]
                          );
                        }}
                        selected={versionFilters}
                        toggle={(toggleRef) => (
                          <MenuToggle
                            ref={toggleRef}
                            onClick={() => setIsVersionFilterOpen(!isVersionFilterOpen)}
                            isExpanded={isVersionFilterOpen}
                            id="version-filter-toggle"
                          >
                            Version
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          <SelectOption hasCheckbox isSelected={versionFilters.includes('Legacy V1')} value="Legacy V1">
                            Legacy V1
                          </SelectOption>
                          <SelectOption hasCheckbox isSelected={versionFilters.includes('NB 2.0 Compliant')} value="NB 2.0 Compliant">
                            NB 2.0 Compliant
                          </SelectOption>
                        </SelectList>
                      </Select>
                    </ToolbarItem>
                    <ToolbarItem>
                      <Button
                        id="delete-selected-button"
                        variant="plain"
                        icon={<TrashIcon />}
                        isDisabled={selectedCount === 0}
                        onClick={() => {
                          console.log('Delete selected workbenches:', selectedWorkbenchIds);
                        }}
                        aria-label={`Delete ${selectedCount} selected workbench${selectedCount !== 1 ? 'es' : ''}`}
                      />
                    </ToolbarItem>
                  </ToolbarGroup>
                  <ToolbarGroup>
                    <ToolbarItem>
                      <Button variant="primary" id="create-workbench-tab-button" onClick={() => setIsCreateWizardOpen(true)}>
                        Create Workbench
                      </Button>
                    </ToolbarItem>
                    <ToolbarItem>
                      <Button
                        variant="secondary"
                        id="migrate-selected-button"
                        isDisabled={selectedDeprecatedCount === 0}
                        onClick={handleBulkMigration}
                      >
                        Migrate Workbenches ({selectedDeprecatedCount} Selected)
                      </Button>
                    </ToolbarItem>
                  </ToolbarGroup>
                </ToolbarContent>
              </Toolbar>
            </FlexItem>

            <FlexItem>
              <Table aria-label="Workbenches table" variant="compact" id="workbenches-table">
                <Thead>
                  <Tr>
                    <Th
                      select={{
                        onSelect: onSelectAllWorkbenches,
                        isSelected: areAllWorkbenchesSelected,
                      }}
                      id="select-all-checkbox"
                    />
                    <Th />
                    <Th width={15} id="workbench-name-header">Name</Th>
                    <Th width={25} id="workbench-image-header">Workbench image</Th>
                    <Th width={10} id="workbench-hardware-header">Hardware profile</Th>
                    <Th width={15} id="workbench-version-header">Version/Compliance</Th>
                    <Th width={15} id="workbench-status-header">Status</Th>
                    <Th width={10} />
                    <Th width={10} />
                  </Tr>
                </Thead>
                {filteredWorkbenches.map((workbench, rowIndex) => {
                  const isExpanded = expandedWorkbenches.includes(workbench.id);

                  const getStatusLabel = (status: string) => {
                    switch (status) {
                      case 'Running':
                        return <Label color="green" icon={<span style={{ fontSize: '0.75rem' }}>●</span>} id={`status-${workbench.id}`}>Running</Label>;
                      case 'Stopped':
                        return <Label icon={<span style={{ fontSize: '0.75rem' }}>○</span>} id={`status-${workbench.id}`}>Stopped</Label>;
                      case 'Failed':
                        return <Label color="red" icon={<span style={{ fontSize: '0.75rem' }}>●</span>} id={`status-${workbench.id}`}>Failed</Label>;
                      default:
                        return <Label id={`status-${workbench.id}`}>{status}</Label>;
                    }
                  };

                  const rowActions: IAction[] = [
                    {
                      title: 'Edit',
                      onClick: () => console.log(`Edit ${workbench.name}`),
                    },
                    {
                      title: 'Migrate to New Version...',
                      onClick: () => {
                        const wbConfig: LegacyWorkbenchConfig = {
                          id: workbench.id,
                          name: workbench.name,
                          project: projectName,
                          env: { SAMPLE_ENV: 'VALUE', ANOTHER_VAR: 'test' }
                        };
                        setSelectedWorkbenchesForMigration([wbConfig]);
                        setIsMigrationWizardOpen(true);
                      },
                      isDisabled: !workbench.isDeprecated,
                    },
                    {
                      title: 'Delete',
                      onClick: () => console.log(`Delete ${workbench.name}`),
                    },
                  ];

                  return (
                    <Tbody key={workbench.id} isExpanded={isExpanded}>
                      <Tr>
                        <Td
                          select={{
                            rowIndex,
                            onSelect: (_event, isSelecting) => onSelectWorkbench(workbench.id, isSelecting),
                            isSelected: isWorkbenchSelected(workbench.id),
                          }}
                          id={`select-${workbench.id}`}
                        />
                        <Td
                          expand={{
                            rowIndex,
                            isExpanded,
                            onToggle: () => toggleWorkbenchExpansion(workbench.id),
                          }}
                        />
                        <Td dataLabel="Name">
                          <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                            <FlexItem>
                              {workbench.name}
                            </FlexItem>
                            <FlexItem>
                              <Popover
                                headerContent="Resource names and types are used to find your resources in OpenShift."
                                bodyContent={
                                  <div>
                                    <strong>Resource name</strong>
                                    <div>{workbench.resourceName}</div>
                                    <br />
                                    <strong>Resource type</strong>
                                    <div>{workbench.resourceType}</div>
                                  </div>
                                }
                              >
                                <Button
                                  variant="plain"
                                  aria-label={`Resource info for ${workbench.name}`}
                                  id={`info-${workbench.id}`}
                                  style={{ padding: 0, minWidth: 'auto' }}
                                >
                                  <OutlinedQuestionCircleIcon style={{ fontSize: '0.875rem' }} />
                                </Button>
                              </Popover>
                            </FlexItem>
                          </Flex>
                        </Td>
                        <Td dataLabel="Workbench image">
                          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXs' }}>
                            <FlexItem>{workbench.image}</FlexItem>
                            <FlexItem>
                              <span style={{ fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)' }}>
                                {workbench.imageVersion}
                              </span>
                            </FlexItem>
                          </Flex>
                        </Td>
                        <Td dataLabel="Hardware profile">
                          {workbench.hardwareProfile || '-'}
                        </Td>
                        <Td dataLabel="Version/Compliance" id={`version-${workbench.id}`}>
                          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXs' }}>
                            <FlexItem>
                              {workbench.migrationStatus === 'completed' 
                                ? renderComplianceLabel(false) // Show NB 2.0 Compliant for completed migrations
                                : renderComplianceLabel(workbench.isLegacyV1)
                              }
                            </FlexItem>
                            {workbench.migrationStatus === 'in-progress' && (
                              <FlexItem>
                                <Label color="blue" icon={<SyncAltIcon />} isCompact id={`migration-status-${workbench.id}`}>
                                  Migration in progress
                                </Label>
                              </FlexItem>
                            )}
                          </Flex>
                        </Td>
                        <Td dataLabel="Status">
                          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXs' }}>
                            <FlexItem>
                              {getStatusLabel(workbench.status)}
                            </FlexItem>
                            {workbench.statusMessage && (
                              <FlexItem>
                                <Button
                                  variant="link"
                                  isInline
                                  id={`status-message-${workbench.id}`}
                                  style={{ fontSize: '0.875rem', padding: 0 }}
                                >
                                  {workbench.statusMessage}
                                </Button>
                              </FlexItem>
                            )}
                          </Flex>
                        </Td>
                        <Td>
                          <Button
                            variant="link"
                            isInline
                            id={`action-${workbench.id}`}
                            isDisabled={workbench.status === 'Failed'}
                          >
                            {workbench.status === 'Running' ? 'Stop' : 'Start'}
                          </Button>
                        </Td>
                        <Td isActionCell>
                          <ActionsColumn items={rowActions} id={`actions-${workbench.id}`} />
                        </Td>
                      </Tr>
                      <Tr isExpanded={isExpanded}>
                        <Td />
                        <Td />
                        <Td colSpan={7}>
                          <ExpandableRowContent>
                            <Grid hasGutter md={4}>
                              <GridItem>
                                <Title headingLevel="h4" size="md" id={`cluster-storage-title-${workbench.id}`}>
                                  Cluster storage
                                </Title>
                                <Content component={ContentVariants.p}>
                                  {workbench.clusterStorage || 'No cluster storage configured'}
                                </Content>
                              </GridItem>
                              <GridItem>
                                <Title headingLevel="h4" size="md" id={`packages-title-${workbench.id}`}>
                                  Packages
                                </Title>
                                {workbench.packages.length > 0 ? (
                                  <List isPlain>
                                    {workbench.packages.map((pkg, idx) => (
                                      <ListItem key={idx}>{pkg}</ListItem>
                                    ))}
                                  </List>
                                ) : (
                                  <Content component={ContentVariants.p}>No packages</Content>
                                )}
                              </GridItem>
                              <GridItem>
                                <Title headingLevel="h4" size="md" id={`limits-title-${workbench.id}`}>
                                  Limits
                                </Title>
                                <Content component={ContentVariants.p}>
                                  {workbench.limits || 'No limits configured'}
                                </Content>
                                <br />
                                <Title headingLevel="h4" size="md" id={`requests-title-${workbench.id}`}>
                                  Requests
                                </Title>
                                <Content component={ContentVariants.p}>
                                  {workbench.requests || 'No requests configured'}
                                </Content>
                              </GridItem>
                            </Grid>
                          </ExpandableRowContent>
                        </Td>
                      </Tr>
                    </Tbody>
                  );
                })}
              </Table>
            </FlexItem>
          </Flex>
        )}
        {activeTabKey === 2 && (
          <Content component={ContentVariants.p} id="pipelines-tab-content">
            Pipelines tab content
          </Content>
        )}
        {activeTabKey === 3 && (
          <Content component={ContentVariants.p} id="models-tab-content">
            Models tab content
          </Content>
        )}
        {activeTabKey === 4 && (
          <Content component={ContentVariants.p} id="storage-tab-content">
            Cluster storage tab content
          </Content>
        )}
        {activeTabKey === 5 && (
          <Content component={ContentVariants.p} id="connections-tab-content">
            Connections tab content
          </Content>
        )}
        {activeTabKey === 6 && (
          <Content component={ContentVariants.p} id="permissions-tab-content">
            Permissions tab content
          </Content>
        )}
        {activeTabKey === 7 && (
          <Content component={ContentVariants.p} id="settings-tab-content">
            Settings tab content
          </Content>
        )}
      </PageSection>

      {/* Create Workbench Wizard */}
      <CreateWorkbenchWizard 
        isOpen={isCreateWizardOpen} 
        onClose={() => setIsCreateWizardOpen(false)} 
      />

      {/* Migration Assist Wizard */}
      {selectedWorkbenchesForMigration.length > 0 && (
        <MigrationAssistWizard
          isOpen={isMigrationWizardOpen}
          onClose={() => {
            setIsMigrationWizardOpen(false);
            setSelectedWorkbenchesForMigration([]);
          }}
          workbenches={selectedWorkbenchesForMigration}
        />
      )}
    </>
  );
};

export { DataScienceProjectDetail };

