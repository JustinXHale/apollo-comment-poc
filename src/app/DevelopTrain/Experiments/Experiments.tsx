import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const Experiments: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Experiments</Content>
    <Content component={ContentVariants.p}>
      Design and manage machine learning experiments and trials.
    </Content>
  </PageSection>
);

export { Experiments };
