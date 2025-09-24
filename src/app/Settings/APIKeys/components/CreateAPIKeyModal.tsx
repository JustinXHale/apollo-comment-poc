import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  Button,
  ExpandableSection,
  DatePicker,
  NumberInput,
  Checkbox,
  Flex,
  FlexItem,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Alert,
} from '@patternfly/react-core';
import { CreateAPIKeyForm } from '../types';
import { 
  mockModels, 
  mockMCPServers, 
  mockVectorDatabases, 
  mockAgents,
  mockAPIKeys 
} from '../mockData';

interface CreateAPIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateAPIKeyModal: React.FunctionComponent<CreateAPIKeyModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<CreateAPIKeyForm>({
    name: '',
    description: '',
    owner: {
      type: 'User',
      name: '',
    },
    assets: {
      modelEndpoints: [],
      mcpServers: [],
      vectorDatabases: [],
      agents: [],
    },
  });

  // UI state
  const [isOwnerTypeOpen, setIsOwnerTypeOpen] = React.useState(false);
  const [isOwnerNameOpen, setIsOwnerNameOpen] = React.useState(false);
  const [isLimitsExpanded, setIsLimitsExpanded] = React.useState(false);
  const [isModelsOpen, setIsModelsOpen] = React.useState(false);
  const [isMCPServersOpen, setIsMCPServersOpen] = React.useState(false);
  const [isVectorDBsOpen, setIsVectorDBsOpen] = React.useState(false);
  const [isAgentsOpen, setIsAgentsOpen] = React.useState(false);

  // Mock owner names based on type
  const getOwnerNames = (type: string): string[] => {
    switch (type) {
      case 'User':
        return ['john.doe', 'jane.smith', 'bob.wilson', 'alice.johnson'];
      case 'Group':
        return ['dev-team', 'qa-team', 'prod-team', 'data-science-team'];
      case 'Service Account':
        return ['prod-service-account', 'dev-service-account', 'ci-service-account'];
      default:
        return [];
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parentField: string, field: string, value: any) => {
    setFormData(prev => {
      const parentObj = prev[parentField as keyof CreateAPIKeyForm] as any;
      return {
        ...prev,
        [parentField]: {
          ...parentObj,
          [field]: value,
        },
      };
    });
  };

  const handleOwnerTypeSelect = (
    _event?: React.MouseEvent<Element, MouseEvent>,
    selection?: string | number
  ) => {
    if (typeof selection !== 'string') return;
    setFormData(prev => ({
      ...prev,
      owner: {
        type: selection as 'User' | 'Group' | 'Service Account',
        name: '',
      },
    }));
    setIsOwnerTypeOpen(false);
  };

  const handleOwnerNameSelect = (
    _event?: React.MouseEvent<Element, MouseEvent>,
    selection?: string | number
  ) => {
    if (typeof selection !== 'string') return;
    handleNestedInputChange('owner', 'name', selection);
    setIsOwnerNameOpen(false);
  };

  const handleAssetSelect = (
    assetType: 'modelEndpoints' | 'mcpServers' | 'vectorDatabases' | 'agents',
    assetId: string,
    isSelected: boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      assets: {
        ...prev.assets,
        [assetType]: isSelected
          ? [...prev.assets[assetType], assetId]
          : prev.assets[assetType].filter(id => id !== assetId),
      },
    }));
  };

  const generateAPIKey = (): string => {
    const prefix = 'sk-';
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = prefix;
    for (let i = 0; i < 48; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate new API key
    const newAPIKey = {
      id: `key-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      apiKey: generateAPIKey(),
      owner: formData.owner,
      dateCreated: new Date(),
      limits: formData.limits,
      assets: formData.assets,
    };
    
    // Navigate to the new API key details page
    navigate(`/gen-ai-studio/api-keys/${newAPIKey.id}`);
    onClose();
  };

  const isFormValid = () => {
    return formData.name.trim() !== '' && formData.owner.name.trim() !== '';
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      name: '',
      description: '',
      owner: {
        type: 'User',
        name: '',
      },
      assets: {
        modelEndpoints: [],
        mcpServers: [],
        vectorDatabases: [],
        agents: [],
      },
    });
    setIsLimitsExpanded(false);
    onClose();
  };

  const ownerNames = getOwnerNames(formData.owner.type);

    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        aria-labelledby="create-api-key-modal-title"
        aria-describedby="create-api-key-modal-body"
        ouiaId="CreateAPIKeyModal"
        appendTo={document.body}
        className="pf-m-md"
      >
        <ModalHeader title="Create API key" labelId="create-api-key-modal-title" />
        <ModalBody id="create-api-key-modal-body">
          <Form>
        {/* Basic Information */}
        <FormGroup label="Name" isRequired>
          <TextInput
            value={formData.name}
            onChange={(_event, value) => handleInputChange('name', value)}
            placeholder="Enter a descriptive name for this API key"
            isDisabled={isSubmitting}
          />
        </FormGroup>

        <FormGroup label="Description">
          <TextArea
            value={formData.description}
            onChange={(_event, value) => handleInputChange('description', value)}
            placeholder="Describe the key's purpose"
            rows={3}
            isDisabled={isSubmitting}
          />
        </FormGroup>

        {/* Owner Information */}
        <FormGroup label="Owner type" isRequired>
          <select
            value={formData.owner.type}
            onChange={(e) => {
              const value = e.target.value as 'User' | 'Group' | 'Service Account';
              setFormData(prev => ({
                ...prev,
                owner: { type: value, name: '' }
              }));
            }}
            disabled={isSubmitting}
            style={{ 
              width: '100%', 
              padding: '0.375rem 0.75rem', 
              border: '1px solid #d2d2d2', 
              borderRadius: '0.25rem',
              fontSize: '0.875rem'
            }}
          >
            <option value="User">User</option>
            <option value="Group">Group</option>
            <option value="Service Account">Service Account</option>
          </select>
        </FormGroup>

        <FormGroup label="Owner name" isRequired>
          <select
            value={formData.owner.name}
            onChange={(e) => handleNestedInputChange('owner', 'name', e.target.value)}
            disabled={isSubmitting || ownerNames.length === 0}
            style={{ 
              width: '100%', 
              padding: '0.375rem 0.75rem', 
              border: '1px solid #d2d2d2', 
              borderRadius: '0.25rem',
              fontSize: '0.875rem'
            }}
          >
            <option value="">{`Select a ${formData.owner.type.toLowerCase()}`}</option>
            {ownerNames.map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </FormGroup>

        {/* Limits and Policies */}
        <ExpandableSection
          toggleText="Limits and Policies"
          isExpanded={isLimitsExpanded}
          onToggle={() => setIsLimitsExpanded(!isLimitsExpanded)}
        >
          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
            <FlexItem>
              <FormGroup label="Token rate limit">
                <NumberInput
                  value={formData.limits?.tokenRateLimit || ''}
                  onMinus={() => {
                    const current = formData.limits?.tokenRateLimit || 0;
                    handleNestedInputChange('limits', 'tokenRateLimit', Math.max(0, current - 1000));
                  }}
                  onChange={(event) => {
                    const value = parseInt((event.target as HTMLInputElement).value) || 0;
                    handleNestedInputChange('limits', 'tokenRateLimit', value);
                  }}
                  onPlus={() => {
                    const current = formData.limits?.tokenRateLimit || 0;
                    handleNestedInputChange('limits', 'tokenRateLimit', current + 1000);
                  }}
                  inputName="token-rate-limit"
                  inputAriaLabel="Token rate limit"
                  minusBtnAriaLabel="Decrease token rate limit"
                  plusBtnAriaLabel="Increase token rate limit"
                  unit="tokens per minute"
                  min={0}
                  isDisabled={isSubmitting}
                />
              </FormGroup>
            </FlexItem>

            <FlexItem>
              <FormGroup label="Request rate limit">
                <NumberInput
                  value={formData.limits?.requestRateLimit || ''}
                  onMinus={() => {
                    const current = formData.limits?.requestRateLimit || 0;
                    handleNestedInputChange('limits', 'requestRateLimit', Math.max(0, current - 100));
                  }}
                  onChange={(event) => {
                    const value = parseInt((event.target as HTMLInputElement).value) || 0;
                    handleNestedInputChange('limits', 'requestRateLimit', value);
                  }}
                  onPlus={() => {
                    const current = formData.limits?.requestRateLimit || 0;
                    handleNestedInputChange('limits', 'requestRateLimit', current + 100);
                  }}
                  inputName="request-rate-limit"
                  inputAriaLabel="Request rate limit"
                  minusBtnAriaLabel="Decrease request rate limit"
                  plusBtnAriaLabel="Increase request rate limit"
                  unit="requests per minute"
                  min={0}
                  isDisabled={isSubmitting}
                />
              </FormGroup>
            </FlexItem>

            <FlexItem>
              <FormGroup label="Budget limit">
                <NumberInput
                  value={formData.limits?.budgetLimit || ''}
                  onMinus={() => {
                    const current = formData.limits?.budgetLimit || 0;
                    handleNestedInputChange('limits', 'budgetLimit', Math.max(0, current - 50));
                  }}
                  onChange={(event) => {
                    const value = parseInt((event.target as HTMLInputElement).value) || 0;
                    handleNestedInputChange('limits', 'budgetLimit', value);
                  }}
                  onPlus={() => {
                    const current = formData.limits?.budgetLimit || 0;
                    handleNestedInputChange('limits', 'budgetLimit', current + 50);
                  }}
                  inputName="budget-limit"
                  inputAriaLabel="Budget limit"
                  minusBtnAriaLabel="Decrease budget limit"
                  plusBtnAriaLabel="Increase budget limit"
                  unit="USD"
                  min={0}
                  isDisabled={isSubmitting}
                />
              </FormGroup>
            </FlexItem>

            <FlexItem>
              <FormGroup label="Expiration date">
                <DatePicker
                  value={formData.limits?.expirationDate ? formData.limits.expirationDate.toISOString().split('T')[0] : ''}
                  onChange={(_event, str, date) => {
                    handleNestedInputChange('limits', 'expirationDate', date);
                  }}
                  placeholder="Select expiration date (optional)"
                  isDisabled={isSubmitting}
                />
              </FormGroup>
            </FlexItem>
          </Flex>
        </ExpandableSection>

        {/* AI Asset Access */}
        <FormGroup>
          <FormHelperText>
            <HelperText>
              <HelperTextItem>
                Select the AI assets this API key should have access to. You can modify these selections later.
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        </FormGroup>

        {/* Model Endpoints */}
        <FormGroup label="Model Endpoints">
          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
            {mockModels.map(model => (
              <FlexItem key={model.id}>
                <Checkbox
                  id={`model-${model.id}`}
                  label={`${model.name} (${model.id})`}
                  isChecked={formData.assets.modelEndpoints.includes(model.id)}
                  onChange={(_event, checked) => handleAssetSelect('modelEndpoints', model.id, checked)}
                  isDisabled={isSubmitting}
                />
              </FlexItem>
            ))}
          </Flex>
        </FormGroup>

        {/* MCP Servers */}
        <FormGroup label="MCP Servers & tools">
          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
            {mockMCPServers.map(server => (
              <FlexItem key={server.id}>
                <Checkbox
                  id={`mcp-${server.id}`}
                  label={`${server.name} (${server.tools.join(', ')})`}
                  isChecked={formData.assets.mcpServers.includes(server.id)}
                  onChange={(_event, checked) => handleAssetSelect('mcpServers', server.id, checked)}
                  isDisabled={isSubmitting}
                />
              </FlexItem>
            ))}
          </Flex>
        </FormGroup>

        {/* Vector Databases */}
        <FormGroup label="Vector Databases">
          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
            {mockVectorDatabases.map(db => (
              <FlexItem key={db.id}>
                <Checkbox
                  id={`vdb-${db.id}`}
                  label={`${db.name} (${db.size})`}
                  isChecked={formData.assets.vectorDatabases.includes(db.id)}
                  onChange={(_event, checked) => handleAssetSelect('vectorDatabases', db.id, checked)}
                  isDisabled={isSubmitting}
                />
              </FlexItem>
            ))}
          </Flex>
        </FormGroup>

        {/* Agents */}
        <FormGroup label="Agents">
          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
            {mockAgents.map(agent => (
              <FlexItem key={agent.id}>
                <Checkbox
                  id={`agent-${agent.id}`}
                  label={agent.name}
                  isChecked={formData.assets.agents.includes(agent.id)}
                  onChange={(_event, checked) => handleAssetSelect('agents', agent.id, checked)}
                  isDisabled={isSubmitting}
                />
              </FlexItem>
            ))}
          </Flex>
        </FormGroup>

          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            key="create"
            variant="primary"
            onClick={handleSubmit}
            isDisabled={!isFormValid() || isSubmitting}
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create API key'}
          </Button>
          <Button
            key="cancel"
            variant="link"
            onClick={handleClose}
            isDisabled={isSubmitting}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
  );
};

export { CreateAPIKeyModal };
