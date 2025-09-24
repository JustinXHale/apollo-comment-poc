import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const Registry: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Registry</Content>
    <Content component={ContentVariants.p}>
      Manage your AI model registry and versions.
    </Content>
  </PageSection>
);

export { Registry };
