import * as React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  Label,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  MastheadToggle,
  MenuToggle,
  MenuToggleElement,
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  Page,
  PageSidebar,
  PageSidebarBody,
  SkipToContent,
  Tooltip
} from '@patternfly/react-core';
import { IAppRoute, IAppRouteGroup, routes, AppRouteConfig, filterRoutesByFlags } from '@app/routes';
import { BarsIcon, BellIcon, CaretDownIcon, CogIcon, FlagIcon, InfoCircleIcon, MoonIcon, SunIcon, TrashIcon, UserIcon } from '@patternfly/react-icons';
import { useTheme } from '@app/utils/ThemeContext';
import { useUserProfile } from '@app/utils/UserProfileContext';
import { useFeatureFlags } from '@app/utils/FeatureFlagsContext';
// Import custom logos
import LightLogo from '@app/bgimages/Product_Logos_Light.svg';
import DarkLogo from '@app/bgimages/Product-Logos_Dark.svg';

interface IAppLayout {
  children: React.ReactNode;
}

const AppLayout: React.FunctionComponent<IAppLayout> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const { userProfile, setUserProfile } = useUserProfile();
  const { theme, toggleTheme } = useTheme();
  const { flags } = useFeatureFlags();
  const navigate = useNavigate();
  
  // Clear local storage handler
  const handleClearLocalStorage = () => {
    // Clear all playground-related localStorage items
    localStorage.removeItem('playgroundMcpServers');
    localStorage.removeItem('enabledMcpTools');
    localStorage.removeItem('agentConfig');
    // Clear any other playground-related items
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('mcp-token-') || key.startsWith('playground-')) {
        localStorage.removeItem(key);
      }
    });
    // Clear sessionStorage as well
    sessionStorage.clear();
    // Reload the page to reset the state
    window.location.reload();
  };

  // Theme-aware logo selection
  const logoSrc = theme === 'light' ? LightLogo : DarkLogo;
  const logoAlt = theme === 'light' ? 'Product Logo Light' : 'Product Logo Dark';

  const masthead = (
    <Masthead>
      <MastheadMain style={{ width: 'fit-content' }}>
        <MastheadToggle>
          <Button
            icon={<BarsIcon />}
            variant="plain"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Global navigation"
          />
        </MastheadToggle>
        <MastheadBrand style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={logoSrc}
            alt={logoAlt}
            style={{ 
              height: '36px', 
              width: 'auto', 
              maxWidth: '200px' // Prevent logo from being too wide
            }}
          />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <div style={{ 
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex', 
          alignItems: 'center',
          gap: '0.25rem',
          zIndex: 10
        }}>
            <Button
              icon={<BellIcon />}
              variant="plain"
              aria-label="Alerts"
            />
            <Button
              icon={<InfoCircleIcon />}
              variant="plain"
              aria-label="Information"
            />
            {flags.displayMode && (
              <Button
                icon={theme === 'light' ? <MoonIcon /> : <SunIcon />}
                variant="plain"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                style={{ color: theme === 'dark' ? '#f0ab00' : undefined }}
              />
            )}
            <Dropdown
              isOpen={userDropdownOpen}
              onSelect={() => setUserDropdownOpen(false)}
              onOpenChange={(isOpen: boolean) => setUserDropdownOpen(isOpen)}
              popperProps={{
                position: 'right'
              }}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  isExpanded={userDropdownOpen}
                  variant="plain"
                  aria-label="User menu"
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    padding: '0.25rem 0.5rem'
                  }}>
                    <div style={{ 
                      width: '24px', 
                      height: '24px',
                      backgroundColor: '#0066cc',
                      color: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px'
                    }}>
                      <UserIcon />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{userProfile}</span>
                  </div>
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem 
                  key="ai-admin"
                  icon={<UserIcon />}
                  onClick={() => {
                    setUserProfile('AI Admin');
                  }}
                  style={{ 
                    fontWeight: userProfile === 'AI Admin' ? '600' : '400',
                    color: userProfile === 'AI Admin' ? '#0066cc' : 'inherit'
                  }}
                >
                  AI Admin
                </DropdownItem>
                <DropdownItem 
                  key="ai-engineer"
                  icon={<UserIcon />}
                  onClick={() => {
                    setUserProfile('AI Engineer');
                  }}
                  style={{ 
                    fontWeight: userProfile === 'AI Engineer' ? '600' : '400',
                    color: userProfile === 'AI Engineer' ? '#0066cc' : 'inherit'
                  }}
                >
                  AI Engineer
                </DropdownItem>
                <Divider component="li" />
                <DropdownItem 
                  key="profile"
                  icon={<UserIcon />}
                >
                  Profile
                </DropdownItem>
                <DropdownItem 
                  key="settings"
                  icon={<CogIcon />}
                >
                  Settings
                </DropdownItem>
                <DropdownItem 
                  key="feature-flags"
                  icon={<FlagIcon />}
                  onClick={() => navigate('/feature-flags')}
                >
                  Feature Flags
                </DropdownItem>
                <DropdownItem 
                  key="clear-storage"
                  icon={<TrashIcon />}
                  onClick={handleClearLocalStorage}
                >
                  Clear local storage
                </DropdownItem>
              </DropdownList>
            </Dropdown>
          </div>
      </MastheadContent>
    </Masthead>
  );

  const location = useLocation();

  const renderNavItem = (route: IAppRoute, index: number, groupId?: string) => {
    const IconComponent = route.icon;
    const itemId = `${groupId ? `${groupId}_` : ''}${route.label}-${index}`;
    
    return (
      <NavItem 
        key={itemId} 
        id={itemId} 
        itemId={itemId}
        groupId={groupId}
        isActive={route.path === location.pathname}
      >
        {(route as any).disabled ? (
          <div
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0.5rem 1rem',
              color: '#6a6e73',
              cursor: 'not-allowed',
              opacity: 0.5
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {IconComponent && <IconComponent />}
              {route.label}
            </span>
            {(route as any).techPreview && (
              <Label 
                variant="outline" 
                color="orange" 
                isCompact
                style={{ fontSize: '10px' }}
              >
                Tech Preview
              </Label>
            )}
          </div>
        ) : (
          <NavLink
            to={route.path}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {IconComponent && <IconComponent />}
              {route.label}
            </span>
            {(route as any).techPreview && (
              <Label 
                variant="outline" 
                color="orange" 
                isCompact
                style={{ fontSize: '10px' }}
              >
                Tech Preview
              </Label>
            )}
          </NavLink>
        )}
      </NavItem>
    );
  };

  const renderNavGroup = (group: IAppRouteGroup, groupIndex: number, parentGroupId?: string) => {
    const IconComponent = group.icon;
    const groupId = `${parentGroupId ? `${parentGroupId}_` : ''}nav-group-${groupIndex}`;
    
    // Check if this group or any of its children are active
    const isGroupActive = (routes: AppRouteConfig[]): boolean => {
      return routes.some((route) => {
        if ('routes' in route && route.routes) {
          return isGroupActive(route.routes);
        }
        return 'path' in route && route.path === location.pathname;
      });
    };
    
    return (
      <NavExpandable
        key={groupId}
        id={groupId}
        groupId={groupId}
        title={
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {IconComponent && <IconComponent />}
            {group.label}
          </span>
        }
        isActive={isGroupActive(group.routes)}
        style={(group as any).disabled ? { 
          color: '#6a6e73', 
          opacity: 0.5, 
          cursor: 'not-allowed' 
        } : undefined}
      >
        {group.routes.map((route, idx) => {
          if (!route.label) return null;
          
          if ('routes' in route) {
            // This is a nested group (third level)
            return renderNavGroup(route as IAppRouteGroup, idx, groupId);
          } else {
            // This is a regular nav item
            return renderNavItem(route as IAppRoute, idx, groupId);
          }
        })}
      </NavExpandable>
    );
  };

  const renderNavigationItem = (route: AppRouteConfig, idx: number) => {
    if (!('label' in route) || !route.label) {
      return null;
    }

    if ('routes' in route) {
      return renderNavGroup(route as IAppRouteGroup, idx);
    } else {
      return renderNavItem(route as IAppRoute, idx);
    }
  };

  const filteredRoutes = React.useMemo(() => filterRoutesByFlags(routes, flags), [flags]);

  const Navigation = (
    <Nav id="nav-primary-simple">
      <NavList id="nav-list-simple">
        {filteredRoutes.map((route, idx) => renderNavigationItem(route, idx))}
      </NavList>
    </Nav>
  );

  const Sidebar = (
    <PageSidebar>
      <PageSidebarBody>{Navigation}</PageSidebarBody>
    </PageSidebar>
  );

  const pageId = 'primary-app-container';

  const PageSkipToContent = (
    <SkipToContent
      onClick={(event) => {
        event.preventDefault();
        const primaryContentContainer = document.getElementById(pageId);
        primaryContentContainer?.focus();
      }}
      href={`#${pageId}`}
    >
      Skip to Content
    </SkipToContent>
  );
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* UXD Prototype Banner */}
      <div style={{
        backgroundColor: '#FF6F00',
        color: 'white',
        textAlign: 'center',
        padding: '0.25rem',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.5px',
        flexShrink: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem'
      }}>
        UXD PROTOTYPE
        <Tooltip
          content={
            <div>
               This prototype demonstrates the <em>AI hub</em> and <em>Generative AI studio</em> features for 3.0. Not all features and interactions are fully represented and this does not represent a commitment on the part of Red Hat. Features are subject to change.
            </div>
          }
          position="bottom"
        >
          <InfoCircleIcon 
            style={{ 
              fontSize: '0.75rem', 
              cursor: 'pointer',
              opacity: 0.8 
            }} 
          />
        </Tooltip>
      </div>
      
      <Page
        mainContainerId={pageId}
        masthead={masthead}
        sidebar={sidebarOpen && Sidebar}
        skipToContent={PageSkipToContent}
        style={{ flex: 1, minHeight: 0 }}
      >
        {children}
      </Page>
    </div>
  );
};

export { AppLayout };
