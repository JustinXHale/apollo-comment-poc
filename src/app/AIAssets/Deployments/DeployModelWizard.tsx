import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Label,
  MenuToggle,
  NumberInput,
  PageSection,
  PageSectionTypes,
  Radio,
  Select,
  SelectList,
  SelectOption,
  TextArea,
  TextInput,
  Title,
  Wizard,
  WizardStep,
} from '@patternfly/react-core';
import { useDocumentTitle } from '../../utils/useDocumentTitle';

interface WizardData {
  // Step 1: Source model
  modelLocation: string;
  connectionName: string;
  modelUri: string;
  createConnection: boolean;
  connectionNameNew: string;
  connectionDescription: string;
  accessType: string;
  secretDetails: string;
  registryUri: string;
  accessKey: string;
  secretKey: string;
  endpoint: string;
  region: string;
  bucket: string;
  clusterStorageName: string;
  modelPath: string;
  modelType: string;

  // Step 2: Model deployment
  project: string;
  modelDeploymentName: string;
  description: string;
  hardwareProfile: string;
  modelFormat: string;
  servingRuntimeOption: string;
  servingRuntime: string;
  numberOfReplicas: number;

  // Step 3: Advanced settings
  makeAvailableExternal: boolean;
  requireTokenAuth: boolean;
  includeRuntimeArgs: boolean;
  applyEnvVars: boolean;
  makeAvailableAsAIAsset: boolean;
  makeAvailableGlobally: boolean;
}

const DeployModelWizard: React.FunctionComponent = () => {
  useDocumentTitle('Deploy model');
  const navigate = useNavigate();
  const [wizardData, setWizardData] = React.useState<WizardData>({
    modelLocation: '',
    connectionName: '',
    modelUri: '',
    createConnection: false,
    connectionNameNew: '',
    connectionDescription: '',
    accessType: '',
    secretDetails: '',
    registryUri: '',
    accessKey: '',
    secretKey: '',
    endpoint: '',
    region: '',
    bucket: '',
    clusterStorageName: '',
    modelPath: '',
    modelType: '',
    project: 'my_project_xyz',
    modelDeploymentName: '',
    description: '',
    hardwareProfile: '',
    modelFormat: '',
    servingRuntimeOption: 'auto',
    servingRuntime: '',
    numberOfReplicas: 1,
    makeAvailableExternal: false,
    requireTokenAuth: false,
    includeRuntimeArgs: false,
    applyEnvVars: false,
    makeAvailableAsAIAsset: false,
    makeAvailableGlobally: false,
  });

  // State for dropdowns
  const [isModelLocationOpen, setIsModelLocationOpen] = React.useState(false);
  const [isConnectionNameOpen, setIsConnectionNameOpen] = React.useState(false);
  const [isModelTypeOpen, setIsModelTypeOpen] = React.useState(false);
  const [isHardwareProfileOpen, setIsHardwareProfileOpen] = React.useState(false);
  const [isModelFormatOpen, setIsModelFormatOpen] = React.useState(false);
  const [isServingRuntimeOpen, setIsServingRuntimeOpen] = React.useState(false);

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData((prev) => ({ ...prev, ...updates }));
  };

  const handleClose = () => {
    // Navigate back to deployments list
    navigate('/ai-hub/deployments');
  };

  const handleDeploy = () => {
    // Add deployment logic here
    console.log('Model deployed successfully');
    // Navigate back to deployments list
    navigate('/ai-hub/deployments');
  };

  // Step 1: Source model
  const sourceModelStep = (
    <Form>
      <FormGroup label="Model location" isRequired>
        <FormHelperText>
          <HelperText>
            <HelperTextItem>Where is the model you want to deploy located?</HelperTextItem>
          </HelperText>
        </FormHelperText>
        <Select
          isOpen={isModelLocationOpen}
          selected={wizardData.modelLocation}
          onSelect={(_event, value) => {
            updateWizardData({ modelLocation: value as string });
            setIsModelLocationOpen(false);
          }}
          onOpenChange={(isOpen) => setIsModelLocationOpen(isOpen)}
          toggle={(toggleRef) => (
            <MenuToggle
              ref={toggleRef}
              onClick={() => setIsModelLocationOpen(!isModelLocationOpen)}
              isExpanded={isModelLocationOpen}
              style={{ width: '100%' }}
            >
              {wizardData.modelLocation || 'Select an option'}
            </MenuToggle>
          )}
        >
          <SelectList>
            <SelectOption value="Existing connection">Existing connection</SelectOption>
            <SelectOption value="URI">URI</SelectOption>
            <SelectOption value="OCI compliant registry">OCI compliant registry</SelectOption>
            <SelectOption value="Cluster storage">Cluster storage</SelectOption>
            <SelectOption value="S3 object storage">S3 object storage</SelectOption>
          </SelectList>
        </Select>
      </FormGroup>

      {/* Conditional fields based on model location */}
      {wizardData.modelLocation === 'Existing connection' && (
        <FormGroup label="Connection name" isRequired>
          <Select
            isOpen={isConnectionNameOpen}
            selected={wizardData.connectionName}
            onSelect={(_event, value) => {
              updateWizardData({ connectionName: value as string });
              setIsConnectionNameOpen(false);
            }}
            onOpenChange={(isOpen) => setIsConnectionNameOpen(isOpen)}
            toggle={(toggleRef) => (
              <MenuToggle
                ref={toggleRef}
                onClick={() => setIsConnectionNameOpen(!isConnectionNameOpen)}
                isExpanded={isConnectionNameOpen}
                style={{ width: '100%' }}
              >
                {wizardData.connectionName || 'Select an option'}
              </MenuToggle>
            )}
          >
            <SelectList>
              <SelectOption value="aws-connection-1">aws-connection-1</SelectOption>
              <SelectOption value="s3-bucket-models">s3-bucket-models</SelectOption>
              <SelectOption value="azure-storage-prod">azure-storage-prod</SelectOption>
            </SelectList>
          </Select>
        </FormGroup>
      )}

      {wizardData.modelLocation === 'URI' && (
        <>
          <FormGroup label="Model location URI" isRequired>
            <TextInput
              value={wizardData.modelUri}
              onChange={(_event, value) => updateWizardData({ modelUri: value })}
              placeholder="Enter the model location URI"
            />
          </FormGroup>
          <FormGroup>
            <Checkbox
              id="create-connection-uri"
              label="Create a connection to this location"
              isChecked={wizardData.createConnection}
              onChange={(_event, checked) => updateWizardData({ createConnection: checked })}
            />
          </FormGroup>
          {wizardData.createConnection && (
            <>
              <FormGroup label="Connection name">
                <TextInput
                  value={wizardData.connectionNameNew}
                  onChange={(_event, value) => updateWizardData({ connectionNameNew: value })}
                />
              </FormGroup>
              <FormGroup label="Connection description">
                <TextInput
                  value={wizardData.connectionDescription}
                  onChange={(_event, value) => updateWizardData({ connectionDescription: value })}
                />
              </FormGroup>
            </>
          )}
        </>
      )}

      {wizardData.modelLocation === 'OCI compliant registry' && (
        <>
          <FormGroup label="Secret details">
            <TextInput
              value={wizardData.secretDetails}
              onChange={(_event, value) => updateWizardData({ secretDetails: value })}
            />
          </FormGroup>
          <FormGroup label="Full URL / Registry URI">
            <TextInput
              value={wizardData.registryUri}
              onChange={(_event, value) => updateWizardData({ registryUri: value })}
            />
          </FormGroup>
          <FormGroup>
            <Checkbox
              id="create-connection-oci"
              label="Create a connection to this location"
              isChecked={wizardData.createConnection}
              onChange={(_event, checked) => updateWizardData({ createConnection: checked })}
            />
          </FormGroup>
          {wizardData.createConnection && (
            <>
              <FormGroup label="Connection name">
                <TextInput
                  value={wizardData.connectionNameNew}
                  onChange={(_event, value) => updateWizardData({ connectionNameNew: value })}
                />
              </FormGroup>
              <FormGroup label="Connection description">
                <TextInput
                  value={wizardData.connectionDescription}
                  onChange={(_event, value) => updateWizardData({ connectionDescription: value })}
                />
              </FormGroup>
              <FormGroup label="Access type">
                <TextInput
                  value={wizardData.accessType}
                  onChange={(_event, value) => updateWizardData({ accessType: value })}
                />
              </FormGroup>
            </>
          )}
        </>
      )}

      {wizardData.modelLocation === 'S3 object storage' && (
        <>
          <FormGroup label="Access key">
            <TextInput
              value={wizardData.accessKey}
              onChange={(_event, value) => updateWizardData({ accessKey: value })}
            />
          </FormGroup>
          <FormGroup label="Secret key">
            <TextInput
              type="password"
              value={wizardData.secretKey}
              onChange={(_event, value) => updateWizardData({ secretKey: value })}
            />
          </FormGroup>
          <FormGroup label="Endpoint">
            <TextInput
              value={wizardData.endpoint}
              onChange={(_event, value) => updateWizardData({ endpoint: value })}
            />
          </FormGroup>
          <FormGroup label="Region">
            <TextInput
              value={wizardData.region}
              onChange={(_event, value) => updateWizardData({ region: value })}
            />
          </FormGroup>
          <FormGroup label="Bucket">
            <TextInput
              value={wizardData.bucket}
              onChange={(_event, value) => updateWizardData({ bucket: value })}
            />
          </FormGroup>
          <FormGroup>
            <Checkbox
              id="create-connection-s3"
              label="Create a connection to this location"
              isChecked={wizardData.createConnection}
              onChange={(_event, checked) => updateWizardData({ createConnection: checked })}
            />
          </FormGroup>
          {wizardData.createConnection && (
            <>
              <FormGroup label="Connection name">
                <TextInput
                  value={wizardData.connectionNameNew}
                  onChange={(_event, value) => updateWizardData({ connectionNameNew: value })}
                />
              </FormGroup>
              <FormGroup label="Connection description">
                <TextInput
                  value={wizardData.connectionDescription}
                  onChange={(_event, value) => updateWizardData({ connectionDescription: value })}
                />
              </FormGroup>
              <FormGroup label="Access type">
                <TextInput
                  value={wizardData.accessType}
                  onChange={(_event, value) => updateWizardData({ accessType: value })}
                />
              </FormGroup>
            </>
          )}
        </>
      )}

      {wizardData.modelLocation === 'Cluster storage' && (
        <>
          <FormGroup label="Cluster storage name">
            <TextInput
              value={wizardData.clusterStorageName}
              onChange={(_event, value) => updateWizardData({ clusterStorageName: value })}
            />
          </FormGroup>
          <FormGroup label="Model path">
            <TextInput
              value={wizardData.modelPath}
              onChange={(_event, value) => updateWizardData({ modelPath: value })}
              placeholder="pvc://mystorage/"
            />
          </FormGroup>
        </>
      )}

      <FormGroup label="Model type" isRequired>
        <Select
          isOpen={isModelTypeOpen}
          selected={wizardData.modelType}
          onSelect={(_event, value) => {
            updateWizardData({ modelType: value as string });
            setIsModelTypeOpen(false);
          }}
          onOpenChange={(isOpen) => setIsModelTypeOpen(isOpen)}
          toggle={(toggleRef) => (
            <MenuToggle
              ref={toggleRef}
              onClick={() => setIsModelTypeOpen(!isModelTypeOpen)}
              isExpanded={isModelTypeOpen}
              style={{ width: '100%' }}
            >
              {wizardData.modelType || 'Select'}
            </MenuToggle>
          )}
        >
          <SelectList>
            <SelectOption value="Predictive model">Predictive model</SelectOption>
            <SelectOption value="Generative AI model (including LLMs and multimodal models)">
              Generative AI model (including LLMs and multimodal models)
            </SelectOption>
          </SelectList>
        </Select>
      </FormGroup>
    </Form>
  );

  // Step 2: Model deployment
  const modelDeploymentStep = (
    <Form>
      <FormGroup label="Project">
        <TextInput value={wizardData.project} isDisabled />
      </FormGroup>

      <FormGroup label="Model deployment name" isRequired>
        <TextInput
          value={wizardData.modelDeploymentName}
          onChange={(_event, value) => updateWizardData({ modelDeploymentName: value })}
          placeholder="loan-default-predictor-278482"
        />
        <FormHelperText>
          <HelperText>
            <HelperTextItem>
              This is the name of the inference service created when the model is deployed.
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>

      <FormGroup label="Description">
        <TextArea
          value={wizardData.description}
          onChange={(_event, value) => updateWizardData({ description: value })}
          resizeOrientation="vertical"
        />
      </FormGroup>

      <FormGroup label="Hardware profile" isRequired>
        <Select
          isOpen={isHardwareProfileOpen}
          selected={wizardData.hardwareProfile}
          onSelect={(_event, value) => {
            updateWizardData({ hardwareProfile: value as string });
            setIsHardwareProfileOpen(false);
          }}
          onOpenChange={(isOpen) => setIsHardwareProfileOpen(isOpen)}
          toggle={(toggleRef) => (
            <MenuToggle
              ref={toggleRef}
              onClick={() => setIsHardwareProfileOpen(!isHardwareProfileOpen)}
              isExpanded={isHardwareProfileOpen}
              style={{ width: '100%' }}
            >
              {wizardData.hardwareProfile || 'Select'}
            </MenuToggle>
          )}
        >
          <SelectList>
            <SelectOption value="default">default</SelectOption>
            <SelectOption value="Small">Small</SelectOption>
            <SelectOption value="Medium">Medium</SelectOption>
            <SelectOption value="Large">Large</SelectOption>
          </SelectList>
        </Select>
        <Button variant="link" isInline style={{ paddingLeft: 0, marginTop: '0.5rem' }}>
          View profile details
        </Button>
      </FormGroup>

      <FormGroup label="Model format">
        <Select
          isOpen={isModelFormatOpen}
          selected={wizardData.modelFormat}
          onSelect={(_event, value) => {
            updateWizardData({ modelFormat: value as string });
            setIsModelFormatOpen(false);
          }}
          onOpenChange={(isOpen) => setIsModelFormatOpen(isOpen)}
          toggle={(toggleRef) => (
            <MenuToggle
              ref={toggleRef}
              onClick={() => setIsModelFormatOpen(!isModelFormatOpen)}
              isExpanded={isModelFormatOpen}
              style={{ width: '100%' }}
            >
              {wizardData.modelFormat || 'Select'}
            </MenuToggle>
          )}
        >
          <SelectList>
            <SelectOption value="onnx - 1">onnx - 1</SelectOption>
            <SelectOption value="pytorch">pytorch</SelectOption>
            <SelectOption value="tensorflow">tensorflow</SelectOption>
            <SelectOption value="sklearn">sklearn</SelectOption>
          </SelectList>
        </Select>
      </FormGroup>

      <FormGroup label="Serving runtime" isRequired>
        <Radio
          id="auto-select-runtime"
          name="serving-runtime-option"
          label="Auto-select the best runtime for my model based on model type, model format and hardware profile"
          isChecked={wizardData.servingRuntimeOption === 'auto'}
          onChange={() => updateWizardData({ servingRuntimeOption: 'auto' })}
        />
        {wizardData.servingRuntimeOption === 'auto' && (
          <div style={{ marginLeft: '1.75rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
            <TextInput value="OpenVINO Model Server" isDisabled />
          </div>
        )}

        <Radio
          id="manual-select-runtime"
          name="serving-runtime-option"
          label="Select from a list of serving runtimes, including custom ones"
          isChecked={wizardData.servingRuntimeOption === 'manual'}
          onChange={() => updateWizardData({ servingRuntimeOption: 'manual' })}
        />
        {wizardData.servingRuntimeOption === 'manual' && (
          <div style={{ marginLeft: '1.75rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
            <Select
              isOpen={isServingRuntimeOpen}
              selected={wizardData.servingRuntime}
              onSelect={(_event, value) => {
                updateWizardData({ servingRuntime: value as string });
                setIsServingRuntimeOpen(false);
              }}
              onOpenChange={(isOpen) => setIsServingRuntimeOpen(isOpen)}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsServingRuntimeOpen(!isServingRuntimeOpen)}
                  isExpanded={isServingRuntimeOpen}
                  style={{ width: '100%' }}
                >
                  {wizardData.servingRuntime || 'Select a serving runtime'}
                </MenuToggle>
              )}
            >
              <SelectList>
                <SelectOption value="OpenVINO Model Server">OpenVINO Model Server</SelectOption>
                <SelectOption value="Caikit Standalone ServingRuntime">
                  Caikit Standalone ServingRuntime
                </SelectOption>
                <SelectOption value="TGIS Standalone ServingRuntime">
                  TGIS Standalone ServingRuntime
                </SelectOption>
              </SelectList>
            </Select>
          </div>
        )}
      </FormGroup>

      <FormGroup label="Number of replicas to deploy">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Button
            variant="plain"
            onClick={() =>
              updateWizardData({ numberOfReplicas: Math.max(1, wizardData.numberOfReplicas - 1) })
            }
          >
            -
          </Button>
          <NumberInput
            value={wizardData.numberOfReplicas}
            min={1}
            onMinus={() =>
              updateWizardData({ numberOfReplicas: Math.max(1, wizardData.numberOfReplicas - 1) })
            }
            onChange={(event) => {
              const value = Number((event.target as HTMLInputElement).value);
              if (!isNaN(value) && value >= 1) {
                updateWizardData({ numberOfReplicas: value });
              }
            }}
            onPlus={() => updateWizardData({ numberOfReplicas: wizardData.numberOfReplicas + 1 })}
            inputName="replicas"
            inputAriaLabel="Number of replicas"
            minusBtnAriaLabel="Minus"
            plusBtnAriaLabel="Plus"
            widthChars={4}
          />
          <Button
            variant="plain"
            onClick={() => updateWizardData({ numberOfReplicas: wizardData.numberOfReplicas + 1 })}
          >
            +
          </Button>
        </div>
        <FormHelperText>
          <HelperText>
            <HelperTextItem>Non-production models typically require only one replica.</HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>
    </Form>
  );

  // Step 3: Advanced settings
  const advancedSettingsStep = (
    <Form>
      <FormGroup label="Model access">
        <Checkbox
          id="make-available-external"
          label="Make model deployment available through an external route"
          isChecked={wizardData.makeAvailableExternal}
          onChange={(_event, checked) => updateWizardData({ makeAvailableExternal: checked })}
        />
      </FormGroup>

      <FormGroup label="Token authentication">
        <Checkbox
          id="require-token-auth"
          label="Require token authentication"
          isChecked={wizardData.requireTokenAuth}
          onChange={(_event, checked) => updateWizardData({ requireTokenAuth: checked })}
        />
      </FormGroup>

      <FormGroup label="Configuration parameters">
        <Checkbox
          id="include-runtime-args"
          label="Include additional runtime arguments"
          isChecked={wizardData.includeRuntimeArgs}
          onChange={(_event, checked) => updateWizardData({ includeRuntimeArgs: checked })}
        />
        <Checkbox
          id="apply-env-vars"
          label="Apply additional serving runtime environment variables"
          isChecked={wizardData.applyEnvVars}
          onChange={(_event, checked) => updateWizardData({ applyEnvVars: checked })}
        />
      </FormGroup>

      <FormGroup label="Model availability">
        <Checkbox
          id="make-available-ai-asset"
          label={
            <span>
              Make this deployment available as an AI asset{' '}
              <Label variant="outline" color="orange" style={{ fontSize: '10px' }}>Tech Preview</Label>
            </span>
          }
          isChecked={wizardData.makeAvailableAsAIAsset}
          onChange={(_event, checked) => updateWizardData({ makeAvailableAsAIAsset: checked })}
        />
        <Checkbox
          id="make-available-globally"
          label={
            <span>
              Make this deployment available globally for models as a service{' '}
              <Label variant="outline" color="orange" style={{ fontSize: '10px' }}>Developer Preview</Label>
            </span>
          }
          isChecked={wizardData.makeAvailableGlobally}
          onChange={(_event, checked) => updateWizardData({ makeAvailableGlobally: checked })}
        />
      </FormGroup>
    </Form>
  );

  // Step 4: Summary
  const summaryStep = (
    <>
      <DescriptionList isHorizontal>
        {/* Source model details */}
        <DescriptionListGroup>
          <DescriptionListTerm>Model location</DescriptionListTerm>
          <DescriptionListDescription>
            {wizardData.modelLocation || 'Not specified'}
          </DescriptionListDescription>
        </DescriptionListGroup>

        {wizardData.modelLocation === 'Existing connection' && (
          <DescriptionListGroup>
            <DescriptionListTerm>Connection name</DescriptionListTerm>
            <DescriptionListDescription>
              {wizardData.connectionName || 'Not specified'}
            </DescriptionListDescription>
          </DescriptionListGroup>
        )}

        {wizardData.modelLocation === 'URI' && (
          <DescriptionListGroup>
            <DescriptionListTerm>Model URI</DescriptionListTerm>
            <DescriptionListDescription>
              {wizardData.modelUri || 'Not specified'}
            </DescriptionListDescription>
          </DescriptionListGroup>
        )}

        {wizardData.modelLocation === 'Cluster storage' && (
          <>
            <DescriptionListGroup>
              <DescriptionListTerm>Cluster storage name</DescriptionListTerm>
              <DescriptionListDescription>
                {wizardData.clusterStorageName || 'Not specified'}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Model path</DescriptionListTerm>
              <DescriptionListDescription>
                {wizardData.modelPath || 'Not specified'}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </>
        )}

        <DescriptionListGroup>
          <DescriptionListTerm>Model type</DescriptionListTerm>
          <DescriptionListDescription>
            {wizardData.modelType || 'Not specified'}
          </DescriptionListDescription>
        </DescriptionListGroup>

        {/* Model deployment details */}
        <DescriptionListGroup>
          <DescriptionListTerm>Project</DescriptionListTerm>
          <DescriptionListDescription>{wizardData.project}</DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>Model deployment name</DescriptionListTerm>
          <DescriptionListDescription>
            {wizardData.modelDeploymentName || 'Not specified'}
          </DescriptionListDescription>
        </DescriptionListGroup>

        {wizardData.description && (
          <DescriptionListGroup>
            <DescriptionListTerm>Description</DescriptionListTerm>
            <DescriptionListDescription>{wizardData.description}</DescriptionListDescription>
          </DescriptionListGroup>
        )}

        <DescriptionListGroup>
          <DescriptionListTerm>Hardware profile</DescriptionListTerm>
          <DescriptionListDescription>
            {wizardData.hardwareProfile || 'Not specified'}
          </DescriptionListDescription>
        </DescriptionListGroup>

        {wizardData.modelFormat && (
          <DescriptionListGroup>
            <DescriptionListTerm>Model format</DescriptionListTerm>
            <DescriptionListDescription>{wizardData.modelFormat}</DescriptionListDescription>
          </DescriptionListGroup>
        )}

        <DescriptionListGroup>
          <DescriptionListTerm>Serving runtime</DescriptionListTerm>
          <DescriptionListDescription>
            {wizardData.servingRuntimeOption === 'auto'
              ? 'Auto-selected: OpenVINO Model Server'
              : wizardData.servingRuntime || 'Not specified'}
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>Number of replicas</DescriptionListTerm>
          <DescriptionListDescription>{wizardData.numberOfReplicas}</DescriptionListDescription>
        </DescriptionListGroup>

        {/* Advanced settings */}
        <DescriptionListGroup>
          <DescriptionListTerm>External route</DescriptionListTerm>
          <DescriptionListDescription>
            {wizardData.makeAvailableExternal ? 'Yes' : 'No'}
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>Token authentication</DescriptionListTerm>
          <DescriptionListDescription>
            {wizardData.requireTokenAuth ? 'Required' : 'Not required'}
          </DescriptionListDescription>
        </DescriptionListGroup>

        {wizardData.makeAvailableAsAIAsset && (
          <DescriptionListGroup>
            <DescriptionListTerm>Available as AI asset</DescriptionListTerm>
            <DescriptionListDescription>
              Yes <Label variant="outline" color="blue" style={{ fontSize: '10px' }}>Tech Preview</Label>
            </DescriptionListDescription>
          </DescriptionListGroup>
        )}

        {wizardData.makeAvailableGlobally && (
          <DescriptionListGroup>
            <DescriptionListTerm>Available globally</DescriptionListTerm>
            <DescriptionListDescription>Yes (Developer Preview)</DescriptionListDescription>
          </DescriptionListGroup>
        )}
      </DescriptionList>
    </>
  );

  return (
    <>
      <PageSection>
        <Title headingLevel="h1" size="2xl">
          Deploy model
        </Title>
      </PageSection>
      <PageSection hasBodyWrapper={false} type={PageSectionTypes.wizard} aria-label="Deploy model wizard">
        <Wizard onClose={handleClose}>
          <WizardStep
        name="Source model"
        id="source-model-step"
        body={{ hasNoPadding: false }}
      >
        <div style={{ padding: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Source model</h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--pf-v5-global--Color--200)' }}>
            Tell us about the model you want to deploy
          </p>
          {sourceModelStep}
        </div>
      </WizardStep>

      <WizardStep
        name="Model deployment"
        id="model-deployment-step"
        body={{ hasNoPadding: false }}
      >
        <div style={{ padding: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Model deployment</h2>
          {modelDeploymentStep}
        </div>
      </WizardStep>

      <WizardStep
        name="Advanced options"
        id="advanced-options-step"
        body={{ hasNoPadding: false }}
      >
        <div style={{ padding: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Advanced settings (optional)
          </h2>
          {advancedSettingsStep}
        </div>
      </WizardStep>

      <WizardStep
        name="Summary"
        id="summary-step"
        footer={{ nextButtonText: 'Deploy', onNext: handleDeploy }}
        body={{ hasNoPadding: false }}
      >
        <div style={{ padding: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Summary</h2>
          {summaryStep}
        </div>
      </WizardStep>
        </Wizard>
      </PageSection>
    </>
  );
};

export { DeployModelWizard };

