import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const Home: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Home</Content>
    <Content component={ContentVariants.p}>
      Welcome to the RHOAI 3.2 Dashboard home page.
    </Content>
  </PageSection>
);

export { Home };
