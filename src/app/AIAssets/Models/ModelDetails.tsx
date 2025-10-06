import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CodeBlock,
  CodeBlockCode,
  Divider,
  Grid,
  GridItem,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  PageSection,
  Progress,
  Title,
  Tooltip
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  CopyIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  InfoCircleIcon,
  LinkIcon,
  PlayIcon,
  PlusCircleIcon
} from '@patternfly/react-icons';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import { useFeatureFlags } from '../../utils/FeatureFlagsContext';
import { modelLogos } from './modelLogos';
import genericModelIcon from '@app/assets/generic-model-icon.png';

// Mock model data (should match the data from AvailableAIAssets)
const mockModels = [
  {
    id: '1',
    slug: 'llama-3-1-8b-instruct',
    name: 'llama-3.1-8b-instruct',
    internalEndpoint: 'http://llama-3-1-8b.demo-namespace.svc.cluster.local:8080/v1',
    internalToken: 'sk-internal-token-123',
    externalEndpoint: 'https://api.demo.openshift.ai/models/llama-3-1-8b/v1',
    externalToken: 'sk-external-token-456',
    llsStatus: 'registered',
    useCase: 'General chat',
    description: 'Meta Llama 3.1 8B parameter model optimized for instruction following',
    framework: 'vLLM',
    version: '3.1',
    provider: 'Meta',
    parameters: '8B',
    license: 'Custom',
    deploymentDate: '2025-01-15',
    lastUsed: '2025-01-21',
    logo: modelLogos['llama-3-1-8b-instruct'],
    projects: ['Project X'],
    servingRuntime: 'vLLM NVIDIA GPU ServingRuntime for KServe - v0.9.1.0',
    apiType: 'REST',
    status: 'Running',
    statusColor: '#3e8635'
  },
  {
    id: '2',
    slug: 'granite-7b-code',
    name: 'granite-7b-code',
    internalEndpoint: 'http://granite-7b-code.demo-namespace.svc.cluster.local:8080/v1',
    internalToken: 'sk-internal-granite-789',
    externalEndpoint: 'https://api.demo.openshift.ai/models/granite-7b/v1',
    externalToken: 'sk-external-granite-xyz',
    llsStatus: 'not-registered',
    useCase: 'Code generation and programming assistance',
    description: 'IBM Granite 7B model specialized for code generation tasks',
    framework: 'TGI',
    version: '1.0',
    provider: 'IBM',
    parameters: '7B',
    license: 'Apache 2.0',
    deploymentDate: '2025-01-10',
    lastUsed: '2025-01-20',
    logo: modelLogos['granite-7b-code'],
    projects: ['Project X', 'Project Y'],
    servingRuntime: 'vLLM NVIDIA GPU ServingRuntime for KServe - v0.9.1.0',
    apiType: 'REST',
    status: 'Running',
    statusColor: '#3e8635'
  },
  {
    id: '3',
    slug: 'mistral-7b-instruct',
    name: 'mistral-7b-instruct',
    internalEndpoint: 'http://mistral-7b.demo-namespace.svc.cluster.local:8080/v1',
    internalToken: 'sk-internal-mistral-abc',
    externalEndpoint: 'https://api.demo.openshift.ai/models/mistral-7b/v1',
    externalToken: 'sk-external-mistral-def',
    llsStatus: 'registered',
    useCase: 'Multilingual, Reasoning',
    description: 'Mistral 7B instruction-tuned model for general purpose tasks',
    framework: 'vLLM',
    version: '0.1',
    provider: 'Mistral AI',
    parameters: '7B',
    license: 'Apache 2.0',
    deploymentDate: '2025-01-12',
    lastUsed: '2025-01-21',
    logo: modelLogos['mistral-7b-instruct'],
    projects: ['Project X'],
    servingRuntime: 'vLLM NVIDIA GPU ServingRuntime for KServe - v0.9.1.0',
    apiType: 'REST',
    status: 'Running',
    statusColor: '#3e8635'
  }
];

type ModelDetailsProps = Record<string, never>;

const ModelDetails: React.FunctionComponent<ModelDetailsProps> = () => {
  const { modelSlug } = useParams<{ modelSlug: string }>();
  const navigate = useNavigate();
  const { flags } = useFeatureFlags();
  const [isTokenModalOpen, setIsTokenModalOpen] = React.useState(false);
  const [selectedToken] = React.useState('');
  const [tokenType] = React.useState('');
  const [copyNotification] = React.useState<string>('');
  const [copiedItems, setCopiedItems] = React.useState<Set<string>>(new Set());
  const [showExternalToken, setShowExternalToken] = React.useState(false);
  const [showApiKeyText, setShowApiKeyText] = React.useState(false);
  const [isAddingToPlayground, setIsAddingToPlayground] = React.useState(false);
  const [addProgress, setAddProgress] = React.useState(0);
  const [currentAddMessage, setCurrentAddMessage] = React.useState('');
  const [modelsWithEndpoints, setModelsWithEndpoints] = React.useState<Set<string>>(new Set());
  const [isCreateEndpointModalOpen, setIsCreateEndpointModalOpen] = React.useState(false);
  const [animationState, setAnimationState] = React.useState({
    breadcrumbs: false,
    header: false,
    playground: false,
    divider: false,
    about: false,
    endpoints: false,
    status: false
  });

  // Find the model by slug
  const model = mockModels.find(m => m.slug === modelSlug);
  const [modelStatus, setModelStatus] = React.useState(model?.llsStatus || 'not-registered');

  useDocumentTitle(model ? `${model.name} - Model Details` : 'Model Details');

  // Animation effect on component mount
  React.useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    timeouts.push(setTimeout(() => setAnimationState(prev => ({ ...prev, breadcrumbs: true })), 100));
    timeouts.push(setTimeout(() => setAnimationState(prev => ({ ...prev, header: true })), 200));
    timeouts.push(setTimeout(() => setAnimationState(prev => ({ ...prev, playground: true })), 400));
    timeouts.push(setTimeout(() => setAnimationState(prev => ({ ...prev, divider: true })), 600));
    timeouts.push(setTimeout(() => setAnimationState(prev => ({ ...prev, about: true })), 800));
    timeouts.push(setTimeout(() => setAnimationState(prev => ({ ...prev, status: true })), 1000));
    timeouts.push(setTimeout(() => setAnimationState(prev => ({ ...prev, endpoints: true })), 1200));

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const getAnimationStyle = (isVisible: boolean) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
  });

  if (!model) {
    return (
      <PageSection>
        <Title headingLevel="h1" size="2xl">Model Not Found</Title>
        <p>The requested model could not be found.</p>
        <Button variant="primary" onClick={() => navigate('/ai-assets/available')}>
          Back to Available AI Assets
        </Button>
      </PageSection>
    );
  }



  const handleCopyWithFeedback = (text: string, itemId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItems(prev => new Set(prev).add(itemId));
    setTimeout(() => {
      setCopiedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 2000);
  };

  const generateNewApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'sk-';
    for (let i = 0; i < 48; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleRegenerateOrGenerate = () => {
    if (showExternalToken) {
      // Regenerate - create new token and update the model data
      const newToken = generateNewApiKey();
      if (model) {
        model.externalToken = newToken;
      }
    } else {
      // Generate - show the existing token
      setShowExternalToken(true);
    }
  };

  const handlePlayground = () => {
    if (modelStatus === 'not-registered') {
      // Start the add to playground process
      setIsAddingToPlayground(true);
      setAddProgress(0);
      setCurrentAddMessage('Initializing model...');
      
      // Simulate progress steps
      const steps = [
        { progress: 20, message: 'Preparing model configuration...' },
        { progress: 40, message: 'Setting up playground environment...' },
        { progress: 60, message: 'Registering model endpoints...' },
        { progress: 80, message: 'Validating model access...' },
        { progress: 100, message: 'Model added successfully!' }
      ];
      
      let currentStep = 0;
      const progressInterval = setInterval(() => {
        if (currentStep < steps.length) {
          setAddProgress(steps[currentStep].progress);
          setCurrentAddMessage(steps[currentStep].message);
          currentStep++;
        } else {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsAddingToPlayground(false);
            // Update model status to registered
            model.llsStatus = 'registered';
            setModelStatus('registered');
            // Don't navigate automatically - wait for user to click "Try in Playground"
          }, 1000);
        }
      }, 800);
    } else {
      // Model is already registered, go directly to playground
      navigate('/gen-ai-studio/ai-playground', { 
        state: { 
          preselectedModel: model.name,
          modelEndpoint: model.internalEndpoint,
          modelToken: model.internalToken
        }
      });
    }
  };

  const handleCreateEndpoint = () => {
    setIsCreateEndpointModalOpen(true);
  };

  const handleConfirmCreateEndpoint = () => {
    setIsCreateEndpointModalOpen(false);
    setModelsWithEndpoints(prev => new Set(prev).add(model.id));
    // Update the model status to registered when external endpoint is created
    if (model.name === 'granite-7b-code') {
      model.llsStatus = 'registered';
      setModelStatus('registered');
    }
  };

  const handleCancelCreateEndpoint = () => {
    setIsCreateEndpointModalOpen(false);
  };

  const renderStatusBadge = (status: 'registered' | 'not-registered') => {
    if (status === 'registered') {
      return (
        <Label color="green" icon={<CheckCircleIcon />}>
          Available
        </Label>
      );
    }
    return (
      <Label color="orange" icon={<ExclamationTriangleIcon />}>
        Not available
      </Label>
    );
  };

  return (
    <>
      <PageSection>
        {/* Header with breadcrumbs */}
        <div style={{ marginBottom: '1rem', ...getAnimationStyle(animationState.breadcrumbs) }}>
          <Breadcrumb>
            <BreadcrumbItem to="/ai-assets/available">Available AI Assets</BreadcrumbItem>
            <BreadcrumbItem isActive>{model.name}</BreadcrumbItem>
          </Breadcrumb>
        </div>

        {/* Main content */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '1.5rem' }}>
            {/* Model header */}
            <div style={{ marginBottom: '1.5rem', ...getAnimationStyle(animationState.header) }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img 
                        src={genericModelIcon}
                        alt={`${model.name} logo`}
                        style={{ 
                          width: '48px', 
                          height: '48px', 
                          borderRadius: '8px'
                        }}
                      />
                      <Title headingLevel="h1" size="2xl" style={{ margin: 0, lineHeight: 1.2 }}>
                        {model.name}
                      </Title>
                    </div>
                    <p style={{ color: '#6A6E73', fontSize: '0.875rem', margin: 0, lineHeight: 1.4 }}>
                      {model.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginBottom: '1rem', ...getAnimationStyle(animationState.playground) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handlePlayground}
                  icon={modelStatus === 'registered' ? <PlayIcon /> : <PlusCircleIcon />}
                >
                  {modelStatus === 'registered' ? 'Try in Playground' : 'Add to Playground'}
                </Button>
              </div>
            </div>

            <Divider style={{ margin: '1rem 0', background: 'linear-gradient(to right, transparent, #d1d5db, transparent)', ...getAnimationStyle(animationState.divider) }} />

            {/* Content - Single Column Layout */}
            <div>
              {/* About section */}
              <div style={{ marginBottom: '2rem', ...getAnimationStyle(animationState.about) }}>
                <Title headingLevel="h2" size="xl" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <InfoCircleIcon />
                  About
                </Title>
                <Card>
                  <CardBody>
                    <Grid hasGutter>
                      <GridItem span={6}>
                        <div style={{ marginBottom: '1rem' }}>
                          <strong>Provider:</strong> {model.provider}
                        </div>
                      </GridItem>
                      <GridItem span={6}>
                        <div style={{ marginBottom: '1rem' }}>
                          <strong>Parameters:</strong> {model.parameters}
                        </div>
                      </GridItem>
                      <GridItem span={6}>
                        <div style={{ marginBottom: '1rem' }}>
                          <strong>Framework:</strong> {model.framework}
                        </div>
                      </GridItem>
                      <GridItem span={6}>
                        <div style={{ marginBottom: '1rem' }}>
                          <strong>Version:</strong> {model.version}
                        </div>
                      </GridItem>
                      <GridItem span={6}>
                        <div style={{ marginBottom: '1rem' }}>
                          <strong>License:</strong> {model.license}
                        </div>
                      </GridItem>
                      <GridItem span={6}>
                        <div style={{ marginBottom: '1rem' }}>
                          <strong>Deployed:</strong> {model.deploymentDate}
                        </div>
                      </GridItem>
                      <GridItem span={6}>
                        <div style={{ marginBottom: '1rem' }}>
                          <strong>API Type:</strong> {model.apiType}
                        </div>
                      </GridItem>
                      <GridItem span={12}>
                        <div style={{ marginBottom: '1rem' }}>
                          <strong>Serving Runtime:</strong> {model.servingRuntime}
                        </div>
                      </GridItem>
                      <GridItem span={12}>
                        <div style={{ marginBottom: '1rem' }}>
                          <strong>Use Case:</strong> {model.useCase}
                        </div>
                      </GridItem>
                    </Grid>
                  </CardBody>
                </Card>
              </div>

              {/* Status section */}
              <div style={{ marginBottom: '2rem', ...getAnimationStyle(animationState.status) }}>
                <Title headingLevel="h2" size="xl" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <CheckCircleIcon />
                  Playground Status
                </Title>
                <Card>
                  <CardBody>
                    <div style={{ marginBottom: '1rem' }}>
                      {renderStatusBadge(modelStatus as 'registered' | 'not-registered')}
                    </div>
                    
                    {modelStatus === 'not-registered' ? (
                      <div>
                        <p style={{ marginBottom: '1rem' }}>
                          This model needs to be added to the playground before it can be used.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button 
                            variant="primary" 
                            icon={<PlusCircleIcon />}
                            onClick={handlePlayground}
                          >
                            Add to Playground
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p style={{ marginBottom: '1rem' }}>
                          This model is available in the playground and ready to use.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button 
                            variant="primary" 
                            icon={<PlayIcon />}
                            onClick={handlePlayground}
                          >
                            Try in Playground
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>

              {/* Endpoints section */}
              <div style={{ marginBottom: '2rem', ...getAnimationStyle(animationState.endpoints) }}>
                <Title headingLevel="h2" size="xl" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <LinkIcon />
                  Endpoints & Tokens
                </Title>
                <Card>
                  <CardBody>
                    <div>
                      {/* Only show external endpoint section if it's not the granite model OR if the granite model has an external endpoint created */}
                      {(model.name !== 'granite-7b-code' || modelsWithEndpoints.has(model.id)) && (
                        <>
                          {/* External Endpoint Section */}
                          <div style={{ marginBottom: '2rem' }}>
                            <Title headingLevel="h4" size="md" style={{ marginBottom: '1rem' }}>
                              External
                            </Title>
                            <div style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
                              <CodeBlock>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <CodeBlockCode style={{ flex: 1 }}>{model.externalEndpoint}</CodeBlockCode>
                                  <Tooltip content={copiedItems.has('external-endpoint') ? 'Copied' : 'Copy endpoint'}>
                                    <Button 
                                      variant="plain" 
                                      aria-label="Copy external endpoint"
                                      size="sm"
                                      onClick={() => handleCopyWithFeedback(model.externalEndpoint!, 'external-endpoint')}
                                      style={{ marginLeft: '0.5rem' }}
                                    >
                                      {copiedItems.has('external-endpoint') ? <CheckCircleIcon /> : <CopyIcon />}
                                    </Button>
                                  </Tooltip>
                                </div>
                              </CodeBlock>
                            </div>
                            
                            {/* API Key Field */}
                            <div style={{ marginTop: '1.5rem' }}>
                              <Title headingLevel="h5" size="md" style={{ marginBottom: '0.5rem' }}>
                                API Key
                              </Title>
                              <div style={{ marginTop: '1rem' }}>
                                <CodeBlock>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <CodeBlockCode style={{ flex: 1 }}>
                                      {showApiKeyText 
                                        ? model.externalToken || 'sk-external-token-456'
                                        : '••••••••••••••••••••••••••••••••••••••••••••••••••••'
                                      }
                                    </CodeBlockCode>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      <Tooltip content={showApiKeyText ? 'Hide API key' : 'Show API key'}>
                                        <Button 
                                          variant="plain" 
                                          aria-label={showApiKeyText ? 'Hide API key' : 'Show API key'}
                                          size="sm"
                                          onClick={() => setShowApiKeyText(!showApiKeyText)}
                                        >
                                          {showApiKeyText ? <EyeSlashIcon /> : <EyeIcon />}
                                        </Button>
                                      </Tooltip>
                                      <Tooltip content={copiedItems.has('api-key') ? 'Copied' : 'Copy API key'}>
                                        <Button 
                                          variant="plain" 
                                          aria-label="Copy API key"
                                          size="sm"
                                          onClick={() => handleCopyWithFeedback(model.externalToken || 'sk-external-token-456', 'api-key')}
                                        >
                                          {copiedItems.has('api-key') ? <CheckCircleIcon /> : <CopyIcon />}
                                        </Button>
                                      </Tooltip>
                                    </div>
                                  </div>
                                </CodeBlock>
                              </div>
                            </div>
                            
                            {flags.enableGenerateApiKey && (
                              <div style={{ marginTop: '1rem' }}>
                                <Button 
                                  variant="secondary" 
                                  size="sm"
                                  onClick={handleRegenerateOrGenerate}
                                >
                                  <CopyIcon style={{ marginRight: '0.25rem' }} />
                                  {showExternalToken ? 'Regenerate' : 'Generate API Key'}
                                </Button>
                              </div>
                            )}
                            {showExternalToken && (
                              <div style={{ marginTop: '2rem' }}>
                                <CodeBlock>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <CodeBlockCode style={{ flex: 1 }}>{model.externalToken}</CodeBlockCode>
                                    <Tooltip content={copiedItems.has('external-token') ? 'Copied' : 'Copy token'}>
                                      <Button 
                                        variant="plain" 
                                        aria-label="Copy external token"
                                        size="sm"
                                        onClick={() => handleCopyWithFeedback(model.externalToken!, 'external-token')}
                                        style={{ marginLeft: '0.5rem' }}
                                      >
                                        {copiedItems.has('external-token') ? <CheckCircleIcon /> : <CopyIcon />}
                                      </Button>
                                    </Tooltip>
                                  </div>
                                </CodeBlock>
                              </div>
                            )}
                          </div>
                          
                          {/* Divider */}
                          <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #d2d2d2' }} />
                        </>
                      )}
                      
                      {/* Internal Endpoint Section */}
                      <div style={{ marginBottom: '2rem' }}>
                        <Title headingLevel="h4" size="md" style={{ marginBottom: '1rem' }}>
                          Internal
                        </Title>
                        <div style={{ marginTop: '1rem' }}>
                          <CodeBlock>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <CodeBlockCode style={{ flex: 1 }}>{model.internalEndpoint}</CodeBlockCode>
                              <Tooltip content={copiedItems.has('internal-endpoint') ? 'Copied' : 'Copy endpoint'}>
                                <Button 
                                  variant="plain" 
                                  aria-label="Copy internal endpoint"
                                  size="sm"
                                  onClick={() => handleCopyWithFeedback(model.internalEndpoint, 'internal-endpoint')}
                                  style={{ marginLeft: '0.5rem' }}
                                >
                                  {copiedItems.has('internal-endpoint') ? <CheckCircleIcon /> : <CopyIcon />}
                                </Button>
                              </Tooltip>
                            </div>
                          </CodeBlock>
                        </div>
                        
                        {/* Create External Endpoint Button */}
                        {model.name === 'granite-7b-code' && !modelsWithEndpoints.has(model.id) && (
                          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-start' }}>
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={handleCreateEndpoint}
                            >
                              <PlusCircleIcon style={{ marginRight: '0.25rem' }} />
                              Create external endpoint
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* Token Copy Modal */}
      <Modal
        variant={ModalVariant.small}
        title="Token Copied"
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
      >
        <ModalHeader>
          <Title headingLevel="h2" size="xl">
            <CheckCircleIcon className="pf-v5-u-mr-sm pf-v5-u-success-color-100" />
            {tokenType} Copied
          </Title>
        </ModalHeader>
        <ModalBody>
          {copyNotification && (
            <Alert 
              variant="success" 
              title={copyNotification}
              isInline
              style={{ marginBottom: '1rem' }}
            />
          )}
          <div className="pf-v5-u-mb-md">
            The {tokenType.toLowerCase()} has been copied to your clipboard.
          </div>
          <CodeBlock>
            <CodeBlockCode>{selectedToken}</CodeBlockCode>
          </CodeBlock>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setIsTokenModalOpen(false)}>
                      Close
        </Button>
      </ModalFooter>
    </Modal>

    {/* Add to Playground Progress Modal */}
    <Modal
      variant={ModalVariant.small}
      title="Adding to Playground"
      isOpen={isAddingToPlayground}
      onClose={() => {}} // Prevent closing during addition
    >
      <ModalHeader>
        <Title headingLevel="h2" size="xl">
          Adding to Playground
        </Title>
      </ModalHeader>
      <ModalBody>
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          {currentAddMessage}
        </div>
        <Progress 
          value={addProgress}
          size="lg"
        />
      </ModalBody>
    </Modal>

    {/* Update Model Deployment Modal */}
    <Modal
      variant={ModalVariant.small}
      title="Update model deployment"
      isOpen={isCreateEndpointModalOpen}
      onClose={handleCancelCreateEndpoint}
    >
      <ModalHeader>
        <Title headingLevel="h2" size="xl">
          Update model deployment
        </Title>
      </ModalHeader>
      <ModalBody>
        <div style={{ marginBottom: '1rem' }}>
          Coming soon! This will kick off the flow for updating the Llama Stack configuraion.
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="primary" onClick={handleConfirmCreateEndpoint}>
          Update
        </Button>
        <Button variant="link" onClick={handleCancelCreateEndpoint}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  </>
);
};

export default ModelDetails;
