import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PageSection,
  Content,
  ContentVariants,
  Tabs,
  Tab,
  TabTitleText,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Flex,
  FlexItem,
  Alert,
  ClipboardCopy,
  PageBreadcrumb,
} from '@patternfly/react-core';
import { ArrowLeftIcon } from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { getAPIKeyById } from './mockData';
import { APIKeyDetailsTab } from './components/APIKeyDetailsTab';
import { APIKeyAssetsTab } from './components/APIKeyAssetsTab';
import { APIKeyMetricsTab } from './components/APIKeyMetricsTab';
import { APIKeyPoliciesTab } from './components/APIKeyPoliciesTab';
import { APIKeySettingsTab } from './components/APIKeySettingsTab';

type TabKey = 'details' | 'assets' | 'metrics' | 'policies' | 'settings';

const APIKeyDetails: React.FunctionComponent = () => {
  const { keyId, tab } = useParams<{ keyId: string; tab?: string }>();
  const navigate = useNavigate();
  const [activeTabKey, setActiveTabKey] = React.useState<TabKey>((tab as TabKey) || 'details');

  useDocumentTitle('API Key Details');

  const apiKey = keyId ? getAPIKeyById(keyId) : undefined;

  React.useEffect(() => {
    if (tab && ['details', 'assets', 'metrics', 'policies', 'settings'].includes(tab)) {
      setActiveTabKey(tab as TabKey);
    }
  }, [tab]);

  const handleTabSelect = (
    _event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    const newTab = tabIndex as TabKey;
    setActiveTabKey(newTab);
    navigate(`/gen-ai-studio/api-keys/${keyId}/${newTab}`, { replace: true });
  };

  const handleBackToList = () => {
    navigate('/gen-ai-studio/api-keys');
  };

  if (!apiKey) {
    return (
      <PageSection>
        <Alert variant="danger" title="API Key not found">
          The requested API key could not be found.
        </Alert>
      </PageSection>
    );
  }

  const formatAPIKey = (apiKey: string): string => {
    return apiKey.substring(0, 9) + '••••••••••••••••••••••••••••••••';
  };

  const breadcrumb = (
    <PageBreadcrumb>
      <Breadcrumb>
        <BreadcrumbItem to="/gen-ai-studio/api-keys">API keys</BreadcrumbItem>
        <BreadcrumbItem isActive>{apiKey.name}</BreadcrumbItem>
      </Breadcrumb>
    </PageBreadcrumb>
  );

  return (
    <>
      {breadcrumb}
      <PageSection>
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
          <FlexItem>
            <Button
              variant="link"
              icon={<ArrowLeftIcon />}
              onClick={handleBackToList}
              isInline
            >
              Back to API keys
            </Button>
          </FlexItem>
          <FlexItem>
            <Content component={ContentVariants.h1}>{apiKey.name}</Content>
            <ClipboardCopy
              hoverTip="Copy"
              clickTip="Copied"
              variant="inline-compact"
              isReadOnly
            >
              {formatAPIKey(apiKey.apiKey)}
            </ClipboardCopy>
          </FlexItem>
        </Flex>
      </PageSection>

      <PageSection type="tabs">
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabSelect}
          aria-label="API Key details tabs"
          role="region"
        >
          <Tab eventKey="details" title={<TabTitleText>Details</TabTitleText>} aria-label="Details tab">
            <APIKeyDetailsTab apiKey={apiKey} />
          </Tab>
          <Tab eventKey="assets" title={<TabTitleText>Assets</TabTitleText>} aria-label="Assets tab">
            <APIKeyAssetsTab apiKey={apiKey} />
          </Tab>
          <Tab eventKey="metrics" title={<TabTitleText>Metrics</TabTitleText>} aria-label="Metrics tab">
            <APIKeyMetricsTab keyId={apiKey.id} />
          </Tab>
          <Tab eventKey="policies" title={<TabTitleText>Policies</TabTitleText>} aria-label="Policies tab">
            <APIKeyPoliciesTab keyId={apiKey.id} />
          </Tab>
          <Tab eventKey="settings" title={<TabTitleText>Settings</TabTitleText>} aria-label="Settings tab">
            <APIKeySettingsTab apiKey={apiKey} />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export { APIKeyDetails };
