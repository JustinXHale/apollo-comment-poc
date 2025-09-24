import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const FeatureServices: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Feature Store - Feature Services</Content>
    <Content component={ContentVariants.p}>
      Manage feature services that provide real-time access to features for model serving.
    </Content>
  </PageSection>
);

export { FeatureServices };
