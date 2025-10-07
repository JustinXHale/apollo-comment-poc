import * as React from 'react';
import {
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Card,
  CardBody,
  PageSection,
  Badge,
  Flex,
  FlexItem,
  Content,
  ContentVariants,
} from '@patternfly/react-core';
import { Policy } from '../types';
import { getGroupById, getUserById, getServiceAccountById } from '../mockData';
import { getModelById, getMCPServerById } from '@app/Settings/APIKeys/mockData';

interface PolicyDetailsTabProps {
  policy: Policy;
}

const PolicyDetailsTab: React.FunctionComponent<PolicyDetailsTabProps> = ({ policy }) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderAssetsList = (assetIds: string[], getAssetFn: (id: string) => any | undefined, assetType: string) => {
    if (assetIds.includes('all')) {
      return <Badge isRead>All {assetType}</Badge>;
    }
    
    if (assetIds.length === 0) {
      return <span>No {assetType}</span>;
    }

    return (
      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXs' }}>
        {assetIds.map(id => {
          const asset = getAssetFn(id);
          return asset ? (
            <FlexItem key={id}>{asset.name}</FlexItem>
          ) : (
            <FlexItem key={id}>{id}</FlexItem>
          );
        })}
      </Flex>
    );
  };

  const renderTargetsList = (targetIds: string[], getTargetFn: (id: string) => any | undefined, targetType: string) => {
    if (targetIds.length === 0) {
      return <span>No {targetType}</span>;
    }

    return (
      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXs' }}>
        {targetIds.map(id => {
          const target = getTargetFn(id);
          return target ? (
            <FlexItem key={id}>{target.name}</FlexItem>
          ) : (
            <FlexItem key={id}>{id}</FlexItem>
          );
        })}
      </Flex>
    );
  };

  const renderLimits = () => {
    const hasLimits = policy.limits.tokenLimit || policy.limits.rateLimit || policy.limits.timeLimit;
    
    if (!hasLimits) {
      return <span>No limits configured</span>;
    }

    return (
      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
        {policy.limits.tokenLimit && (
          <FlexItem>
            <strong>Token limit:</strong> {policy.limits.tokenLimit.amount.toLocaleString()} tokens per {policy.limits.tokenLimit.period}
          </FlexItem>
        )}
        {policy.limits.rateLimit && (
          <FlexItem>
            <strong>Rate limit:</strong> {policy.limits.rateLimit.amount.toLocaleString()} requests per {policy.limits.rateLimit.period}
          </FlexItem>
        )}
        {policy.limits.timeLimit && (
          <FlexItem>
            <strong>Time limit:</strong> {formatDate(policy.limits.timeLimit.start)} to {formatDate(policy.limits.timeLimit.end)}
          </FlexItem>
        )}
      </Flex>
    );
  };

  return (
    <PageSection>
      <Card>
        <CardBody>
          <DescriptionList isHorizontal columnModifier={{ default: '2Col' }}>
            <DescriptionListGroup>
              <DescriptionListTerm>Name</DescriptionListTerm>
              <DescriptionListDescription>{policy.name}</DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Description</DescriptionListTerm>
              <DescriptionListDescription>
                {policy.description || 'No description provided'}
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Status</DescriptionListTerm>
              <DescriptionListDescription>
                <Badge isRead={policy.status === 'Inactive'}>
                  {policy.status}
                </Badge>
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Date created</DescriptionListTerm>
              <DescriptionListDescription>
                {formatDate(policy.dateCreated)}
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Created by</DescriptionListTerm>
              <DescriptionListDescription>
                {policy.createdBy}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </CardBody>
      </Card>

      {/* Available Assets Section */}
      <Card style={{ marginTop: '1rem' }}>
        <CardBody>
          <Content component={ContentVariants.h3} style={{ marginBottom: '1rem' }}>
            Available assets
          </Content>
          <DescriptionList isHorizontal columnModifier={{ default: '2Col' }}>
            <DescriptionListGroup>
              <DescriptionListTerm>Models</DescriptionListTerm>
              <DescriptionListDescription>
                {renderAssetsList(policy.availableAssets.models, getModelById, 'models')}
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>MCP Servers</DescriptionListTerm>
              <DescriptionListDescription>
                {renderAssetsList(policy.availableAssets.mcpServers, getMCPServerById, 'MCP servers')}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </CardBody>
      </Card>

      {/* Limits Section */}
      <Card style={{ marginTop: '1rem' }}>
        <CardBody>
          <Content component={ContentVariants.h3} style={{ marginBottom: '1rem' }}>
            Limits
          </Content>
          <DescriptionList>
            <DescriptionListGroup>
              <DescriptionListTerm>Configured limits</DescriptionListTerm>
              <DescriptionListDescription>
                {renderLimits()}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </CardBody>
      </Card>

      {/* Targets Section */}
      <Card style={{ marginTop: '1rem' }}>
        <CardBody>
          <Content component={ContentVariants.h3} style={{ marginBottom: '1rem' }}>
            Targets
          </Content>
          <DescriptionList isHorizontal columnModifier={{ default: '2Col' }}>
            <DescriptionListGroup>
              <DescriptionListTerm>Groups</DescriptionListTerm>
              <DescriptionListDescription>
                {renderTargetsList(policy.targets.groups, getGroupById, 'groups')}
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Users</DescriptionListTerm>
              <DescriptionListDescription>
                {renderTargetsList(policy.targets.users, getUserById, 'users')}
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Service Accounts</DescriptionListTerm>
              <DescriptionListDescription>
                {renderTargetsList(policy.targets.serviceAccounts, getServiceAccountById, 'service accounts')}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </CardBody>
      </Card>
    </PageSection>
  );
};

export { PolicyDetailsTab };


