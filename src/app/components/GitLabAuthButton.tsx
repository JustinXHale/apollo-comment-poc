import * as React from 'react';
import { Button, Dropdown, DropdownList, DropdownItem, MenuToggle, Avatar } from '@patternfly/react-core';
import { useGitLabAuth } from '@apollo/commenting-system';

export const GitLabAuthButton: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useGitLabAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  if (!isAuthenticated) {
    return (
      <Button
        variant="secondary"
        onClick={login}
        id="gitlab-login-button"
      >
        Sign in with GitLab
      </Button>
    );
  }

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      toggle={(toggleRef) => (
        <MenuToggle
          ref={toggleRef}
          onClick={() => setIsOpen(!isOpen)}
          isExpanded={isOpen}
          id="gitlab-user-menu-toggle"
        >
          <Avatar src={user?.avatar || ''} alt={user?.username || 'User'} size="sm" />
          <span style={{ marginLeft: '8px' }}>{user?.username || 'GitLab user'}</span>
        </MenuToggle>
      )}
    >
      <DropdownList>
        <DropdownItem key="logout" onClick={logout}>
          Sign out
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );
};


