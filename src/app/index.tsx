import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { AppRoutes } from '@app/routes';
import { ThemeProvider } from '@app/utils/ThemeContext';
import { FeatureFlagsProvider } from '@app/utils/FeatureFlagsContext';
import { UserProfileProvider } from '@app/utils/UserProfileContext';
import { CommentProvider } from '@app/context/CommentContext';
import { ToasterProvider } from '@app/utils/ToasterContext';
import { GitHubAuthProvider } from '@app/contexts/GitHubAuthContext';
import '@app/app.css';

const App: React.FunctionComponent = () => (
  <FeatureFlagsProvider>
    <UserProfileProvider>
      <ThemeProvider>
        <ToasterProvider>
          <GitHubAuthProvider>
            <CommentProvider>
              <Router>
                <AppLayout>
                  <AppRoutes />
                </AppLayout>
              </Router>
            </CommentProvider>
          </GitHubAuthProvider>
        </ToasterProvider>
      </ThemeProvider>
    </UserProfileProvider>
  </FeatureFlagsProvider>
);

export default App;
