import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const APIKeys: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Settings - API Keys</Content>
    <Content component={ContentVariants.p}>
      Manage API keys for authentication and authorization to access services and resources.
    </Content>
  </PageSection>
);

export { APIKeys };
