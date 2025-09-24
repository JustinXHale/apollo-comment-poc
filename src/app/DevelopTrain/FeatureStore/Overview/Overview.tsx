import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const Overview: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Feature Store - Overview</Content>
    <Content component={ContentVariants.p}>
      Overview of the feature store including key metrics and status information.
    </Content>
  </PageSection>
);

export { Overview };
