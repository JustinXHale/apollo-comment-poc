import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const Artifacts: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Pipelines - Artifacts</Content>
    <Content component={ContentVariants.p}>
      View and manage pipeline artifacts and outputs.
    </Content>
  </PageSection>
);

export { Artifacts };
