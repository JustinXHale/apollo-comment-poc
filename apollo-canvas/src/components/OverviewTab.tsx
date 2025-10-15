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
  Content,
  Divider,
  Alert,
  AlertActionLink,
  AlertActionCloseButton,
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@patternfly/react-table';
import { ExternalLinkAltIcon, OptimizeIcon } from '@patternfly/react-icons';

const ContextTab: React.FC = () => {
  const [isAlertVisible, setIsAlertVisible] = React.useState(true);

  const jiraLinks = [
    { title: 'RHOAIENG-12345: Feature Implementation', url: '#' },
    { title: 'RHOAIENG-12346: UI Component Updates', url: '#' },
    { title: 'RHOAIENG-12347: User Testing Results', url: '#' },
  ];

  const driveLinks = [
    { title: 'Design Specifications', url: '#' },
    { title: 'User Research Findings', url: '#' },
    { title: 'Product Requirements Document', url: '#' },
    { title: 'Technical Architecture', url: '#' },
  ];

  const slackLinks = [
    { title: '#apollo-canvas-discussion', url: '#' },
    { title: '#design-system-updates', url: '#' },
    { title: '#user-feedback', url: '#' },
  ];

  const renderLinkSection = (title: string, links: Array<{ title: string; url: string }>) => (
    <Card isCompact>
      <CardTitle>
        <Title headingLevel="h3" size="md">
          {title}
        </Title>
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
    <div style={{ padding: '16px 0px', height: '100%', overflow: 'auto' }}>
      <Stack hasGutter>
        <StackItem>
          <Content>
            {isAlertVisible && (
              <Alert
                variant="info"
                isInline
                title="Quick catchup"
                customIcon={<OptimizeIcon />}
                actionClose={<AlertActionCloseButton onClose={() => setIsAlertVisible(false)} />}
                actionLinks={
                  <>
                    <AlertActionLink onClick={() => {}}>
                      Start chat
                    </AlertActionLink>
                    <AlertActionLink onClick={() => {}}>
                      Customize
                    </AlertActionLink>
                  </>
                }
              >
                <p>
                  Since you last visited the team has updated the design twice. The first update improved some confusion around the setup wizard, and the second added a wizard to reboot Panda Stack based on a recent architectural decision for 3.0.
                </p>
                <p>
                  This summary was created for you based on your interests. Some details may be incorrect. Check the Log for more detailed, human-reviewed updates.
                </p>
              </Alert>
            )}
            <Content component="h3">
              What is this?
            </Content>
            <Content component="p">
              This is the AI Assets page that displays a list of model endpoints that the user can consume simply by creating an API key.
            </Content>
            <Content component="h3">
              Why is it needed?
            </Content>
            <Content component="p">
              Making it easier to provide models-as-a-service to internal AI Engineers is one of the top requests we've heard from customers via our field teams. Customers are looking for something that's well-integrated with the rest of the OpenShift platform.
            </Content>
            <Content component="h3">
              Who does it help?
            </Content>
            <Table aria-label="Team members table" variant="compact">
              <Thead>
                <Tr>
                  <Th>Persona</Th>
                  <Th>Need</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    <Button variant="link" isInline component="a" href="#">
                      AI Engineer
                    </Button>
                  </Td>
                  <Td>
                    <Button variant="link" isInline component="a" href="#">
                      Get self-service access to model inference API endpoints without needing to wait for approval.
                    </Button>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Button variant="link" isInline component="a" href="#">
                      AI Platform Engineer
                    </Button>
                  </Td>
                  <Td>
                    <Button variant="link" isInline component="a" href="#">
                      Enable AIEs with self-service access to model inference API endpoints.
                    </Button>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
            <Content component="h3">
              What are we delivering in 3.0?
            </Content>
            <Content component="p">
              3.0 includes a new model deployment wizard that you can access by clicking "Deploy Model" from this page. Not much changes on this list page itself.
            </Content>
            <Content component="h3">
              Who is working on this?
            </Content>
            
            <Table aria-label="Team members table" variant="compact">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Role</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    <Button variant="link" isInline component="a" href="#">
                      Jonathan Zarecki
                    </Button>
                  </Td>
                  <Td>PM</Td>
                </Tr>
                <Tr>
                  <Td>
                    <Button variant="link" isInline component="a" href="#">
                      Alessandro Lazarotti
                    </Button>
                  </Td>
                  <Td>ENG Lead</Td>
                </Tr>
                <Tr>
                  <Td>
                    <Button variant="link" isInline component="a" href="#">
                      Daniele Zonca
                    </Button>
                  </Td>
                  <Td>Architect</Td>
                </Tr>
                <Tr>
                  <Td>
                    <Button variant="link" isInline component="a" href="#">
                      Yuan Tang
                    </Button>
                  </Td>
                  <Td>Staff</Td>
                </Tr>
                <Tr>
                  <Td>
                    <Button variant="link" isInline component="a" href="#">
                      Lindani Phiri
                    </Button>
                  </Td>
                  <Td>Security Architect</Td>
                </Tr>
                <Tr>
                  <Td>
                    <Button variant="link" isInline component="a" href="#">
                      Andy Braren
                    </Button>
                  </Td>
                  <Td>Designer</Td>
                </Tr>
              </Tbody>
            </Table>

          </Content>
        </StackItem>
      </Stack>
    </div>
  );
};

export default ContextTab;
