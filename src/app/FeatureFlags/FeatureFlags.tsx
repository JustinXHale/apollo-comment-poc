import * as React from 'react';
import { 
  Button,
  Card, 
  CardBody, 
  Flex,
  FlexItem,
  MenuToggle,
  PageSection,
  Select,
  SelectList,
  SelectOption,
  Switch,
  Title
} from '@patternfly/react-core';
import { 
  CaretDownIcon,
  DesktopIcon,
  FlagIcon,
  FlaskIcon,
  StarIcon,
  UndoIcon
} from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { useFeatureFlags } from '@app/utils/FeatureFlagsContext';

const FeatureFlags: React.FunctionComponent = () => {
  useDocumentTitle("Feature Flags");
  
  const { 
    flags, 
    updateFlag, 
    resetFlags
  } = useFeatureFlags();

  // Fidelity switcher state
  const [fidelitySelectOpen, setFidelitySelectOpen] = React.useState(false);
  const [fidelity, setFidelity] = React.useState<'high' | 'low'>('high');

  // Effect to toggle fidelity class on body
  React.useEffect(() => {
    if (fidelity === 'low') {
      document.body.classList.add('fidelity-low');
    } else {
      document.body.classList.remove('fidelity-low');
    }
  }, [fidelity]);

  return (
    <>
      <PageSection>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Title headingLevel="h1" size="xl">
              <FlagIcon style={{ marginRight: '0.5rem' }} />
              Feature Flags & Developer Settings
            </Title>
          </FlexItem>
          <FlexItem>
            <Button 
              variant="secondary" 
              size="sm"
              icon={<UndoIcon />}
              onClick={resetFlags}
            >
              Restore Defaults
            </Button>
          </FlexItem>
        </Flex>
      </PageSection>

      {/* MVP Features - Always show at the top */}
      <PageSection>
        <Card>
          <CardBody>
            <Title headingLevel="h2" size="lg" style={{ marginBottom: '1rem' }}>
              <StarIcon style={{ marginRight: '0.5rem', color: '#0066cc' }} />
              Features
            </Title>
            
            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    MVP Layout
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    Enable MVP mode to access specialized features and streamlined layout
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  isChecked={flags.enableMVPMode}
                  onChange={(_event, checked) => updateFlag('enableMVPMode', checked)}
                  aria-label="Enable MVP Layout"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Show Project and Workspace Dropdowns
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    Controls visibility of the Project and Workspace selector dropdowns in page headers
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  id="project-workspace-toggle"
                  isChecked={flags.showProjectWorkspaceDropdowns}
                  onChange={() => updateFlag('showProjectWorkspaceDropdowns', !flags.showProjectWorkspaceDropdowns)}
                  aria-label="Toggle Project and Workspace dropdowns visibility"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Model Playground Card
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    Controls visibility of the Model Playground card on the AI Hub dashboard
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  id="model-playground-card-toggle"
                  isChecked={flags.enableModelPlaygroundCard}
                  onChange={() => updateFlag('enableModelPlaygroundCard', !flags.enableModelPlaygroundCard)}
                  aria-label="Toggle Model Playground card visibility"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Prompt Engineering Card
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    Controls visibility of the Prompt Engineering card on the AI Hub dashboard
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  id="prompt-engineering-card-toggle"
                  isChecked={flags.enablePromptEngineeringCard}
                  onChange={() => updateFlag('enablePromptEngineeringCard', !flags.enablePromptEngineeringCard)}
                  aria-label="Toggle Prompt Engineering card visibility"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    My Agents Card
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    Controls visibility of the My Agents card on the AI Hub dashboard
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  id="my-agents-card-toggle"
                  isChecked={flags.enableMyAgentsCard}
                  onChange={() => updateFlag('enableMyAgentsCard', !flags.enableMyAgentsCard)}
                  aria-label="Toggle My Agents card visibility"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Model Playground Page
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    Controls access to the Model Playground page in Gen AI Studio
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  id="model-playground-page-toggle"
                  isChecked={flags.enableModelPlaygroundPage}
                  onChange={() => updateFlag('enableModelPlaygroundPage', !flags.enableModelPlaygroundPage)}
                  aria-label="Toggle Model Playground page access"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    My Agents Page
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    Controls access to the My Agents page in Gen AI Studio
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  id="my-agents-page-toggle"
                  isChecked={flags.enableMyAgentsPage}
                  onChange={() => updateFlag('enableMyAgentsPage', !flags.enableMyAgentsPage)}
                  aria-label="Toggle My Agents page access"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Prompt Engineering Page
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    Controls access to the Prompt Engineering page in Gen AI Studio
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  id="prompt-engineering-page-toggle"
                  isChecked={flags.enablePromptEngineeringPage}
                  onChange={() => updateFlag('enablePromptEngineeringPage', !flags.enablePromptEngineeringPage)}
                  aria-label="Toggle Prompt Engineering page access"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Knowledge Sources Page
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    Controls access to the Knowledge Sources page in Gen AI Studio
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  id="knowledge-sources-page-toggle"
                  isChecked={flags.enableKnowledgeSourcesPage}
                  onChange={() => updateFlag('enableKnowledgeSourcesPage', !flags.enableKnowledgeSourcesPage)}
                  aria-label="Toggle Knowledge Sources page access"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Persist Data
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    When enabled, MCP server selections and tool configurations persist between sessions. When disabled, data is cleared on page reload.
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  id="persist-data-toggle"
                  isChecked={flags.persistData}
                  onChange={() => updateFlag('persistData', !flags.persistData)}
                  aria-label="Toggle data persistence"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    UI Fidelity
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    Switch between high-fidelity and low-fidelity UI modes for testing and development
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Select
                  isOpen={fidelitySelectOpen}
                  selected={fidelity}
                  onSelect={(_event, value) => {
                    setFidelity(value as 'high' | 'low');
                    setFidelitySelectOpen(false);
                  }}
                  onOpenChange={(isOpen) => setFidelitySelectOpen(isOpen)}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setFidelitySelectOpen(!fidelitySelectOpen)}
                      isExpanded={fidelitySelectOpen}
                      aria-label="Fidelity switcher"
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {fidelity === 'high' ? 'High fidelity' : 'Low fidelity'}
                        <CaretDownIcon />
                      </span>
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    <SelectOption value="high">High fidelity</SelectOption>
                    <SelectOption value="low">Low fidelity</SelectOption>
                  </SelectList>
                </Select>
              </FlexItem>
            </Flex>

            {flags.enableMVPMode && (
              <>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
                  <FlexItem>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        Evaluations
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                        Enable or disable the evaluations feature for MVP mode
                      </div>
                    </div>
                  </FlexItem>
                  <FlexItem>
                    <Switch
                      isChecked={flags.enableEvals}
                      onChange={(_event, checked) => updateFlag('enableEvals', checked)}
                      aria-label="Enable Evals"
                    />
                  </FlexItem>
                </Flex>

                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
                  <FlexItem>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        Knowledge Sources
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                        Enable or disable the knowledge sources feature for MVP mode
                      </div>
                    </div>
                  </FlexItem>
                  <FlexItem>
                    <Switch
                      isChecked={flags.enableKnowledge}
                      onChange={(_event, checked) => updateFlag('enableKnowledge', checked)}
                      aria-label="Enable Knowledge"
                    />
                  </FlexItem>
                </Flex>

                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
                  <FlexItem>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        MCP (Model Context Protocol)
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                        Enable or disable Model Context Protocol integration
                      </div>
                    </div>
                  </FlexItem>
                  <FlexItem>
                    <Switch
                      isChecked={flags.enableMCP}
                      onChange={(_event, checked) => updateFlag('enableMCP', checked)}
                      aria-label="Enable MCP"
                    />
                  </FlexItem>
                </Flex>

                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
                  <FlexItem>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        Guardrails Catalog
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                        Enable or disable the guardrails catalog feature
                      </div>
                    </div>
                  </FlexItem>
                  <FlexItem>
                    <Switch
                      isChecked={flags.enableGuardrailsCatalog}
                      onChange={(_event, checked) => updateFlag('enableGuardrailsCatalog', checked)}
                      aria-label="Enable Guardrails Catalog"
                    />
                  </FlexItem>
                </Flex>

                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
                  <FlexItem>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        Advanced Prompt Engineering
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                        Enable or disable advanced prompt engineering capabilities
                      </div>
                    </div>
                  </FlexItem>
                  <FlexItem>
                    <Switch
                      isChecked={flags.enableAdvancedPromptEngineering}
                      onChange={(_event, checked) => updateFlag('enableAdvancedPromptEngineering', checked)}
                      aria-label="Enable Advanced Prompt Engineering"
                    />
                  </FlexItem>
                </Flex>

                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
                  <FlexItem>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        Advanced Agent Management
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                        Enable or disable advanced agent management features
                      </div>
                    </div>
                  </FlexItem>
                  <FlexItem>
                    <Switch
                      isChecked={flags.enableAdvancedAgentManagement}
                      onChange={(_event, checked) => updateFlag('enableAdvancedAgentManagement', checked)}
                      aria-label="Enable Advanced Agent Management"
                    />
                  </FlexItem>
                </Flex>

                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1.5rem' }}>
                  <FlexItem>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        Show MCP Filters
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                        Show filter buttons (Server Type, Deployment, etc.) in the MCP servers view
                      </div>
                    </div>
                  </FlexItem>
                  <FlexItem>
                    <Switch
                      isChecked={flags.showMcpFilters}
                      onChange={(_event, checked) => updateFlag('showMcpFilters', checked)}
                      aria-label="Show MCP Filters"
                    />
                  </FlexItem>
                </Flex>

                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1.5rem' }}>
                  <FlexItem>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        Show MCP Connection URL
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                        Show the connection URL section on MCP server details pages
                      </div>
                    </div>
                  </FlexItem>
                  <FlexItem>
                    <Switch
                      isChecked={flags.showMcpConnectionUrl}
                      onChange={(_event, checked) => updateFlag('showMcpConnectionUrl', checked)}
                      aria-label="Show MCP Connection URL"
                    />
                  </FlexItem>
                </Flex>

                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1.5rem' }}>
                  <FlexItem>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        Show Discover Assets
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                        Show the Discover Assets dropdown section in navigation
                      </div>
                    </div>
                  </FlexItem>
                  <FlexItem>
                    <Switch
                      isChecked={flags.showDiscoverAssets}
                      onChange={(_event, checked) => updateFlag('showDiscoverAssets', checked)}
                      aria-label="Show Discover Assets"
                    />
                  </FlexItem>
                </Flex>

              </>
            )}
          </CardBody>
        </Card>
      </PageSection>

      {/* Layout Modes */}
      <PageSection>
        <Card>
          <CardBody>
            <Title headingLevel="h2" size="lg" style={{ marginBottom: '1rem' }}>
              <DesktopIcon style={{ marginRight: '0.5rem', color: '#0066cc' }} />
              Layout Modes
            </Title>
            
            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    IDE Layout
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    Three-panel developer layout for advanced users
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  isChecked={flags.enableIDELayout}
                  onChange={(_event, checked) => updateFlag('enableIDELayout', checked)}
                  aria-label="Enable IDE Layout"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Workflow Layout
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    Wizard-style step-by-step layout for guided workflows
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  isChecked={flags.enableWorkflowLayout}
                  onChange={(_event, checked) => updateFlag('enableWorkflowLayout', checked)}
                  aria-label="Enable Workflow Layout"
                />
              </FlexItem>
            </Flex>


          </CardBody>
        </Card>
      </PageSection>

      {/* Agent Builder Features */}
      <PageSection>
        <Card>
          <CardBody>
            <Title headingLevel="h2" size="lg" style={{ marginBottom: '1rem' }}>
              <FlaskIcon style={{ marginRight: '0.5rem', color: '#0066cc' }} />
              Agent Builder Features
            </Title>
            
            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Agent Builder Mode
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    When enabled, moves Agent Builder to the top-level navigation instead of being nested under Gen AI Studio
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  id="agent-builder-mode-toggle"
                  isChecked={flags.agentBuilderMode}
                  onChange={() => updateFlag('agentBuilderMode', !flags.agentBuilderMode)}
                  aria-label="Toggle Agent Builder mode"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Agent Templates
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    Enable or disable agent templates tab in the Agent Builder
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  isChecked={flags.enableAgentTemplates}
                  onChange={(_event, checked) => updateFlag('enableAgentTemplates', checked)}
                  aria-label="Enable Agent Templates"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Guardrails
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    Enable or disable guardrails configuration section
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  isChecked={flags.enableGuardrails}
                  onChange={(_event, checked) => updateFlag('enableGuardrails', checked)}
                  aria-label="Enable Guardrails"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Evaluation & Testing
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    Enable evaluation and testing tools for agent performance
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  isChecked={flags.enableEvaluation}
                  onChange={(_event, checked) => updateFlag('enableEvaluation', checked)}
                  aria-label="Enable Evaluation & Testing"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Tracing
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    Enable agent execution tracing and monitoring capabilities
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  isChecked={flags.enableTracing}
                  onChange={(_event, checked) => updateFlag('enableTracing', checked)}
                  aria-label="Enable Tracing"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Deploy Mode
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    When enabled, shows the staging deployment URL in the Agent Builder topology view
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  id="deploy-mode-toggle"
                  isChecked={flags.deploy}
                  onChange={() => updateFlag('deploy', !flags.deploy)}
                  aria-label="Toggle Deploy mode"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Generate API Key
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    When enabled, shows the Generate/Regenerate API Key button in model endpoint modals
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  id="generate-api-key-toggle"
                  isChecked={flags.enableGenerateApiKey}
                  onChange={(_event, checked) => updateFlag('enableGenerateApiKey', checked)}
                  aria-label="Toggle Generate API Key"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Model Descriptions
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    When enabled, shows the Description column in the models table
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  id="model-descriptions-toggle"
                  isChecked={flags.showModelDescriptions}
                  onChange={(_event, checked) => updateFlag('showModelDescriptions', checked)}
                  aria-label="Toggle Model Descriptions"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Card/Table View Switcher
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    When enabled, shows the Cards/Table view toggle buttons in the Models and MCP Servers tabs
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  id="card-table-view-switcher-toggle"
                  isChecked={flags.enableCardTableViewSwitcher}
                  onChange={(_event, checked) => updateFlag('enableCardTableViewSwitcher', checked)}
                  aria-label="Toggle Card/Table View Switcher"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Model Description Pages
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    When enabled, model names in the Models tab become clickable links to detailed model pages
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  id="model-description-pages-toggle"
                  isChecked={flags.enableModelDescriptionPages}
                  onChange={(_event, checked) => updateFlag('enableModelDescriptionPages', checked)}
                  aria-label="Toggle Model Description Pages"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    MCP Details Page
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    When enabled, MCP server names in the MCP Servers tab become clickable links to detailed server pages
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  id="mcp-details-page-toggle"
                  isChecked={flags.enableMcpDetailsPage}
                  onChange={(_event, checked) => updateFlag('enableMcpDetailsPage', checked)}
                  aria-label="Toggle MCP Details Page"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    First Time Playground
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    When enabled, shows the empty state in the playground regardless of project selection
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  id="first-time-playground-toggle"
                  isChecked={flags.firstTimePlayground}
                  onChange={(_event, checked) => updateFlag('firstTimePlayground', checked)}
                  aria-label="Toggle First Time Playground"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Model Performance in Catalog
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    Show the &apos;Explore model performance&apos; card in the model catalog filters
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  id="model-performance-catalog-toggle"
                  isChecked={flags.modelPerformanceInCatalog}
                  onChange={(_event, checked) => updateFlag('modelPerformanceInCatalog', checked)}
                  aria-label="Toggle Model Performance in Catalog"
                />
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
              <FlexItem>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Display Mode
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                    Show light/dark mode toggle in the header
                  </div>
                </div>
              </FlexItem>
              <FlexItem>
                <Switch
                  id="display-mode-toggle"
                  isChecked={flags.displayMode}
                  onChange={(_event, checked) => updateFlag('displayMode', checked)}
                  aria-label="Toggle Display Mode"
                />
              </FlexItem>
            </Flex>
          </CardBody>
        </Card>
      </PageSection>


    </>
  );
};

export { FeatureFlags }; 