import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const LearningResources: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Learning Resources</Content>
    <Content component={ContentVariants.p}>
      Access tutorials, documentation, and educational materials for AI and machine learning.
    </Content>
  </PageSection>
);

export { LearningResources };
