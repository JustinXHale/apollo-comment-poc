import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  TabTitleText,
  TabContent,
  Menu,
  MenuContent,
  MenuList,
  MenuItem,
  Divider,
  DrilldownMenu,
  MenuToggle,
  Popper,
  MenuGroup,
} from '@patternfly/react-core';
import ContextTab from './ContextTab';
import ChatTab from './ChatTab';
import OverviewTab from './OverviewTab';
import LogTab from './LogTab';

interface LeftDrawerContentProps {
  isSelectMode: boolean;
  setIsSelectMode: (value: boolean) => void;
  title?: string;
}

const LeftDrawerContent: React.FC<LeftDrawerContentProps> = ({ isSelectMode, setIsSelectMode, title = 'OpenShift AI Dashboard' }) => {
  const [activeTabKey, setActiveTabKey] = useState<string | number>('overview');
  
  // Menu drilldown state
  const [menuDrilledIn, setMenuDrilledIn] = useState<string[]>([]);
  const [drilldownPath, setDrilldownPath] = useState<string[]>([]);
  const [menuHeights, setMenuHeights] = useState<any>({});
  const [activeMenu, setActiveMenu] = useState<string>('scope-rootMenu');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [selectedScope, setSelectedScope] = useState<string>('All');
  
  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const handleTabClick = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  // Menu drilldown handlers
  const drillIn = (
    _event: React.KeyboardEvent | React.MouseEvent,
    fromMenuId: string,
    toMenuId: string,
    pathId: string
  ) => {
    setMenuDrilledIn([...menuDrilledIn, fromMenuId]);
    setDrilldownPath([...drilldownPath, pathId]);
    setActiveMenu(toMenuId);
  };

  const drillOut = (_event: React.KeyboardEvent | React.MouseEvent, toMenuId: string) => {
    const menuDrilledInSansLast = menuDrilledIn.slice(0, menuDrilledIn.length - 1);
    const pathSansLast = drilldownPath.slice(0, drilldownPath.length - 1);
    setMenuDrilledIn(menuDrilledInSansLast);
    setDrilldownPath(pathSansLast);
    setActiveMenu(toMenuId);
  };

  const setHeight = (menuId: string, height: number) => {
    if (menuHeights[menuId] === undefined || (menuId !== 'scope-rootMenu' && menuHeights[menuId] !== height)) {
      setMenuHeights({ ...menuHeights, [menuId]: height });
    }
  };

  // Menu toggle handlers
  const onMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle click outside to close menu
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        toggleRef.current &&
        menuRef.current &&
        !toggleRef.current.contains(event.target as Node) &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const onMenuSelect = (event?: React.MouseEvent, itemId?: string | number) => {
    if (typeof itemId === 'string') {
      // Handle scope selection
      if (itemId === 'all') {
        setSelectedScope('All');
        setIsMenuOpen(false);
      } else if (itemId === 'playground_setup') {
        setSelectedScope('Playground setup');
        setIsMenuOpen(false);
      } else if (itemId === 'deploying_model') {
        setSelectedScope('Deploying a model');
        setIsMenuOpen(false);
      } else if (itemId === 'maas') {
        setSelectedScope('MaaS');
        setIsMenuOpen(false);
      } else if (itemId === 'ai_hub') {
        setSelectedScope('AI Hub');
        setIsMenuOpen(false);
      } else if (itemId === 'model_serving') {
        setSelectedScope('Model Serving');
        setIsMenuOpen(false);
      } else if (itemId === 'ia_updates') {
        setSelectedScope('IA Updates');
        setIsMenuOpen(false);
      }
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Scope selector menu */}
      <div style={{ marginBottom: '0.5rem' }}>
        <Popper
          trigger={
            <MenuToggle
              ref={toggleRef}
              onClick={onMenuToggle}
              isExpanded={isMenuOpen}
              style={{ width: '320px' }}
            >
              Scope: {selectedScope}
            </MenuToggle>
          }
          popper={
            <Menu
              ref={menuRef}
              id="scope-rootMenu"
              containsDrilldown
              drilldownItemPath={drilldownPath}
              drilledInMenus={menuDrilledIn}
              activeMenu={activeMenu}
              onDrillIn={drillIn}
              onDrillOut={drillOut}
              onGetMenuHeight={setHeight}
              onSelect={onMenuSelect}
            >
              <MenuContent menuHeight={`${menuHeights[activeMenu]}px`}>
                <MenuList>
                  <MenuItem itemId="all">All</MenuItem>
                  <MenuItem
                    itemId="group:experiences"
                    direction="down"
                    drilldownMenu={
                      <DrilldownMenu id="scope-drilldownMenuExperiences">
                        <MenuItem itemId="group:experiences_breadcrumb" direction="up">
                          Journeys
                        </MenuItem>
                        <Divider component="li" />
                          <MenuItem itemId="playground_setup" description="Setting up and configuring the AI playground environment">
                            Playground setup
                          </MenuItem>
                          <MenuItem itemId="deploying_model" description="Complete workflow for deploying ML models to production">
                            Deploying a model
                          </MenuItem>
                      </DrilldownMenu>
                    }
                  >
                    Journeys
                  </MenuItem>
                  <MenuItem
                    itemId="group:features"
                    direction="down"
                    drilldownMenu={
                      <DrilldownMenu id="scope-drilldownMenuFeatures">
                        <MenuItem itemId="group:features_breadcrumb" direction="up">
                          Features
                        </MenuItem>
                        <Divider component="li" />
                        <MenuItem itemId="maas" description="RHAISTRAT-32 Models as a Service MVP">
                          MaaS
                        </MenuItem>
                        <MenuItem itemId="ai_hub" description="RHAISTRAT-45 AI Hub Integration Platform">
                          AI Hub
                        </MenuItem>
                        <MenuItem itemId="model_serving" description="RHAISTRAT-28 Model Serving Infrastructure">
                          Model Serving
                        </MenuItem>
                        <MenuItem itemId="ia_updates" description="RHAISTRAT-51 Intelligent Assistant Updates">
                          IA Updates
                        </MenuItem>
                      </DrilldownMenu>
                    }
                  >
                    Features
                  </MenuItem>
                </MenuList>
              </MenuContent>
            </Menu>
          }
          isVisible={isMenuOpen}
        />
      </div>
      
      {/* Page title */}
      {/*}
      <div style={{ marginBottom: '1rem', borderTop: '1px solid var(--pf-v6-global--BorderColor--100)' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)' }}>
          Page: {title}
        </span>
      </div>
      */}
      
      <Tabs
        activeKey={activeTabKey}
        onSelect={handleTabClick}
        aria-label="Left drawer tabs"
        role="region"
      >
        <Tab
          eventKey="overview"
          title={<TabTitleText>Overview</TabTitleText>}
          aria-label="Overview tab"
        >
          <TabContent id="details-tab-content">
            <OverviewTab />
          </TabContent>
        </Tab>
        <Tab
          eventKey="changes"
          title={<TabTitleText>History</TabTitleText>}
          aria-label="Log tab"
        >
          <TabContent id="log-tab-content">
            <LogTab />
          </TabContent>
        </Tab>
        <Tab
          eventKey="context"
          title={<TabTitleText>Sources</TabTitleText>}
          aria-label="Context tab"
        >
          <TabContent id="context-tab-content">
            <ContextTab />
          </TabContent>
        </Tab>
        <Tab
          eventKey="chat"
          title={<TabTitleText>Chat</TabTitleText>}
          aria-label="Chat tab"
        >
          <TabContent id="chat-tab-content">
            <ChatTab 
              isSelectMode={isSelectMode}
              setIsSelectMode={setIsSelectMode}
            />
          </TabContent>
        </Tab>
      </Tabs>
    </div>
  );
};

export default LeftDrawerContent;
