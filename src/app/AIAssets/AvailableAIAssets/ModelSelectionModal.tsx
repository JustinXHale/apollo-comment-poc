import React from 'react';
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownList,
  Label,
  MenuToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  Pagination,
  TextInput,
  Title
} from '@patternfly/react-core';
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@patternfly/react-table';
import { CheckCircleIcon, FilterIcon } from '@patternfly/react-icons';

interface Model {
  id: string;
  name: string;
  description: string;
  useCase: string;
}

interface ModelSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigure: () => void;
  selectedModels: Set<string>;
  onModelToggle: (modelId: string) => void;
  onSelectAll: () => void;
  filteredModels: Model[];
  filterBy: string;
  onFilterByChange: (value: string) => void;
  searchText: string;
  onSearchTextChange: (value: string) => void;
  isFilterDropdownOpen: boolean;
  onFilterDropdownToggle: (isOpen: boolean) => void;
  onNavigateToModels: () => void;
}

export const ModelSelectionModal: React.FC<ModelSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfigure,
  selectedModels,
  onModelToggle,
  onSelectAll,
  filteredModels,
  filterBy,
  onFilterByChange,
  searchText,
  onSearchTextChange,
  isFilterDropdownOpen,
  onFilterDropdownToggle,
  onNavigateToModels
}) => {
  return (
    <Modal
      variant={ModalVariant.large}
      title="Configure playground"
      isOpen={isOpen}
      onClose={onClose}
      id="model-selection-modal"
    >
      <ModalHeader>
        <Title headingLevel="h2" size="xl" id="model-selection-modal-title">
          Configure playground
        </Title>
      </ModalHeader>
      <ModalBody>
        <div style={{ marginBottom: '1.5rem' }}>
          <p>
            Choose the models you want to make available in this playground from your AI available assets. You can add additional models by making them available from the{' '}
            <Button 
              variant="link" 
              isInline 
              style={{ padding: 0, fontSize: 'inherit' }}
              onClick={onNavigateToModels}
              id="navigate-to-models-link"
            >
              Model deployments page
            </Button>
            .
          </p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          {/* Filter and Selection Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Checkbox 
              id="select-all-models-checkbox"
              isChecked={selectedModels.size === filteredModels.length && filteredModels.length > 0}
              onChange={onSelectAll}
            />
            
            <Dropdown
              isOpen={isFilterDropdownOpen}
              onSelect={(event, value) => {
                onFilterByChange(value as string);
                onFilterDropdownToggle(false);
              }}
              onOpenChange={onFilterDropdownToggle}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => onFilterDropdownToggle(!isFilterDropdownOpen)}
                  isExpanded={isFilterDropdownOpen}
                  icon={<FilterIcon />}
                  style={{ minWidth: '120px' }}
                  id="model-filter-toggle"
                >
                  {filterBy === 'name' ? 'Name' : 'Use Case'}
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem value="name" id="filter-by-name">Name</DropdownItem>
                <DropdownItem value="useCase" id="filter-by-usecase">Use Case</DropdownItem>
              </DropdownList>
            </Dropdown>
            
            <div style={{ width: '200px' }}>
              <TextInput
                type="search"
                placeholder={filterBy === 'name' ? 'Filter by name' : 'Filter by use case...'}
                value={searchText}
                onChange={(_event, value) => onSearchTextChange(value)}
                id="model-search-input"
              />
            </div>
            
            <span style={{ fontSize: '0.875rem', color: '#6a6e73' }}>
              {selectedModels.size} of {filteredModels.length} items selected
            </span>
            
            <div style={{ marginLeft: 'auto' }}>
              <Pagination
                itemCount={filteredModels.length}
                perPage={4}
                page={1}
                onSetPage={() => {}}
                onPerPageSelect={() => {}}
                isCompact
                id="model-pagination"
              />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <Title headingLevel="h3" size="md" style={{ marginBottom: '1rem' }} id="available-models-title">
            Available models
          </Title>
          
          <Table variant="compact" id="available-models-table">
            <Thead>
              <Tr>
                <Th width={10}></Th>
                <Th>Model name</Th>
                <Th>Model ID</Th>
                <Th>Description</Th>
                <Th>Use Case</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredModels
                .slice(0, 4)
                .map((model) => (
                <Tr key={model.id}>
                  <Td>
                    <Checkbox
                      id={`model-checkbox-${model.id}`}
                      isChecked={selectedModels.has(model.id)}
                      onChange={() => onModelToggle(model.id)}
                    />
                  </Td>
                  <Td>{model.name}</Td>
                  <Td style={{ maxWidth: '300px' }}>
                    <div style={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {model.description}
                    </div>
                  </Td>
                  <Td>{model.useCase}</Td>
                  <Td>
                    <Label color="green" icon={<CheckCircleIcon />}>
                      Active
                    </Label>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button 
          variant="primary" 
          onClick={onConfigure}
          isDisabled={selectedModels.size === 0}
          id="configure-playground-button"
        >
          Configure
        </Button>
        <Button variant="link" onClick={onClose} id="cancel-model-selection-button">
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

