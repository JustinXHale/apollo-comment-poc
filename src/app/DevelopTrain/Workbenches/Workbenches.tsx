import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  PageSection,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Button,
  Label,
  LabelGroup,
  Content,
  ContentVariants,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelContent,
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
  FlexItem,
  Dropdown,
  DropdownItem,
  DropdownList,
  Divider,
  Radio,
  Card,
  CardBody,
  Badge,
  Tooltip,
  Pagination,
  Tabs,
  Tab,
  TabTitleText,
  Checkbox,
  Switch,
  InputGroup,
  InputGroupItem
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
import { ExchangeAltIcon, TrashIcon, CaretDownIcon, LinkIcon, ArrowRightIcon, ArrowLeftIcon, ThIcon, FilterIcon, EllipsisVIcon, TimesIcon } from '@patternfly/react-icons';
import MigrationAssistWizard, { LegacyWorkbenchConfig } from './MigrationAssistWizard';
import CreateWorkspaceKindWizard from './CreateWorkspaceKindWizard';

type VisualStyle = 'expandable-side-by-side';

type WorkspaceKind = {
  id: string;
  name: string;
  type: string;
  isLegacyV1: boolean;
  baseImage: string;
  usageCount: number;
  isActive: boolean; // Changed from isDeprecated to isActive (ON = Active, OFF = Inactive)
};

type ArchivedWorkbench = {
  id: string;
  name: string;
  project: string;
  status: string;
  isLegacyV1: boolean;
  image: string;
  createdBy: string;
  archivedDate: string;
  originalMigrationFrom?: string;
  historicalMetadata?: Record<string, string>;
};

type WorkbenchRecord = {
  id: string;
  name: string;
  project: string;
  status: string;
  isLegacyV1: boolean;
  createdBy: string;
  image: string;
  workspaceKindId?: string; // ID of the workspace kind this workbench uses
  lastActivity?: string;
  lastUpdate?: string;
  pauseTime?: string;
  pendingRestart?: boolean;
  clusterStorage?: string;
  cpu?: string;
  memory?: string;
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
  // Running + Migrating (highest priority for demo)
  {
    id: 'wb-1',
    name: 'notebook-cpu-small',
    project: 'ds-team-a',
    status: 'Running',
    isLegacyV1: true,
    createdBy: 'alice',
    image: 'quay.io/org/notebook:1.2.3',
    workspaceKindId: 'kind-2', // VS Code Legacy
    isMigrating: true,
    migrationDetails: {
      newWorkbenchName: 'notebook-cpu-small-v2-2024-01-15',
      migrationStatus: 'in-progress',
      initiatedAt: '2024-01-15T10:30:00Z'
    }
  },
  {
    id: 'wb-3',
    name: 'data-analysis-nb',
    project: 'ds-team-a',
    status: 'Running',
    isLegacyV1: true,
    createdBy: 'bob',
    image: 'quay.io/org/notebook:1.2.3',
    workspaceKindId: 'kind-1' // Jupyter Notebook 2.0
  },
  {
    id: 'wb-6',
    name: 'exploratory-analysis',
    project: 'ds-team-b',
    status: 'Running',
    isLegacyV1: true,
    createdBy: 'dave',
    image: 'quay.io/org/notebook:1.2.5',
    workspaceKindId: 'kind-2' // VS Code Legacy
  },
  {
    id: 'wb-14',
    name: 'financial-modeling',
    project: 'finance-team',
    status: 'Running',
    isLegacyV1: true,
    createdBy: 'lisa',
    image: 'quay.io/org/notebook:1.2.7',
    workspaceKindId: 'kind-4' // TensorFlow Legacy
  },
  {
    id: 'wb-15',
    name: 'sentiment-analysis',
    project: 'research-lab',
    status: 'Running',
    isLegacyV1: true,
    createdBy: 'mike',
    image: 'quay.io/org/notebook:1.3.1',
    workspaceKindId: 'kind-2', // VS Code Legacy
    isMigrating: true,
    migrationDetails: {
      newWorkbenchName: 'sentiment-analysis-v2-2024-01-17',
      migrationStatus: 'pending',
      initiatedAt: '2024-01-17T10:30:00Z'
    }
  },
  // Stopped + Migrating
  {
    id: 'wb-16',
    name: 'legacy-data-pipeline',
    project: 'data-ops',
    status: 'Stopped',
    isLegacyV1: true,
    createdBy: 'sarah',
    image: 'quay.io/org/notebook:1.2.4',
    workspaceKindId: 'kind-4' // TensorFlow Legacy
  },
  {
    id: 'wb-4-v2',
    name: 'ml-training-gpu-v2-2024-01-15',
    project: 'ml-platform',
    status: 'Running',
    isLegacyV1: false,
    createdBy: 'alice',
    image: 'quay.io/org/notebook-nb20:2.0.0',
    workspaceKindId: 'kind-3', // PyTorch Training 2.0
    lastActivity: '2024-01-15T12:41:00Z',
    lastUpdate: '2024-01-15T11:55:00Z',
    pauseTime: '-',
    pendingRestart: false,
    clusterStorage: 'cluster-storage-ml',
    cpu: '4',
    memory: '16Gi'
  },
  {
    id: 'wb-4',
    name: 'ml-training-gpu',
    project: 'ml-platform',
    status: 'Stopped',
    isLegacyV1: true,
    createdBy: 'alice',
    image: 'quay.io/org/notebook:1.3.0',
    workspaceKindId: 'kind-2', // VS Code Legacy
    lastActivity: '2024-01-10T08:12:00Z',
    lastUpdate: '2024-01-10T08:10:00Z',
    pauseTime: '5d',
    pendingRestart: true,
    clusterStorage: 'cluster-storage-ml',
    cpu: '2',
    memory: '8Gi',
    isLegacyChild: true,
    parentWorkbenchId: 'wb-4-v2'
  },
  {
    id: 'wb-4a-v2',
    name: 'inference-server-v2-2024-01-16',
    project: 'ml-platform',
    status: 'Running',
    isLegacyV1: false,
    createdBy: 'bob',
    image: 'quay.io/org/notebook-nb20:2.0.1',
    workspaceKindId: 'kind-1', // Jupyter Notebook 2.0
    migratedFromId: 'wb-4a',
    hasBeenStarted: true,
    lastActivity: '2024-01-16T09:20:00Z',
    lastUpdate: '2024-01-16T09:00:00Z',
    pauseTime: '-',
    pendingRestart: false,
    clusterStorage: 'cluster-storage-inference',
    cpu: '1',
    memory: '4Gi'
  },
  {
    id: 'wb-4a',
    name: 'inference-server',
    project: 'ml-platform',
    status: 'Stopped',
    isLegacyV1: true,
    createdBy: 'bob',
    image: 'quay.io/org/notebook:1.3.0',
    workspaceKindId: 'kind-2', // VS Code Legacy
    lastActivity: '2024-01-05T10:20:00Z',
    lastUpdate: '2024-01-05T10:10:00Z',
    pauseTime: '11d',
    pendingRestart: false,
    clusterStorage: 'cluster-storage-inference',
    cpu: '1',
    memory: '2Gi',
    isLegacyChild: true,
    parentWorkbenchId: 'wb-4a-v2'
  },
  // More completed migration pairs
  {
    id: 'wb-17-v2',
    name: 'image-classifier-v2-2024-01-12',
    project: 'cv-team',
    status: 'Running',
    isLegacyV1: false,
    createdBy: 'nina',
    image: 'quay.io/org/notebook-nb20:2.0.2',
    workspaceKindId: 'kind-3', // PyTorch Training 2.0
    migratedFromId: 'wb-17',
    hasBeenStarted: true
  },
  {
    id: 'wb-17',
    name: 'image-classifier',
    project: 'cv-team',
    status: 'Stopped',
    isLegacyV1: true,
    createdBy: 'nina',
    image: 'quay.io/org/notebook:1.2.6',
    workspaceKindId: 'kind-2', // VS Code Legacy
    isLegacyChild: true,
    parentWorkbenchId: 'wb-17-v2'
  },
  {
    id: 'wb-18-v2',
    name: 'recommendation-engine-v2-2024-01-14',
    project: 'ml-platform',
    status: 'Running',
    isLegacyV1: false,
    createdBy: 'oscar',
    image: 'quay.io/org/notebook-nb20:2.0.3',
    workspaceKindId: 'kind-5', // R Studio 2.0
    migratedFromId: 'wb-18',
    hasBeenStarted: true
  },
  {
    id: 'wb-18',
    name: 'recommendation-engine',
    project: 'ml-platform',
    status: 'Stopped',
    isLegacyV1: true,
    createdBy: 'oscar',
    image: 'quay.io/org/notebook:1.3.2',
    workspaceKindId: 'kind-4', // TensorFlow Legacy
    isLegacyChild: true,
    parentWorkbenchId: 'wb-18-v2'
  },
  {
    id: 'wb-19-v2',
    name: 'fraud-detection-v2-2024-01-13',
    project: 'finance-team',
    status: 'Running',
    isLegacyV1: false,
    createdBy: 'paula',
    image: 'quay.io/org/notebook-nb20:2.0.1',
    workspaceKindId: 'kind-1', // Jupyter Notebook 2.0
    migratedFromId: 'wb-19',
    hasBeenStarted: true
  },
  {
    id: 'wb-19',
    name: 'fraud-detection',
    project: 'finance-team',
    status: 'Stopped',
    isLegacyV1: true,
    createdBy: 'paula',
    image: 'quay.io/org/notebook:1.2.9',
    workspaceKindId: 'kind-2', // VS Code Legacy
    isLegacyChild: true,
    parentWorkbenchId: 'wb-19-v2'
  },
  {
    id: 'wb-20-v2',
    name: 'customer-churn-v2-2024-01-11',
    project: 'data-ops',
    status: 'Stopped',
    isLegacyV1: false,
    createdBy: 'quinn',
    image: 'quay.io/org/notebook-nb20:2.0.0',
    workspaceKindId: 'kind-3', // PyTorch Training 2.0
    migratedFromId: 'wb-20'
  },
  {
    id: 'wb-20',
    name: 'customer-churn',
    project: 'data-ops',
    status: 'Running',
    isLegacyV1: true,
    createdBy: 'quinn',
    image: 'quay.io/org/notebook:1.3.0',
    workspaceKindId: 'kind-4' // TensorFlow Legacy
  },
  // Standalone workbenches (not migrated)
  {
    id: 'wb-2',
    name: 'cuda-notebook-2xgpu',
    project: 'ml-platform',
    status: 'Stopped',
    isLegacyV1: false,
    createdBy: 'joel',
    image: 'quay.io/org/notebook-nb20:2.0.0',
    workspaceKindId: 'kind-3' // PyTorch Training 2.0
  },
  {
    id: 'wb-5',
    name: 'model-dev-workspace',
    project: 'research-lab',
    status: 'Stopped',
    isLegacyV1: false,
    createdBy: 'carol',
    image: 'quay.io/org/notebook-nb20:2.0.1',
    workspaceKindId: 'kind-1' // Jupyter Notebook 2.0
  },
  {
    id: 'wb-7',
    name: 'tensorflow-workbench',
    project: 'ml-platform',
    status: 'Running',
    isLegacyV1: false,
    createdBy: 'eve',
    image: 'quay.io/org/notebook-nb20:2.1.0',
    workspaceKindId: 'kind-5' // R Studio 2.0
  },
  {
    id: 'wb-8',
    name: 'pytorch-experiments',
    project: 'research-lab',
    status: 'Stopped',
    isLegacyV1: true,
    createdBy: 'frank',
    image: 'quay.io/org/notebook:1.2.8',
    workspaceKindId: 'kind-2' // VS Code Legacy
  },
  {
    id: 'wb-9',
    name: 'data-prep-notebook',
    project: 'ds-team-a',
    status: 'Running',
    isLegacyV1: true,
    createdBy: 'grace',
    image: 'quay.io/org/notebook:1.3.1',
    workspaceKindId: 'kind-4' // TensorFlow Legacy
  },
  {
    id: 'wb-10',
    name: 'visualization-studio',
    project: 'ds-team-b',
    status: 'Running',
    isLegacyV1: false,
    createdBy: 'henry',
    image: 'quay.io/org/notebook-nb20:2.0.2',
    workspaceKindId: 'kind-1' // Jupyter Notebook 2.0
  },
  {
    id: 'wb-11',
    name: 'nlp-processing-env',
    project: 'research-lab',
    status: 'Stopped',
    isLegacyV1: true,
    createdBy: 'iris',
    image: 'quay.io/org/notebook:1.2.9',
    workspaceKindId: 'kind-2' // VS Code Legacy
  },
  {
    id: 'wb-12',
    name: 'deep-learning-lab',
    project: 'ml-platform',
    status: 'Running',
    isLegacyV1: true,
    createdBy: 'joel',
    image: 'quay.io/org/notebook:1.3.2',
    workspaceKindId: 'kind-4' // TensorFlow Legacy
  },
  {
    id: 'wb-13',
    name: 'batch-inference-nb',
    project: 'ds-team-b',
    status: 'Running',
    isLegacyV1: false,
    createdBy: 'karen',
    image: 'quay.io/org/notebook-nb20:2.0.3',
    workspaceKindId: 'kind-3' // PyTorch Training 2.0
  }
];


// Mock data for Workspace Kinds
const initialWorkspaceKinds: WorkspaceKind[] = [
  {
    id: 'kind-1',
    name: 'Jupyter Notebook 2.0',
    type: 'Jupyter Notebook',
    isLegacyV1: false,
    baseImage: 'quay.io/org/notebook-nb20:2.0.0',
    usageCount: 12,
    isActive: true
  },
  {
    id: 'kind-2',
    name: 'VS Code Legacy',
    type: 'VS Code',
    isLegacyV1: true,
    baseImage: 'quay.io/org/vscode:1.3.0',
    usageCount: 5,
    isActive: true
  },
  {
    id: 'kind-3',
    name: 'PyTorch Training 2.0',
    type: 'PyTorch',
    isLegacyV1: false,
    baseImage: 'quay.io/org/pytorch-nb20:2.1.0',
    usageCount: 8,
    isActive: true
  },
  {
    id: 'kind-4',
    name: 'TensorFlow Legacy',
    type: 'TensorFlow',
    isLegacyV1: true,
    baseImage: 'quay.io/org/tensorflow:1.2.8',
    usageCount: 3,
    isActive: false
  },
  {
    id: 'kind-5',
    name: 'R Studio 2.0',
    type: 'R Studio',
    isLegacyV1: false,
    baseImage: 'quay.io/org/rstudio-nb20:2.0.2',
    usageCount: 4,
    isActive: true
  }
];

// Mock data for Archived Workbenches
const initialArchivedWorkbenches: ArchivedWorkbench[] = [
  {
    id: 'arch-1',
    name: 'old-analysis-notebook',
    project: 'ds-team-a',
    status: 'Archived',
    isLegacyV1: true,
    image: 'quay.io/org/notebook:1.2.3',
    createdBy: 'alice',
    archivedDate: '2024-01-10T10:00:00Z',
    originalMigrationFrom: 'old-analysis-notebook-v2',
    historicalMetadata: {
      'Original Created': '2023-06-15T08:30:00Z',
      'Last Modified': '2024-01-08T14:20:00Z',
      'Total Runtime': '1,234 hours',
      'Data Processed': '2.5 TB'
    }
  },
  {
    id: 'arch-2',
    name: 'legacy-ml-training',
    project: 'ml-platform',
    status: 'Archived',
    isLegacyV1: true,
    image: 'quay.io/org/notebook:1.3.0',
    createdBy: 'bob',
    archivedDate: '2024-01-12T15:30:00Z',
    historicalMetadata: {
      'Original Created': '2023-08-20T09:15:00Z',
      'Last Modified': '2024-01-10T11:45:00Z',
      'Total Runtime': '856 hours',
      'Models Trained': '15'
    }
  },
  {
    id: 'arch-3',
    name: 'deprecated-data-pipeline',
    project: 'data-ops',
    status: 'Archived',
    isLegacyV1: false,
    image: 'quay.io/org/notebook-nb20:2.0.0',
    createdBy: 'carol',
    archivedDate: '2024-01-14T09:00:00Z',
    historicalMetadata: {
      'Original Created': '2023-11-01T10:00:00Z',
      'Last Modified': '2024-01-13T16:30:00Z',
      'Total Runtime': '432 hours',
      'Jobs Processed': '1,234'
    }
  }
];


const Workbenches: React.FunctionComponent = () => {
  const [records, setRecords] = React.useState<WorkbenchRecord[]>(initialRows);
  const [workspaceKinds, setWorkspaceKinds] = React.useState<WorkspaceKind[]>(initialWorkspaceKinds);
  const [archivedWorkbenches, setArchivedWorkbenches] = React.useState<ArchivedWorkbench[]>(initialArchivedWorkbenches);
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [isCreateWorkspaceKindWizardOpen, setIsCreateWorkspaceKindWizardOpen] = React.useState(false);
  const [selectedWorkbenches, setSelectedWorkbenches] = React.useState<LegacyWorkbenchConfig[]>([]);
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([]);

  // Visual style is always side-by-side (Option B)
  const visualStyle: VisualStyle = 'expandable-side-by-side';

  // Expandable rows state
  const [expandedRows, setExpandedRows] = React.useState<string[]>([]);
  const [expandedPanelKebabOpenId, setExpandedPanelKebabOpenId] = React.useState<string | null>(null);

  // Workbench details drawer state (Kubeflow parity: View details)
  const [isWorkbenchDetailsDrawerExpanded, setIsWorkbenchDetailsDrawerExpanded] = React.useState(false);
  const [workbenchDetailsTab, setWorkbenchDetailsTab] = React.useState<string | number>(0);
  const [workbenchDetailsRecord, setWorkbenchDetailsRecord] = React.useState<WorkbenchRecord | null>(null);
  const [workbenchDetailsRelated, setWorkbenchDetailsRelated] = React.useState<WorkbenchRecord | undefined>(undefined);

  // Filtering state
  const [searchValue, setSearchValue] = React.useState('');
  const [statusFilters, setStatusFilters] = React.useState<string[]>([]);
  const [versionFilters, setVersionFilters] = React.useState<string[]>([]);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = React.useState(false);
  const [isVersionFilterOpen, setIsVersionFilterOpen] = React.useState(false);

  // Sorting state
  const [sortBy, setSortBy] = React.useState<{ index: number; direction: 'asc' | 'desc' } | undefined>(undefined);

  // Pagination state
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(15);

  // Tab state
  const [activeTab, setActiveTab] = React.useState<string | number>(0);

  // Column visibility state
  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = React.useState(false);
  const [visibleColumns, setVisibleColumns] = React.useState({
    name: true,
    project: true,
    status: true,
    lastActivity: false, // Hidden by default
    version: true,
    createdBy: true,
    templateImage: true // Shows template name for V2, image name for V1
  });

  // Workspace Kinds filter state - Attribute search
  const [workspaceKindsFilterAttribute, setWorkspaceKindsFilterAttribute] = React.useState<'name' | 'compliance' | 'status'>('name');
  const [workspaceKindsFilterInput, setWorkspaceKindsFilterInput] = React.useState('');
  const [workspaceKindsFilterDropdownOpen, setWorkspaceKindsFilterDropdownOpen] = React.useState(false);
  const [workspaceKindsActiveFilters, setWorkspaceKindsActiveFilters] = React.useState<{
    name: string[];
    compliance: string[];
    status: string[];
  }>({
    name: [],
    compliance: [],
    status: []
  });
  const [selectedWorkspaceKindIds, setSelectedWorkspaceKindIds] = React.useState<string[]>([]);

  // Archive filter state - Attribute search
  const [archiveFilterAttribute, setArchiveFilterAttribute] = React.useState<'name' | 'status' | 'version'>('name');
  const [archiveFilterInput, setArchiveFilterInput] = React.useState('');
  const [archiveFilterDropdownOpen, setArchiveFilterDropdownOpen] = React.useState(false);
  const [archiveActiveFilters, setArchiveActiveFilters] = React.useState<{
    name: string[];
    status: string[];
    version: string[];
  }>({
    name: [],
    status: [],
    version: []
  });
  const [selectedArchiveIds, setSelectedArchiveIds] = React.useState<string[]>([]);

  // Workbenches filter state - Attribute search
  const [workbenchesFilterAttribute, setWorkbenchesFilterAttribute] = React.useState<'name' | 'status' | 'version' | 'workspaceKind'>('name');
  const [workbenchesFilterInput, setWorkbenchesFilterInput] = React.useState('');
  const [workbenchesFilterDropdownOpen, setWorkbenchesFilterDropdownOpen] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState<{
    name: string[];
    status: string[];
    version: string[];
    workspaceKind: string[];
  }>({
    name: [],
    status: [],
    version: [],
    workspaceKind: []
  });

  // Filter helper functions
  const addFilter = (tab: 'workbenches' | 'workspaceKinds' | 'archive', attribute: string, value: string) => {
    if (tab === 'workbenches') {
      setActiveFilters(prev => {
        const newFilters = { ...prev };
        if (!newFilters[attribute as keyof typeof newFilters].includes(value)) {
          newFilters[attribute as keyof typeof newFilters] = [...newFilters[attribute as keyof typeof newFilters], value];
        }
        return newFilters;
      });
      setWorkbenchesFilterInput('');
    } else if (tab === 'workspaceKinds') {
      setWorkspaceKindsActiveFilters(prev => {
        const newFilters = { ...prev };
        if (!newFilters[attribute as keyof typeof newFilters].includes(value)) {
          newFilters[attribute as keyof typeof newFilters] = [...newFilters[attribute as keyof typeof newFilters], value];
        }
        return newFilters;
      });
      setWorkspaceKindsFilterInput('');
    } else if (tab === 'archive') {
      setArchiveActiveFilters(prev => {
        const newFilters = { ...prev };
        if (!newFilters[attribute as keyof typeof newFilters].includes(value)) {
          newFilters[attribute as keyof typeof newFilters] = [...newFilters[attribute as keyof typeof newFilters], value];
        }
        return newFilters;
      });
      setArchiveFilterInput('');
    }
  };

  const removeFilter = (tab: 'workbenches' | 'workspaceKinds' | 'archive', attribute: string, value: string) => {
    if (tab === 'workbenches') {
      setActiveFilters(prev => ({
        ...prev,
        [attribute]: prev[attribute as keyof typeof prev].filter(f => f !== value)
      }));
    } else if (tab === 'workspaceKinds') {
      setWorkspaceKindsActiveFilters(prev => ({
        ...prev,
        [attribute]: prev[attribute as keyof typeof prev].filter(f => f !== value)
      }));
    } else if (tab === 'archive') {
      setArchiveActiveFilters(prev => ({
        ...prev,
        [attribute]: prev[attribute as keyof typeof prev].filter(f => f !== value)
      }));
    }
  };

  const clearAllFilters = (tab: 'workbenches' | 'workspaceKinds' | 'archive') => {
    if (tab === 'workbenches') {
      setActiveFilters({
        name: [],
        status: [],
        version: [],
        workspaceKind: []
      });
      setWorkbenchesFilterInput('');
    } else if (tab === 'workspaceKinds') {
      setWorkspaceKindsActiveFilters({
        name: [],
        compliance: [],
        status: []
      });
      setWorkspaceKindsFilterInput('');
    } else if (tab === 'archive') {
      setArchiveActiveFilters({
        name: [],
        status: [],
        version: []
      });
      setArchiveFilterInput('');
    }
  };

  // Helper to calculate colSpan for expanded rows based on visible columns
  const getColSpan = (): number => {
    let count = 2; // Expand column + Select column
    if (visibleColumns.name) count++;
    if (visibleColumns.project) count++;
    if (visibleColumns.status) count++;
    if (visibleColumns.lastActivity) count++;
    if (visibleColumns.version) count++;
    if (visibleColumns.createdBy) count++;
    if (visibleColumns.templateImage) count++;
    count++; // Actions column
    return count;
  };

  // Filtered records based on search and filters
  const filteredRecords = React.useMemo(() => {
    let filtered = records.filter((record) => {

      // Attribute search filters
      const matchesName = activeFilters.name.length === 0 ||
        activeFilters.name.some(filter => 
          record.name.toLowerCase().includes(filter.toLowerCase()) ||
          record.project.toLowerCase().includes(filter.toLowerCase()) ||
          record.createdBy.toLowerCase().includes(filter.toLowerCase())
        );

      const matchesStatus = activeFilters.status.length === 0 ||
        activeFilters.status.includes(record.status) ||
        (record.isMigrating && activeFilters.status.includes('Migrating'));

      const versionLabel = record.isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant';
      const matchesVersion = activeFilters.version.length === 0 ||
        activeFilters.version.includes(versionLabel);

      const matchesWorkspaceKind = activeFilters.workspaceKind.length === 0 ||
        (record.workspaceKindId && activeFilters.workspaceKind.some(filter => {
          const kind = workspaceKinds.find(k => k.id === record.workspaceKindId);
          return kind && (kind.name.toLowerCase().includes(filter.toLowerCase()) || kind.id === filter);
        }));

      // For side-by-side mode: hide V1 workbenches that have a parent V2 (they show in expanded row)
      if (record.isLegacyChild && record.parentWorkbenchId) {
        return false;
      }

      return matchesName && matchesStatus && matchesVersion && matchesWorkspaceKind;
    });

    // Default sort: by name alphabetically (unless user has selected a sort)
    if (!sortBy) {
      filtered = [...filtered].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    }

    let sorted = filtered;

    // Apply column sorting if specified
    if (sortBy) {
      const sortedCopy = [...sorted];
      sortedCopy.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        // Index mapping: 0=Name, 1=Project, 2=Status, 3=Last activity, 4=Version, 5=Created By, 6=Template/Image
        switch (sortBy.index) {
          case 0: // Name
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 1: // Project
            aValue = a.project.toLowerCase();
            bValue = b.project.toLowerCase();
            break;
          case 2: // Status
            aValue = a.status;
            bValue = b.status;
            break;
          case 3: { // Last activity
            const aTime = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
            const bTime = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
            aValue = aTime;
            bValue = bTime;
            break;
          }
          case 4: // Version/Compliance
            aValue = a.isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant';
            bValue = b.isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant';
            break;
          case 5: // Created By
            aValue = a.createdBy.toLowerCase();
            bValue = b.createdBy.toLowerCase();
            break;
          case 6: // Template/Image
            aValue = getTemplateImageDisplay(a).toLowerCase();
            bValue = getTemplateImageDisplay(b).toLowerCase();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortBy.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortBy.direction === 'asc' ? 1 : -1;
        return 0;
      });
      return sortedCopy;
    }

    return sorted;
  }, [records, activeFilters, sortBy, workspaceKinds]);

  // Paginated records
  const paginatedRecords = React.useMemo(() => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return filteredRecords.slice(startIndex, endIndex);
  }, [filteredRecords, page, perPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setPage(1);
  }, [activeFilters]);

  // Filtered archived workbenches
  const filteredArchivedWorkbenches = React.useMemo(() => {
    return archivedWorkbenches.filter((archived) => {
      const matchesName = archiveActiveFilters.name.length === 0 ||
        archiveActiveFilters.name.some(filter =>
          archived.name.toLowerCase().includes(filter.toLowerCase()) ||
          archived.project.toLowerCase().includes(filter.toLowerCase())
        );
      
      const matchesStatus = archiveActiveFilters.status.length === 0 ||
        archiveActiveFilters.status.includes(archived.status);
      
      const versionLabel = archived.isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant';
      const matchesVersion = archiveActiveFilters.version.length === 0 ||
        archiveActiveFilters.version.includes(versionLabel);
      
      return matchesName && matchesStatus && matchesVersion;
    });
  }, [archivedWorkbenches, archiveActiveFilters]);

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

  // Sort handler
  const handleSort = (_event: unknown, index: number, direction: 'asc' | 'desc') => {
    setSortBy({ index, direction });
  };

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

  // Helper to get related workbench
  const getRelatedWorkbench = (record: WorkbenchRecord): WorkbenchRecord | undefined => {
    if (record.isLegacyChild && record.parentWorkbenchId) {
      return records.find(r => r.id === record.parentWorkbenchId);
    }
    if (record.migratedFromId) {
      return records.find(r => r.id === record.migratedFromId);
    }
    return undefined;
  };

  const openWorkbenchDetailsDrawer = (record: WorkbenchRecord) => {
    setWorkbenchDetailsRecord(record);
    setWorkbenchDetailsRelated(getRelatedWorkbench(record));
    setWorkbenchDetailsTab(0);
    setIsWorkbenchDetailsDrawerExpanded(true);
  };

  const closeWorkbenchDetailsDrawer = () => {
    setIsWorkbenchDetailsDrawerExpanded(false);
    setWorkbenchDetailsRecord(null);
    setWorkbenchDetailsRelated(undefined);
  };

  // Helper to get workspace kind name for a workbench
  const getWorkspaceKindName = (record: WorkbenchRecord): string => {
    if (record.workspaceKindId) {
      const kind = workspaceKinds.find(k => k.id === record.workspaceKindId);
      return kind ? kind.name : 'Unknown';
    }
    return 'Not assigned';
  };

  // Helper to get Template/Image display (template name for V2, image name for V1)
  const getTemplateImageDisplay = (record: WorkbenchRecord): string => {
    if (record.isLegacyV1) {
      // For V1: Show image name (extract from full path)
      // e.g., "quay.io/org/notebook:1.2.3" -> "notebook:1.2.3"
      const parts = record.image.split('/');
      return parts[parts.length - 1] || record.image;
    }
    // For V2: Show template name
    if (record.workspaceKindId) {
      const kind = workspaceKinds.find(k => k.id === record.workspaceKindId);
      return kind ? kind.name : 'Not assigned';
    }
    return 'Not assigned';
  };

  // Helper to render name cell
  const renderNameCell = (record: WorkbenchRecord) => {
    return record.name;
  };

  // Helper to get status color
  const getStatusColor = (status: string, isMigrating: boolean) => {
    if (isMigrating) {
      return 'blue';
    }
    switch (status) {
      case 'Running':
        return 'blue';
      case 'Stopped':
        return 'grey';
      case 'Ready':
        return 'blue';
      case 'Migrating':
        return 'orange';
      default:
        return 'grey';
    }
  };

  // Helper to render status cell
  const renderPrimaryStatusLabel = (record: WorkbenchRecord) => {
    const statusColor = getStatusColor(record.status, !!record.isMigrating);
    const displayStatus = record.isMigrating ? 'Migrating' : record.status;

    return (
      <Label id={`status-${record.id}`} color={statusColor}>
        {displayStatus}
      </Label>
    );
  };

  const renderStatusCell = (record: WorkbenchRecord) => {
    const relatedWorkbench = getRelatedWorkbench(record);

    // For side-by-side: show stacked status labels when there's a related workbench
    if (relatedWorkbench && !record.isLegacyChild) {
      const legacyStatusColor = getStatusColor(relatedWorkbench.status, false);

      return (
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsNone' }}>
          <FlexItem>
            {renderPrimaryStatusLabel(record)}
          </FlexItem>
          <FlexItem style={{ marginTop: '0.25rem' }}>
            <Label id={`status-legacy-${record.id}`} color={legacyStatusColor} style={{ fontSize: '0.75rem' }}>
              Legacy: {relatedWorkbench.status}
            </Label>
          </FlexItem>
        </Flex>
      );
    }

    return renderPrimaryStatusLabel(record);
  };

  // Helper to render version cell
  const renderVersionCell = (record: WorkbenchRecord) => {
    return (
      <Label id={record.isLegacyV1 ? 'label-legacy-v1' : 'label-nb20'} color={record.isLegacyV1 ? 'grey' : 'blue'}>
        {record.isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant'}
      </Label>
    );
  };

  // Helper to get row styling based on visual style
  const getRowStyle = (record: WorkbenchRecord): React.CSSProperties => {
    return {};
  };

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

    const viewDetails: IAction = {
      title: 'View Details',
      onClick: () => {
        openWorkbenchDetailsDrawer(record);
      }
    };

    const edit: IAction = {
      title: 'Edit',
      onClick: () => {
        // eslint-disable-next-line no-console
        console.log('Edit clicked for', record.id);
        // TODO: Open edit dialog/modal
      }
    };

    const restart: IAction = {
      title: 'Restart',
      onClick: () => {
        // eslint-disable-next-line no-console
        console.log('Restart clicked for', record.id);
        // Restart logic: stop then start
        setRecords(prevRecords => prevRecords.map(r => {
          if (r.id === record.id && r.status === 'Running') {
            // Simulate restart: briefly stop then start
            setTimeout(() => {
              setRecords(prev => prev.map(rec => 
                rec.id === record.id ? { ...rec, status: 'Running' } : rec
              ));
            }, 1000);
            return { ...r, status: 'Stopped' };
          }
          return r;
        }));
      }
    };

    const deleteAction: IAction = {
      title: 'Delete',
      // eslint-disable-next-line no-console
      onClick: () => console.log('Delete clicked for', record.id)
    };

    // Build actions based on status and type
    const actions: IAction[] = [];
    
    // Add Start/Stop/Restart based on status
    if (record.status === 'Stopped') {
      actions.push(start);
    } else if (record.status === 'Running') {
      actions.push(stop);
      actions.push(restart);
    }

    // Add other actions
    if (record.isLegacyV1) {
      actions.push(migrate);
    }
    actions.push(open);
    actions.push({ isSeparator: true });
    actions.push(viewDetails, edit);
    actions.push({ isSeparator: true });
    actions.push(deleteAction);

    return actions;
  };

  return (
    <>
      <PageSection aria-label="Workbenches Tabs" id="workbenches-tabs">
        <Tabs
          activeKey={activeTab}
          onSelect={(_event, tabIndex) => setActiveTab(tabIndex)}
          aria-label="Workbenches tabs"
        >
          <Tab eventKey={0} title={<TabTitleText>Workbenches</TabTitleText>}>
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Workspace Kinds</TabTitleText>}>
          </Tab>
          <Tab eventKey={2} title={<TabTitleText>Archive</TabTitleText>}>
          </Tab>
        </Tabs>
      </PageSection>

      {activeTab === 0 && (
        <Drawer id="workbench-details-drawer" isExpanded={isWorkbenchDetailsDrawerExpanded}>
          <DrawerContent
            panelContent={
              <DrawerPanelContent id="workbench-details-drawer-panel">
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                  <FlexItem>
                    <Title headingLevel="h3" id="workbench-details-title">
                      Workbench details
                    </Title>
                  </FlexItem>
                  <FlexItem>
                    <Button
                      id="workbench-details-close"
                      variant="plain"
                      aria-label="Close workbench details"
                      onClick={closeWorkbenchDetailsDrawer}
                    >
                      <TimesIcon />
                    </Button>
                  </FlexItem>
                </Flex>

                <Tabs
                  id="workbench-details-tabs"
                  activeKey={workbenchDetailsTab}
                  onSelect={(_event, tabIndex) => setWorkbenchDetailsTab(tabIndex)}
                  aria-label="Workbench details tabs"
                >
                  <Tab eventKey={0} title={<TabTitleText>Overview</TabTitleText>} />
                  <Tab eventKey={1} title={<TabTitleText>Activity</TabTitleText>} />
                </Tabs>

                <div style={{ marginTop: 'var(--pf-v6-global--spacer--md)' }}>
                  {!workbenchDetailsRecord && (
                    <Content component={ContentVariants.p} id="workbench-details-empty">
                      Select <strong>View details</strong> to see workbench information.
                    </Content>
                  )}

                  {workbenchDetailsRecord && workbenchDetailsTab === 0 && (
                    <DescriptionList isHorizontal isCompact id="workbench-details-overview">
                      <DescriptionListGroup>
                        <DescriptionListTerm>Name</DescriptionListTerm>
                        <DescriptionListDescription>{workbenchDetailsRecord.name}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Project</DescriptionListTerm>
                        <DescriptionListDescription>{workbenchDetailsRecord.project}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Status</DescriptionListTerm>
                        <DescriptionListDescription>{renderPrimaryStatusLabel(workbenchDetailsRecord)}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Version</DescriptionListTerm>
                        <DescriptionListDescription>{renderVersionCell(workbenchDetailsRecord)}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Template/Image</DescriptionListTerm>
                        <DescriptionListDescription>{getTemplateImageDisplay(workbenchDetailsRecord)}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Created by</DescriptionListTerm>
                        <DescriptionListDescription>{workbenchDetailsRecord.createdBy}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Cluster storage</DescriptionListTerm>
                        <DescriptionListDescription>{workbenchDetailsRecord.clusterStorage || '-'}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>CPU / Memory</DescriptionListTerm>
                        <DescriptionListDescription>
                          {workbenchDetailsRecord.cpu && workbenchDetailsRecord.memory
                            ? `${workbenchDetailsRecord.cpu} / ${workbenchDetailsRecord.memory}`
                            : '-'}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Image</DescriptionListTerm>
                        <DescriptionListDescription>{workbenchDetailsRecord.image}</DescriptionListDescription>
                      </DescriptionListGroup>
                      {workbenchDetailsRelated && (
                        <DescriptionListGroup>
                          <DescriptionListTerm>Related workbench</DescriptionListTerm>
                          <DescriptionListDescription>{workbenchDetailsRelated.name}</DescriptionListDescription>
                        </DescriptionListGroup>
                      )}
                    </DescriptionList>
                  )}

                  {workbenchDetailsRecord && workbenchDetailsTab === 1 && (
                    <DescriptionList isHorizontal isCompact id="workbench-details-activity">
                      <DescriptionListGroup>
                        <DescriptionListTerm>Last activity</DescriptionListTerm>
                        <DescriptionListDescription>
                          {workbenchDetailsRecord.lastActivity
                            ? new Date(workbenchDetailsRecord.lastActivity).toLocaleString()
                            : '-'}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Last update</DescriptionListTerm>
                        <DescriptionListDescription>
                          {workbenchDetailsRecord.lastUpdate
                            ? new Date(workbenchDetailsRecord.lastUpdate).toLocaleString()
                            : '-'}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Pause time</DescriptionListTerm>
                        <DescriptionListDescription>{workbenchDetailsRecord.pauseTime || '-'}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Pending restart</DescriptionListTerm>
                        <DescriptionListDescription>
                          {typeof workbenchDetailsRecord.pendingRestart === 'boolean'
                            ? (workbenchDetailsRecord.pendingRestart ? 'Yes' : 'No')
                            : '-'}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  )}
                </div>
              </DrawerPanelContent>
            }
          >
            <DrawerContentBody id="workbench-details-drawer-body">
              <PageSection aria-label="Workbenches Header" id="workbenches-header">
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: 'var(--pf-v6-global--spacer--md)',
                }}>
                  <div>
                    <Title headingLevel="h2" id="workbenches-title">
                      Workbenches
                    </Title>
                    <Content component={ContentVariants.p}>
                      Monitor and manage all active workbenches. Use bulk actions below to migrate legacy V1 resources.
                    </Content>
                  </div>
                </div>
              </PageSection>

              <PageSection id="workbenches-content-section">
        <Toolbar id="workbenches-toolbar" inset={{ default: 'insetNone' }} style={{ columnGap: '16px', paddingBottom: '0px' }} clearAllFilters={() => clearAllFilters('workbenches')}>
          <ToolbarContent>
            <ToolbarGroup variant="filter-group">
              <ToolbarItem>
                <InputGroup>
                  <InputGroupItem>
                    <Dropdown
                      isOpen={workbenchesFilterDropdownOpen}
                      onOpenChange={(isOpen) => setWorkbenchesFilterDropdownOpen(isOpen)}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setWorkbenchesFilterDropdownOpen(!workbenchesFilterDropdownOpen)}
                          isExpanded={workbenchesFilterDropdownOpen}
                          icon={<FilterIcon style={{ marginRight: '0.5rem' }} />}
                        >
                          {workbenchesFilterAttribute === 'name' ? 'Name' :
                           workbenchesFilterAttribute === 'status' ? 'Status' :
                           workbenchesFilterAttribute === 'version' ? 'Version' :
                           'Template/Image'}
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem onClick={() => setWorkbenchesFilterAttribute('name')}>Name</DropdownItem>
                        <DropdownItem onClick={() => setWorkbenchesFilterAttribute('status')}>Status</DropdownItem>
                        <DropdownItem onClick={() => setWorkbenchesFilterAttribute('version')}>Version</DropdownItem>
                        <DropdownItem onClick={() => setWorkbenchesFilterAttribute('workspaceKind')}>Template/Image</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </InputGroupItem>
                  <InputGroupItem isFill>
                    <SearchInput
                      placeholder={`Filter by ${workbenchesFilterAttribute === 'name' ? 'name, project, or user' :
                                   workbenchesFilterAttribute === 'status' ? 'status' :
                                   workbenchesFilterAttribute === 'version' ? 'version' :
                                   'template/image'}`}
                      value={workbenchesFilterInput}
                      onChange={(_event, value) => setWorkbenchesFilterInput(value)}
                      onClear={() => setWorkbenchesFilterInput('')}
                      onSearch={() => {
                        if (workbenchesFilterInput.trim()) {
                          addFilter('workbenches', workbenchesFilterAttribute, workbenchesFilterInput.trim());
                        }
                      }}
                      id="workbenches-attribute-search"
                    />
                  </InputGroupItem>
                </InputGroup>
              </ToolbarItem>
              <ToolbarItem>
                <Select
                  isOpen={isColumnSelectorOpen}
                  onOpenChange={(isOpen) => setIsColumnSelectorOpen(isOpen)}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsColumnSelectorOpen(!isColumnSelectorOpen)}
                      isExpanded={isColumnSelectorOpen}
                      variant="plain"
                      aria-label="Column management"
                      id="column-selector-toggle"
                      icon={<ThIcon />}
                    >
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    <SelectOption
                      hasCheckbox
                      isSelected={visibleColumns.name}
                      value="name"
                      onClick={() => setVisibleColumns({ ...visibleColumns, name: !visibleColumns.name })}
                    >
                      Name
                    </SelectOption>
                    <SelectOption
                      hasCheckbox
                      isSelected={visibleColumns.project}
                      value="project"
                      onClick={() => setVisibleColumns({ ...visibleColumns, project: !visibleColumns.project })}
                    >
                      Project
                    </SelectOption>
                    <SelectOption
                      hasCheckbox
                      isSelected={visibleColumns.status}
                      value="status"
                      onClick={() => setVisibleColumns({ ...visibleColumns, status: !visibleColumns.status })}
                    >
                      Status
                    </SelectOption>
                    <SelectOption
                      hasCheckbox
                      isSelected={visibleColumns.lastActivity}
                      value="lastActivity"
                      onClick={() => setVisibleColumns({ ...visibleColumns, lastActivity: !visibleColumns.lastActivity })}
                    >
                      Last activity
                    </SelectOption>
                    <SelectOption
                      hasCheckbox
                      isSelected={visibleColumns.version}
                      value="version"
                      onClick={() => setVisibleColumns({ ...visibleColumns, version: !visibleColumns.version })}
                    >
                      Version/Compliance
                    </SelectOption>
                    <SelectOption
                      hasCheckbox
                      isSelected={visibleColumns.createdBy}
                      value="createdBy"
                      onClick={() => setVisibleColumns({ ...visibleColumns, createdBy: !visibleColumns.createdBy })}
                    >
                      Created By
                    </SelectOption>
                    <SelectOption
                      hasCheckbox
                      isSelected={visibleColumns.templateImage}
                      value="templateImage"
                      onClick={() => setVisibleColumns({ ...visibleColumns, templateImage: !visibleColumns.templateImage })}
                    >
                      Template/Image
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
                <Button
                  id="migrate-workbenches-button"
                  variant="secondary"
                  isDisabled={selectedLegacyV1Count === 0}
                  onClick={() => openBulkMigrationWizard()}
                >
                  Migrate Workbenches ({selectedLegacyV1Count} Selected)
                </Button>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        {/* Active Filters */}
        {(activeFilters.name.length > 0 || activeFilters.status.length > 0 || activeFilters.version.length > 0 || activeFilters.workspaceKind.length > 0) && (
          <div style={{ marginBottom: '16px', marginTop: '0px' }}>
            <LabelGroup
              categoryName="Active filters"
              isClosable={false}
              numLabels={activeFilters.name.length + activeFilters.status.length + activeFilters.version.length + activeFilters.workspaceKind.length}
            >
              {activeFilters.name.map(filter => (
                <Label 
                  key={`name-${filter}`}
                  variant="outline"
                  onClose={() => removeFilter('workbenches', 'name', filter)}
                >
                  Name: {filter}
                </Label>
              ))}
              {activeFilters.status.map(filter => (
                <Label 
                  key={`status-${filter}`}
                  variant="outline"
                  onClose={() => removeFilter('workbenches', 'status', filter)}
                >
                  Status: {filter}
                </Label>
              ))}
              {activeFilters.version.map(filter => (
                <Label 
                  key={`version-${filter}`}
                  variant="outline"
                  onClose={() => removeFilter('workbenches', 'version', filter)}
                >
                  Version: {filter}
                </Label>
              ))}
              {activeFilters.workspaceKind.map(kindId => {
                const kind = workspaceKinds.find(k => k.id === kindId);
                return (
                  <Label 
                    key={`workspace-kind-${kindId}`}
                    variant="outline"
                    onClose={() => removeFilter('workbenches', 'workspaceKind', kindId)}
                  >
                    Template/Image: {kind?.name || kindId}
                  </Label>
                );
              })}
            </LabelGroup>
            <Button 
              variant="link" 
              onClick={() => clearAllFilters('workbenches')} 
              style={{ marginTop: '0.5rem' }}
            >
              Clear all filters
            </Button>
          </div>
        )}

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
              {visibleColumns.name && (
                <Th
                  sort={{
                    sortBy: sortBy?.index === 0 ? sortBy : { index: 0, direction: 'asc' as const },
                    onSort: handleSort,
                    columnIndex: 0
                  }}
                >
                  Name
                </Th>
              )}
              {visibleColumns.project && (
                <Th
                  sort={{
                    sortBy: sortBy?.index === 1 ? sortBy : { index: 1, direction: 'asc' as const },
                    onSort: handleSort,
                    columnIndex: 1
                  }}
                >
                  Project
                </Th>
              )}
              {visibleColumns.status && (
                <Th
                  sort={{
                    sortBy: sortBy?.index === 2 ? sortBy : { index: 2, direction: 'asc' as const },
                    onSort: handleSort,
                    columnIndex: 2
                  }}
                >
                  Status
                </Th>
              )}
              {visibleColumns.lastActivity && (
                <Th
                  sort={{
                    sortBy: sortBy?.index === 3 ? sortBy : { index: 3, direction: 'asc' as const },
                    onSort: handleSort,
                    columnIndex: 3
                  }}
                >
                  Last activity
                </Th>
              )}
                  {visibleColumns.version && (
                    <Th
                      sort={{
                    sortBy: sortBy?.index === 4 ? sortBy : { index: 4, direction: 'asc' as const },
                        onSort: handleSort,
                    columnIndex: 4
                      }}
                    >
                      Version/Compliance
                    </Th>
                  )}
                  {visibleColumns.createdBy && (
                    <Th
                      sort={{
                    sortBy: sortBy?.index === 5 ? sortBy : { index: 5, direction: 'asc' as const },
                        onSort: handleSort,
                    columnIndex: 5
                      }}
                    >
                      Created By
                    </Th>
                  )}
                  {visibleColumns.templateImage && (
                    <Th
                      sort={{
                    sortBy: sortBy?.index === 6 ? sortBy : { index: 6, direction: 'asc' as const },
                        onSort: handleSort,
                    columnIndex: 6
                      }}
                    >
                      Template/Image
                    </Th>
                  )}
              <Th screenReaderText="Actions"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedRecords.map((r, rowIndex) => {
              const relatedWorkbench = getRelatedWorkbench(r);
              const canExpand = !r.isLegacyV1 && relatedWorkbench !== undefined;
              const isExpanded = expandedRows.includes(r.id);

              return (
              <React.Fragment key={r.id}>
                <Tr style={getRowStyle(r)}>
                  {canExpand || r.isMigrating ? (
                    <Td
                      expand={{
                        rowIndex: rowIndex,
                        isExpanded: isExpanded,
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
                  {visibleColumns.name && (
                    <Td dataLabel="Name">
                      {renderNameCell(r)}
                    </Td>
                  )}
                  {visibleColumns.project && (
                    <Td dataLabel="Project">{r.project}</Td>
                  )}
                  {visibleColumns.status && (
                    <Td dataLabel="Status">
                      {renderStatusCell(r)}
                    </Td>
                  )}
                  {visibleColumns.lastActivity && (
                    <Td dataLabel="Last activity">
                      {r.lastActivity ? new Date(r.lastActivity).toLocaleString() : '-'}
                    </Td>
                  )}
                  {visibleColumns.version && (
                    <Td dataLabel="Version/Compliance">{renderVersionCell(r)}</Td>
                  )}
                  {visibleColumns.createdBy && (
                    <Td dataLabel="Created By">{r.createdBy}</Td>
                  )}
                  {visibleColumns.templateImage && (
                    <Td dataLabel="Template/Image">
                      {r.isLegacyV1 ? (
                        <code style={{ fontSize: 'var(--pf-t--global--font--size--sm)' }}>
                          {getTemplateImageDisplay(r)}
                        </code>
                      ) : (
                        getTemplateImageDisplay(r)
                      )}
                    </Td>
                  )}
                  <Td isActionCell dataLabel="Actions">
                    {/* For expandable (V2 + legacy) rows, actions live inside the expanded panels */}
                    {!canExpand && <ActionsColumn items={buildActions(r)} popperProps={{ position: 'right' }} />}
                  </Td>
                </Tr>
                {r.isMigrating && r.migrationDetails && (
                  <Tr key={`${r.id}-expanded`} isExpanded={expandedRows.includes(r.id)}>
                    <Td />
                    <Td colSpan={getColSpan()}>
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
                {/* Side-by-side expansion for V2 workbenches with legacy */}
                {canExpand && isExpanded && relatedWorkbench && (
                  <Tr key={`${r.id}-side-by-side`} isExpanded={true}>
                    <Td />
                    <Td colSpan={getColSpan()}>
                      <div style={{ padding: '1rem', backgroundColor: '#f5f5f5' }}>
                        <Flex>
                          <FlexItem flex={{ default: 'flex_1' }}>
                            <div style={{ padding: '1rem', backgroundColor: '#fff', borderLeft: '3px solid #06c', marginRight: '0.5rem' }}>
                              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                                <FlexItem>
                                  <Title headingLevel="h6" style={{ marginBottom: '0.75rem' }}>
                                    New Workbench (V2)
                                  </Title>
                                </FlexItem>
                                <FlexItem>
                                  <Dropdown
                                    id={`expanded-v2-kebab-${r.id}`}
                                    isOpen={expandedPanelKebabOpenId === `${r.id}-v2`}
                                    onOpenChange={(isOpen) => setExpandedPanelKebabOpenId(isOpen ? `${r.id}-v2` : null)}
                                    toggle={(toggleRef) => (
                                      <MenuToggle
                                        ref={toggleRef}
                                        id={`expanded-v2-kebab-toggle-${r.id}`}
                                        variant="plain"
                                        aria-label={`Actions for new workbench ${r.name}`}
                                        isExpanded={expandedPanelKebabOpenId === `${r.id}-v2`}
                                      >
                                        <EllipsisVIcon />
                                      </MenuToggle>
                                    )}
                                  >
                                    <DropdownList>
                                      <DropdownItem
                                        id={`expanded-v2-view-details-${r.id}`}
                                        onClick={() => {
                                          setExpandedPanelKebabOpenId(null);
                                          openWorkbenchDetailsDrawer(r);
                                        }}
                                      >
                                        View details
                                      </DropdownItem>
                                      <DropdownItem
                                        id={`expanded-v2-edit-${r.id}`}
                                        onClick={() => {
                                          setExpandedPanelKebabOpenId(null);
                                          // eslint-disable-next-line no-console
                                          console.log('Edit (V2) clicked for', r.id);
                                        }}
                                      >
                                        Edit
                                      </DropdownItem>
                                      <DropdownItem
                                        id={`expanded-v2-restart-${r.id}`}
                                        onClick={() => {
                                          setExpandedPanelKebabOpenId(null);
                                          // eslint-disable-next-line no-console
                                          console.log('Restart (V2) clicked for', r.id);
                                          // Simulate restart: stop then start
                                          setRecords(prevRecords => prevRecords.map(rec => (
                                            rec.id === r.id ? { ...rec, status: 'Stopped' } : rec
                                          )));
                                          setTimeout(() => {
                                            setRecords(prevRecords => prevRecords.map(rec => (
                                              rec.id === r.id ? { ...rec, status: 'Running', hasBeenStarted: true } : rec
                                            )));
                                          }, 1000);
                                        }}
                                      >
                                        Restart
                                      </DropdownItem>
                                      <DropdownItem
                                        id={`expanded-v2-delete-${r.id}`}
                                        isDanger
                                        onClick={() => {
                                          setExpandedPanelKebabOpenId(null);
                                          // eslint-disable-next-line no-console
                                          console.log('Delete (V2) clicked for', r.id);
                                        }}
                                      >
                                        Delete
                                      </DropdownItem>
                                    </DropdownList>
                                  </Dropdown>
                                </FlexItem>
                              </Flex>
                              <DescriptionList isHorizontal isCompact>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Name</DescriptionListTerm>
                                  <DescriptionListDescription>{r.name}</DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Status</DescriptionListTerm>
                                  <DescriptionListDescription>{renderPrimaryStatusLabel(r)}</DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Version</DescriptionListTerm>
                                  <DescriptionListDescription>
                                    <Label color="blue">NB 2.0 Compliant</Label>
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Template/Image</DescriptionListTerm>
                                  <DescriptionListDescription>{getTemplateImageDisplay(r)}</DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Cluster storage</DescriptionListTerm>
                                  <DescriptionListDescription>{r.clusterStorage || '-'}</DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>CPU / Memory</DescriptionListTerm>
                                  <DescriptionListDescription>{r.cpu && r.memory ? `${r.cpu} / ${r.memory}` : '-'}</DescriptionListDescription>
                                </DescriptionListGroup>
                              </DescriptionList>
                              <Flex style={{ marginTop: '1rem' }} spaceItems={{ default: 'spaceItemsMd' }}>
                                <FlexItem>
                                  {r.status === 'Stopped' ? (
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() => {
                                        setRecords(prevRecords => prevRecords.map(rec =>
                                          rec.id === r.id ? { ...rec, status: 'Running' } : rec
                                        ));
                                      }}
                                    >
                                      Start
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => {
                                        setRecords(prevRecords => prevRecords.map(rec =>
                                          rec.id === r.id ? { ...rec, status: 'Stopped' } : rec
                                        ));
                                      }}
                                    >
                                      Stop
                                    </Button>
                                  )}
                                </FlexItem>
                                <FlexItem>
                                  <Button variant="link" size="sm">Open</Button>
                                </FlexItem>
                              </Flex>
                            </div>
                          </FlexItem>
                          <FlexItem flex={{ default: 'flex_1' }}>
                            <div style={{ padding: '1rem', backgroundColor: '#e6f3ff', borderLeft: '3px solid #0066cc', marginLeft: '0.5rem' }}>
                              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                                <FlexItem>
                                  <Title headingLevel="h6" style={{ marginBottom: '0.75rem' }}>
                                    Legacy Workbench (V1)
                                  </Title>
                                </FlexItem>
                                <FlexItem>
                                  <Dropdown
                                    id={`expanded-v1-kebab-${r.id}`}
                                    isOpen={expandedPanelKebabOpenId === `${r.id}-v1`}
                                    onOpenChange={(isOpen) => setExpandedPanelKebabOpenId(isOpen ? `${r.id}-v1` : null)}
                                    toggle={(toggleRef) => (
                                      <MenuToggle
                                        ref={toggleRef}
                                        id={`expanded-v1-kebab-toggle-${r.id}`}
                                        variant="plain"
                                        aria-label={`Actions for legacy workbench ${relatedWorkbench.name}`}
                                        isExpanded={expandedPanelKebabOpenId === `${r.id}-v1`}
                                      >
                                        <EllipsisVIcon />
                                      </MenuToggle>
                                    )}
                                  >
                                    <DropdownList>
                                      <DropdownItem
                                        id={`expanded-v1-view-details-${r.id}`}
                                        onClick={() => {
                                          setExpandedPanelKebabOpenId(null);
                                          openWorkbenchDetailsDrawer(relatedWorkbench);
                                        }}
                                      >
                                        View details
                                      </DropdownItem>
                                      <DropdownItem
                                        id={`expanded-v1-delete-${r.id}`}
                                        isDanger
                                        onClick={() => {
                                          setExpandedPanelKebabOpenId(null);
                                          // eslint-disable-next-line no-console
                                          console.log('Delete Legacy Workbench clicked for', relatedWorkbench.id);
                                        }}
                                      >
                                        Delete legacy workbench
                                      </DropdownItem>
                                    </DropdownList>
                                  </Dropdown>
                                </FlexItem>
                              </Flex>
                              <DescriptionList isHorizontal isCompact>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Name</DescriptionListTerm>
                                  <DescriptionListDescription>{relatedWorkbench.name}</DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Status</DescriptionListTerm>
                                  <DescriptionListDescription>{renderPrimaryStatusLabel(relatedWorkbench)}</DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Version</DescriptionListTerm>
                                  <DescriptionListDescription>
                                    <Label color="grey">Legacy V1</Label>
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Image</DescriptionListTerm>
                                  <DescriptionListDescription>{relatedWorkbench.image}</DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Cluster storage</DescriptionListTerm>
                                  <DescriptionListDescription>{relatedWorkbench.clusterStorage || '-'}</DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>CPU / Memory</DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {relatedWorkbench.cpu && relatedWorkbench.memory ? `${relatedWorkbench.cpu} / ${relatedWorkbench.memory}` : '-'}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                              </DescriptionList>
                              <Flex style={{ marginTop: '1rem' }} spaceItems={{ default: 'spaceItemsMd' }}>
                                <FlexItem>
                                  {relatedWorkbench.status === 'Stopped' ? (
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() => {
                                        setRecords(prevRecords => prevRecords.map(rec =>
                                          rec.id === relatedWorkbench.id ? { ...rec, status: 'Running' } : rec
                                        ));
                                      }}
                                    >
                                      Start
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => {
                                        setRecords(prevRecords => prevRecords.map(rec =>
                                          rec.id === relatedWorkbench.id ? { ...rec, status: 'Stopped' } : rec
                                        ));
                                      }}
                                    >
                                      Stop
                                    </Button>
                                  )}
                                </FlexItem>
                              </Flex>
                            </div>
                          </FlexItem>
                        </Flex>
                      </div>
                    </Td>
                  </Tr>
                )}
              </React.Fragment>
            );
            })}
          </Tbody>
        </Table>
        <Pagination
          itemCount={filteredRecords.length}
          page={page}
          perPage={perPage}
          onSetPage={(_event, newPage) => setPage(newPage)}
          onPerPageSelect={(_event, newPerPage) => {
            setPerPage(newPerPage);
            setPage(1);
          }}
          widgetId="workbenches-pagination"
          style={{ marginTop: '8px' }}
        />
              </PageSection>
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      )}

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

      <CreateWorkspaceKindWizard
        isOpen={isCreateWorkspaceKindWizardOpen}
        onClose={() => setIsCreateWorkspaceKindWizardOpen(false)}
      />

      {activeTab === 1 && (
        <>
          <PageSection>
            <Toolbar
              id="workspace-kinds-toolbar"
              inset={{ default: 'insetNone' }}
              clearAllFilters={() => clearAllFilters('workspaceKinds')}
            >
              <ToolbarContent>
                <ToolbarGroup variant="filter-group">
                  <ToolbarItem>
                    <InputGroup>
                      <InputGroupItem>
                        <Dropdown
                          isOpen={workspaceKindsFilterDropdownOpen}
                          onOpenChange={(isOpen) => setWorkspaceKindsFilterDropdownOpen(isOpen)}
                          toggle={(toggleRef) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setWorkspaceKindsFilterDropdownOpen(!workspaceKindsFilterDropdownOpen)}
                              aria-label="Filter attribute selector"
                              isExpanded={workspaceKindsFilterDropdownOpen}
                              style={{
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                minWidth: '140px'
                              }}
                            >
                              <FilterIcon style={{ marginRight: '0.5rem' }} />
                              {workspaceKindsFilterAttribute === 'name' ? 'Name' :
                               workspaceKindsFilterAttribute === 'compliance' ? 'Compliance' : 'Status'}
                            </MenuToggle>
                          )}
                        >
                          <DropdownList>
                            <DropdownItem onClick={() => {
                              setWorkspaceKindsFilterAttribute('name');
                              setWorkspaceKindsFilterInput('');
                            }}>
                              Name
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                              setWorkspaceKindsFilterAttribute('compliance');
                              setWorkspaceKindsFilterInput('');
                            }}>
                              Compliance
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                              setWorkspaceKindsFilterAttribute('status');
                              setWorkspaceKindsFilterInput('');
                            }}>
                              Status
                            </DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </InputGroupItem>
                      <InputGroupItem isFill>
                        <SearchInput
                          placeholder={
                            workspaceKindsFilterAttribute === 'name' ? 'Filter by name or type' :
                            workspaceKindsFilterAttribute === 'compliance' ? 'Filter by compliance (Legacy V1, NB 2.0 Compliant)' :
                            'Filter by status (Active, Inactive)'
                          }
                          value={workspaceKindsFilterInput}
                          onChange={(_event, value) => setWorkspaceKindsFilterInput(value)}
                          onSearch={() => {
                            if (workspaceKindsFilterInput.trim()) {
                              addFilter('workspaceKinds', workspaceKindsFilterAttribute, workspaceKindsFilterInput.trim());
                            }
                          }}
                          onClear={() => setWorkspaceKindsFilterInput('')}
                          style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0
                          }}
                          id="workspace-kinds-attribute-search"
                        />
                      </InputGroupItem>
                    </InputGroup>
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button
                      id="delete-selected-workspace-kinds-button"
                      variant="plain"
                      icon={<TrashIcon />}
                      isDisabled={selectedWorkspaceKindIds.length === 0}
                      onClick={() => {
                        // eslint-disable-next-line no-console
                        console.log('Delete selected workspace kinds:', selectedWorkspaceKindIds);
                        setWorkspaceKinds(prevKinds => (prevKinds || []).filter(k => !selectedWorkspaceKindIds.includes(k.id)));
                        setSelectedWorkspaceKindIds([]);
                      }}
                      style={{
                        color: selectedWorkspaceKindIds.length > 0 ? 'var(--pf-v5-global--danger-color--100)' : 'var(--pf-v5-global--disabled-color--100)'
                      }}
                      aria-label={`Delete ${selectedWorkspaceKindIds.length} selected workspace kind${selectedWorkspaceKindIds.length !== 1 ? 's' : ''}`}
                    >
                      {selectedWorkspaceKindIds.length > 0 && `(${selectedWorkspaceKindIds.length})`}
                    </Button>
                  </ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup>
                  <ToolbarItem>
                    <Button
                      id="create-workspace-kind-button"
                      variant="primary"
                      onClick={() => setIsCreateWorkspaceKindWizardOpen(true)}
                    >
                      Create Workspace Kind
                    </Button>
                  </ToolbarItem>
                </ToolbarGroup>
              </ToolbarContent>
            </Toolbar>
          </PageSection>

          {/* Active Filters */}
          {(workspaceKindsActiveFilters.name.length > 0 || workspaceKindsActiveFilters.compliance.length > 0 || workspaceKindsActiveFilters.status.length > 0) && (
            <div style={{ marginBottom: '16px', marginTop: '0px' }}>
              <LabelGroup
                categoryName="Active filters"
                isClosable={false}
                numLabels={workspaceKindsActiveFilters.name.length + workspaceKindsActiveFilters.compliance.length + workspaceKindsActiveFilters.status.length}
              >
                {workspaceKindsActiveFilters.name.map(filter => (
                  <Label 
                    key={`name-${filter}`}
                    variant="outline"
                    onClose={() => removeFilter('workspaceKinds', 'name', filter)}
                  >
                    Name: {filter}
                  </Label>
                ))}
                {workspaceKindsActiveFilters.compliance.map(filter => (
                  <Label 
                    key={`compliance-${filter}`}
                    variant="outline"
                    onClose={() => removeFilter('workspaceKinds', 'compliance', filter)}
                  >
                    Compliance: {filter}
                  </Label>
                ))}
                {workspaceKindsActiveFilters.status.map(filter => (
                  <Label 
                    key={`status-${filter}`}
                    variant="outline"
                    onClose={() => removeFilter('workspaceKinds', 'status', filter)}
                  >
                    Status: {filter}
                  </Label>
                ))}
              </LabelGroup>
              <Button 
                variant="link" 
                onClick={() => clearAllFilters('workspaceKinds')} 
                style={{ marginTop: '0.5rem' }}
              >
                Clear all filters
              </Button>
            </div>
          )}

          <PageSection>
            <Table aria-label="Workspace Kinds table" id="workspace-kinds-table" variant="compact">
              <Thead>
                <Tr>
                  <Th
                    select={{
                      onSelect: (_event, isSelecting) => {
                        const filteredKinds = Array.isArray(workspaceKinds) ? workspaceKinds.filter((kind) => {
                          const matchesName = workspaceKindsActiveFilters.name.length === 0 ||
                            workspaceKindsActiveFilters.name.some(filter =>
                              kind.name.toLowerCase().includes(filter.toLowerCase()) ||
                              kind.type.toLowerCase().includes(filter.toLowerCase())
                            );
                          
                          const complianceLabel = kind.isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant';
                          const matchesCompliance = workspaceKindsActiveFilters.compliance.length === 0 ||
                            workspaceKindsActiveFilters.compliance.includes(complianceLabel);
                          
                          const statusLabel = kind.isActive ? 'Active' : 'Inactive';
                          const matchesStatus = workspaceKindsActiveFilters.status.length === 0 ||
                            workspaceKindsActiveFilters.status.includes(statusLabel);
                          
                          return matchesName && matchesCompliance && matchesStatus;
                        }) : [];
                        const allIds = Array.isArray(filteredKinds) ? filteredKinds.map(k => k.id) : [];
                        setSelectedWorkspaceKindIds(isSelecting ? allIds : []);
                      },
                      isSelected: (() => {
                        const filteredKinds = Array.isArray(workspaceKinds) ? workspaceKinds.filter((kind) => {
                          const matchesName = workspaceKindsActiveFilters.name.length === 0 ||
                            workspaceKindsActiveFilters.name.some(filter =>
                              kind.name.toLowerCase().includes(filter.toLowerCase()) ||
                              kind.type.toLowerCase().includes(filter.toLowerCase())
                            );
                          
                          const complianceLabel = kind.isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant';
                          const matchesCompliance = workspaceKindsActiveFilters.compliance.length === 0 ||
                            workspaceKindsActiveFilters.compliance.includes(complianceLabel);
                          
                          const statusLabel = kind.isActive ? 'Active' : 'Inactive';
                          const matchesStatus = workspaceKindsActiveFilters.status.length === 0 ||
                            workspaceKindsActiveFilters.status.includes(statusLabel);
                          
                          return matchesName && matchesCompliance && matchesStatus;
                        }) : [];
                        return Array.isArray(filteredKinds) && filteredKinds.length > 0 && filteredKinds.every(k => selectedWorkspaceKindIds.includes(k.id));
                      })(),
                      isDisabled: false
                    }}
                  />
                  <Th>Name</Th>
                  <Th>Type</Th>
                  <Th>Compliance</Th>
                  <Th>Base Image</Th>
                  <Th>Usage Count</Th>
                  <Th>Status</Th>
                  <Th screenReaderText="Actions"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {Array.isArray(workspaceKinds) ? workspaceKinds
                  .filter((kind) => {
                    const matchesName = workspaceKindsActiveFilters.name.length === 0 ||
                      workspaceKindsActiveFilters.name.some(filter =>
                        kind.name.toLowerCase().includes(filter.toLowerCase()) ||
                        kind.type.toLowerCase().includes(filter.toLowerCase())
                      );
                    
                    const complianceLabel = kind.isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant';
                    const matchesCompliance = workspaceKindsActiveFilters.compliance.length === 0 ||
                      workspaceKindsActiveFilters.compliance.includes(complianceLabel);
                    
                    const statusLabel = kind.isActive ? 'Active' : 'Inactive';
                    const matchesStatus = workspaceKindsActiveFilters.status.length === 0 ||
                      workspaceKindsActiveFilters.status.includes(statusLabel);
                    
                    return matchesName && matchesCompliance && matchesStatus;
                  })
                  .map((kind, rowIndex) => (
                  <Tr key={kind.id}>
                    <Td
                      select={{
                        rowIndex: rowIndex,
                        onSelect: (_event, isSelecting) => {
                          setSelectedWorkspaceKindIds(prev =>
                            isSelecting
                              ? [...prev, kind.id]
                              : prev.filter(id => id !== kind.id)
                          );
                        },
                        isSelected: selectedWorkspaceKindIds.includes(kind.id),
                        isDisabled: false
                      }}
                    />
                    <Td dataLabel="Name">{kind.name}</Td>
                    <Td dataLabel="Type">{kind.type}</Td>
                    <Td dataLabel="Compliance">
                      <Label color={kind.isLegacyV1 ? 'grey' : 'blue'}>
                        {kind.isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant'}
                      </Label>
                    </Td>
                    <Td dataLabel="Base Image">
                      <code style={{ fontSize: '0.875rem' }}>{kind.baseImage}</code>
                    </Td>
                    <Td dataLabel="Usage Count">
                      <Button
                        variant="link"
                        isInline
                        onClick={() => {
                          // Switch to Workbenches tab and filter by this workspace kind
                          setActiveTab(0);
                          addFilter('workbenches', 'workspaceKind', kind.id);
                        }}
                        style={{ padding: 0 }}
                      >
                        <Badge>{kind.usageCount}</Badge>
                      </Button>
                    </Td>
                    <Td dataLabel="Status">
                      <Switch
                        id={`status-${kind.id}`}
                        label={kind.isActive ? 'Active' : 'Inactive'}
                        isChecked={kind.isActive}
                        onChange={(_event, checked) => {
                          setWorkspaceKinds(prevKinds =>
                            (prevKinds || []).map(k => k.id === kind.id ? { ...k, isActive: checked } : k)
                          );
                        }}
                      />
                    </Td>
                    <Td isActionCell dataLabel="Actions">
                      <ActionsColumn
                        items={[
                          {
                            title: 'Edit',
                            onClick: () => {
                              // eslint-disable-next-line no-console
                              console.log('Edit kind:', kind.id);
                            }
                          },
                          {
                            title: 'View Details',
                            onClick: () => {
                              // eslint-disable-next-line no-console
                              console.log('View details:', kind.id);
                            }
                          },
                          {
                            title: 'Delete',
                            isDanger: true,
                            onClick: () => {
                              // eslint-disable-next-line no-console
                              console.log('Delete kind:', kind.id);
                              setWorkspaceKinds(prevKinds => (prevKinds || []).filter(k => k.id !== kind.id));
                            }
                          }
                        ]}
                      />
                    </Td>
                  </Tr>
                )) : null}
              </Tbody>
            </Table>
          </PageSection>
        </>
      )}

      {activeTab === 2 && (
        <>
          <PageSection>
            <Toolbar
              id="archive-toolbar"
              inset={{ default: 'insetNone' }}
              clearAllFilters={() => clearAllFilters('archive')}
            >
              <ToolbarContent>
                <ToolbarGroup variant="filter-group">
                  <ToolbarItem>
                    <InputGroup>
                      <InputGroupItem>
                        <Dropdown
                          isOpen={archiveFilterDropdownOpen}
                          onOpenChange={(isOpen) => setArchiveFilterDropdownOpen(isOpen)}
                          toggle={(toggleRef) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setArchiveFilterDropdownOpen(!archiveFilterDropdownOpen)}
                              aria-label="Filter attribute selector"
                              isExpanded={archiveFilterDropdownOpen}
                              style={{
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                minWidth: '140px'
                              }}
                            >
                              <FilterIcon style={{ marginRight: '0.5rem' }} />
                              {archiveFilterAttribute === 'name' ? 'Name' :
                               archiveFilterAttribute === 'status' ? 'Status' : 'Version'}
                            </MenuToggle>
                          )}
                        >
                          <DropdownList>
                            <DropdownItem onClick={() => {
                              setArchiveFilterAttribute('name');
                              setArchiveFilterInput('');
                            }}>
                              Name
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                              setArchiveFilterAttribute('status');
                              setArchiveFilterInput('');
                            }}>
                              Status
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                              setArchiveFilterAttribute('version');
                              setArchiveFilterInput('');
                            }}>
                              Version
                            </DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </InputGroupItem>
                      <InputGroupItem isFill>
                        <SearchInput
                          placeholder={
                            archiveFilterAttribute === 'name' ? 'Filter by name or project' :
                            archiveFilterAttribute === 'status' ? 'Filter by status (Archived)' :
                            'Filter by version (Legacy V1, NB 2.0 Compliant)'
                          }
                          value={archiveFilterInput}
                          onChange={(_event, value) => setArchiveFilterInput(value)}
                          onSearch={() => {
                            if (archiveFilterInput.trim()) {
                              addFilter('archive', archiveFilterAttribute, archiveFilterInput.trim());
                            }
                          }}
                          onClear={() => setArchiveFilterInput('')}
                          style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0
                          }}
                          id="archive-attribute-search"
                        />
                      </InputGroupItem>
                    </InputGroup>
                  </ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup>
                  <ToolbarItem>
                    <Button
                      id="restore-selected-button"
                      variant="primary"
                      isDisabled={selectedArchiveIds.length === 0}
                      onClick={() => {
                        // Restore all selected archived workbenches
                        selectedArchiveIds.forEach(archivedId => {
                          const archived = archivedWorkbenches.find(a => a.id === archivedId);
                          if (archived) {
                            const restored: WorkbenchRecord = {
                              id: archived.id,
                              name: archived.name,
                              project: archived.project,
                              status: 'Stopped',
                              isLegacyV1: archived.isLegacyV1,
                              createdBy: archived.createdBy,
                              image: archived.image
                            };
                            setRecords(prev => [...prev, restored]);
                          }
                        });
                        setArchivedWorkbenches(prev => prev.filter(a => !selectedArchiveIds.includes(a.id)));
                        setSelectedArchiveIds([]);
                      }}
                    >
                      Restore ({selectedArchiveIds.length})
                    </Button>
                  </ToolbarItem>
                </ToolbarGroup>
              </ToolbarContent>
            </Toolbar>
          </PageSection>

          {/* Active Filters */}
          {(archiveActiveFilters.name.length > 0 || archiveActiveFilters.status.length > 0 || archiveActiveFilters.version.length > 0) && (
            <div style={{ marginBottom: '16px', marginTop: '0px' }}>
              <LabelGroup
                categoryName="Active filters"
                isClosable={false}
                numLabels={archiveActiveFilters.name.length + archiveActiveFilters.status.length + archiveActiveFilters.version.length}
              >
                {archiveActiveFilters.name.map(filter => (
                  <Label 
                    key={`name-${filter}`}
                    variant="outline"
                    onClose={() => removeFilter('archive', 'name', filter)}
                  >
                    Name: {filter}
                  </Label>
                ))}
                {archiveActiveFilters.status.map(filter => (
                  <Label 
                    key={`status-${filter}`}
                    variant="outline"
                    onClose={() => removeFilter('archive', 'status', filter)}
                  >
                    Status: {filter}
                  </Label>
                ))}
                {archiveActiveFilters.version.map(filter => (
                  <Label 
                    key={`version-${filter}`}
                    variant="outline"
                    onClose={() => removeFilter('archive', 'version', filter)}
                  >
                    Version: {filter}
                  </Label>
                ))}
              </LabelGroup>
              <Button 
                variant="link" 
                onClick={() => clearAllFilters('archive')} 
                style={{ marginTop: '0.5rem' }}
              >
                Clear all filters
              </Button>
            </div>
          )}

          <PageSection>
            <Table aria-label="Archived workbenches table" id="archive-table" variant="compact">
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th
                    select={{
                      onSelect: (_event, isSelecting) => {
                        const allIds = filteredArchivedWorkbenches.map(a => a.id);
                        setSelectedArchiveIds(isSelecting ? allIds : []);
                      },
                      isSelected: filteredArchivedWorkbenches.length > 0 && filteredArchivedWorkbenches.every(a => selectedArchiveIds.includes(a.id)),
                      isDisabled: false
                    }}
                  />
                  <Th>Name</Th>
                  <Th>Project</Th>
                  <Th>Status</Th>
                  <Th>Version</Th>
                  <Th>Archived Date</Th>
                  <Th screenReaderText="Actions"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredArchivedWorkbenches.map((archived, rowIndex) => {
                  const isExpanded = expandedRows.includes(archived.id);
                  return (
                    <React.Fragment key={archived.id}>
                      <Tr>
                        <Td
                          expand={{
                            rowIndex: rowIndex,
                            isExpanded: isExpanded,
                            onToggle: () => toggleRowExpansion(archived.id),
                            expandId: `archive-expandable-${archived.id}`
                          }}
                        />
                        <Td
                          select={{
                            rowIndex: rowIndex,
                            onSelect: (_event, isSelecting) => {
                              setSelectedArchiveIds(prev =>
                                isSelecting
                                  ? [...prev, archived.id]
                                  : prev.filter(id => id !== archived.id)
                              );
                            },
                            isSelected: selectedArchiveIds.includes(archived.id),
                            isDisabled: false
                          }}
                        />
                        <Td dataLabel="Name">
                          <div>
                            <div>{archived.name}</div>
                            {archived.originalMigrationFrom && (
                              <div style={{ marginTop: '4px' }}>
                                <Badge isRead>
                                  Migrated from: {archived.originalMigrationFrom}
                                </Badge>
                              </div>
                            )}
                            <div style={{ marginTop: '4px' }}>
                              <Badge isRead color="orange">Archived</Badge>
                            </div>
                          </div>
                        </Td>
                        <Td dataLabel="Project">{archived.project}</Td>
                        <Td dataLabel="Status">{archived.status}</Td>
                        <Td dataLabel="Version">
                          <Label color={archived.isLegacyV1 ? 'grey' : 'blue'}>
                            {archived.isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant'}
                          </Label>
                        </Td>
                        <Td dataLabel="Archived Date">
                          {new Date(archived.archivedDate).toLocaleDateString()}
                        </Td>
                        <Td isActionCell dataLabel="Actions">
                          <ActionsColumn
                            items={[
                              {
                                title: 'Restore to Active',
                                onClick: () => {
                                  // eslint-disable-next-line no-console
                                  console.log('Restore archived workbench:', archived.id);
                                  // Move from archive back to active
                                  const restored: WorkbenchRecord = {
                                    id: archived.id,
                                    name: archived.name,
                                    project: archived.project,
                                    status: 'Stopped',
                                    isLegacyV1: archived.isLegacyV1,
                                    createdBy: archived.createdBy,
                                    image: archived.image
                                  };
                                  setRecords(prev => [...prev, restored]);
                                  setArchivedWorkbenches(prev => prev.filter(a => a.id !== archived.id));
                                }
                              },
                              {
                                title: 'Permanent Delete',
                                isDanger: true,
                                onClick: () => {
                                  // eslint-disable-next-line no-console
                                  console.log('Permanently delete archived workbench:', archived.id);
                                  setArchivedWorkbenches(prev => prev.filter(a => a.id !== archived.id));
                                }
                              }
                            ]}
                          />
                        </Td>
                      </Tr>
                      {isExpanded && archived.historicalMetadata && (
                        <Tr key={`${archived.id}-expanded`} isExpanded={true}>
                          <Td />
                          <Td />
                          <Td colSpan={6}>
                            <div style={{ padding: '1rem', backgroundColor: '#f0f0f0' }}>
                              <Title headingLevel="h6" style={{ marginBottom: '0.5rem' }}>
                                Historical Metadata
                              </Title>
                              <DescriptionList isHorizontal>
                                {Object.entries(archived.historicalMetadata).map(([key, value]) => (
                                  <DescriptionListGroup key={key}>
                                    <DescriptionListTerm>{key}</DescriptionListTerm>
                                    <DescriptionListDescription>{value}</DescriptionListDescription>
                                  </DescriptionListGroup>
                                ))}
                              </DescriptionList>
                            </div>
                          </Td>
                        </Tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </Tbody>
            </Table>
          </PageSection>
        </>
      )}
    </>
  );
};

export { Workbenches };
