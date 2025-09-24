import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const WorkloadMetrics: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Observe & Monitor - Workload Metrics</Content>
    <Content component={ContentVariants.p}>
      Monitor workload performance and resource utilization metrics.
    </Content>
  </PageSection>
);

export { WorkloadMetrics };
