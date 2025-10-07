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
import { mockPolicies, getGroupById, getUserById, getServiceAccountById } from './mockData';
import { Policy } from './types';
import { CreatePolicyModal } from './components/CreatePolicyModal';

const Policies: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const getTargetsSummary = (policy: Policy): React.ReactNode => {
    const totalTargets = 
      policy.targets.groups.length +
      policy.targets.users.length +
      policy.targets.serviceAccounts.length;

    if (totalTargets === 0) {
      return <span>No targets</span>;
    }

    return (
      <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
        {policy.targets.groups.length > 0 && (
          <FlexItem>
            <Badge isRead>{policy.targets.groups.length} Groups</Badge>
          </FlexItem>
        )}
        {policy.targets.users.length > 0 && (
          <FlexItem>
            <Badge isRead>{policy.targets.users.length} Users</Badge>
          </FlexItem>
        )}
        {policy.targets.serviceAccounts.length > 0 && (
          <FlexItem>
            <Badge isRead>{policy.targets.serviceAccounts.length} Service Accounts</Badge>
          </FlexItem>
        )}
      </Flex>
    );
  };

  const getRulesSummary = (policy: Policy): React.ReactNode => {
    const rules: string[] = [];
    
    if (policy.limits.tokenLimit) {
      rules.push(`Token limit: ${policy.limits.tokenLimit.amount}/${policy.limits.tokenLimit.period}`);
    }
    
    if (policy.limits.rateLimit) {
      rules.push(`Rate limit: ${policy.limits.rateLimit.amount}/${policy.limits.rateLimit.period}`);
    }
    
    if (policy.limits.timeLimit) {
      rules.push('Time limit');
    }

    if (rules.length === 0) {
      return <span>No limits</span>;
    }

    return (
      <Flex direction={{ default: 'column' }}>
        {rules.map((rule, index) => (
          <FlexItem key={index}>
            <span style={{ fontSize: '0.875rem' }}>{rule}</span>
          </FlexItem>
        ))}
      </Flex>
    );
  };

  const rowActions = (policy: Policy): IAction[] => [
    {
      title: 'View details',
      onClick: () => navigate(`/settings/policies/${policy.id}`),
    },
    {
      title: 'Edit',
      onClick: () => {
        // TODO: Implement edit functionality
        console.log('Edit', policy.id);
      },
    },
    {
      isSeparator: true,
    },
    {
      title: policy.status === 'Active' ? 'Deactivate' : 'Activate',
      onClick: () => {
        // TODO: Implement toggle status functionality
        console.log('Toggle status', policy.id);
      },
    },
    {
      title: 'Delete',
      onClick: () => {
        // TODO: Implement delete functionality
        console.log('Delete', policy.id);
      },
    },
  ];

  const handleCreatePolicy = () => {
    setIsCreateModalOpen(true);
  };

  const handleRowClick = (policy: Policy) => {
    navigate(`/settings/policies/${policy.id}`);
  };

  return (
    <PageSection>
      <Content component={ContentVariants.h1}>Policies</Content>
      <Content component={ContentVariants.p}>
        Manage access policies, rate limits, and usage controls for AI assets.
      </Content>
      
      <Card>
        <CardBody>
          <Toolbar id="policies-toolbar">
            <ToolbarContent>
              <ToolbarItem>
                <Button 
                  variant="primary" 
                  icon={<PlusIcon />}
                  onClick={handleCreatePolicy}
                  id="create-policy-button"
                >
                  Create policy
                </Button>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table aria-label="Policies table" id="policies-table">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Status</Th>
                <Th>Targets</Th>
                <Th>Rules</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockPolicies.map((policy) => (
                <Tr 
                  key={policy.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRowClick(policy)}
                >
                  <Td dataLabel="Name">
                    <div>
                      <strong>{policy.name}</strong>
                      {policy.description && (
                        <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
                          {policy.description}
                        </div>
                      )}
                    </div>
                  </Td>
                  <Td dataLabel="Status">
                    <Badge 
                      id={`policy-status-${policy.id}`}
                      isRead={policy.status === 'Inactive'}
                    >
                      {policy.status}
                    </Badge>
                  </Td>
                  <Td dataLabel="Targets">
                    {getTargetsSummary(policy)}
                  </Td>
                  <Td dataLabel="Rules">
                    {getRulesSummary(policy)}
                  </Td>
                  <Td isActionCell>
                    <ActionsColumn 
                      items={rowActions(policy)}
                      onClick={(e) => e.stopPropagation()} // Prevent row click when clicking actions
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      <CreatePolicyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </PageSection>
  );
};

export { Policies };


