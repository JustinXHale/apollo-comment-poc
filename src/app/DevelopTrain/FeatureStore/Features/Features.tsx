import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const Features: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Feature Store - Features</Content>
    <Content component={ContentVariants.p}>
      Browse and manage individual features in the feature store.
    </Content>
  </PageSection>
);

export { Features };
