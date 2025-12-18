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
  SearchInput,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
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
  Switch
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
import { ExchangeAltIcon, TrashIcon, CaretDownIcon, PlusCircleIcon, LinkIcon, ArrowRightIcon, ArrowLeftIcon, ThIcon } from '@patternfly/react-icons';
import MigrationAssistWizard, { LegacyWorkbenchConfig } from './MigrationAssistWizard';
import CreateWorkspaceKindWizard from './CreateWorkspaceKindWizard';

type VisualStyle =
  | 'indentation'
  | 'expandable'
  | 'badge-in-name'
  | 'migration-link-column'
  | 'combined';

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
    workspaceKindId: 'kind-3' // PyTorch Training 2.0
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
    hasBeenStarted: true
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

const visualStyleDescriptions: Record<VisualStyle, string> = {
  'indentation': 'Displays migrated legacy workbenches with orange "Legacy V1 - Migrated" labels in the Version/Compliance column. Hover over the label to see migration details. All workbenches are visible as independent rows with full sorting capability.',
  'expandable': 'V2 workbenches can be expanded to reveal nested legacy V1 details. Legacy V1 workbenches are hidden by default and only appear when their parent V2 workbench is expanded. Best for focusing on V2 workbenches while keeping legacy details accessible.',
  'badge-in-name': 'Shows migration relationship badges directly below the workbench name. Both V1 and V2 workbenches remain as independent rows with full sorting capability. Clear visual relationship but adds vertical space to each row.',
  'migration-link-column': 'Uses a dedicated "Migration Link" column to show relationships with directional arrows (← From / → To). Both workbenches remain independent rows and fully sortable. Provides the clearest representation of migration relationships.',
  'combined': 'Combined view displaying 2-3 examples of each visual style in one table for side-by-side comparison. Each workbench demonstrates a different style approach, making it easy to evaluate all options together.'
};

// Mapping to limit examples to 3 per style for the first 4 radio options
// This helps keep the table manageable (about 3 examples = 6-9 rows per style)
// All styles include the 2 migrating items (wb-1: in-progress, wb-15: pending)
const styleExampleLimitMap: Record<VisualStyle, string[]> = {
  'indentation': ['wb-1', 'wb-4', 'wb-4-v2', 'wb-17', 'wb-17-v2', 'wb-15'], // 3 pairs + 2 migrating = ~8 rows
  'expandable': ['wb-1', 'wb-19-v2', 'wb-19', 'wb-4a-v2', 'wb-4a', 'wb-15'], // 2 pairs + 2 migrating = ~6 rows (V1 hidden)
  'badge-in-name': ['wb-1', 'wb-20-v2', 'wb-20', 'wb-18-v2', 'wb-18', 'wb-15'], // 2 pairs + 2 migrating = ~6 rows
  'migration-link-column': ['wb-1', 'wb-17-v2', 'wb-17', 'wb-18-v2', 'wb-18', 'wb-15'], // 2 pairs + 2 migrating = ~6 rows
  'combined': [] // No limit for combined
};

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

// Mapping of workbench IDs to their assigned visual style for combined view
// Each style gets 2-3 examples (workbench pairs)
const combinedViewStyleMap: Record<string, VisualStyle> = {
  // Indentation style examples (2-3 migrated legacy workbenches)
  'wb-4': 'indentation',
  'wb-4-v2': 'indentation',
  // Expandable style examples (2-3 V2 workbenches with legacy children)
  'wb-19-v2': 'expandable',
  'wb-19': 'expandable',
  'wb-4a-v2': 'expandable',
  'wb-4a': 'expandable',
  // Badge in name style examples (2-3 workbenches with relationships)
  'wb-20-v2': 'badge-in-name',
  'wb-20': 'badge-in-name',
  // Migration link column style examples (2-3 workbenches with relationships)
  'wb-17-v2': 'migration-link-column',
  'wb-17': 'migration-link-column',
  'wb-18-v2': 'migration-link-column',
  'wb-18': 'migration-link-column',
  // Migrating items (like in current style)
  'wb-1': 'indentation', // Migrating item
  'wb-15': 'indentation' // Migrating item
};

const Workbenches: React.FunctionComponent = () => {
  const [records, setRecords] = React.useState<WorkbenchRecord[]>(initialRows);
  const [workspaceKinds, setWorkspaceKinds] = React.useState<WorkspaceKind[]>(initialWorkspaceKinds);
  const [archivedWorkbenches, setArchivedWorkbenches] = React.useState<ArchivedWorkbench[]>(initialArchivedWorkbenches);
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [isCreateWorkspaceKindWizardOpen, setIsCreateWorkspaceKindWizardOpen] = React.useState(false);
  const [selectedWorkbenches, setSelectedWorkbenches] = React.useState<LegacyWorkbenchConfig[]>([]);
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([]);

  // Visual style selection
  const [visualStyle, setVisualStyle] = React.useState<VisualStyle>('badge-in-name');

  // Action dropdown state
  const [isActionDropdownOpen, setIsActionDropdownOpen] = React.useState(false);

  // Expandable rows state
  const [expandedRows, setExpandedRows] = React.useState<string[]>([]);

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
    migrationLink: true,
    version: true,
    createdBy: true,
    image: true
  });

  // Workspace Kinds filter state
  const [workspaceKindsSearch, setWorkspaceKindsSearch] = React.useState('');
  const [workspaceKindsComplianceFilter, setWorkspaceKindsComplianceFilter] = React.useState<string[]>([]);
  const [workspaceKindsStatusFilter, setWorkspaceKindsStatusFilter] = React.useState<string[]>([]);
  const [isWorkspaceKindsComplianceFilterOpen, setIsWorkspaceKindsComplianceFilterOpen] = React.useState(false);
  const [isWorkspaceKindsStatusFilterOpen, setIsWorkspaceKindsStatusFilterOpen] = React.useState(false);
  const [selectedWorkspaceKindIds, setSelectedWorkspaceKindIds] = React.useState<string[]>([]);

  // Archive filter state
  const [archiveSearch, setArchiveSearch] = React.useState('');
  const [archiveStatusFilter, setArchiveStatusFilter] = React.useState<string[]>([]);
  const [archiveVersionFilter, setArchiveVersionFilter] = React.useState<string[]>([]);
  const [isArchiveStatusFilterOpen, setIsArchiveStatusFilterOpen] = React.useState(false);
  const [isArchiveVersionFilterOpen, setIsArchiveVersionFilterOpen] = React.useState(false);
  const [selectedArchiveIds, setSelectedArchiveIds] = React.useState<string[]>([]);

  // Workbenches workspace kind filter state
  const [workspaceKindFilter, setWorkspaceKindFilter] = React.useState<string[]>([]);
  const [isWorkspaceKindFilterOpen, setIsWorkspaceKindFilterOpen] = React.useState(false);

  // Helper to get effective visual style for a record (used in combined view)
  const getEffectiveVisualStyle = (record: WorkbenchRecord): VisualStyle => {
    if (visualStyle === 'combined') {
      return combinedViewStyleMap[record.id] || 'indentation';
    }
    return visualStyle;
  };

  // Helper to calculate colSpan for expanded rows based on visible columns
  const getColSpan = (): number => {
    let count = 2; // Expand column + Select column
    if (visibleColumns.name) count++;
    if (visibleColumns.project) count++;
    if (visibleColumns.status) count++;
    if ((visualStyle === 'migration-link-column' || visualStyle === 'combined') && visibleColumns.migrationLink) count++;
    if (visibleColumns.version) count++;
    if (visibleColumns.createdBy) count++;
    if (visibleColumns.image) count++;
    count++; // Actions column
    return count;
  };

  // Filtered records based on search and filters
  const filteredRecords = React.useMemo(() => {
    let filtered = records.filter((record) => {
      // For combined view: only show workbenches in the style map
      if (visualStyle === 'combined') {
        if (!combinedViewStyleMap[record.id]) {
          return false;
        }
      }

      // For first 4 styles: limit to 3 examples per style
      if (visualStyle !== 'combined' && styleExampleLimitMap[visualStyle]) {
        const allowedIds = styleExampleLimitMap[visualStyle];
        if (!allowedIds.includes(record.id)) {
          return false;
        }
      }

      // Search filter (name, project, created by)
      const matchesSearch =
        searchValue === '' ||
        record.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        record.project.toLowerCase().includes(searchValue.toLowerCase()) ||
        record.createdBy.toLowerCase().includes(searchValue.toLowerCase());

      // Status filter - check both actual status and migrating state
      const matchesStatus = statusFilters.length === 0 ||
        statusFilters.includes(record.status) ||
        (record.isMigrating && statusFilters.includes('Migrating'));

      // Version filter
      const versionLabel = record.isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant';
      const matchesVersion = versionFilters.length === 0 || versionFilters.includes(versionLabel);

      // Workspace kind filter
      const matchesWorkspaceKind = workspaceKindFilter.length === 0 ||
        (record.workspaceKindId && workspaceKindFilter.includes(record.workspaceKindId));

      // For expandable mode: hide V1 workbenches that have a parent V2 (they show as nested content)
      if (visualStyle === 'expandable') {
        // Hide legacy children that have a parent - they'll be shown in the expanded row
        if (record.isLegacyChild && record.parentWorkbenchId) {
          return false;
        }
      }

      // For combined view with expandable style: hide legacy children
      if (visualStyle === 'combined') {
        const effectiveStyle = combinedViewStyleMap[record.id];
        if (effectiveStyle === 'expandable' && record.isLegacyChild && record.parentWorkbenchId) {
          return false;
        }
      }

      return matchesSearch && matchesStatus && matchesVersion && matchesWorkspaceKind;
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

    // Only apply custom sorting for styles that need grouping (and no user sort)
    const needsCustomSorting = ['expandable'].includes(visualStyle) && !sortBy;

    let sorted = filtered;

    if (needsCustomSorting) {
      // Sort so that legacy children appear directly after their parent
      // while maintaining alphabetical order
      const grouped: WorkbenchRecord[] = [];
      const childrenMap = new Map<string, WorkbenchRecord[]>();

      // Group children by parent
      sorted.forEach(record => {
        if (record.isLegacyChild && record.parentWorkbenchId) {
          if (!childrenMap.has(record.parentWorkbenchId)) {
            childrenMap.set(record.parentWorkbenchId, []);
          }
          childrenMap.get(record.parentWorkbenchId)!.push(record);
        }
      });

      // Build sorted array, maintaining alphabetical order within groups
      sorted.forEach(record => {
        if (!record.isLegacyChild) {
          grouped.push(record);
          // Add any children immediately after the parent, sorted by name
          const children = childrenMap.get(record.id);
          if (children) {
            children.sort((a, b) => {
              const nameA = a.name.toLowerCase();
              const nameB = b.name.toLowerCase();
              if (nameA < nameB) return -1;
              if (nameA > nameB) return 1;
              return 0;
            });
            grouped.push(...children);
          }
        }
      });

      sorted = grouped;
    }

    // Apply column sorting if specified
    if (sortBy) {
      const sortedCopy = [...sorted];
      sortedCopy.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        // Adjust index based on whether Migration Link column is visible
        const migrationLinkVisible = visualStyle === 'migration-link-column' || visualStyle === 'combined';
        let actualIndex = sortBy.index;
        
        // If Migration Link column is visible and index >= 3, we need to check if it's Migration Link or later columns
        if (migrationLinkVisible) {
          // Index mapping: 0=Name, 1=Project, 2=Status, 3=Migration Link, 4=Version, 5=Created By, 6=Workspace Kinds
          switch (actualIndex) {
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
            case 3: // Migration Link
              const aRelated = a.isLegacyChild && a.parentWorkbenchId 
                ? records.find(r => r.id === a.parentWorkbenchId)
                : a.migratedFromId 
                  ? records.find(r => r.id === a.migratedFromId)
                  : undefined;
              const bRelated = b.isLegacyChild && b.parentWorkbenchId 
                ? records.find(r => r.id === b.parentWorkbenchId)
                : b.migratedFromId 
                  ? records.find(r => r.id === b.migratedFromId)
                  : undefined;
              aValue = aRelated ? aRelated.name.toLowerCase() : '';
              bValue = bRelated ? bRelated.name.toLowerCase() : '';
              break;
            case 4: // Version/Compliance
              aValue = a.isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant';
              bValue = b.isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant';
              break;
            case 5: // Created By
              aValue = a.createdBy.toLowerCase();
              bValue = b.createdBy.toLowerCase();
              break;
            case 6: // Workspace Kinds
              aValue = getWorkspaceKindName(a).toLowerCase();
              bValue = getWorkspaceKindName(b).toLowerCase();
              break;
            default:
              return 0;
          }
        } else {
          // Index mapping: 0=Name, 1=Project, 2=Status, 3=Version, 4=Created By, 5=Workspace Kinds
          switch (actualIndex) {
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
            case 3: // Version/Compliance
              aValue = a.isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant';
              bValue = b.isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant';
              break;
            case 4: // Created By
              aValue = a.createdBy.toLowerCase();
              bValue = b.createdBy.toLowerCase();
              break;
            case 5: // Workspace Kinds
              aValue = getWorkspaceKindName(a).toLowerCase();
              bValue = getWorkspaceKindName(b).toLowerCase();
              break;
            default:
              return 0;
          }
        }

        if (aValue < bValue) return sortBy.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortBy.direction === 'asc' ? 1 : -1;
        return 0;
      });
      return sortedCopy;
    }

    return sorted;
  }, [records, searchValue, statusFilters, versionFilters, workspaceKindFilter, visualStyle, sortBy]);

  // Paginated records
  const paginatedRecords = React.useMemo(() => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return filteredRecords.slice(startIndex, endIndex);
  }, [filteredRecords, page, perPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setPage(1);
  }, [searchValue, statusFilters, versionFilters, visualStyle]);

  // Filtered archived workbenches
  const filteredArchivedWorkbenches = React.useMemo(() => {
    return archivedWorkbenches.filter((archived) => {
      const matchesSearch =
        archiveSearch === '' ||
        archived.name.toLowerCase().includes(archiveSearch.toLowerCase()) ||
        archived.project.toLowerCase().includes(archiveSearch.toLowerCase());
      
      const matchesStatus =
        archiveStatusFilter.length === 0 ||
        archiveStatusFilter.includes(archived.status);
      
      const versionLabel = archived.isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant';
      const matchesVersion =
        archiveVersionFilter.length === 0 ||
        archiveVersionFilter.includes(versionLabel);
      
      return matchesSearch && matchesStatus && matchesVersion;
    });
  }, [archivedWorkbenches, archiveSearch, archiveStatusFilter, archiveVersionFilter]);

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

  // Helper to get workspace kind name for a workbench
  const getWorkspaceKindName = (record: WorkbenchRecord): string => {
    if (record.workspaceKindId) {
      const kind = workspaceKinds.find(k => k.id === record.workspaceKindId);
      return kind ? kind.name : 'Unknown';
    }
    return 'Not assigned';
  };

  // Helper to render name cell based on visual style
  const renderNameCell = (record: WorkbenchRecord) => {
    const relatedWorkbench = getRelatedWorkbench(record);
    const effectiveStyle = getEffectiveVisualStyle(record);

    switch (effectiveStyle) {
      case 'badge-in-name':
        // For Legacy V1 items, show badge under name
        if (record.isLegacyV1 && (record.isLegacyChild || record.parentWorkbenchId) && relatedWorkbench) {
          return (
            <div>
              <div>{record.name}</div>
              <div style={{ marginTop: '4px' }}>
                <Badge isRead>
                  Successor: {relatedWorkbench.name}
                </Badge>
              </div>
            </div>
          );
        }
        // For NB 2.0 Compliant items, just show name (migration info in label tooltip)
        return record.name;

      default:
        return record.name;
    }
  };

  // Helper to render status cell based on visual style
  const renderStatusCell = (record: WorkbenchRecord) => {
    // Original rendering logic
    if (record.isMigrating) {
      return (
        <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>{record.status}</FlexItem>
          <FlexItem>
            <ExchangeAltIcon />
          </FlexItem>
        </Flex>
      );
    }
    return record.status;
  };

  // Helper to render version cell based on visual style
  const renderVersionCell = (record: WorkbenchRecord) => {
    const effectiveStyle = getEffectiveVisualStyle(record);
    const relatedWorkbench = getRelatedWorkbench(record);
    
    // In indentation style, show "Legacy V1 - Migrated" for migrated Legacy V1 items
    if (effectiveStyle === 'indentation' && record.isLegacyChild && record.parentWorkbenchId) {
      const parentWorkbench = records.find(r => r.id === record.parentWorkbenchId);
      const tooltipContent = parentWorkbench 
        ? `Migrated to: ${parentWorkbench.name}`
        : 'Migrated to V2';
      
      return (
        <Tooltip content={tooltipContent}>
          <Label id="label-legacy-v1-migrated" color="orange">Legacy V1 - Migrated</Label>
        </Tooltip>
      );
    }

    // In badge-in-name style, include migration info in the labels
    if (effectiveStyle === 'badge-in-name' && relatedWorkbench) {
      if (!record.isLegacyV1) {
        // NB 2.0 Compliant workbench - show what it migrated from
        const migrationInfo = `Migrated from: ${relatedWorkbench.name}`;
        return (
          <Tooltip content={migrationInfo}>
            <Label id="label-nb20" color="blue">NB 2.0 Compliant</Label>
          </Tooltip>
        );
      } else if (record.isLegacyChild || record.parentWorkbenchId) {
        // Legacy V1 workbench - show what it migrated to
        const migrationInfo = `Successor: ${relatedWorkbench.name}`;
        return (
          <Tooltip content={migrationInfo}>
            <Label id="label-legacy-v1-migrated" color="orange">Legacy V1 - Migrated</Label>
          </Tooltip>
        );
      }
    }

    // Default label
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
        <>
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
          <Dropdown
            isOpen={isActionDropdownOpen}
            onOpenChange={(isOpen) => setIsActionDropdownOpen(isOpen)}
            popperProps={{ position: 'right' }}
            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
              <MenuToggle
                ref={toggleRef}
                onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
                isExpanded={isActionDropdownOpen}
                variant="primary"
                id="workbenches-action-dropdown-toggle"
                icon={<PlusCircleIcon />}
              >
                Actions
              </MenuToggle>
            )}
            id="workbenches-action-dropdown"
          >
            <DropdownList>
              <DropdownItem
                key="create-workspace-kind"
                id="create-workspace-kind-action"
                description="Define a golden template for organizational standards"
                onClick={() => {
                  setIsCreateWorkspaceKindWizardOpen(true);
                  setIsActionDropdownOpen(false);
                }}
              >
                Create Workspace Kind
              </DropdownItem>
              <Divider component="li" />
              <DropdownItem
                key="migrate-workbenches"
                id="migrate-workbenches-action"
                description={`Migrate ${selectedLegacyV1Count} selected legacy workbenches to V2`}
                isDisabled={selectedLegacyV1Count === 0}
                onClick={() => {
                  openBulkMigrationWizard();
                  setIsActionDropdownOpen(false);
                }}
              >
                Migrate Workbenches ({selectedLegacyV1Count} Selected)
              </DropdownItem>
            </DropdownList>
          </Dropdown>
        </div>
      </PageSection>

      <PageSection aria-label="Visual Style Selector" id="visual-style-selector">
        <Card style={{ backgroundColor: '#e6f3ff', border: '1px solid #0066cc' }}>
          <CardBody>
            <Title headingLevel="h6" style={{ marginBottom: 'var(--pf-v6-global--spacer--md)' }}>
              Visual Style Demos
            </Title>
            <Flex wrap="wrap" spaceItems={{ default: 'spaceItemsLg' }}>
              <FlexItem>
                <Radio
                  id="style-badge-in-name"
                  name="visual-style"
                  label="Badge in Name"
                  isChecked={visualStyle === 'badge-in-name'}
                  onChange={() => setVisualStyle('badge-in-name')}
                />
              </FlexItem>
              <FlexItem>
                <Radio
                  id="style-indentation"
                  name="visual-style"
                  label="Badge only"
                  isChecked={visualStyle === 'indentation'}
                  onChange={() => setVisualStyle('indentation')}
                />
              </FlexItem>
              <FlexItem>
                <Radio
                  id="style-expandable"
                  name="visual-style"
                  label="Expandable Nested"
                  isChecked={visualStyle === 'expandable'}
                  onChange={() => setVisualStyle('expandable')}
                />
              </FlexItem>
              <FlexItem>
                <Radio
                  id="style-migration-link-column"
                  name="visual-style"
                  label="Migration Link Column"
                  isChecked={visualStyle === 'migration-link-column'}
                  onChange={() => setVisualStyle('migration-link-column')}
                />
              </FlexItem>
              <FlexItem>
                <Radio
                  id="style-combined"
                  name="visual-style"
                  label="Combined (All Styles)"
                  isChecked={visualStyle === 'combined'}
                  onChange={() => setVisualStyle('combined')}
                />
              </FlexItem>
            </Flex>
            <Divider style={{ marginTop: 'calc(var(--pf-v6-global--spacer--md) + 4px)', marginBottom: 'var(--pf-v6-global--spacer--md)' }} />
            <div style={{
              marginTop: '8px',
              padding: 'var(--pf-v6-global--spacer--md)'
            }}>
              <strong>Description:</strong>
              <p style={{ marginTop: 'var(--pf-v6-global--spacer--sm)', marginBottom: 0 }}>
                {visualStyleDescriptions[visualStyle]}
              </p>
            </div>
          </CardBody>
        </Card>
      </PageSection>

      <PageSection id="workbenches-content-section">
        <Toolbar id="workbenches-toolbar" inset={{ default: 'insetNone' }} style={{ columnGap: '16px', paddingBottom: '0px' }} clearAllFilters={() => {
          setSearchValue('');
          setStatusFilters([]);
          setVersionFilters([]);
          setWorkspaceKindFilter([]);
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
                <Select
                  isOpen={isWorkspaceKindFilterOpen}
                  onOpenChange={(isOpen) => setIsWorkspaceKindFilterOpen(isOpen)}
                  onSelect={(_event, value) => {
                    const kindId = value as string;
                    setWorkspaceKindFilter(
                      workspaceKindFilter.includes(kindId)
                        ? workspaceKindFilter.filter((id) => id !== kindId)
                        : [...workspaceKindFilter, kindId]
                    );
                  }}
                  selected={workspaceKindFilter}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsWorkspaceKindFilterOpen(!isWorkspaceKindFilterOpen)}
                      isExpanded={isWorkspaceKindFilterOpen}
                    >
                      Workspace Kind
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    {(workspaceKinds || []).map((kind) => (
                      <SelectOption
                        key={kind.id}
                        hasCheckbox
                        isSelected={workspaceKindFilter.includes(kind.id)}
                        value={kind.id}
                      >
                        {kind.name}
                      </SelectOption>
                    ))}
                  </SelectList>
                </Select>
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
                    {(visualStyle === 'migration-link-column' || visualStyle === 'combined') && (
                      <SelectOption
                        hasCheckbox
                        isSelected={visibleColumns.migrationLink}
                        value="migrationLink"
                        onClick={() => setVisibleColumns({ ...visibleColumns, migrationLink: !visibleColumns.migrationLink })}
                      >
                        Migration Link
                      </SelectOption>
                    )}
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
                      isSelected={visibleColumns.image}
                      value="image"
                      onClick={() => setVisibleColumns({ ...visibleColumns, image: !visibleColumns.image })}
                    >
                      Workspace Kinds
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
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        {/* Active Filters */}
        {(statusFilters.length > 0 || versionFilters.length > 0 || workspaceKindFilter.length > 0) && (
          <div style={{ marginBottom: '4px', marginTop: '0px' }}>
            <LabelGroup
              categoryName="Active filters"
              isClosable={false}
              numLabels={statusFilters.length + versionFilters.length + workspaceKindFilter.length}
            >
              {statusFilters.map(filter => (
                <Label 
                  key={`status-${filter}`}
                  variant="outline"
                  onClose={() => setStatusFilters(prev => prev.filter(f => f !== filter))}
                >
                  Status: {filter}
                </Label>
              ))}
              {versionFilters.map(filter => (
                <Label 
                  key={`version-${filter}`}
                  variant="outline"
                  onClose={() => setVersionFilters(prev => prev.filter(f => f !== filter))}
                >
                  Version: {filter}
                </Label>
              ))}
              {workspaceKindFilter.map(kindId => {
                const kind = workspaceKinds.find(k => k.id === kindId);
                return (
                  <Label 
                    key={`workspace-kind-${kindId}`}
                    variant="outline"
                    onClose={() => setWorkspaceKindFilter(prev => prev.filter(id => id !== kindId))}
                  >
                    Workspace Kind: {kind?.name || kindId}
                  </Label>
                );
              })}
            </LabelGroup>
            <Button 
              variant="link" 
              onClick={() => {
                setStatusFilters([]);
                setVersionFilters([]);
                setWorkspaceKindFilter([]);
              }} 
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
              {(visualStyle === 'migration-link-column' || visualStyle === 'combined') && visibleColumns.migrationLink && (
                <Th
                  sort={{
                    sortBy: sortBy?.index === 3 ? sortBy : { index: 3, direction: 'asc' as const },
                    onSort: handleSort,
                    columnIndex: 3
                  }}
                >
                  Migration Link
                </Th>
              )}
              {visibleColumns.version && (
                <Th
                  sort={{
                    sortBy: sortBy?.index === ((visualStyle === 'migration-link-column' || visualStyle === 'combined') && visibleColumns.migrationLink ? 4 : 3) ? sortBy : { index: (visualStyle === 'migration-link-column' || visualStyle === 'combined') && visibleColumns.migrationLink ? 4 : 3, direction: 'asc' as const },
                    onSort: handleSort,
                    columnIndex: (visualStyle === 'migration-link-column' || visualStyle === 'combined') && visibleColumns.migrationLink ? 4 : 3
                  }}
                >
                  Version/Compliance
                </Th>
              )}
              {visibleColumns.createdBy && (
                <Th
                  sort={{
                    sortBy: sortBy?.index === ((visualStyle === 'migration-link-column' || visualStyle === 'combined') && visibleColumns.migrationLink ? 5 : 4) ? sortBy : { index: (visualStyle === 'migration-link-column' || visualStyle === 'combined') && visibleColumns.migrationLink ? 5 : 4, direction: 'asc' as const },
                    onSort: handleSort,
                    columnIndex: (visualStyle === 'migration-link-column' || visualStyle === 'combined') && visibleColumns.migrationLink ? 5 : 4
                  }}
                >
                  Created By
                </Th>
              )}
              {visibleColumns.image && (
                <Th
                  sort={{
                    sortBy: sortBy?.index === ((visualStyle === 'migration-link-column' || visualStyle === 'combined') && visibleColumns.migrationLink ? 6 : 5) ? sortBy : { index: (visualStyle === 'migration-link-column' || visualStyle === 'combined') && visibleColumns.migrationLink ? 6 : 5, direction: 'asc' as const },
                    onSort: handleSort,
                    columnIndex: (visualStyle === 'migration-link-column' || visualStyle === 'combined') && visibleColumns.migrationLink ? 6 : 5
                  }}
                >
                  Workspace Kinds
                </Th>
              )}
              <Th screenReaderText="Actions"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedRecords.map((r, rowIndex) => {
              const relatedWorkbench = getRelatedWorkbench(r);
              const effectiveStyle = getEffectiveVisualStyle(r);
              const shouldShowExpandForNested = effectiveStyle === 'expandable' && relatedWorkbench && !r.isLegacyChild;
              const isExpandedNested = shouldShowExpandForNested && expandedRows.includes(r.id);

              return (
              <React.Fragment key={r.id}>
                <Tr style={getRowStyle(r)}>
                  {r.isMigrating || shouldShowExpandForNested ? (
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
                  {(visualStyle === 'migration-link-column' || visualStyle === 'combined') && visibleColumns.migrationLink && (
                    <Td dataLabel="Migration Link">
                      {effectiveStyle === 'migration-link-column' && relatedWorkbench && (
                        <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                          {r.isLegacyChild || r.parentWorkbenchId ? (
                            <>
                              <FlexItem><ArrowRightIcon /></FlexItem>
                              <FlexItem>To: {relatedWorkbench.name}</FlexItem>
                            </>
                          ) : (
                            <>
                              <FlexItem><ArrowLeftIcon /></FlexItem>
                              <FlexItem>From: {relatedWorkbench.name}</FlexItem>
                            </>
                          )}
                        </Flex>
                      )}
                    </Td>
                  )}
                  {visibleColumns.version && (
                    <Td dataLabel="Version/Compliance">{renderVersionCell(r)}</Td>
                  )}
                  {visibleColumns.createdBy && (
                    <Td dataLabel="Created By">{r.createdBy}</Td>
                  )}
                  {visibleColumns.image && (
                    <Td dataLabel="Workspace Kinds">{getWorkspaceKindName(r)}</Td>
                  )}
                  <Td isActionCell dataLabel="Actions">
                    <ActionsColumn items={buildActions(r)} popperProps={{ position: 'right' }} />
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
                {effectiveStyle === 'expandable' && isExpandedNested && relatedWorkbench && (
                  <Tr key={`${r.id}-nested-legacy`} isExpanded={true}>
                    <Td />
                    <Td colSpan={getColSpan()}>
                      <div style={{ padding: '1rem', backgroundColor: '#e6f3ff', borderLeft: '3px solid #0066cc' }}>
                        <Title headingLevel="h6" style={{ marginBottom: '0.5rem' }}>
                          Legacy Workbench
                        </Title>
                        <DescriptionList isHorizontal isCompact>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Name</DescriptionListTerm>
                            <DescriptionListDescription>{relatedWorkbench.name}</DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Status</DescriptionListTerm>
                            <DescriptionListDescription>{relatedWorkbench.status}</DescriptionListDescription>
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
                        </DescriptionList>
                        <Flex style={{ marginTop: '1rem' }} spaceItems={{ default: 'spaceItemsMd' }}>
                          <FlexItem>
                            {relatedWorkbench.status === 'Stopped' ? (
                              <Button 
                                variant="primary" 
                                size="sm"
                                onClick={() => {
                                  setRecords(prevRecords => prevRecords.map(r => 
                                    r.id === relatedWorkbench.id ? { ...r, status: 'Running' } : r
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
                                  setRecords(prevRecords => prevRecords.map(r => 
                                    r.id === relatedWorkbench.id ? { ...r, status: 'Stopped' } : r
                                  ));
                                }}
                              >
                                Stop
                              </Button>
                            )}
                          </FlexItem>
                          <FlexItem>
                            <Button variant="danger" size="sm" icon={<TrashIcon />}>
                              Delete Legacy Workbench
                            </Button>
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
        />
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
              clearAllFilters={() => {
                setWorkspaceKindsSearch('');
                setWorkspaceKindsComplianceFilter([]);
                setWorkspaceKindsStatusFilter([]);
              }}
            >
              <ToolbarContent>
                <ToolbarGroup variant="filter-group">
                  <ToolbarItem>
                    <SearchInput
                      placeholder="Filter by name or type"
                      value={workspaceKindsSearch}
                      onChange={(_event, value) => setWorkspaceKindsSearch(value)}
                      onClear={() => setWorkspaceKindsSearch('')}
                      id="workspace-kinds-search"
                    />
                  </ToolbarItem>
                  <ToolbarItem>
                    <Select
                      isOpen={isWorkspaceKindsComplianceFilterOpen}
                      onOpenChange={(isOpen) => setIsWorkspaceKindsComplianceFilterOpen(isOpen)}
                      onSelect={(_event, value) => {
                        const compliance = value as string;
                        setWorkspaceKindsComplianceFilter(
                          workspaceKindsComplianceFilter.includes(compliance)
                            ? workspaceKindsComplianceFilter.filter((c) => c !== compliance)
                            : [...workspaceKindsComplianceFilter, compliance]
                        );
                      }}
                      selected={workspaceKindsComplianceFilter}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsWorkspaceKindsComplianceFilterOpen(!isWorkspaceKindsComplianceFilterOpen)}
                          isExpanded={isWorkspaceKindsComplianceFilterOpen}
                        >
                          Compliance
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption
                          hasCheckbox
                          isSelected={workspaceKindsComplianceFilter.includes('NB 2.0 Compliant')}
                          value="NB 2.0 Compliant"
                        >
                          NB 2.0 Compliant
                        </SelectOption>
                        <SelectOption
                          hasCheckbox
                          isSelected={workspaceKindsComplianceFilter.includes('Legacy V1')}
                          value="Legacy V1"
                        >
                          Legacy V1
                        </SelectOption>
                      </SelectList>
                    </Select>
                  </ToolbarItem>
                  <ToolbarItem>
                    <Select
                      isOpen={isWorkspaceKindsStatusFilterOpen}
                      onOpenChange={(isOpen) => setIsWorkspaceKindsStatusFilterOpen(isOpen)}
                      onSelect={(_event, value) => {
                        const status = value as string;
                        setWorkspaceKindsStatusFilter(
                          workspaceKindsStatusFilter.includes(status)
                            ? workspaceKindsStatusFilter.filter((s) => s !== status)
                            : [...workspaceKindsStatusFilter, status]
                        );
                      }}
                      selected={workspaceKindsStatusFilter}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsWorkspaceKindsStatusFilterOpen(!isWorkspaceKindsStatusFilterOpen)}
                          isExpanded={isWorkspaceKindsStatusFilterOpen}
                        >
                          Status
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption
                          hasCheckbox
                          isSelected={workspaceKindsStatusFilter.includes('Active')}
                          value="Active"
                        >
                          Active
                        </SelectOption>
                        <SelectOption
                          hasCheckbox
                          isSelected={workspaceKindsStatusFilter.includes('Inactive')}
                          value="Inactive"
                        >
                          Inactive
                        </SelectOption>
                      </SelectList>
                    </Select>
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
          <PageSection>
            <Table aria-label="Workspace Kinds table" id="workspace-kinds-table" variant="compact">
              <Thead>
                <Tr>
                  <Th
                    select={{
                      onSelect: (_event, isSelecting) => {
                        const filteredKinds = Array.isArray(workspaceKinds) ? workspaceKinds.filter((kind) => {
                          const matchesSearch =
                            workspaceKindsSearch === '' ||
                            kind.name.toLowerCase().includes(workspaceKindsSearch.toLowerCase()) ||
                            kind.type.toLowerCase().includes(workspaceKindsSearch.toLowerCase());
                          
                          const complianceLabel = kind.isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant';
                          const matchesCompliance =
                            workspaceKindsComplianceFilter.length === 0 ||
                            workspaceKindsComplianceFilter.includes(complianceLabel);
                          
                          const statusLabel = kind.isActive ? 'Active' : 'Inactive';
                          const matchesStatus =
                            workspaceKindsStatusFilter.length === 0 ||
                            workspaceKindsStatusFilter.includes(statusLabel);
                          
                          return matchesSearch && matchesCompliance && matchesStatus;
                        }) : [];
                        const allIds = Array.isArray(filteredKinds) ? filteredKinds.map(k => k.id) : [];
                        setSelectedWorkspaceKindIds(isSelecting ? allIds : []);
                      },
                      isSelected: (() => {
                        const filteredKinds = Array.isArray(workspaceKinds) ? workspaceKinds.filter((kind) => {
                          const matchesSearch =
                            workspaceKindsSearch === '' ||
                            kind.name.toLowerCase().includes(workspaceKindsSearch.toLowerCase()) ||
                            kind.type.toLowerCase().includes(workspaceKindsSearch.toLowerCase());
                          
                          const complianceLabel = kind.isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant';
                          const matchesCompliance =
                            workspaceKindsComplianceFilter.length === 0 ||
                            workspaceKindsComplianceFilter.includes(complianceLabel);
                          
                          const statusLabel = kind.isActive ? 'Active' : 'Inactive';
                          const matchesStatus =
                            workspaceKindsStatusFilter.length === 0 ||
                            workspaceKindsStatusFilter.includes(statusLabel);
                          
                          return matchesSearch && matchesCompliance && matchesStatus;
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
                    const matchesSearch =
                      workspaceKindsSearch === '' ||
                      kind.name.toLowerCase().includes(workspaceKindsSearch.toLowerCase()) ||
                      kind.type.toLowerCase().includes(workspaceKindsSearch.toLowerCase());
                    
                    const complianceLabel = kind.isLegacyV1 ? 'Legacy V1' : 'NB 2.0 Compliant';
                    const matchesCompliance =
                      workspaceKindsComplianceFilter.length === 0 ||
                      workspaceKindsComplianceFilter.includes(complianceLabel);
                    
                    const statusLabel = kind.isActive ? 'Active' : 'Inactive';
                    const matchesStatus =
                      workspaceKindsStatusFilter.length === 0 ||
                      workspaceKindsStatusFilter.includes(statusLabel);
                    
                    return matchesSearch && matchesCompliance && matchesStatus;
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
                          setWorkspaceKindFilter([kind.id]);
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
              clearAllFilters={() => {
                setArchiveSearch('');
                setArchiveStatusFilter([]);
                setArchiveVersionFilter([]);
              }}
            >
              <ToolbarContent>
                <ToolbarGroup variant="filter-group">
                  <ToolbarItem>
                    <SearchInput
                      placeholder="Filter by name or project"
                      value={archiveSearch}
                      onChange={(_event, value) => setArchiveSearch(value)}
                      onClear={() => setArchiveSearch('')}
                      id="archive-search"
                    />
                  </ToolbarItem>
                  <ToolbarItem>
                    <Select
                      isOpen={isArchiveStatusFilterOpen}
                      onOpenChange={(isOpen) => setIsArchiveStatusFilterOpen(isOpen)}
                      onSelect={(_event, value) => {
                        const status = value as string;
                        setArchiveStatusFilter(
                          archiveStatusFilter.includes(status)
                            ? archiveStatusFilter.filter((s) => s !== status)
                            : [...archiveStatusFilter, status]
                        );
                      }}
                      selected={archiveStatusFilter}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsArchiveStatusFilterOpen(!isArchiveStatusFilterOpen)}
                          isExpanded={isArchiveStatusFilterOpen}
                        >
                          Status
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption
                          hasCheckbox
                          isSelected={archiveStatusFilter.includes('Archived')}
                          value="Archived"
                        >
                          Archived
                        </SelectOption>
                      </SelectList>
                    </Select>
                  </ToolbarItem>
                  <ToolbarItem>
                    <Select
                      isOpen={isArchiveVersionFilterOpen}
                      onOpenChange={(isOpen) => setIsArchiveVersionFilterOpen(isOpen)}
                      onSelect={(_event, value) => {
                        const version = value as string;
                        setArchiveVersionFilter(
                          archiveVersionFilter.includes(version)
                            ? archiveVersionFilter.filter((v) => v !== version)
                            : [...archiveVersionFilter, version]
                        );
                      }}
                      selected={archiveVersionFilter}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsArchiveVersionFilterOpen(!isArchiveVersionFilterOpen)}
                          isExpanded={isArchiveVersionFilterOpen}
                        >
                          Version
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption
                          hasCheckbox
                          isSelected={archiveVersionFilter.includes('Legacy V1')}
                          value="Legacy V1"
                        >
                          Legacy V1
                        </SelectOption>
                        <SelectOption
                          hasCheckbox
                          isSelected={archiveVersionFilter.includes('NB 2.0 Compliant')}
                          value="NB 2.0 Compliant"
                        >
                          NB 2.0 Compliant
                        </SelectOption>
                      </SelectList>
                    </Select>
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
