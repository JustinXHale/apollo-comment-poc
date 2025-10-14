import React from 'react';
import {
  Button,
  Checkbox,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  MenuToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  SelectList,
  SelectOption,
  TextArea,
  TextInput
} from '@patternfly/react-core';

type AssetType = 'Model' | 'MCP Server' | '';
type ModelLocation = 'Internal' | 'External' | '';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isFormValid: () => boolean;
  
  // Asset Type
  assetType: AssetType;
  setAssetType: (value: AssetType) => void;
  isAssetTypeOpen: boolean;
  setIsAssetTypeOpen: (value: boolean) => void;
  
  // Model Location
  modelLocation: ModelLocation;
  setModelLocation: (value: ModelLocation) => void;
  isModelLocationOpen: boolean;
  setIsModelLocationOpen: (value: boolean) => void;
  
  // Project fields
  project: string;
  setProject: (value: string) => void;
  isProjectOpen: boolean;
  setIsProjectOpen: (value: boolean) => void;
  
  // Model Deployment fields
  modelDeployment: string;
  setModelDeployment: (value: string) => void;
  isModelDeploymentOpen: boolean;
  setIsModelDeploymentOpen: (value: boolean) => void;
  
  // External Provider fields
  externalProvider: string;
  setExternalProvider: (value: string) => void;
  isExternalProviderOpen: boolean;
  setIsExternalProviderOpen: (value: boolean) => void;
  externalProviderAPIKey: string;
  setExternalProviderAPIKey: (value: string) => void;
  selectedExternalModels: Set<string>;
  setSelectedExternalModels: (value: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
  
  // MCP Server fields
  mcpServer: string;
  setMcpServer: (value: string) => void;
  isMcpServerOpen: boolean;
  setIsMcpServerOpen: (value: boolean) => void;
  tools: string;
  setTools: (value: string) => void;
  isToolsOpen: boolean;
  setIsToolsOpen: (value: boolean) => void;
  
  // Description
  assetDescription: string;
  setAssetDescription: (value: string) => void;
}

export const AddAssetModal: React.FC<AddAssetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isFormValid,
  assetType,
  setAssetType,
  isAssetTypeOpen,
  setIsAssetTypeOpen,
  modelLocation,
  setModelLocation,
  isModelLocationOpen,
  setIsModelLocationOpen,
  project,
  setProject,
  isProjectOpen,
  setIsProjectOpen,
  modelDeployment,
  setModelDeployment,
  isModelDeploymentOpen,
  setIsModelDeploymentOpen,
  externalProvider,
  setExternalProvider,
  isExternalProviderOpen,
  setIsExternalProviderOpen,
  externalProviderAPIKey,
  setExternalProviderAPIKey,
  selectedExternalModels,
  setSelectedExternalModels,
  mcpServer,
  setMcpServer,
  isMcpServerOpen,
  setIsMcpServerOpen,
  tools,
  setTools,
  isToolsOpen,
  setIsToolsOpen,
  assetDescription,
  setAssetDescription
}) => {
  const handleAssetTypeChange = (value: AssetType) => {
    setAssetType(value);
    setIsAssetTypeOpen(false);
    // Reset conditional fields when asset type changes
    setProject('');
    setModelDeployment('');
    setMcpServer('');
    setTools('');
  };

  const handleModelLocationChange = (value: ModelLocation) => {
    setModelLocation(value);
    setIsModelLocationOpen(false);
    // Reset conditional fields when location changes
    setProject('');
    setModelDeployment('');
    setExternalProvider('');
    setExternalProviderAPIKey('');
    setSelectedExternalModels(new Set());
  };

  const handleExternalModelToggle = (modelId: string, checked: boolean) => {
    setSelectedExternalModels(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(modelId);
      } else {
        newSet.delete(modelId);
      }
      return newSet;
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="add-asset-modal-title"
      aria-describedby="add-asset-modal-body"
      ouiaId="AddAssetModal"
      className="pf-m-md"
      appendTo={document.body}
      id="add-asset-modal"
    >
      <ModalHeader 
        title="Add asset" 
        labelId="add-asset-modal-title"
      />
      <ModalBody id="add-asset-modal-body">
        <Form>
          <FormGroup 
            label="Asset type" 
            fieldId="asset-type-select"
            isRequired
          >
            <Select
              id="asset-type-select"
              isOpen={isAssetTypeOpen}
              selected={assetType}
              onSelect={(_event, value) => handleAssetTypeChange(value as AssetType)}
              onOpenChange={setIsAssetTypeOpen}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsAssetTypeOpen(!isAssetTypeOpen)}
                  isExpanded={isAssetTypeOpen}
                  style={{ width: '100%' }}
                  id="asset-type-toggle"
                >
                  {assetType || 'Select asset type'}
                </MenuToggle>
              )}
            >
              <SelectList>
                <SelectOption value="Model" id="asset-type-model">
                  Model
                </SelectOption>
                <SelectOption value="MCP Server" id="asset-type-mcp-server">
                  MCP Server
                </SelectOption>
              </SelectList>
            </Select>
          </FormGroup>

          {assetType === 'Model' && (
            <>
              <FormGroup 
                label="Model location" 
                fieldId="model-location-select"
                isRequired
              >
                <Select
                  id="model-location-select"
                  isOpen={isModelLocationOpen}
                  selected={modelLocation}
                  onSelect={(_event, value) => handleModelLocationChange(value as ModelLocation)}
                  onOpenChange={setIsModelLocationOpen}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsModelLocationOpen(!isModelLocationOpen)}
                      isExpanded={isModelLocationOpen}
                      style={{ width: '100%' }}
                      id="model-location-toggle"
                    >
                      {modelLocation || 'Select model location'}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    <SelectOption value="Internal" id="location-internal">
                      Internal (on-cluster)
                    </SelectOption>
                    <SelectOption value="External" id="location-external">
                      External
                    </SelectOption>
                  </SelectList>
                </Select>
              </FormGroup>

              {modelLocation === 'Internal' && (
                <>
                  <FormGroup 
                    label="Project" 
                    fieldId="add-asset-project-select"
                    isRequired
                  >
                    <Select
                      id="add-asset-project-select"
                      isOpen={isProjectOpen}
                      selected={project}
                      onSelect={(_event, value) => {
                        setProject(value as string);
                        setIsProjectOpen(false);
                      }}
                      onOpenChange={setIsProjectOpen}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsProjectOpen(!isProjectOpen)}
                          isExpanded={isProjectOpen}
                          style={{ width: '100%' }}
                          id="add-asset-project-toggle"
                        >
                          {project || 'Select project'}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption value="Project 1" id="add-asset-project-1">
                          Project 1
                        </SelectOption>
                        <SelectOption value="Project 2" id="add-asset-project-2">
                          Project 2
                        </SelectOption>
                        <SelectOption value="Project 3" id="add-asset-project-3">
                          Project 3
                        </SelectOption>
                      </SelectList>
                    </Select>
                  </FormGroup>

                  <FormGroup 
                    label="Model deployment" 
                    fieldId="add-asset-model-deployment-select"
                    isRequired
                  >
                    <Select
                      id="add-asset-model-deployment-select"
                      isOpen={isModelDeploymentOpen}
                      selected={modelDeployment}
                      onSelect={(_event, value) => {
                        setModelDeployment(value as string);
                        setIsModelDeploymentOpen(false);
                      }}
                      onOpenChange={setIsModelDeploymentOpen}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsModelDeploymentOpen(!isModelDeploymentOpen)}
                          isExpanded={isModelDeploymentOpen}
                          style={{ width: '100%' }}
                          id="add-asset-model-deployment-toggle"
                        >
                          {modelDeployment || 'Select model deployment'}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption value="Model Deployment 1" id="add-asset-deployment-1">
                          Model Deployment 1
                        </SelectOption>
                        <SelectOption value="Model Deployment 2" id="add-asset-deployment-2">
                          Model Deployment 2
                        </SelectOption>
                        <SelectOption value="Model Deployment 3" id="add-asset-deployment-3">
                          Model Deployment 3
                        </SelectOption>
                      </SelectList>
                    </Select>
                    <FormHelperText>
                      <HelperText>
                        <HelperTextItem>
                          Adding this as an AI asset will make it available to other users outside of the namespace/project.
                        </HelperTextItem>
                      </HelperText>
                    </FormHelperText>
                  </FormGroup>
                </>
              )}

              {modelLocation === 'External' && (
                <>
                  <FormGroup 
                    label="External provider" 
                    fieldId="external-provider-select"
                    isRequired
                  >
                    <Select
                      id="external-provider-select"
                      isOpen={isExternalProviderOpen}
                      selected={externalProvider}
                      onSelect={(_event, value) => {
                        setExternalProvider(value as string);
                        setIsExternalProviderOpen(false);
                      }}
                      onOpenChange={setIsExternalProviderOpen}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsExternalProviderOpen(!isExternalProviderOpen)}
                          isExpanded={isExternalProviderOpen}
                          style={{ width: '100%' }}
                          id="external-provider-toggle"
                        >
                          {externalProvider || 'Select external provider'}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption value="OpenAI" id="provider-openai">
                          OpenAI
                        </SelectOption>
                        <SelectOption value="Anthropic" id="provider-anthropic">
                          Anthropic
                        </SelectOption>
                      </SelectList>
                    </Select>
                  </FormGroup>

                  <FormGroup 
                    label="API key" 
                    fieldId="external-provider-api-key"
                    isRequired
                  >
                    <TextInput
                      id="external-provider-api-key"
                      type="password"
                      value={externalProviderAPIKey}
                      onChange={(_event, value) => setExternalProviderAPIKey(value)}
                      placeholder="Enter your API key"
                    />
                    <FormHelperText>
                      <HelperText>
                        <HelperTextItem>
                          Your API key from {externalProvider || 'the external provider'} to authenticate requests.
                        </HelperTextItem>
                      </HelperText>
                    </FormHelperText>
                  </FormGroup>

                  {externalProviderAPIKey && (
                    <FormGroup 
                      label="Available models" 
                      fieldId="external-models-select"
                      isRequired
                    >
                      <div style={{ 
                        border: '1px solid var(--pf-v5-global--BorderColor--100)', 
                        borderRadius: '4px', 
                        padding: '1rem',
                        maxHeight: '300px',
                        overflowY: 'auto'
                      }}>
                        <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#6a6e73' }}>
                          Select the models you want to add as AI assets:
                        </p>
                        {externalProvider === 'OpenAI' && (
                          <>
                            <Checkbox
                              id="external-model-gpt4"
                              label="GPT-4"
                              description="Most capable model, best for complex tasks"
                              isChecked={selectedExternalModels.has('gpt-4')}
                              onChange={(_event, checked) => handleExternalModelToggle('gpt-4', checked)}
                              style={{ marginBottom: '0.5rem' }}
                            />
                            <Checkbox
                              id="external-model-gpt4-turbo"
                              label="GPT-4 Turbo"
                              description="Fast and efficient variant of GPT-4"
                              isChecked={selectedExternalModels.has('gpt-4-turbo')}
                              onChange={(_event, checked) => handleExternalModelToggle('gpt-4-turbo', checked)}
                              style={{ marginBottom: '0.5rem' }}
                            />
                            <Checkbox
                              id="external-model-gpt35-turbo"
                              label="GPT-3.5 Turbo"
                              description="Fast and cost-effective for simpler tasks"
                              isChecked={selectedExternalModels.has('gpt-3.5-turbo')}
                              onChange={(_event, checked) => handleExternalModelToggle('gpt-3.5-turbo', checked)}
                            />
                          </>
                        )}
                        {externalProvider === 'Anthropic' && (
                          <>
                            <Checkbox
                              id="external-model-claude-3-opus"
                              label="Claude 3 Opus"
                              description="Most intelligent model for complex tasks"
                              isChecked={selectedExternalModels.has('claude-3-opus')}
                              onChange={(_event, checked) => handleExternalModelToggle('claude-3-opus', checked)}
                              style={{ marginBottom: '0.5rem' }}
                            />
                            <Checkbox
                              id="external-model-claude-3-sonnet"
                              label="Claude 3 Sonnet"
                              description="Balanced performance and intelligence"
                              isChecked={selectedExternalModels.has('claude-3-sonnet')}
                              onChange={(_event, checked) => handleExternalModelToggle('claude-3-sonnet', checked)}
                              style={{ marginBottom: '0.5rem' }}
                            />
                            <Checkbox
                              id="external-model-claude-3-haiku"
                              label="Claude 3 Haiku"
                              description="Fast and cost-effective for quick tasks"
                              isChecked={selectedExternalModels.has('claude-3-haiku')}
                              onChange={(_event, checked) => handleExternalModelToggle('claude-3-haiku', checked)}
                            />
                          </>
                        )}
                      </div>
                      <FormHelperText>
                        <HelperText>
                          <HelperTextItem>
                            Selected models will be added as AI assets and available for use.
                          </HelperTextItem>
                        </HelperText>
                      </FormHelperText>
                    </FormGroup>
                  )}
                </>
              )}
            </>
          )}

          {assetType === 'MCP Server' && (
            <>
              <FormGroup 
                label="MCP Server" 
                fieldId="add-asset-mcp-server-select"
                isRequired
              >
                <Select
                  id="add-asset-mcp-server-select"
                  isOpen={isMcpServerOpen}
                  selected={mcpServer}
                  onSelect={(_event, value) => {
                    setMcpServer(value as string);
                    setIsMcpServerOpen(false);
                  }}
                  onOpenChange={setIsMcpServerOpen}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsMcpServerOpen(!isMcpServerOpen)}
                      isExpanded={isMcpServerOpen}
                      style={{ width: '100%' }}
                      id="add-asset-mcp-server-toggle"
                    >
                      {mcpServer || 'Select MCP server'}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    <SelectOption value="MCP Server 1" id="add-asset-mcp-server-1">
                      MCP Server 1
                    </SelectOption>
                    <SelectOption value="MCP Server 2" id="add-asset-mcp-server-2">
                      MCP Server 2
                    </SelectOption>
                    <SelectOption value="MCP Server 3" id="add-asset-mcp-server-3">
                      MCP Server 3
                    </SelectOption>
                  </SelectList>
                </Select>
              </FormGroup>

              <FormGroup 
                label="Tools" 
                fieldId="add-asset-tools-select"
                isRequired
              >
                <Select
                  id="add-asset-tools-select"
                  isOpen={isToolsOpen}
                  selected={tools}
                  onSelect={(_event, value) => {
                    setTools(value as string);
                    setIsToolsOpen(false);
                  }}
                  onOpenChange={setIsToolsOpen}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsToolsOpen(!isToolsOpen)}
                      isExpanded={isToolsOpen}
                      style={{ width: '100%' }}
                      id="add-asset-tools-toggle"
                    >
                      {tools || 'Select tools'}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    <SelectOption value="Tool 1" id="add-asset-tool-1">
                      Tool 1
                    </SelectOption>
                    <SelectOption value="Tool 2" id="add-asset-tool-2">
                      Tool 2
                    </SelectOption>
                    <SelectOption value="Tool 3" id="add-asset-tool-3">
                      Tool 3
                    </SelectOption>
                  </SelectList>
                </Select>
              </FormGroup>
            </>
          )}

          <FormGroup 
            label="Description" 
            fieldId="add-asset-description-input"
            isRequired
          >
            <TextArea
              id="add-asset-description-input"
              value={assetDescription}
              onChange={(_event, value) => setAssetDescription(value)}
              placeholder="Provide details about the asset, relevant settings, quality of service details, contact information, etc."
              rows={4}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          key="add"
          variant="primary"
          onClick={onSubmit}
          isDisabled={!isFormValid()}
          id="add-asset-submit-button"
        >
          Add AI asset
        </Button>
        <Button
          key="cancel"
          variant="link"
          onClick={onClose}
          id="add-asset-cancel-button"
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

