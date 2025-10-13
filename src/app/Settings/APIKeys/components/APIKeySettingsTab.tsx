import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardTitle,
  CardBody,
  Button,
  Flex,
  FlexItem,
  PageSection,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { APIKey } from '../types';
import { DeleteAPIKeyModal } from './DeleteAPIKeyModal';

interface APIKeySettingsTabProps {
  apiKey: APIKey;
}

const APIKeySettingsTab: React.FunctionComponent<APIKeySettingsTabProps> = ({ apiKey }) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Navigate back to API keys list after deletion
    navigate('/gen-ai-studio/api-keys');
  };

  return (
    <>
      <PageSection>
        <Card>
          <CardTitle>
            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <ExclamationTriangleIcon style={{ color: 'var(--pf-t--global--icon--color--status--danger--default)' }} />
              </FlexItem>
              <FlexItem>
                Danger Zone
              </FlexItem>
            </Flex>
          </CardTitle>
          <CardBody>
            <p style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
              Permanently delete this API key. This action cannot be undone and will immediately revoke access for any applications using this key.
            </p>
            <Button 
              id="delete-api-key-button"
              variant="danger"
              onClick={handleDeleteClick}
            >
              Delete API key
            </Button>
          </CardBody>
        </Card>
      </PageSection>

      <DeleteAPIKeyModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        apiKey={apiKey}
        onDelete={handleDeleteConfirm}
      />
    </>
  );
};

export { APIKeySettingsTab };
