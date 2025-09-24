import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const Evaluations: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Evaluations</Content>
    <Content component={ContentVariants.p}>
      Evaluate and assess model performance and quality metrics.
    </Content>
  </PageSection>
);

export { Evaluations };
