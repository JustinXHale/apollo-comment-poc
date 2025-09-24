import * as React from 'react';
import {
  Flex,
  FlexItem,
  ExpandableSection,
  Badge,
  PageSection,
  Card,
  CardBody,
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
import { APIKey } from '../types';
import { 
  getModelById, 
  getMCPServerById, 
  getVectorDatabaseById, 
  getAgentById 
} from '../mockData';

interface APIKeyAssetsTabProps {
  apiKey: APIKey;
}

const APIKeyAssetsTab: React.FunctionComponent<APIKeyAssetsTabProps> = ({ apiKey }) => {
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    models: true,
    mcpServers: true,
    vectorDatabases: true,
    agents: true,
  });

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Action handlers for different asset types
  const handleViewDetails = (assetType: string, assetId: string) => {
    // TODO: Navigate to asset details page
    console.log(`View details for ${assetType}:`, assetId);
  };

  const handleTryInPlayground = (assetType: string, assetId: string) => {
    // TODO: Navigate to playground with asset preloaded
    console.log(`Try in playground for ${assetType}:`, assetId);
  };

  // Action items for models
  const getModelActions = (modelId: string): IAction[] => [
    {
      title: 'View details',
      onClick: () => handleViewDetails('model', modelId),
    },
    {
      title: 'Try in Playground',
      onClick: () => handleTryInPlayground('model', modelId),
    },
  ];

  // Action items for MCP servers
  const getMCPServerActions = (serverId: string): IAction[] => [
    {
      title: 'View details',
      onClick: () => handleViewDetails('mcp-server', serverId),
    },
    {
      title: 'Try in Playground',
      onClick: () => handleTryInPlayground('mcp-server', serverId),
    },
  ];

  // Action items for vector databases
  const getVectorDatabaseActions = (dbId: string): IAction[] => [
    {
      title: 'View details',
      onClick: () => handleViewDetails('vector-database', dbId),
    },
    {
      title: 'Try in Playground',
      onClick: () => handleTryInPlayground('vector-database', dbId),
    },
  ];

  // Action items for agents
  const getAgentActions = (agentId: string): IAction[] => [
    {
      title: 'View details',
      onClick: () => handleViewDetails('agent', agentId),
    },
    {
      title: 'Try in Playground',
      onClick: () => handleTryInPlayground('agent', agentId),
    },
  ];

  return (
    <PageSection>
      <Card>
        <CardBody>
          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
            {/* Models Section */}
            <FlexItem>
              <ExpandableSection
                toggleText={`Models (${apiKey.assets.modelEndpoints.length})`}
                isExpanded={expandedSections.models}
                onToggle={() => toggleSection('models')}
              >
                {apiKey.assets.modelEndpoints.length > 0 ? (
                  <Table aria-label="Models table">
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th>ID</Th>
                        <Th>Endpoint</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {apiKey.assets.modelEndpoints.map((modelId) => {
                        const model = getModelById(modelId);
                        return model ? (
                          <Tr key={model.id}>
                            <Td dataLabel="Name">
                              <a href="#">{model.name}</a>
                            </Td>
                            <Td dataLabel="ID">
                              <a href="#"><code>{model.id}</code></a>
                            </Td>
                            <Td dataLabel="Endpoint">
                              <code>{model.endpoint}</code>
                            </Td>
                            <Td isActionCell>
                              <ActionsColumn items={getModelActions(model.id)} />
                            </Td>
                          </Tr>
                        ) : null;
                      })}
                    </Tbody>
                  </Table>
                ) : (
                  <div>No models assigned to this API key</div>
                )}
              </ExpandableSection>
            </FlexItem>

            {/* MCP Servers Section */}
            <FlexItem>
              <ExpandableSection
                toggleText={`MCP Servers & tools (${apiKey.assets.mcpServers.length})`}
                isExpanded={expandedSections.mcpServers}
                onToggle={() => toggleSection('mcpServers')}
              >
                {apiKey.assets.mcpServers.length > 0 ? (
                  <Table aria-label="MCP Servers table">
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th>Tools</Th>
                        <Th>Endpoint</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {apiKey.assets.mcpServers.map((serverId) => {
                        const server = getMCPServerById(serverId);
                        return server ? (
                          <Tr key={server.id}>
                            <Td dataLabel="Name">{server.name}</Td>
                            <Td dataLabel="Tools">
                              <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                                {server.tools.map((tool) => (
                                  <FlexItem key={tool}>
                                    <Badge isRead>{tool}</Badge>
                                  </FlexItem>
                                ))}
                              </Flex>
                            </Td>
                            <Td dataLabel="Endpoint">
                              <code>{server.endpoint}</code>
                            </Td>
                            <Td isActionCell>
                              <ActionsColumn items={getMCPServerActions(server.id)} />
                            </Td>
                          </Tr>
                        ) : null;
                      })}
                    </Tbody>
                  </Table>
                ) : (
                  <div>No MCP servers assigned to this API key</div>
                )}
              </ExpandableSection>
            </FlexItem>

            {/* Vector Databases Section */}
            <FlexItem>
              <ExpandableSection
                toggleText={`Vector Databases (${apiKey.assets.vectorDatabases.length})`}
                isExpanded={expandedSections.vectorDatabases}
                onToggle={() => toggleSection('vectorDatabases')}
              >
                {apiKey.assets.vectorDatabases.length > 0 ? (
                  <Table aria-label="Vector Databases table">
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th>Size</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {apiKey.assets.vectorDatabases.map((dbId) => {
                        const db = getVectorDatabaseById(dbId);
                        return db ? (
                          <Tr key={db.id}>
                            <Td dataLabel="Name">{db.name}</Td>
                            <Td dataLabel="Size">{db.size}</Td>
                            <Td isActionCell>
                              <ActionsColumn items={getVectorDatabaseActions(db.id)} />
                            </Td>
                          </Tr>
                        ) : null;
                      })}
                    </Tbody>
                  </Table>
                ) : (
                  <div>No vector databases assigned to this API key</div>
                )}
              </ExpandableSection>
            </FlexItem>

            {/* Agents Section */}
            <FlexItem>
              <ExpandableSection
                toggleText={`Agents (${apiKey.assets.agents.length})`}
                isExpanded={expandedSections.agents}
                onToggle={() => toggleSection('agents')}
              >
                {apiKey.assets.agents.length > 0 ? (
                  <Table aria-label="Agents table">
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th>Endpoint</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {apiKey.assets.agents.map((agentId) => {
                        const agent = getAgentById(agentId);
                        return agent ? (
                          <Tr key={agent.id}>
                            <Td dataLabel="Name">{agent.name}</Td>
                            <Td dataLabel="Endpoint">
                              <code>{agent.endpoint}</code>
                            </Td>
                            <Td isActionCell>
                              <ActionsColumn items={getAgentActions(agent.id)} />
                            </Td>
                          </Tr>
                        ) : null;
                      })}
                    </Tbody>
                  </Table>
                ) : (
                  <div>No agents assigned to this API key</div>
                )}
              </ExpandableSection>
            </FlexItem>
          </Flex>
        </CardBody>
      </Card>
    </PageSection>
  );
};

export { APIKeyAssetsTab };
