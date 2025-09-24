import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const Deployments: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>AI Hub - Deployments</Content>
    <Content component={ContentVariants.p}>
      View and manage AI model deployments.
    </Content>
  </PageSection>
);

export { Deployments };
