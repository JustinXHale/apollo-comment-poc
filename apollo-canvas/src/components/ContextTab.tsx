import React from 'react';
import {
  Card,
  CardTitle,
  CardBody,
  Stack,
  StackItem,
  Title,
  List,
  ListItem,
  Button,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { 
  ExternalLinkAltIcon,
  FolderIcon,
  ClipboardCheckIcon,
  ChatIcon
} from '@patternfly/react-icons';

const ContextTab: React.FC = () => {
  const jiraLinks = [
    { title: 'RHOAIENG-12345: Feature Implementation', url: '#' },
    { title: 'RHOAIENG-12346: UI Component Updates', url: '#' },
    { title: 'RHOAIENG-12347: User Testing Results', url: '#' },
  ];

  const driveLinks = [
    { title: 'Red Hat AI 6-pager', url: '#' },
    { title: 'MaaS Worksheet', url: '#' },
    { title: 'MaaS Product Definition', url: '#' },
    { title: 'Maas Architecture', url: '#' },
    { title: 'Observability Worksheet', url: '#' },
  ];

  const slackLinks = [
    { title: '#forum-openshift-ai', url: '#' },
    { title: '#wg-ai-hub-x-gen-ai-studio', url: '#' },
    { title: '#wg-rhoai-observability-ux', url: '#' },
  ];

  const renderLinkSection = (
    title: string, 
    links: Array<{ title: string; url: string }>,
    icon?: React.ReactNode
  ) => (
    <Card isCompact>
      <CardTitle>
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          {icon && <FlexItem>{icon}</FlexItem>}
          <FlexItem>
            <Title headingLevel="h3" size="md">
              {title}
            </Title>
          </FlexItem>
        </Flex>
      </CardTitle>
      <CardBody>
        <List isPlain>
          {links.map((link, index) => (
            <ListItem key={index}>
              <Button
                variant="link"
                isInline
                icon={<ExternalLinkAltIcon />}
                iconPosition="end"
                component="a"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.title}
              </Button>
            </ListItem>
          ))}
        </List>
      </CardBody>
    </Card>
  );

  return (
    <div style={{ padding: '16px', height: '100%', overflow: 'auto' }}>
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h2" size="lg">
            Sources
          </Title>
        </StackItem>
        <StackItem>
          {renderLinkSection('Jira', jiraLinks, <ClipboardCheckIcon />)}
        </StackItem>
        <StackItem>
          {renderLinkSection('Drive', driveLinks, <FolderIcon />)}
        </StackItem>
        <StackItem>
          {renderLinkSection('Slack', slackLinks, <ChatIcon />)}
        </StackItem>
      </Stack>
    </div>
  );
};

export default ContextTab;
