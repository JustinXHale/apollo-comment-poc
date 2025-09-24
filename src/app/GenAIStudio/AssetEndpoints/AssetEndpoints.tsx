import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const AssetEndpoints: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Gen AI Studio - AI Asset Endpoints</Content>
    <Content component={ContentVariants.p}>
      Configure and manage AI asset endpoints for your generative AI applications.
    </Content>
  </PageSection>
);

export { AssetEndpoints };
