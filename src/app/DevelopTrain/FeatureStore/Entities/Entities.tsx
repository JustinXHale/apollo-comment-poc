import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const Entities: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Feature Store - Entities</Content>
    <Content component={ContentVariants.p}>
      Manage and view feature store entities and their configurations.
    </Content>
  </PageSection>
);

export { Entities };
