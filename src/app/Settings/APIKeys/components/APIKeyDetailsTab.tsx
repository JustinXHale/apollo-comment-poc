import * as React from 'react';
import {
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  ClipboardCopy,
  Card,
  CardBody,
  PageSection,
} from '@patternfly/react-core';
import { APIKey } from '../types';

interface APIKeyDetailsTabProps {
  apiKey: APIKey;
}

const APIKeyDetailsTab: React.FunctionComponent<APIKeyDetailsTabProps> = ({ apiKey }) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAPIKey = (apiKey: string): string => {
    return apiKey.substring(0, 9) + '••••••••••••••••••••••••••••••••';
  };

  return (
    <PageSection>
      <Card>
        <CardBody>
          <DescriptionList isHorizontal columnModifier={{ default: '2Col' }}>
            <DescriptionListGroup>
              <DescriptionListTerm>Name</DescriptionListTerm>
              <DescriptionListDescription>{apiKey.name}</DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Description</DescriptionListTerm>
              <DescriptionListDescription>
                {apiKey.description || 'No description provided'}
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>API key</DescriptionListTerm>
              <DescriptionListDescription>
                <ClipboardCopy
                  hoverTip="Copy"
                  clickTip="Copied"
                  variant="inline-compact"
                  isReadOnly
                >
                  {formatAPIKey(apiKey.apiKey)}
                </ClipboardCopy>
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Owner</DescriptionListTerm>
              <DescriptionListDescription>
                {apiKey.owner.name} ({apiKey.owner.type})
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Date created</DescriptionListTerm>
              <DescriptionListDescription>
                {formatDate(apiKey.dateCreated)}
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Date last used</DescriptionListTerm>
              <DescriptionListDescription>
                {apiKey.dateLastUsed ? formatDate(apiKey.dateLastUsed) : 'Never used'}
              </DescriptionListDescription>
            </DescriptionListGroup>

            {apiKey.limits?.expirationDate && (
              <DescriptionListGroup>
                <DescriptionListTerm>Expiration date</DescriptionListTerm>
                <DescriptionListDescription>
                  {formatDate(apiKey.limits.expirationDate)}
                </DescriptionListDescription>
              </DescriptionListGroup>
            )}
          </DescriptionList>
        </CardBody>
      </Card>
    </PageSection>
  );
};

export { APIKeyDetailsTab };
