import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const DataSources: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Feature Store - Data Sources</Content>
    <Content component={ContentVariants.p}>
      Configure and manage data sources for the feature store.
    </Content>
  </PageSection>
);

export { DataSources };
