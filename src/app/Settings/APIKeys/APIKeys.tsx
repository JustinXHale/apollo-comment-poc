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
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ActionsColumn,
  IAction,
} from '@patternfly/react-table';
import { PlusIcon } from '@patternfly/react-icons';
import { mockAPIKeys, getModelById, getMCPServerById, getVectorDatabaseById, getAgentById } from './mockData';
import { APIKey } from './types';
import { CreateAPIKeyModal } from './components/CreateAPIKeyModal';

const APIKeys: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

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

  const rowActions = (apiKey: APIKey): IAction[] => [
    {
      title: 'View details',
      onClick: () => navigate(`/gen-ai-studio/api-keys/${apiKey.id}`),
    },
    {
      title: 'Edit',
      onClick: () => {
        // TODO: Implement edit functionality
        console.log('Edit', apiKey.id);
      },
    },
    {
      isSeparator: true,
    },
    {
      title: 'Delete',
      onClick: () => {
        // TODO: Implement delete functionality
        console.log('Delete', apiKey.id);
      },
    },
  ];

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
        Browse endpoints for available models and MCP servers.
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
                <Th>API Key</Th>
                <Th>Assets</Th>
                <Th>Owner</Th>
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
                  <Td dataLabel="API Key">
                    <code>{formatAPIKey(apiKey.apiKey)}</code>
                  </Td>
                  <Td dataLabel="Assets">
                    {getAssetsSummary(apiKey)}
                  </Td>
                  <Td dataLabel="Owner">
                    {getOwnerDisplay(apiKey.owner)}
                  </Td>
                  <Td isActionCell>
                    <ActionsColumn 
                      items={rowActions(apiKey)}
                      onClick={(e) => e.stopPropagation()} // Prevent row click when clicking actions
                    />
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
    </PageSection>
  );
};

export { APIKeys };