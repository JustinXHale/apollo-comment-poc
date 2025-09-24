import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardTitle,
  CardBody,
  Button,
  Modal,
  ModalVariant,
  Form,
  FormGroup,
  TextInput,
  Title,
  Alert,
  ActionGroup,
  Flex,
  FlexItem,
  PageSection,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { APIKey } from '../types';

interface APIKeySettingsTabProps {
  apiKey: APIKey;
}

const APIKeySettingsTab: React.FunctionComponent<APIKeySettingsTabProps> = ({ apiKey }) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setDeleteConfirmation('');
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmation !== apiKey.name) {
      return;
    }

    setIsDeleting(true);
    // Simulate deletion API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate back to API keys list
    navigate('/gen-ai-studio/api-keys');
  };

  const isDeleteEnabled = deleteConfirmation === apiKey.name && !isDeleting;

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
              variant="danger"
              onClick={handleDeleteClick}
            >
              Delete API key
            </Button>
          </CardBody>
        </Card>
      </PageSection>

      <Modal
        variant={ModalVariant.small}
        title="Delete API key"
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        appendTo={document.body}
      >
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
          <FlexItem>
            <Alert
              variant="danger"
              title="This action cannot be undone"
              isInline
            >
              Deleting this API key will immediately revoke access for any applications currently using it.
            </Alert>
          </FlexItem>
          
          <FlexItem>
            <p>
              To confirm deletion, type the API key name below:
            </p>
            <p style={{ fontFamily: 'monospace', padding: 'var(--pf-t--global--spacer--sm)', backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', borderRadius: 'var(--pf-t--global--border--radius--small)' }}>
              {apiKey.name}
            </p>
          </FlexItem>
          
          <FlexItem>
            <Form>
              <FormGroup label="API key name" isRequired>
                <TextInput
                  value={deleteConfirmation}
                  onChange={(_event, value) => setDeleteConfirmation(value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && isDeleteEnabled) {
                      handleDeleteConfirm();
                    }
                  }}
                  placeholder="Enter API key name to confirm"
                  isDisabled={isDeleting}
                />
              </FormGroup>
            </Form>
          </FlexItem>
          
          <FlexItem>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button
                variant="danger"
                onClick={handleDeleteConfirm}
                isDisabled={!isDeleteEnabled}
                isLoading={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Confirm'}
              </Button>
              <Button
                variant="link"
                onClick={handleDeleteCancel}
                isDisabled={isDeleting}
              >
                Cancel
              </Button>
            </div>
          </FlexItem>
        </Flex>
      </Modal>
    </>
  );
};

export { APIKeySettingsTab };
