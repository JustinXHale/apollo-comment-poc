import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const StorageClasses: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Cluster Settings - Storage Classes</Content>
    <Content component={ContentVariants.p}>
      Configure and manage storage classes for your cluster.
    </Content>
  </PageSection>
);

export { StorageClasses };
