import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const TrainingJobs: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Observe & Monitor - Training Jobs</Content>
    <Content component={ContentVariants.p}>
      Monitor and track the progress of machine learning training jobs.
    </Content>
  </PageSection>
);

export { TrainingJobs };
