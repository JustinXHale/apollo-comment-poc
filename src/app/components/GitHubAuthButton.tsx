import * as React from 'react';
import { Button, Avatar, Dropdown, DropdownList, DropdownItem, MenuToggle } from '@patternfly/react-core';
import { GithubIcon } from '@patternfly/react-icons';
import { useGitHubAuth } from '@app/commenting-system';

export const GitHubAuthButton: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useGitHubAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  if (!isAuthenticated) {
    return (
      <Button
        variant="secondary"
        icon={<GithubIcon />}
        onClick={login}
        id="github-login-button"
      >
        Sign in with GitHub
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
          id="github-user-menu-toggle"
        >
          <Avatar src={user?.avatar || ''} alt={user?.login || 'User'} size="sm" />
          <span style={{ marginLeft: '8px' }}>{user?.login || 'User'}</span>
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

