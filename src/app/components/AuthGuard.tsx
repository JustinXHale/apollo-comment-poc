import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Alert,
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Page,
  PageSection,
  TextInput,
  Title
} from '@patternfly/react-core';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simple password - you can change this or use environment variables
  const DEMO_PASSWORD = 'rhoai2024';

  useEffect(() => {
    // Check if user is already authenticated (stored in localStorage)
    const authStatus = localStorage.getItem('rhoai-auth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (password: string): boolean => {
    if (password === DEMO_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('rhoai-auth', 'authenticated');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('rhoai-auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setError('');
    } else {
      setError('Invalid password. Please try again.');
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <Page>
      <PageSection isFilled style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Card style={{ maxWidth: '400px', width: '100%' }}>
          <CardBody>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Title headingLevel="h1" size="2xl">
                RH Generative AI Dashboard
              </Title>
              <p style={{ marginTop: '0.5rem', color: '#6a6e73' }}>
                Please enter the password to access the dashboard
              </p>
            </div>
            
            {error && (
              <Alert
                variant="danger"
                title={error}
                style={{ marginBottom: '1rem' }}
              />
            )}
            
            <Form onSubmit={handleSubmit}>
              <FormGroup label="Password" isRequired fieldId="password">
                <TextInput
                  isRequired
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(_event, value) => setPassword(value)}
                  placeholder="Enter password"
                />
              </FormGroup>
              <Button type="submit" variant="primary" isBlock>
                Login
              </Button>
            </Form>
            
          </CardBody>
        </Card>
      </PageSection>
    </Page>
  );
}; 