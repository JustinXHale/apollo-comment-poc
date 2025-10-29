import * as React from 'react';
import { Alert, AlertActionCloseButton, AlertGroup } from '@patternfly/react-core';

type ToastVariant = 'success' | 'danger' | 'warning' | 'info' | 'custom';

export interface ToastMessage {
  id: string;
  title: string;
  variant: ToastVariant;
  timeout?: number;
}

interface ToasterContextType {
  showSuccess: (title: string, timeout?: number) => void;
  showError: (title: string, timeout?: number) => void;
  showInfo: (title: string, timeout?: number) => void;
  showWarning: (title: string, timeout?: number) => void;
}

const ToasterContext = React.createContext<ToasterContextType | undefined>(undefined);

export const ToasterProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const addToast = React.useCallback((title: string, variant: ToastVariant, timeout: number = 5000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastMessage = { id, title, variant, timeout };
    
    setToasts(prev => [...prev, newToast]);

    // Auto-remove after timeout
    if (timeout > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, timeout);
    }
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showSuccess = React.useCallback((title: string, timeout?: number) => {
    addToast(title, 'success', timeout);
  }, [addToast]);

  const showError = React.useCallback((title: string, timeout?: number) => {
    addToast(title, 'danger', timeout);
  }, [addToast]);

  const showInfo = React.useCallback((title: string, timeout?: number) => {
    addToast(title, 'info', timeout);
  }, [addToast]);

  const showWarning = React.useCallback((title: string, timeout?: number) => {
    addToast(title, 'warning', timeout);
  }, [addToast]);

  const value = React.useMemo(
    () => ({ showSuccess, showError, showInfo, showWarning }),
    [showSuccess, showError, showInfo, showWarning]
  );

  return (
    <ToasterContext.Provider value={value}>
      {children}
      <AlertGroup isToast isLiveRegion>
        {toasts.map(toast => (
          <Alert
            key={toast.id}
            variant={toast.variant}
            title={toast.title}
            timeout={toast.timeout}
            actionClose={
              <AlertActionCloseButton
                title={toast.title}
                variantLabel={`${toast.variant} alert`}
                onClose={() => removeToast(toast.id)}
              />
            }
            onTimeout={() => removeToast(toast.id)}
          />
        ))}
      </AlertGroup>
    </ToasterContext.Provider>
  );
};

export const useToaster = (): ToasterContextType => {
  const context = React.useContext(ToasterContext);
  if (!context) {
    throw new Error('useToaster must be used within a ToasterProvider');
  }
  return context;
};

