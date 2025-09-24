import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const Workbenches: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Develop & Train - Workbenches</Content>
    <Content component={ContentVariants.p}>
      Create and manage development workbenches for data science projects.
    </Content>
  </PageSection>
);

export { Workbenches };
