import * as React from 'react';
import { useParams } from 'react-router-dom';
import {
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
  PageSection,
  Tab,
  Tabs,
  TabTitleText,
  Title,
} from '@patternfly/react-core';
import {
  WrenchIcon,
  CogIcon,
  CubesIcon,
  DatabaseIcon,
  ConnectedIcon,
  UsersIcon,
  InfoCircleIcon,
} from '@patternfly/react-icons';

const DataScienceProjectDetail: React.FunctionComponent = () => {
  const { projectName = 'emptyProject' } = useParams<{ projectName: string }>();
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [isTrainExpanded, setIsTrainExpanded] = React.useState(true);
  const [isServeExpanded, setIsServeExpanded] = React.useState(true);
  const [isConfigExpanded, setIsConfigExpanded] = React.useState(true);

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
                            <Button variant="primary" id="create-workbench-button">
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

        {/* Other tabs content placeholders */}
        {activeTabKey === 1 && (
          <Content component={ContentVariants.p} id="workbenches-tab-content">
            Workbenches tab content
          </Content>
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
    </>
  );
};

export { DataScienceProjectDetail };

