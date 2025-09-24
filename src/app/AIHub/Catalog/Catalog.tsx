import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const Catalog: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>AI Hub - Catalog</Content>
    <Content component={ContentVariants.p}>
      Browse and discover AI models, datasets, and other resources.
    </Content>
  </PageSection>
);

export { Catalog };
