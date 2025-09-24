import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const Projects: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Projects</Content>
    <Content component={ContentVariants.p}>
      Manage your data science projects and workspaces.
    </Content>
  </PageSection>
);

export { Projects };
