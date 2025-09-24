import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const Playground: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Gen AI Studio - Playground</Content>
    <Content component={ContentVariants.p}>
      Experiment and test with AI models in an interactive playground environment.
    </Content>
  </PageSection>
);

export { Playground };
