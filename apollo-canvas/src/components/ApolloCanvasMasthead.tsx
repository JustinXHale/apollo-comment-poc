import React, { useState } from 'react';
import {
  Masthead,
  MastheadMain,
  MastheadToggle,
  MastheadBrand,
  MastheadContent,
  MastheadLogo,
  PageToggleButton,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Dropdown,
  DropdownItem,
  DropdownList,
  DropdownGroup,
  MenuToggle,
  Divider,
  Brand,
  ToggleGroup,
  ToggleGroupItem,
  SearchInput,
} from '@patternfly/react-core';
import { BarsIcon, SunIcon, MoonIcon, CommentIcon, CodeBranchIcon } from '@patternfly/react-icons';
import apolloLogo from '../assets/apollo-logo.png';
import { useThemeContext } from './ThemeContext';

interface ApolloCanvasMastheadProps {
  onLeftDrawerToggle: () => void;
  onRightDrawerToggle: () => void;
}

const ApolloCanvasMasthead: React.FC<ApolloCanvasMastheadProps> = ({
  onLeftDrawerToggle,
  onRightDrawerToggle,
}) => {
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isReleaseDropdownOpen, setIsReleaseDropdownOpen] = useState(false);
  const [isIterationDropdownOpen, setIsIterationDropdownOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('RHOAI');
  const [selectedRelease, setSelectedRelease] = useState('3.0');
  const [selectedIteration, setSelectedIteration] = useState('v4');
  const [currentBranch, setCurrentBranch] = useState('main');
  const [availableBranches, setAvailableBranches] = useState<Array<{ name: string; commit?: { id: string; short_id: string; message: string; date: string } }>>([]);
  const [branchLoading, setBranchLoading] = useState(false);
  const [branchSearchValue, setBranchSearchValue] = useState('');
  const { theme, setTheme } = useThemeContext();

  const productOptions = [
    { key: 'acm', label: 'ACM', description: 'Red Hat Advanced Cluster Management for Kubernetes' },
    { key: 'acs', label: 'ACS', description: 'Red HatAdvanced Cluster Security for Kubernetes' },
    { key: 'ansible', label: 'Ansible', description: 'Red Hat Ansible Automation Platform' },
    { key: 'consoledot', label: 'ConsoleDot', description: 'Red Hat ConsoleDot' },
    { key: 'openshift', label: 'OCP', description: 'Red Hat OpenShift Container Platform' },
    { key: 'openshift-virtualization', label: 'OCP Virt', description: 'Red Hat OpenShift Virtualization' },
    { key: 'rhdh', label: 'RHDH', description: 'Red Hat Developer Hub' },
    { key: 'rhel', label: 'RHEL', description: 'Red Hat Enterprise Linux' },
    { key: 'openshift-ai', label: 'RHOAI', description: 'Red Hat OpenShift AI' },
  ];

  const releaseOptionGroups = [
    {
      groupLabel: 'Prototypes',
      options: [
        { key: 'now', label: '3.0', description: undefined },
        { key: 'next', label: '3.1', description: undefined },
        { key: 'future', label: '3.next', description: undefined },
      ]
    },
    {
      groupLabel: 'Upstreams',
      options: [
        { key: 'odh-dashboard', label: 'ODH Dashboard', description: 'red-hat-data-services/odh-dashboard' },
      ]
    }
  ];

  const iterationOptions = [
    { key: 'v4', label: 'v4' },
    { key: 'v3', label: 'v3' },
    { key: 'v2', label: 'v2' },
    { key: 'v1', label: 'v1' },
  ];

  // Product to repository mapping
  const productRepoMap: Record<string, { gitlabUrl: string; localPath: string }> = {
    'RHOAI': {
      gitlabUrl: 'git@gitlab.cee.redhat.com:uxd/apollo/openshift-ai.git',
      localPath: 'projects/redhat/openshift-ai/code'
    }
    // Add more products as needed
  };

  const handleProductSelect = (option: { key: string; label: string; description: string }) => {
    setSelectedProduct(option.label);
    setIsProductDropdownOpen(false);
    // Reset branch-related state when product changes
    setCurrentBranch('main');
    setAvailableBranches([]);
    setBranchSearchValue('');
  };

  const handleReleaseSelect = (option: { key: string; label: string; description?: string }) => {
    setSelectedRelease(option.label);
    setIsReleaseDropdownOpen(false);
  };

  const handleIterationSelect = (option: { key: string; label: string }) => {
    setSelectedIteration(option.label);
    setIsIterationDropdownOpen(false);
  };

  // Fetch available branches for the current product
  const fetchBranches = async () => {
    const productConfig = productRepoMap[selectedProduct];
    if (!productConfig) {
      console.warn(`No repository configuration found for product: ${selectedProduct}`);
      return;
    }

    setBranchLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/git/gitlab-branches?repoPath=${encodeURIComponent(productConfig.localPath)}`);
      const result = await response.json();
      
      if (result.success) {
        setAvailableBranches(result.branches || []);
      } else {
        console.error('Failed to fetch branches:', result.error);
        setAvailableBranches([]);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      setAvailableBranches([]);
    } finally {
      setBranchLoading(false);
    }
  };

  // Get current branch when product changes
  const getCurrentBranch = async () => {
    const productConfig = productRepoMap[selectedProduct];
    if (!productConfig) return;

    try {
      const response = await fetch(`http://localhost:3001/api/git/current-branch?repoPath=${encodeURIComponent(productConfig.localPath)}`);
      const result = await response.json();
      
      if (result.success) {
        setCurrentBranch(result.branch);
      }
    } catch (error) {
      console.error('Error fetching current branch:', error);
    }
  };

  // Switch to selected branch
  const handleBranchSelect = async (branchName: string) => {
    const productConfig = productRepoMap[selectedProduct];
    if (!productConfig) return;

    setBranchLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/git/switch-branch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          branch: branchName,
          repoPath: productConfig.localPath
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setCurrentBranch(branchName);
        console.log('Branch switched successfully:', result.message);
      } else {
        console.error('Failed to switch branch:', result.error);
      }
    } catch (error) {
      console.error('Error switching branch:', error);
    } finally {
      setBranchLoading(false);
      setIsBranchDropdownOpen(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString || dateString === 'unknown') return 'Unknown date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Filter branches based on search
  const filteredBranches = availableBranches.filter(branch => 
    branch.name.toLowerCase().includes(branchSearchValue.toLowerCase()) ||
    (branch.commit?.message || '').toLowerCase().includes(branchSearchValue.toLowerCase())
  );

  // Load current branch when component mounts or product changes
  React.useEffect(() => {
    getCurrentBranch();
  }, [selectedProduct]);

  return (
    <Masthead role="banner" aria-label="Apollo Canvas masthead">
      <MastheadMain>
        <MastheadToggle>
          <PageToggleButton
            variant="plain"
            aria-label="Toggle left drawer"
            onClick={onLeftDrawerToggle}
          >
            <BarsIcon />
          </PageToggleButton>
        </MastheadToggle>
        <MastheadBrand>
            <MastheadLogo component={(props) => <a {...props} href="#" />}>
            <Brand src={apolloLogo} alt="Apollo" heights={{ default: '36px' }} />
            </MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar isFullHeight>
          <ToolbarContent>
            <ToolbarGroup variant="action-group-plain">
              <ToolbarItem>
                <Dropdown
                  onOpenChange={(isOpen) => setIsProductDropdownOpen(isOpen)}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                      isExpanded={isProductDropdownOpen}
                      variant="plainText"
                    >
                      Product: {selectedProduct}
                    </MenuToggle>
                  )}
                  isOpen={isProductDropdownOpen}
                >
                  <DropdownList>
                    {productOptions.map((option) => (
                      <DropdownItem
                        key={option.key}
                        onClick={() => handleProductSelect(option)}
                        description={option.description}
                      >
                        {option.label}
                      </DropdownItem>
                    ))}
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
              <ToolbarItem>
                <Dropdown
                  onOpenChange={(isOpen) => setIsReleaseDropdownOpen(isOpen)}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsReleaseDropdownOpen(!isReleaseDropdownOpen)}
                      isExpanded={isReleaseDropdownOpen}
                      variant="plainText"
                    >
                      Release: {selectedRelease}
                    </MenuToggle>
                  )}
                  isOpen={isReleaseDropdownOpen}
                >
                  <DropdownList>
                    {releaseOptionGroups.map((group) => (
                      <DropdownGroup key={group.groupLabel} label={group.groupLabel}>
                        {group.options.map((option) => (
                          <DropdownItem
                            key={option.key}
                            onClick={() => handleReleaseSelect(option)}
                            description={option.description}
                          >
                            {option.label}
                          </DropdownItem>
                        ))}
                        <Divider />
                      </DropdownGroup>
                    ))}
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
              <ToolbarItem>
                <Dropdown
                  onOpenChange={(isOpen) => {
                    setIsBranchDropdownOpen(isOpen);
                    if (isOpen) {
                      fetchBranches();
                    } else {
                      setBranchSearchValue('');
                    }
                  }}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => {
                        const newState = !isBranchDropdownOpen;
                        setIsBranchDropdownOpen(newState);
                        if (newState) {
                          fetchBranches();
                        } else {
                          setBranchSearchValue('');
                        }
                      }}
                      isExpanded={isBranchDropdownOpen}
                      variant="plainText"
                      icon={<CodeBranchIcon />}
                      isDisabled={branchLoading || !productRepoMap[selectedProduct]}
                    >
                      Branch: {branchLoading ? 'Loading...' : currentBranch}
                    </MenuToggle>
                  )}
                  isOpen={isBranchDropdownOpen}
                >
                  <DropdownList 
                    style={{ 
                      maxHeight: '400px', 
                      maxWidth: '500px', 
                      overflowY: 'auto' 
                    }}
                  >
                    {availableBranches.length > 0 && (
                      <div style={{ padding: '8px', borderBottom: '1px solid var(--pf-v5-global--BorderColor--100)' }}>
                        <SearchInput
                          placeholder="Search branches..."
                          value={branchSearchValue}
                          onChange={(_, value) => setBranchSearchValue(value)}
                          onClear={() => setBranchSearchValue('')}
                          style={{ width: '100%' }}
                        />
                      </div>
                    )}
                    {availableBranches.length > 0 ? (
                      filteredBranches.length > 0 ? (
                        filteredBranches.map((branch) => (
                          <DropdownItem
                            key={branch.name}
                            onClick={() => handleBranchSelect(branch.name)}
                            description={
                              branch.commit ? 
                                `${formatDate(branch.commit.date)} • ${branch.commit.short_id}: ${branch.commit.message}` : 
                                undefined
                            }
                          >
                            {branch.name}
                          </DropdownItem>
                        ))
                      ) : (
                        <DropdownItem isDisabled>
                          <span style={{ fontSize: '0.875rem', color: 'var(--pf-v5-global--Color--200)' }}>
                            No branches match "{branchSearchValue}"
                          </span>
                        </DropdownItem>
                      )
                    ) : (
                      <DropdownItem isDisabled>
                        {branchLoading ? 'Loading branches...' : 'No branches available'}
                      </DropdownItem>
                    )}
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
              <ToolbarItem>
                {/*}
                <Dropdown
                  onOpenChange={(isOpen) => setIsIterationDropdownOpen(isOpen)}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsIterationDropdownOpen(!isIterationDropdownOpen)}
                      isExpanded={isIterationDropdownOpen}
                      variant="plainText"
                    >
                      Iteration: {selectedIteration}
                    </MenuToggle>
                  )}
                  isOpen={isIterationDropdownOpen}
                >
                  <DropdownList>
                    {iterationOptions.map((option) => (
                      <DropdownItem
                        key={option.key}
                        onClick={() => handleIterationSelect(option)}
                      >
                        {option.label}
                      </DropdownItem>
                    ))}
                  </DropdownList>
                </Dropdown>
                */}
              </ToolbarItem>

            </ToolbarGroup>
            <ToolbarGroup variant="action-group-plain" align={{ default: 'alignEnd' }}>
              <ToolbarItem>
                <ToggleGroup aria-label="Theme toggle group">
                  <ToggleGroupItem
                    aria-label="light theme"
                    icon={<SunIcon />}
                    isSelected={theme === 'light'}
                    onChange={() => {
                      setTheme('light');
                    }}
                  />
                  <ToggleGroupItem
                    aria-label="dark theme"
                    icon={<MoonIcon />}
                    isSelected={theme === 'dark'}
                    onChange={() => {
                      setTheme('dark');
                    }}
                  />
                </ToggleGroup>
              </ToolbarItem>
              <ToolbarItem>
                <PageToggleButton
                  variant="plain"
                  aria-label="Toggle right drawer"
                  onClick={onRightDrawerToggle}
                >
                  <CommentIcon />
                </PageToggleButton>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  );
};

export default ApolloCanvasMasthead;
