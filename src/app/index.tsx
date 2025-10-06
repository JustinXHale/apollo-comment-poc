import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { AppRoutes } from '@app/routes';
import { ThemeProvider } from '@app/utils/ThemeContext';
import { FeatureFlagsProvider } from '@app/utils/FeatureFlagsContext';
import { UserProfileProvider } from '@app/utils/UserProfileContext';
import { AuthGuard, AuthProvider } from '@app/components/AuthGuard';
import '@app/app.css';

const App: React.FunctionComponent = () => (
  <AuthProvider>
    <AuthGuard>
      <FeatureFlagsProvider>
        <UserProfileProvider>
          <ThemeProvider>
            <Router>
              <AppLayout>
                <AppRoutes />
              </AppLayout>
            </Router>
          </ThemeProvider>
        </UserProfileProvider>
      </FeatureFlagsProvider>
    </AuthGuard>
  </AuthProvider>
);

export default App;
