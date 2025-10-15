import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
  Card,
  CardBody,
  FormGroup,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { mockAPIKeys } from '@app/Settings/APIKeys/mockData';

const Playground: React.FunctionComponent = () => {
  const [selectedModel, setSelectedModel] = React.useState('');
  const [selectedAPIKey, setSelectedAPIKey] = React.useState('playground-free');
  const [isModelSelectOpen, setIsModelSelectOpen] = React.useState(false);
  const [isAPIKeySelectOpen, setIsAPIKeySelectOpen] = React.useState(false);

  const models = [
    { id: 'gpt-oss-20b', name: 'GPT-OSS 20B' },
    { id: 'granite-3.1b', name: 'Granite 3.1B' },
    { id: 'llama-7b', name: 'Llama 7B' },
  ];

  // Create API key options from mock data, plus the free playground key
  const apiKeyOptions = [
    { id: 'playground-free', name: 'Playground key (free)' },
    ...mockAPIKeys
      .filter(key => key.status === 'Active')
      .map(key => ({ id: key.id, name: key.name }))
  ];

  return (
    <PageSection>
      <Content component={ContentVariants.h1}>Playground</Content>
      <Content component={ContentVariants.p}>
        Experiment and test with AI models in an interactive playground environment.
      </Content>

      <Card style={{ marginTop: '2rem' }}>
        <CardBody>
          <Grid hasGutter>
            <GridItem span={6}>
              <FormGroup label="Model" fieldId="model-select">
                <Select
                  id="model-select"
                  isOpen={isModelSelectOpen}
                  selected={selectedModel}
                  onSelect={(_event, value) => {
                    setSelectedModel(value as string);
                    setIsModelSelectOpen(false);
                  }}
                  onOpenChange={(isOpen) => setIsModelSelectOpen(isOpen)}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsModelSelectOpen(!isModelSelectOpen)}
                      isExpanded={isModelSelectOpen}
                      style={{ width: '100%' }}
                      id="model-select-toggle"
                    >
                      {selectedModel 
                        ? models.find(m => m.id === selectedModel)?.name 
                        : 'Select a model'}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    {models.map((model) => (
                      <SelectOption key={model.id} value={model.id}>
                        {model.name}
                      </SelectOption>
                    ))}
                  </SelectList>
                </Select>
              </FormGroup>
            </GridItem>

            <GridItem span={6}>
              <FormGroup label="API key" fieldId="api-key-select">
                <Select
                  id="api-key-select"
                  isOpen={isAPIKeySelectOpen}
                  selected={selectedAPIKey}
                  onSelect={(_event, value) => {
                    setSelectedAPIKey(value as string);
                    setIsAPIKeySelectOpen(false);
                  }}
                  onOpenChange={(isOpen) => setIsAPIKeySelectOpen(isOpen)}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsAPIKeySelectOpen(!isAPIKeySelectOpen)}
                      isExpanded={isAPIKeySelectOpen}
                      style={{ width: '100%' }}
                      id="api-key-select-toggle"
                    >
                      {apiKeyOptions.find(k => k.id === selectedAPIKey)?.name || 'Select an API key'}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    {apiKeyOptions.map((apiKey) => (
                      <SelectOption key={apiKey.id} value={apiKey.id}>
                        {apiKey.name}
                      </SelectOption>
                    ))}
                  </SelectList>
                </Select>
              </FormGroup>
            </GridItem>
          </Grid>

          <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: '#f5f5f5', borderRadius: '4px', textAlign: 'center' }}>
            <p style={{ color: '#6a6e73' }}>
              Playground chat interface will appear here
            </p>
          </div>
        </CardBody>
      </Card>
    </PageSection>
  );
};

export { Playground };
