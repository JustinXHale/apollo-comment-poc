import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const DataSets: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Feature Store - Data Sets</Content>
    <Content component={ContentVariants.p}>
      Manage data sets used in the feature store for feature engineering.
    </Content>
  </PageSection>
);

export { DataSets };
