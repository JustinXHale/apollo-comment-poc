import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const FeatureViews: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Feature Store - Feature Views</Content>
    <Content component={ContentVariants.p}>
      Create and manage feature views for data transformation and feature engineering.
    </Content>
  </PageSection>
);

export { FeatureViews };
