import * as React from 'react';
import {
  PageSection,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Button,
  Label,
  Content,
  ContentVariants,
  SearchInput,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  ToolbarGroup,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Flex,
  FlexItem
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ActionsColumn,
  IAction,
  ThProps
} from '@patternfly/react-table';
import { ExchangeAltIcon, TrashIcon } from '@patternfly/react-icons';
import MigrationAssistWizard, { LegacyWorkbenchConfig } from './MigrationAssistWizard';

type WorkbenchRecord = {
  id: string;
  name: string;
  project: string;
  status: string;
  isLegacyV1: boolean;
  createdBy: string;
  image: string;
  isMigrating?: boolean;
  migrationDetails?: {
    newWorkbenchName: string;
    migrationStatus: 'pending' | 'in-progress' | 'completed' | 'failed';
    initiatedAt: string;
  };
  isLegacyChild?: boolean;
  parentWorkbenchId?: string;
  migratedFromId?: string;
  hasBeenStarted?: boolean;
};

const initialRows: WorkbenchRecord[] = [
  {
    id: 'wb-1',
    name: 'notebook-cpu-small',
    project: 'ds-team-a',
    status: 'Running',
    isLegacyV1: true,
    createdBy: 'alice',
    image: 'quay.io/org/notebook:1.2.3',
    isMigrating: true,
    migrationDetails: {
      newWorkbenchName: 'notebook-cpu-small-v2-2024-01-15',
      migrationStatus: 'in-progress',
      initiatedAt: '2024-01-15T10:30:00Z'
    }
  },
  {
    id: 'wb-2',
    name: 'cuda-notebook-2xgpu',
    project: 'ml-platform',
    status: 'Stopped',
    isLegacyV1: false,
    createdBy: 'joel',
    image: 'quay.io/org/notebook-nb20:2.0.0'
  },
  {
    id: 'wb-3',
    name: 'data-analysis-nb',
    project: 'ds-team-a',
    status: 'Running',
    isLegacyV1: true,
    createdBy: 'bob',
    image: 'quay.io/org/notebook:1.2.3',
    isMigrating: true,
    migrationDetails: {
      newWorkbenchName: 'data-analysis-nb-v2-2024-01-15',
      migrationStatus: 'pending',
      initiatedAt: '2024-01-15T11:15:00Z'
    }
  },
  {
    id: 'wb-4-v2',
    name: 'ml-training-gpu-v2-2024-01-15',
    project: 'ml-platform',
    status: 'Running',
    isLegacyV1: false,
    createdBy: 'alice',
    image: 'quay.io/org/notebook-nb20:2.0.0'
  },
  {
    id: 'wb-4',
    name: 'ml-training-gpu',
    project: 'ml-platform',
    status: 'Stopped',
    isLegacyV1: true,
    createdBy: 'alice',
    image: 'quay.io/org/notebook:1.3.0',
    isLegacyChild: true,
    parentWorkbenchId: 'wb-4-v2'
  },
  {
    id: 'wb-4a-v2',
    name: 'inference-server-v2-2024-01-16',
    project: 'ml-platform',
    status: 'Stopped',
    isLegacyV1: false,
    createdBy: 'bob',
    image: 'quay.io/org/notebook-nb20:2.0.1',
    migratedFromId: 'wb-4a'
  },
  {
    id: 'wb-4a',
    name: 'inference-server',
    project: 'ml-platform',
    status: 'Running',
    isLegacyV1: true,
    createdBy: 'bob',
    image: 'quay.io/org/notebook:1.3.0'
  },
  {
    id: 'wb-5',
    name: 'model-dev-workspace',
    project: 'research-lab',
    status: 'Stopped',
    isLegacyV1: false,
    createdBy: 'carol',
    image: 'quay.io/org/notebook-nb20:2.0.1'
  },
  {
    id: 'wb-6',
    name: 'exploratory-analysis',
    project: 'ds-team-b',
    status: 'Running',
    isLegacyV1: true,
    createdBy: 'dave',
    image: 'quay.io/org/notebook:1.2.5',
    isMigrating: true,
    migrationDetails: {
      newWorkbenchName: 'exploratory-analysis-v2-2024-01-16',
      migrationStatus: 'in-progress',
      initiatedAt: '2024-01-16T14:20:00Z'
    }
  },
  {
    id: 'wb-7',
    name: 'tensorflow-workbench',
    project: 'ml-platform',
    status: 'Running',
    isLegacyV1: false,
    createdBy: 'eve',
    image: 'quay.io/org/notebook-nb20:2.1.0'
  },
  {
    id: 'wb-8',
    name: 'pytorch-experiments',
    project: 'research-lab',
    status: 'Stopped',
    isLegacyV1: true,
    createdBy: 'frank',
    image: 'quay.io/org/notebook:1.2.8'
  },
  {
    id: 'wb-9',
    name: 'data-prep-notebook',
    project: 'ds-team-a',
    status: 'Running',
    isLegacyV1: true,
    createdBy: 'grace',
    image: 'quay.io/org/notebook:1.3.1'
  },
  {
    id: 'wb-10',
    name: 'visualization-studio',
    project: 'ds-team-b',
    status: 'Running',
    isLegacyV1: false,
    createdBy: 'henry',
    image: 'quay.io/org/notebook-nb20:2.0.2'
  },
  {
    id: 'wb-11',
    name: 'nlp-processing-env',
    project: 'research-lab',
    status: 'Stopped',
    isLegacyV1: true,
    createdBy: 'iris',
    image: 'quay.io/org/notebook:1.2.9'
  },
  {
    id: 'wb-12',
    name: 'deep-learning-lab',
    project: 'ml-platform',
    status: 'Running',
    isLegacyV1: true,
    createdBy: 'joel',
    image: 'quay.io/org/notebook:1.3.2'
  },
  {
    id: 'wb-13',
    name: 'batch-inference-nb',
    project: 'ds-team-b',
    status: 'Running',
    isLegacyV1: false,
    createdBy: 'karen',
    image: 'quay.io/org/notebook-nb20:2.0.3'
  }
];

const Workbenches: React.FunctionComponent = () => {
  const [records, setRecords] = React.useState<WorkbenchRecord[]>(initialRows);
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [selectedWorkbenches, setSelectedWorkbenches] = React.useState<LegacyWorkbenchConfig[]>([]);
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([]);
  
  // Expandable rows state
  const [expandedRows, setExpandedRows] = React.useState<string[]>([]);
  
  // Filtering state
  const [searchValue, setSearchValue] = React.useState('');
  const [statusFilters, setStatusFilters] = React.useState<string[]>([]);
  const [versionFilters, setVersionFilters] = React.useState<string[]>([]);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = React.useState(false);
  const [isVersionFilterOpen, setIsVersionFilterOpen] = React.useState(false);

  // Filtered records based on search and filters
  const filteredRecords = React.useMemo(() => {
    const filtered = records.filter((record) => {
      // Search filter (name, project, created by)
      const matchesSearch =
        searchValue === '' ||
        record.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        record.project.toLowerCase().includes(searchValue.toLowerCase()) ||
        record.createdBy.toLowerCase().includes(searchValue.toLowerCase());

      // Status filter - check both actual status, migrating state, and legacy child cleanup state
      const matchesStatus = statusFilters.length === 0 || 
        statusFilters.includes(record.status) ||
        (record.isMigrating && statusFilters.includes('Migrating')) ||
        (record.isLegacyChild && statusFilters.includes('Ready for Cleanup'));

      // Version filter
      const versionLabel = record.isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant';
      const matchesVersion = versionFilters.length === 0 || versionFilters.includes(versionLabel);

      return matchesSearch && matchesStatus && matchesVersion;
    });

    // Sort so that legacy children appear directly after their parent
    const sorted: WorkbenchRecord[] = [];
    const childrenMap = new Map<string, WorkbenchRecord[]>();

    // Group children by parent
    filtered.forEach(record => {
      if (record.isLegacyChild && record.parentWorkbenchId) {
        if (!childrenMap.has(record.parentWorkbenchId)) {
          childrenMap.set(record.parentWorkbenchId, []);
        }
        childrenMap.get(record.parentWorkbenchId)!.push(record);
      }
    });

    // Build sorted array
    filtered.forEach(record => {
      if (!record.isLegacyChild) {
        sorted.push(record);
        // Add any children immediately after the parent
        const children = childrenMap.get(record.id);
        if (children) {
          sorted.push(...children);
        }
      }
    });

    return sorted;
  }, [records, searchValue, statusFilters, versionFilters]);

  const isRowSelected = (id: string) => selectedRowIds.includes(id);

  const onSelectAll = (_event: React.FormEvent<HTMLInputElement>, isSelecting: boolean) => {
    const allIds = filteredRecords.map((r) => r.id);
    setSelectedRowIds(isSelecting ? allIds : []);
  };

  const onSelectRow = (id: string, isSelecting: boolean) => {
    setSelectedRowIds((prev) => (isSelecting ? [...prev, id] : prev.filter((i) => i !== id)));
  };

  const areAllSelected = React.useMemo(() => {
    return filteredRecords.length > 0 && filteredRecords.every((r) => selectedRowIds.includes(r.id));
  }, [filteredRecords, selectedRowIds]);

  const selectedCount = React.useMemo(() => {
    return selectedRowIds.length;
  }, [selectedRowIds]);

  const selectedLegacyV1Count = React.useMemo(() => {
    return filteredRecords.filter((r) => r.isLegacyV1 && selectedRowIds.includes(r.id)).length;
  }, [filteredRecords, selectedRowIds]);

  // Toggle row expansion
  const toggleRowExpansion = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const openBulkMigrationWizard = () => {
    const selected = records
      .filter((r) => r.isLegacyV1 && selectedRowIds.includes(r.id))
      .map((r, index) => {
        // Vary the conflicts to demonstrate unique env var counting
        // Multiple workbenches may have the same env vars, but we count unique keys
        let env: Record<string, string> | undefined;
        
        if (index % 3 === 0) {
          // Every 3rd: has SAMPLE_ENV and ANOTHER_VAR
          env = { SAMPLE_ENV: 'VALUE', ANOTHER_VAR: 'test' };
        } else if (index % 5 === 0) {
          // Every 5th: has CUDA_VERSION (unique conflict)
          env = { CUDA_VERSION: '12.1' };
        } else {
          // Others: no conflicts (compatible)
          env = undefined;
        }
        
        return {
          id: r.id,
          name: r.name,
          project: r.project,
          env
        };
      });
    setSelectedWorkbenches(selected);
    setIsWizardOpen(true);
  };

  const renderComplianceLabel = (isLegacyV1: boolean) => (
    <Label id={isLegacyV1 ? 'label-legacy-v1' : 'label-nb20'} color={isLegacyV1 ? 'grey' : 'blue'}>
      {isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant'}
    </Label>
  );

  const buildActions = (record: WorkbenchRecord): IAction[] => {
    const start: IAction = {
      title: 'Start',
      onClick: () => {
        // Update this workbench to Running
        setRecords(prevRecords => prevRecords.map(r => {
          if (r.id === record.id) {
            return { ...r, status: 'Running', hasBeenStarted: true };
          }
          // If this V2 workbench has a migratedFromId and is being started for the first time,
          // convert the V1 to legacy child
          if (record.migratedFromId && r.id === record.migratedFromId && !record.hasBeenStarted && !r.isLegacyChild) {
            return {
              ...r,
              status: 'Stopped',
              isLegacyChild: true,
              parentWorkbenchId: record.id
            };
          }
          return r;
        }));
      }
    };

    const stop: IAction = {
      title: 'Stop',
      onClick: () => {
        setRecords(prevRecords => prevRecords.map(r => 
          r.id === record.id ? { ...r, status: 'Stopped' } : r
        ));
      }
    };

    const deleteLegacy: IAction = {
      title: 'Delete Legacy Workbench',
      // eslint-disable-next-line no-console
      onClick: () => console.log('Delete legacy workbench clicked for', record.id)
    };

    // Legacy child workbenches get Start/Stop + Delete actions
    if (record.isLegacyChild) {
      const actions: IAction[] = [];
      if (record.status === 'Stopped') {
        actions.push(start);
      } else if (record.status === 'Running') {
        actions.push(stop);
      }
      actions.push(deleteLegacy);
      return actions;
    }

    const migrate: IAction = {
      title: 'Migrate to New Version...',
      onClick: () => {
        if (record.isLegacyV1) {
          const wb: LegacyWorkbenchConfig = {
            id: record.id,
            name: record.name,
            project: record.project,
            env: { SAMPLE_ENV: 'VALUE', ANOTHER_VAR: 'test' }
          };
          setSelectedWorkbenches([wb]);
          setIsWizardOpen(true);
        }
      }
    };
    const open: IAction = {
      title: 'Open',
      // eslint-disable-next-line no-console
      onClick: () => console.log('Open clicked for', record.id)
    };
    const manage: IAction = {
      title: 'Manage',
      // eslint-disable-next-line no-console
      onClick: () => console.log('Manage clicked for', record.id)
    };

    // Build actions based on status and type
    const actions: IAction[] = [];
    
    // Add Start/Stop based on status
    if (record.status === 'Stopped') {
      actions.push(start);
    } else if (record.status === 'Running') {
      actions.push(stop);
    }

    // Add other actions
    if (record.isLegacyV1) {
      actions.push(migrate);
    }
    actions.push(open, manage);

    return actions;
  };

  return (
    <>
      <PageSection aria-label="Workbenches Header" id="workbenches-header">
        <Title headingLevel="h2" id="workbenches-title">
          Workbenches
        </Title>
        <Content component={ContentVariants.p}>
          Monitor and manage all active workbenches. Use bulk actions below to migrate legacy V1 resources.
        </Content>
      </PageSection>

      <PageSection id="workbenches-content-section">
        <Toolbar id="workbenches-toolbar" inset={{ default: 'insetNone' }} clearAllFilters={() => {
          setSearchValue('');
          setStatusFilters([]);
          setVersionFilters([]);
        }}>
          <ToolbarContent>
            <ToolbarGroup variant="filter-group">
              <ToolbarItem>
                <SearchInput
                  placeholder="Filter by name, project, or user"
                  value={searchValue}
                  onChange={(_event, value) => setSearchValue(value)}
                  onClear={() => setSearchValue('')}
                  id="workbenches-search"
                />
              </ToolbarItem>
              <ToolbarItem>
                <Select
                  isOpen={isStatusFilterOpen}
                  onOpenChange={(isOpen) => setIsStatusFilterOpen(isOpen)}
                  onSelect={(_event, value) => {
                    const status = value as string;
                    setStatusFilters(
                      statusFilters.includes(status)
                        ? statusFilters.filter((s) => s !== status)
                        : [...statusFilters, status]
                    );
                  }}
                  selected={statusFilters}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                      isExpanded={isStatusFilterOpen}
                    >
                      Status
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    <SelectOption hasCheckbox isSelected={statusFilters.includes('Running')} value="Running">
                      Running
                    </SelectOption>
                    <SelectOption hasCheckbox isSelected={statusFilters.includes('Stopped')} value="Stopped">
                      Stopped
                    </SelectOption>
                    <SelectOption hasCheckbox isSelected={statusFilters.includes('Migrating')} value="Migrating">
                      Migrating
                    </SelectOption>
                    <SelectOption hasCheckbox isSelected={statusFilters.includes('Ready for Cleanup')} value="Ready for Cleanup">
                      Ready for Cleanup
                    </SelectOption>
                  </SelectList>
                </Select>
              </ToolbarItem>
              <ToolbarItem>
                <Select
                  isOpen={isVersionFilterOpen}
                  onOpenChange={(isOpen) => setIsVersionFilterOpen(isOpen)}
                  onSelect={(_event, value) => {
                    const version = value as string;
                    setVersionFilters(
                      versionFilters.includes(version)
                        ? versionFilters.filter((v) => v !== version)
                        : [...versionFilters, version]
                    );
                  }}
                  selected={versionFilters}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsVersionFilterOpen(!isVersionFilterOpen)}
                      isExpanded={isVersionFilterOpen}
                    >
                      Version
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    <SelectOption hasCheckbox isSelected={versionFilters.includes('Legacy V1')} value="Legacy V1">
                      Legacy V1
                    </SelectOption>
                    <SelectOption
                      hasCheckbox
                      isSelected={versionFilters.includes('NB 2.0 Compliant')}
                      value="NB 2.0 Compliant"
                    >
                      NB 2.0 Compliant
                    </SelectOption>
                  </SelectList>
                </Select>
              </ToolbarItem>
              <ToolbarItem>
                <Button
                  id="delete-selected-button"
                  variant="plain"
                  icon={<TrashIcon />}
                  isDisabled={selectedCount === 0}
                  onClick={() => {
                    // eslint-disable-next-line no-console
                    console.log('Delete selected workbenches:', selectedRowIds);
                  }}
                  style={{
                    color: selectedCount > 0 ? 'var(--pf-v5-global--primary-color--100)' : 'var(--pf-v5-global--disabled-color--100)'
                  }}
                  aria-label={`Delete ${selectedCount} selected workbench${selectedCount !== 1 ? 'es' : ''}`}
                >
                  {selectedCount > 0 && `(${selectedCount})`}
                </Button>
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarGroup>
              <ToolbarItem>
                <Button id="create-workbench-button" variant="primary">
                  Create Workbench
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Button id="manage-workspace-kinds-button" variant="secondary">
                  Manage Workspace Kinds
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Button
                  id="migrate-workbenches-button"
                  variant="primary"
                  onClick={openBulkMigrationWizard}
                  isDisabled={selectedLegacyV1Count === 0}
                >
                  Migrate Workbenches ({selectedLegacyV1Count} Selected)
                </Button>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        <Table aria-label="Workbenches list" id="workbenches-table" variant="compact">
          <Thead>
            <Tr>
              <Th></Th>
              <Th
                select={{
                  onSelect: onSelectAll,
                  isSelected: areAllSelected,
                  isDisabled: false
                }}
              />
              <Th>Name</Th>
              <Th>Project</Th>
              <Th>Status</Th>
              <Th>Version/Compliance</Th>
              <Th>Created By</Th>
              <Th>Image</Th>
              <Th screenReaderText="Actions"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredRecords.map((r, rowIndex) => (
              <React.Fragment key={r.id}>
                <Tr>
                  {r.isMigrating ? (
                    <Td
                      expand={{
                        rowIndex: rowIndex,
                        isExpanded: expandedRows.includes(r.id),
                        onToggle: () => toggleRowExpansion(r.id),
                        expandId: `expandable-${r.id}`
                      }}
                    />
                  ) : (
                    <Td />
                  )}
                  <Td
                    select={{
                      rowIndex: rowIndex,
                      onSelect: (_event, isSelecting) => onSelectRow(r.id, isSelecting),
                      isSelected: isRowSelected(r.id),
                      isDisabled: false
                    }}
                  />
                  <Td dataLabel="Name">
                    {r.isLegacyChild ? '└─ ' : ''}{r.name}
                  </Td>
                  <Td dataLabel="Project">{r.project}</Td>
                  <Td dataLabel="Status">
                    {r.isLegacyChild ? (
                      r.status === 'Stopped' ? (
                        <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                          <FlexItem>Ready for Cleanup</FlexItem>
                          <FlexItem>
                            <TrashIcon />
                          </FlexItem>
                        </Flex>
                      ) : (
                        <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                          <FlexItem>{r.status}</FlexItem>
                          <FlexItem>
                            <TrashIcon />
                          </FlexItem>
                        </Flex>
                      )
                    ) : r.isMigrating ? (
                      <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                        <FlexItem>{r.status}</FlexItem>
                        <FlexItem>
                          <ExchangeAltIcon />
                        </FlexItem>
                      </Flex>
                    ) : (
                      r.status
                    )}
                  </Td>
                  <Td dataLabel="Version/Compliance">{renderComplianceLabel(r.isLegacyV1)}</Td>
                  <Td dataLabel="Created By">{r.createdBy}</Td>
                  <Td dataLabel="Image">{r.image}</Td>
                  <Td isActionCell dataLabel="Actions">
                    <ActionsColumn items={buildActions(r)} popperProps={{ position: 'right' }} />
                  </Td>
                </Tr>
                {r.isMigrating && r.migrationDetails && (
                  <Tr key={`${r.id}-expanded`} isExpanded={expandedRows.includes(r.id)}>
                    <Td />
                    <Td colSpan={8}>
                      {expandedRows.includes(r.id) && (
                        <div style={{ padding: '1rem', backgroundColor: '#f0f0f0' }}>
                          <Title headingLevel="h6" id={`migration-title-${r.id}`}>Migration Details</Title>
                          <DescriptionList isHorizontal>
                            <DescriptionListGroup>
                              <DescriptionListTerm>New Workbench Name</DescriptionListTerm>
                              <DescriptionListDescription>
                                {r.migrationDetails.newWorkbenchName}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Migration Status</DescriptionListTerm>
                              <DescriptionListDescription>
                                <Label color={
                                  r.migrationDetails.migrationStatus === 'completed' ? 'green' :
                                  r.migrationDetails.migrationStatus === 'in-progress' ? 'blue' :
                                  r.migrationDetails.migrationStatus === 'failed' ? 'red' : 'orange'
                                }>
                                  {r.migrationDetails.migrationStatus}
                                </Label>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Initiated At</DescriptionListTerm>
                              <DescriptionListDescription>
                                {new Date(r.migrationDetails.initiatedAt).toLocaleString()}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                          </DescriptionList>
                        </div>
                      )}
                    </Td>
                  </Tr>
                )}
              </React.Fragment>
            ))}
          </Tbody>
        </Table>
      </PageSection>

      {selectedWorkbenches.length > 0 && (
        <MigrationAssistWizard
          isOpen={isWizardOpen}
          onClose={() => {
            setIsWizardOpen(false);
            setSelectedWorkbenches([]);
          }}
          workbenches={selectedWorkbenches}
        />
      )}
    </>
  );
};

export { Workbenches };
