import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
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
  MenuToggleElement,
  Modal,
  ModalVariant,
  PageSection,
  PageSectionTypes,
  Select,
  SelectList,
  SelectOption,
  TextArea,
  TextInput,
  Title,
  Wizard,
  WizardStep,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';

interface WorkspaceKindTemplate {
  id: string;
  name: string;
  description: string;
  fixedImage?: string;
  fixedMountPath: string;
  availableImages: string[];
}

interface WorkbenchImage {
  id: string;
  name: string;
  displayName: string;
  isDeprecated: boolean;
  version: string;
}

interface ClusterStorage {
  id: string;
  name: string;
  accessMode: string;
  size: string;
  mountPath: string;
}

interface Connection {
  id: string;
  name: string;
  type: string;
  [key: string]: any;
}

// Mock data - replace with actual API calls
const mockTemplates: WorkspaceKindTemplate[] = [
  {
    id: 'standard-cpu',
    name: 'Standard CPU Profile',
    description: 'Standard profile for CPU-based workloads with pre-configured resource limits',
    fixedMountPath: '/opt/app-root/src',
    availableImages: ['jupyter-datascience', 'jupyter-minimal', 'codeserver-datascience']
  },
  {
    id: 'gpu-restricted',
    name: 'GPU Restricted Template',
    description: 'Restricted GPU profile with enhanced security controls',
    fixedMountPath: '/opt/app-root/src',
    availableImages: ['jupyter-pytorch', 'jupyter-tensorflow']
  },
  {
    id: 'development',
    name: 'Development Template',
    description: 'Flexible template for development and testing',
    fixedMountPath: '/workspace',
    availableImages: ['jupyter-datascience', 'jupyter-minimal', 'codeserver-datascience', 'jupyter-trustyai']
  }
];

const mockImages: WorkbenchImage[] = [
  {
    id: 'jupyter-datascience',
    name: 'jupyter-datascience',
    displayName: 'Jupyter | Data Science | CPU | Python 3.11',
    isDeprecated: true,
    version: '2024.2 (be38cca)'
  },
  {
    id: 'jupyter-minimal',
    name: 'jupyter-minimal',
    displayName: 'Jupyter | Minimal | CPU | Python 3.11',
    isDeprecated: true,
    version: '2024.2 (be38cca)'
  },
  {
    id: 'codeserver-datascience',
    name: 'codeserver-datascience',
    displayName: 'Code Server | Data Science | CPU | Python 3.11',
    isDeprecated: true,
    version: '2025.1 (e332806)'
  },
  {
    id: 'jupyter-pytorch',
    name: 'jupyter-pytorch',
    displayName: 'Jupyter | PyTorch | CUDA | Python 3.11',
    isDeprecated: true,
    version: '2024.2 (be38cca)'
  },
  {
    id: 'jupyter-tensorflow',
    name: 'jupyter-tensorflow',
    displayName: 'Jupyter | TensorFlow | CUDA | Python 3.11',
    isDeprecated: true,
    version: '2024.2 (be38cca)'
  },
  {
    id: 'jupyter-trustyai',
    name: 'jupyter-trustyai',
    displayName: 'Jupyter | TrustyAI | CPU | Python 3.11',
    isDeprecated: false,
    version: '2024.2 (be38cca)'
  }
];

interface CreateWorkbenchWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateWorkbenchWizard: React.FunctionComponent<CreateWorkbenchWizardProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { projectName } = useParams<{ projectName: string }>();
  
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);

  // Step 1 state
  const [isTemplateSelectOpen, setIsTemplateSelectOpen] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>('');

  // Step 2 state
  const initialWorkbenchName = React.useRef(`workbench-${Date.now()}`);
  const [workbenchName, setWorkbenchName] = React.useState(initialWorkbenchName.current);
  const [workbenchDescription, setWorkbenchDescription] = React.useState('');
  const [isImageSelectOpen, setIsImageSelectOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string>('');
  const [nameError, setNameError] = React.useState<string>('');

  // Step 3 state
  const [clusterStorages, setClusterStorages] = React.useState<ClusterStorage[]>([]);
  const [connections, setConnections] = React.useState<Connection[]>([]);

  // Reset wizard state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      // Reset all state when wizard closes
      setSelectedTemplate('');
      const newInitialName = `workbench-${Date.now()}`;
      initialWorkbenchName.current = newInitialName;
      setWorkbenchName(newInitialName);
      setWorkbenchDescription('');
      setSelectedImage('');
      setClusterStorages([]);
      setConnections([]);
      setNameError('');
      setShowCancelModal(false);
    }
  }, [isOpen]);

  // Validation
  const validateName = (name: string): boolean => {
    const regex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
    if (!name) {
      setNameError('Name is required');
      return false;
    }
    if (!regex.test(name)) {
      setNameError('Name must be lowercase alphanumeric with dashes only');
      return false;
    }
    setNameError('');
    return true;
  };

  const getSelectedTemplateData = (): WorkspaceKindTemplate | undefined => {
    return mockTemplates.find(t => t.id === selectedTemplate);
  };

  const getAvailableImages = (): WorkbenchImage[] => {
    const template = getSelectedTemplateData();
    if (!template) return [];
    return mockImages.filter(img => template.availableImages.includes(img.id));
  };

  const handleClose = () => {
    // Only show confirmation if they've selected a template (meaningful progress)
    if (selectedTemplate) {
      setShowCancelModal(true);
    } else {
      // No meaningful changes, close immediately
      onClose();
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    setTimeout(() => {
      onClose();
    }, 0);
  };

  const handleCreate = async () => {
    setIsCreating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsCreating(false);
    onClose();
    
    // Show success notification and navigate
    navigate(`/projects/${projectName}`);
    // TODO: Add toast notification for success
  };

  // Step 1: Select Governance Template
  const step1Content = (
    <Form>
      <Card style={{ backgroundColor: '#e6f3ff', border: '1px solid #0066cc', marginBottom: '1rem' }} id="step1-info-card">
        <CardTitle>Define the Core Policy</CardTitle>
        <CardBody>
          Choose a Workspace Kind Template to establish the base governance, resource limits, and fixed configurations for your new workbench.
        </CardBody>
      </Card>
      <FormGroup label="Workspace Kind Template" isRequired fieldId="governance-template">
        <Select
          id="governance-template-select"
          isOpen={isTemplateSelectOpen}
          selected={selectedTemplate}
          onSelect={(_event, value) => {
            setSelectedTemplate(value as string);
            setSelectedImage(''); // Reset image when template changes
            setIsTemplateSelectOpen(false);
          }}
          onOpenChange={(isOpen) => setIsTemplateSelectOpen(isOpen)}
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle ref={toggleRef} onClick={() => setIsTemplateSelectOpen(!isTemplateSelectOpen)} isExpanded={isTemplateSelectOpen} style={{ width: '100%' }} id="template-select-toggle">
              {selectedTemplate ? mockTemplates.find(t => t.id === selectedTemplate)?.name : 'Select a template'}
            </MenuToggle>
          )}
        >
          <SelectList id="template-select-list">
            {mockTemplates.map((template) => (
              <SelectOption key={template.id} value={template.id} id={`template-option-${template.id}`}>
                <div>
                  <strong>{template.name}</strong>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)' }}>
                    {template.description}
                  </div>
                </div>
              </SelectOption>
            ))}
          </SelectList>
        </Select>
        <FormHelperText>
          <HelperText>
            <HelperTextItem>Choose a governance template that defines the constraints for this workbench</HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>
    </Form>
  );

  // Step 2: Details & Image
  const step2Content = (
    <Form>
      <Card style={{ backgroundColor: '#e6f3ff', border: '1px solid #0066cc', marginBottom: '1rem' }} id="step2-info-card">
        <CardTitle>Identify Your Workbench</CardTitle>
        <CardBody>
          Provide a unique name and description, and select a compatible image based on the governance template chosen in Step 1.
        </CardBody>
      </Card>
      <FormGroup label="Name" isRequired fieldId="workbench-name">
        <TextInput
          isRequired
          type="text"
          id="workbench-name-input"
          name="workbench-name"
          value={workbenchName}
          onChange={(_event, value) => {
            setWorkbenchName(value);
            validateName(value);
          }}
          validated={nameError ? 'error' : 'default'}
        />
        <FormHelperText>
          <HelperText>
            <HelperTextItem variant={nameError ? 'error' : 'default'}>
              {nameError || 'Must be lowercase alphanumeric with dashes only'}
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>

      <FormGroup label="Description" fieldId="workbench-description">
        <TextArea
          id="workbench-description-input"
          name="workbench-description"
          value={workbenchDescription}
          onChange={(_event, value) => setWorkbenchDescription(value)}
          rows={3}
        />
        <FormHelperText>
          <HelperText>
            <HelperTextItem>Optional description for this workbench</HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>

      <FormGroup label="Workbench Image" isRequired fieldId="workbench-image">
        <Select
          id="workbench-image-select"
          isOpen={isImageSelectOpen}
          selected={selectedImage}
          onSelect={(_event, value) => {
            setSelectedImage(value as string);
            setIsImageSelectOpen(false);
          }}
          onOpenChange={(isOpen) => setIsImageSelectOpen(isOpen)}
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle 
              ref={toggleRef} 
              onClick={() => setIsImageSelectOpen(!isImageSelectOpen)} 
              isExpanded={isImageSelectOpen} 
              style={{ width: '100%' }}
              id="image-select-toggle"
            >
              {selectedImage ? mockImages.find(img => img.id === selectedImage)?.displayName : 'Select an image'}
            </MenuToggle>
          )}
        >
          <SelectList id="image-select-list">
            {getAvailableImages().map((image) => (
              <SelectOption key={image.id} value={image.id} id={`image-option-${image.id}`}>
                <div>
                  <div>{image.displayName}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{image.version}</span>
                    {image.isDeprecated && (
                      <Label color="orange" isCompact>⚠ Deprecated</Label>
                    )}
                  </div>
                </div>
              </SelectOption>
            ))}
          </SelectList>
        </Select>
        <FormHelperText>
          <HelperText>
            <HelperTextItem>Available images are determined by the selected template</HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>
    </Form>
  );

  // Step 3: Storage & Connections
  const step3Content = (
    <Form>
      <Card style={{ backgroundColor: '#e6f3ff', border: '1px solid #0066cc', marginBottom: '1rem' }} id="step3-info-card">
        <CardTitle>Attach Data Sources (Note Constraints)</CardTitle>
        <CardBody>
          Attach existing cluster storage and external connections. Note that the Mount Path is automatically determined by your selected template and cannot be customized.
        </CardBody>
      </Card>
      <Title headingLevel="h3" size="md" id="cluster-storage-section-title">
        Cluster Storage
      </Title>
      <FormGroup fieldId="cluster-storage">
        <FormHelperText>
          <HelperText>
            <HelperTextItem>
              Attach existing cluster storage volumes to this workbench. The mount path is determined by the template: <strong>{getSelectedTemplateData()?.fixedMountPath}</strong> (read-only)
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
        <Button variant="link" isInline id="add-cluster-storage-button" onClick={() => {
          // TODO: Open modal to select/create cluster storage
          console.log('Add cluster storage');
        }}>
          Add cluster storage
        </Button>
        {clusterStorages.length === 0 && (
          <div style={{ padding: '1rem', color: 'var(--pf-v6-global--Color--200)' }}>
            No cluster storage attached
          </div>
        )}
      </FormGroup>

      <Title headingLevel="h3" size="md" style={{ marginTop: '2rem' }} id="connections-section-title">
        Connections
      </Title>
      <FormGroup fieldId="connections">
        <FormHelperText>
          <HelperText>
            <HelperTextItem>
              Attach existing connections (S3, OCI Registry, URI, etc.) to this workbench
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
        <Button variant="link" isInline id="add-connection-button" onClick={() => {
          // TODO: Open modal to select/create connection
          console.log('Add connection');
        }}>
          Add connection
        </Button>
        {connections.length === 0 && (
          <div style={{ padding: '1rem', color: 'var(--pf-v6-global--Color--200)' }}>
            No connections attached
          </div>
        )}
      </FormGroup>
    </Form>
  );

  // Step 4: Review & Create
  const step4Content = (
    <>
      <Card style={{ backgroundColor: '#e6f3ff', border: '1px solid #0066cc', marginBottom: '1rem' }} id="step4-info-card">
        <CardTitle>Final Configuration Check</CardTitle>
        <CardBody>
          Review all chosen settings before launching your new workbench. Click 'Create Workbench' to begin resource provisioning.
        </CardBody>
      </Card>
      <Title headingLevel="h3" size="md" style={{ marginBottom: '1rem' }} id="review-title">
        Review your workbench configuration
      </Title>
      <DescriptionList isHorizontal id="review-description-list">
        <DescriptionListGroup>
          <DescriptionListTerm>Governance Template</DescriptionListTerm>
          <DescriptionListDescription>
            {getSelectedTemplateData()?.name || '-'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        
        <DescriptionListGroup>
          <DescriptionListTerm>Name</DescriptionListTerm>
          <DescriptionListDescription>{workbenchName || '-'}</DescriptionListDescription>
        </DescriptionListGroup>
        
        <DescriptionListGroup>
          <DescriptionListTerm>Description</DescriptionListTerm>
          <DescriptionListDescription>{workbenchDescription || 'No description'}</DescriptionListDescription>
        </DescriptionListGroup>
        
        <DescriptionListGroup>
          <DescriptionListTerm>Workbench Image</DescriptionListTerm>
          <DescriptionListDescription>
            {mockImages.find(img => img.id === selectedImage)?.displayName || '-'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        
        <DescriptionListGroup>
          <DescriptionListTerm>Mount Path (Fixed)</DescriptionListTerm>
          <DescriptionListDescription>
            {getSelectedTemplateData()?.fixedMountPath || '-'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        
        <DescriptionListGroup>
          <DescriptionListTerm>Cluster Storage</DescriptionListTerm>
          <DescriptionListDescription>
            {clusterStorages.length > 0 ? `${clusterStorages.length} storage volume(s) attached` : 'None'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        
        <DescriptionListGroup>
          <DescriptionListTerm>Connections</DescriptionListTerm>
          <DescriptionListDescription>
            {connections.length > 0 ? `${connections.length} connection(s) attached` : 'None'}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
      
    </>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        aria-labelledby="create-workbench-wizard-title"
        variant={ModalVariant.large}
        hasNoBodyWrapper
        id="create-workbench-wizard-modal"
      >
        <PageSection hasBodyWrapper={false} type={PageSectionTypes.wizard} aria-label="Create workbench wizard">
          <Wizard onClose={handleClose}>
            <WizardStep
              id="select-template-step"
              name="Select Governance Template"
              body={{ hasNoPadding: false }}
              footer={{ isNextDisabled: !selectedTemplate }}
            >
              <div style={{ padding: '1.5rem' }}>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '0.5rem' }} id="step1-title">
                  Select Governance Template
                </Title>
                <p style={{ marginBottom: '1.5rem', color: 'var(--pf-v6-global--Color--200)' }}>
                  Choose a template that defines the constraints and settings for your workbench
                </p>
                {step1Content}
              </div>
            </WizardStep>

            <WizardStep
              id="details-image-step"
              name="Details & Image"
              body={{ hasNoPadding: false }}
              footer={{ isNextDisabled: !workbenchName || !!nameError || !selectedImage }}
            >
              <div style={{ padding: '1.5rem' }}>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '0.5rem' }} id="step2-title">
                  Details & Image
                </Title>
                <p style={{ marginBottom: '1.5rem', color: 'var(--pf-v6-global--Color--200)' }}>
                  Configure your workbench name, description, and select an image
                </p>
                {step2Content}
              </div>
            </WizardStep>

            <WizardStep
              id="storage-connections-step"
              name="Storage & Connections"
              body={{ hasNoPadding: false }}
            >
              <div style={{ padding: '1.5rem' }}>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '0.5rem' }} id="step3-title">
                  Storage & Connections
                </Title>
                <p style={{ marginBottom: '1.5rem', color: 'var(--pf-v6-global--Color--200)' }}>
                  Attach cluster storage and connections to your workbench (optional)
                </p>
                {step3Content}
              </div>
            </WizardStep>

            <WizardStep
              id="review-create-step"
              name="Review & Create"
              body={{ hasNoPadding: false }}
              footer={{ 
                nextButtonText: isCreating ? 'Creating Workbench...' : 'Create Workbench',
                isNextDisabled: isCreating,
                onNext: handleCreate 
              }}
            >
              <div style={{ padding: '1.5rem' }}>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '1.5rem' }} id="step4-title">
                  Review & Create
                </Title>
                {step4Content}
              </div>
            </WizardStep>
          </Wizard>
        </PageSection>
      </Modal>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <Modal
          variant={ModalVariant.small}
          title="Cancel workbench creation?"
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          actions={[
            <Button key="confirm" variant="danger" onClick={handleConfirmCancel} id="cancel-confirm-button">
              Yes, cancel
            </Button>,
            <Button key="back" variant="link" onClick={() => setShowCancelModal(false)} id="cancel-back-button">
              No, continue editing
            </Button>
          ]}
          id="cancel-confirmation-modal"
        >
          <ExclamationTriangleIcon style={{ color: 'var(--pf-v6-global--warning-color--100)', marginRight: '0.5rem' }} />
          Are you sure you want to cancel? All unsaved work will be lost.
        </Modal>
      )}
    </>
  );
};

export { CreateWorkbenchWizard };

