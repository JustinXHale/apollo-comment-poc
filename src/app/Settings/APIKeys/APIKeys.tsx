import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageSection,
  Content,
  ContentVariants,
  Button,
  ToolbarItem,
  Toolbar,
  ToolbarContent,
  Card,
  CardBody,
  Badge,
  Flex,
  FlexItem,
  Label,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import { PlusIcon, EllipsisVIcon } from '@patternfly/react-icons';
import { mockAPIKeys, getModelById, getMCPServerById, getVectorDatabaseById, getAgentById } from './mockData';
import { APIKey, APIKeyStatus } from './types';
import { CreateAPIKeyModal, DeleteAPIKeyModal } from './components';

const APIKeys: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedAPIKey, setSelectedAPIKey] = React.useState<APIKey | null>(null);
  const [openKebabMenus, setOpenKebabMenus] = React.useState<Set<string>>(new Set());

  const formatAPIKey = (apiKey: string): string => {
    return apiKey.substring(0, 9) + '...';
  };

  const getAssetsSummary = (apiKey: APIKey): React.ReactNode => {
    const totalAssets = 
      apiKey.assets.modelEndpoints.length +
      apiKey.assets.mcpServers.length +
      apiKey.assets.vectorDatabases.length +
      apiKey.assets.agents.length;

    if (totalAssets === 0) {
      return <span>No assets</span>;
    }

    return (
      <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
        {apiKey.assets.modelEndpoints.length > 0 && (
          <FlexItem>
            <Badge isRead>{apiKey.assets.modelEndpoints.length} Models</Badge>
          </FlexItem>
        )}
        {apiKey.assets.mcpServers.length > 0 && (
          <FlexItem>
            <Badge isRead>{apiKey.assets.mcpServers.length} MCP</Badge>
          </FlexItem>
        )}
        {apiKey.assets.vectorDatabases.length > 0 && (
          <FlexItem>
            <Badge isRead>{apiKey.assets.vectorDatabases.length} Vector DBs</Badge>
          </FlexItem>
        )}
        {apiKey.assets.agents.length > 0 && (
          <FlexItem>
            <Badge isRead>{apiKey.assets.agents.length} Agents</Badge>
          </FlexItem>
        )}
      </Flex>
    );
  };

  const getOwnerDisplay = (owner: APIKey['owner']): string => {
    return `${owner.name} (${owner.type})`;
  };

  const getStatusLabel = (status: APIKeyStatus) => {
    const statusMap = {
      Active: { color: 'green' as const, label: 'Active' },
      Expired: { color: 'red' as const, label: 'Expired' },
      Disabled: { color: 'grey' as const, label: 'Disabled' },
    };
    const { color, label } = statusMap[status];
    return <Label id={`status-${status.toLowerCase()}`} color={color}>{label}</Label>;
  };

  const formatLastUsed = (date?: Date): string => {
    if (!date) return 'Never';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const formatExpirationDate = (date?: Date): string => {
    if (!date) return 'Never';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const toggleKebabMenu = (apiKeyId: string) => {
    setOpenKebabMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(apiKeyId)) {
        newSet.delete(apiKeyId);
      } else {
        newSet.add(apiKeyId);
      }
      return newSet;
    });
  };

  const handleViewDetails = (apiKey: APIKey) => {
    navigate(`/gen-ai-studio/api-keys/${apiKey.id}`);
  };

  const handleDeleteAPIKey = (apiKey: APIKey) => {
    setSelectedAPIKey(apiKey);
    setIsDeleteModalOpen(true);
    setOpenKebabMenus(new Set());
  };

  const handleDeleteConfirm = (apiKey: APIKey) => {
    console.log('Deleting API key:', apiKey.id);
    // TODO: Implement actual delete functionality
  };

  const handleCreateAPIKey = () => {
    setIsCreateModalOpen(true);
  };

  const handleRowClick = (apiKey: APIKey) => {
    navigate(`/gen-ai-studio/api-keys/${apiKey.id}`);
  };

  return (
    <PageSection>
      <Content component={ContentVariants.h1}>API keys</Content>
      <Content component={ContentVariants.p}>
        Manage API keys that control access to AI asset endpoints.
      </Content>
      
      <Card>
        <CardBody>
          <Toolbar id="api-keys-toolbar">
            <ToolbarContent>
              <ToolbarItem>
                <Button 
                  variant="primary" 
                  icon={<PlusIcon />}
                  onClick={handleCreateAPIKey}
                >
                  Create API key
                </Button>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table aria-label="API Keys table">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Status</Th>
                <Th>API Key</Th>
                <Th>Assets</Th>
                <Th>Owner</Th>
                <Th>Last used</Th>
                <Th>Expiration date</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockAPIKeys.map((apiKey) => (
                <Tr 
                  key={apiKey.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRowClick(apiKey)}
                >
                  <Td dataLabel="Name">
                    <div>
                      <strong>{apiKey.name}</strong>
                      {apiKey.description && (
                        <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
                          {apiKey.description}
                        </div>
                      )}
                    </div>
                  </Td>
                  <Td dataLabel="Status">
                    {getStatusLabel(apiKey.status)}
                  </Td>
                  <Td dataLabel="API Key">
                    <code>{formatAPIKey(apiKey.apiKey)}</code>
                  </Td>
                  <Td dataLabel="Assets">
                    {getAssetsSummary(apiKey)}
                  </Td>
                  <Td dataLabel="Owner">
                    {getOwnerDisplay(apiKey.owner)}
                  </Td>
                  <Td dataLabel="Last used">
                    {formatLastUsed(apiKey.dateLastUsed)}
                  </Td>
                  <Td dataLabel="Expiration date">
                    {formatExpirationDate(apiKey.limits?.expirationDate)}
                  </Td>
                  <Td 
                    dataLabel="Actions" 
                    style={{ textAlign: 'right', width: '60px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Dropdown
                      id={`api-key-actions-${apiKey.id}`}
                      isOpen={openKebabMenus.has(apiKey.id)}
                      onOpenChange={(isOpen) => {
                        if (!isOpen) {
                          setOpenKebabMenus(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(apiKey.id);
                            return newSet;
                          });
                        }
                      }}
                      popperProps={{ position: 'right' }}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          id={`api-key-menu-toggle-${apiKey.id}`}
                          ref={toggleRef}
                          onClick={() => toggleKebabMenu(apiKey.id)}
                          variant="plain"
                          aria-label={`Actions for ${apiKey.name}`}
                          isExpanded={openKebabMenus.has(apiKey.id)}
                        >
                          <EllipsisVIcon />
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem
                          id={`view-details-${apiKey.id}`}
                          key="view-details"
                          onClick={() => handleViewDetails(apiKey)}
                        >
                          View details
                        </DropdownItem>
                        <DropdownItem
                          id={`delete-api-key-${apiKey.id}`}
                          key="delete"
                          onClick={() => handleDeleteAPIKey(apiKey)}
                        >
                          Delete API key
                        </DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      <CreateAPIKeyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <DeleteAPIKeyModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        apiKey={selectedAPIKey}
        onDelete={handleDeleteConfirm}
      />
    </PageSection>
  );
};

export { APIKeys };