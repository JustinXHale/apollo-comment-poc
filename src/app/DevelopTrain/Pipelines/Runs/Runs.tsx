import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const Runs: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Pipelines - Runs</Content>
    <Content component={ContentVariants.p}>
      Monitor and manage pipeline execution runs.
    </Content>
  </PageSection>
);

export { Runs };
