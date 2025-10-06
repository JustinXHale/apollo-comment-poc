import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Select,
  SelectList,
  SelectOption,
  MenuToggle,
  TextArea,
  Flex,
  FlexItem,
} from '@patternfly/react-core';

type AssetType = 'Model' | 'MCP Server' | '';

const AssetEndpoints: React.FunctionComponent = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [assetType, setAssetType] = React.useState<AssetType>('');
  const [isAssetTypeOpen, setIsAssetTypeOpen] = React.useState(false);
  const [project, setProject] = React.useState('');
  const [isProjectOpen, setIsProjectOpen] = React.useState(false);
  const [modelDeployment, setModelDeployment] = React.useState('');
  const [isModelDeploymentOpen, setIsModelDeploymentOpen] = React.useState(false);
  const [mcpServer, setMcpServer] = React.useState('');
  const [isMcpServerOpen, setIsMcpServerOpen] = React.useState(false);
  const [tools, setTools] = React.useState('');
  const [isToolsOpen, setIsToolsOpen] = React.useState(false);
  const [description, setDescription] = React.useState('');

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset form
    setAssetType('');
    setProject('');
    setModelDeployment('');
    setMcpServer('');
    setTools('');
    setDescription('');
  };

  const handleAddAsset = () => {
    // Handle adding the asset here
    console.log('Adding asset:', { assetType, project, modelDeployment, mcpServer, tools, description });
    handleCloseModal();
  };

  const isFormValid = () => {
    if (!assetType || !description.trim()) return false;
    
    if (assetType === 'Model') {
      return project && modelDeployment;
    }
    
    if (assetType === 'MCP Server') {
      return mcpServer && tools;
    }
    
    return false;
  };

  return (
    <>
      <PageSection>
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
          <FlexItem>
            <Content component={ContentVariants.h1}>AI Asset Endpoints</Content>
          </FlexItem>
          <FlexItem>
            <Content component={ContentVariants.p}>
              Configure and manage AI asset endpoints for your generative AI applications.
            </Content>
          </FlexItem>
          <FlexItem>
            <Button 
              variant="primary" 
              onClick={handleOpenModal}
              id="add-asset-button"
            >
              Add asset
            </Button>
          </FlexItem>
        </Flex>
      </PageSection>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="add-asset-modal-title"
        aria-describedby="add-asset-modal-body"
        ouiaId="AddAssetModal"
        appendTo={document.body}
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
                onSelect={(_event, value) => {
                  setAssetType(value as AssetType);
                  setIsAssetTypeOpen(false);
                  // Reset conditional fields when asset type changes
                  setProject('');
                  setModelDeployment('');
                  setMcpServer('');
                  setTools('');
                }}
                onOpenChange={(isOpen) => setIsAssetTypeOpen(isOpen)}
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
                  label="Project" 
                  fieldId="project-select"
                  isRequired
                >
                  <Select
                    id="project-select"
                    isOpen={isProjectOpen}
                    selected={project}
                    onSelect={(_event, value) => {
                      setProject(value as string);
                      setIsProjectOpen(false);
                    }}
                    onOpenChange={(isOpen) => setIsProjectOpen(isOpen)}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsProjectOpen(!isProjectOpen)}
                        isExpanded={isProjectOpen}
                        style={{ width: '100%' }}
                        id="project-toggle"
                      >
                        {project || 'Select project'}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="Project 1" id="project-1">
                        Project 1
                      </SelectOption>
                      <SelectOption value="Project 2" id="project-2">
                        Project 2
                      </SelectOption>
                      <SelectOption value="Project 3" id="project-3">
                        Project 3
                      </SelectOption>
                    </SelectList>
                  </Select>
                </FormGroup>

                <FormGroup 
                  label="Model deployment" 
                  fieldId="model-deployment-select"
                  isRequired
                >
                  <Select
                    id="model-deployment-select"
                    isOpen={isModelDeploymentOpen}
                    selected={modelDeployment}
                    onSelect={(_event, value) => {
                      setModelDeployment(value as string);
                      setIsModelDeploymentOpen(false);
                    }}
                    onOpenChange={(isOpen) => setIsModelDeploymentOpen(isOpen)}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsModelDeploymentOpen(!isModelDeploymentOpen)}
                        isExpanded={isModelDeploymentOpen}
                        style={{ width: '100%' }}
                        id="model-deployment-toggle"
                      >
                        {modelDeployment || 'Select model deployment'}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="Model Deployment 1" id="deployment-1">
                        Model Deployment 1
                      </SelectOption>
                      <SelectOption value="Model Deployment 2" id="deployment-2">
                        Model Deployment 2
                      </SelectOption>
                      <SelectOption value="Model Deployment 3" id="deployment-3">
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

            {assetType === 'MCP Server' && (
              <>
                <FormGroup 
                  label="MCP Server" 
                  fieldId="mcp-server-select"
                  isRequired
                >
                  <Select
                    id="mcp-server-select"
                    isOpen={isMcpServerOpen}
                    selected={mcpServer}
                    onSelect={(_event, value) => {
                      setMcpServer(value as string);
                      setIsMcpServerOpen(false);
                    }}
                    onOpenChange={(isOpen) => setIsMcpServerOpen(isOpen)}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsMcpServerOpen(!isMcpServerOpen)}
                        isExpanded={isMcpServerOpen}
                        style={{ width: '100%' }}
                        id="mcp-server-toggle"
                      >
                        {mcpServer || 'Select MCP server'}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="MCP Server 1" id="mcp-server-1">
                        MCP Server 1
                      </SelectOption>
                      <SelectOption value="MCP Server 2" id="mcp-server-2">
                        MCP Server 2
                      </SelectOption>
                      <SelectOption value="MCP Server 3" id="mcp-server-3">
                        MCP Server 3
                      </SelectOption>
                    </SelectList>
                  </Select>
                </FormGroup>

                <FormGroup 
                  label="Tools" 
                  fieldId="tools-select"
                  isRequired
                >
                  <Select
                    id="tools-select"
                    isOpen={isToolsOpen}
                    selected={tools}
                    onSelect={(_event, value) => {
                      setTools(value as string);
                      setIsToolsOpen(false);
                    }}
                    onOpenChange={(isOpen) => setIsToolsOpen(isOpen)}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsToolsOpen(!isToolsOpen)}
                        isExpanded={isToolsOpen}
                        style={{ width: '100%' }}
                        id="tools-toggle"
                      >
                        {tools || 'Select tools'}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="Tool 1" id="tool-1">
                        Tool 1
                      </SelectOption>
                      <SelectOption value="Tool 2" id="tool-2">
                        Tool 2
                      </SelectOption>
                      <SelectOption value="Tool 3" id="tool-3">
                        Tool 3
                      </SelectOption>
                    </SelectList>
                  </Select>
                </FormGroup>
              </>
            )}

            <FormGroup 
              label="Description" 
              fieldId="description-input"
              isRequired
            >
              <TextArea
                id="description-input"
                value={description}
                onChange={(_event, value) => setDescription(value)}
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
            onClick={handleAddAsset}
            isDisabled={!isFormValid()}
            id="add-asset-submit-button"
          >
            Add AI asset
          </Button>
          <Button
            key="cancel"
            variant="link"
            onClick={handleCloseModal}
            id="add-asset-cancel-button"
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export { AssetEndpoints };
