import * as React from 'react';
import {
  EmptyState,
  EmptyStateBody,
  Title,
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
} from '@patternfly/react-table';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { getAPIKeyPolicies } from '../mockData';

interface APIKeyPoliciesTabProps {
  keyId: string;
}

const APIKeyPoliciesTab: React.FunctionComponent<APIKeyPoliciesTabProps> = ({ keyId }) => {
  const policies = getAPIKeyPolicies(keyId);

  if (policies.length === 0) {
    return (
      <PageSection>
        <Card>
          <CardBody>
            <EmptyState>
              <ExclamationTriangleIcon />
              <Title headingLevel="h4" size="lg">
                No policies applied
              </Title>
              <EmptyStateBody>
                This API key does not have any policies applied. Contact your platform administrator to apply policies.
              </EmptyStateBody>
            </EmptyState>
          </CardBody>
        </Card>
      </PageSection>
    );
  }

  return (
    <PageSection>
      <Card>
        <CardBody>
          <Table aria-label="Policies table">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>ID</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>
            <Tbody>
              {policies.map((policy) => (
                <Tr key={policy.id}>
                  <Td dataLabel="Name">{policy.name}</Td>
                  <Td dataLabel="ID">
                    <code>{policy.id}</code>
                  </Td>
                  <Td dataLabel="Description">{policy.description}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </PageSection>
  );
};

export { APIKeyPoliciesTab };
