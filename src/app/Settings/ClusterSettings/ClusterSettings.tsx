import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const ClusterSettings: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Settings - Cluster Settings</Content>
    <Content component={ContentVariants.p}>
      Configure general cluster settings and storage classes.
    </Content>
  </PageSection>
);

export { ClusterSettings };
