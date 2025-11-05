import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  Content,
  ContentVariants,
  Dropdown,
  DropdownItem,
  DropdownList,
  Label,
  MenuToggle,
  PageSection,
  Pagination,
  SearchInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
  ToolbarToggleGroup,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td, ExpandableRowContent } from '@patternfly/react-table';
import { 
  FolderIcon,
  EllipsisVIcon, 
  FilterIcon,
  PlayIcon,
  StopIcon,
  CircleIcon,
  ExclamationCircleIcon,
  SyncIcon,
  OutlinedQuestionCircleIcon,
  ExternalLinkAltIcon,
} from '@patternfly/react-icons';

interface Workbench {
  id: string;
  name: string;
  status: 'Running' | 'Stopped' | 'Starting' | 'Failed';
  message?: string;
}

interface Project {
  id: string;
  name: string;
  owner: string;
  description?: string;
  created: string;
  workbenches: {
    running: number;
    stopped: number;
    total: number;
  };
  workbenchList: Workbench[];
}

const DataScienceProjects: React.FunctionComponent = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [openActionMenuId, setOpenActionMenuId] = React.useState<string | null>(null);
  const [openWorkbenchActionId, setOpenWorkbenchActionId] = React.useState<string | null>(null);
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set());
  const [nameFilterOpen, setNameFilterOpen] = React.useState(false);
  const [activeSortIndex, setActiveSortIndex] = React.useState<number | undefined>(0);
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc'>('asc');

  // Mock data matching the screenshot
  const projects: Project[] = [
    {
      id: '1',
      name: 'a project with object storage with an extremely long name so we...',
      owner: 'cluster-admin',
      description: 'DC: UXDPOC6 connects to Object storage, and a model is saved in the path "/models/fraud/1/model.onnx"',
      created: '10/30/2024, 6:26:48 AM',
      workbenches: {
        running: 2,
        stopped: 0,
        total: 6,
      },
      workbenchList: [
        { id: 'wb1', name: 'code server test', status: 'Stopped' },
        { id: 'wb2', name: 'de', status: 'Stopped' },
        { id: 'wb3', name: 'example', status: 'Stopped' },
        { id: 'wb4', name: 'ffd', status: 'Failed', message: 'Failed to scale-up' },
        { id: 'wb5', name: 'kyle', status: 'Stopped' },
        { id: 'wb6', name: 'Next workbench', status: 'Stopped' },
        { id: 'wb7', name: 'Test workbench', status: 'Starting', message: 'Issue creating workbench container' },
        { id: 'wb8', name: 'UXDPOC6', status: 'Stopped' },
      ],
    },
    {
      id: '2',
      name: 'Daragh-test',
      owner: 'cluster-admin',
      description: 'Project to deploy a model',
      created: '5/8/2025, 6:25:02 AM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
      workbenchList: [],
    },
    {
      id: '3',
      name: 'dedicated-admin',
      owner: '',
      created: '10/30/2025, 1:59:17 PM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
      workbenchList: [],
    },
    {
      id: '4',
      name: 'Feast',
      owner: 'cluster-admin',
      created: '8/20/2025, 3:48:11 AM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
      workbenchList: [],
    },
    {
      id: '5',
      name: 'haley-test',
      owner: 'cluster-admin',
      created: '4/9/2025, 1:52:01 AM',
      workbenches: {
        running: 0,
        stopped: 1,
        total: 1,
      },
      workbenchList: [
        { id: 'wb9', name: 'test workbench', status: 'Stopped' },
      ],
    },
    {
      id: '6',
      name: 'istio-system',
      owner: 'cluster-admin',
      created: '10/2/2024, 3:31:24 PM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
      workbenchList: [],
    },
    {
      id: '7',
      name: 'Jenn',
      owner: 'cluster-admin',
      created: '7/15/2025, 4:23:20 PM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
      workbenchList: [],
    },
    {
      id: '8',
      name: "Jenn's new project",
      owner: 'cluster-admin',
      created: '9/11/2025, 2:47:30 PM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
      workbenchList: [],
    },
    {
      id: '9',
      name: 'ml-pipeline-project',
      owner: 'cluster-admin',
      created: '3/15/2025, 9:12:45 AM',
      workbenches: {
        running: 1,
        stopped: 2,
        total: 3,
      },
      workbenchList: [
        { id: 'wb10', name: 'jupyter-notebook', status: 'Running' },
        { id: 'wb11', name: 'vscode-server', status: 'Stopped' },
        { id: 'wb12', name: 'rstudio', status: 'Stopped' },
      ],
    },
    {
      id: '10',
      name: 'customer-analytics',
      owner: 'data-team',
      created: '6/22/2024, 2:30:15 PM',
      workbenches: {
        running: 0,
        stopped: 1,
        total: 1,
      },
      workbenchList: [
        { id: 'wb13', name: 'analysis-workbench', status: 'Stopped' },
      ],
    },
    {
      id: '11',
      name: 'fraud-detection',
      owner: 'security-team',
      description: 'Real-time fraud detection ML model',
      created: '1/8/2025, 11:20:00 AM',
      workbenches: {
        running: 2,
        stopped: 0,
        total: 2,
      },
      workbenchList: [
        { id: 'wb14', name: 'model-training', status: 'Running' },
        { id: 'wb15', name: 'inference-server', status: 'Running' },
      ],
    },
    {
      id: '12',
      name: 'recommendation-engine',
      owner: 'ml-team',
      created: '2/14/2025, 8:45:30 AM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
      workbenchList: [],
    },
    {
      id: '13',
      name: 'sentiment-analysis',
      owner: 'nlp-team',
      description: 'Social media sentiment analysis pipeline',
      created: '11/5/2024, 4:15:22 PM',
      workbenches: {
        running: 1,
        stopped: 1,
        total: 2,
      },
      workbenchList: [
        { id: 'wb16', name: 'bert-training', status: 'Running' },
        { id: 'wb17', name: 'data-preprocessing', status: 'Stopped' },
      ],
    },
    {
      id: '14',
      name: 'computer-vision-lab',
      owner: 'cv-team',
      created: '12/1/2024, 10:00:00 AM',
      workbenches: {
        running: 0,
        stopped: 3,
        total: 3,
      },
      workbenchList: [
        { id: 'wb18', name: 'yolo-training', status: 'Stopped' },
        { id: 'wb19', name: 'image-labeling', status: 'Stopped' },
        { id: 'wb20', name: 'model-evaluation', status: 'Stopped' },
      ],
    },
    {
      id: '15',
      name: 'time-series-forecasting',
      owner: 'cluster-admin',
      created: '7/30/2024, 1:45:10 PM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
      workbenchList: [],
    },
    {
      id: '16',
      name: 'chatbot-development',
      owner: 'ai-team',
      description: 'Enterprise chatbot with RAG architecture',
      created: '5/18/2025, 3:20:45 PM',
      workbenches: {
        running: 1,
        stopped: 0,
        total: 1,
      },
      workbenchList: [
        { id: 'wb21', name: 'llm-finetuning', status: 'Running' },
      ],
    },
    {
      id: '17',
      name: 'data-quality-monitoring',
      owner: 'data-ops',
      created: '9/25/2024, 7:00:00 AM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
      workbenchList: [],
    },
    {
      id: '18',
      name: 'predictive-maintenance',
      owner: 'iot-team',
      created: '4/12/2025, 6:30:20 AM',
      workbenches: {
        running: 0,
        stopped: 2,
        total: 2,
      },
      workbenchList: [
        { id: 'wb22', name: 'sensor-analysis', status: 'Stopped' },
        { id: 'wb23', name: 'anomaly-detection', status: 'Stopped' },
      ],
    },
    {
      id: '19',
      name: 'speech-recognition',
      owner: 'audio-team',
      description: 'Whisper-based speech recognition system',
      created: '8/8/2024, 2:15:35 PM',
      workbenches: {
        running: 1,
        stopped: 1,
        total: 2,
      },
      workbenchList: [
        { id: 'wb24', name: 'whisper-training', status: 'Running' },
        { id: 'wb25', name: 'audio-preprocessing', status: 'Stopped' },
      ],
    },
    {
      id: '20',
      name: 'ab-testing-platform',
      owner: 'product-team',
      created: '10/10/2024, 9:45:00 AM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
      workbenchList: [],
    },
    {
      id: '21',
      name: 'medical-imaging',
      owner: 'healthcare-ai',
      description: 'X-ray and MRI image classification',
      created: '3/3/2025, 11:30:15 AM',
      workbenches: {
        running: 0,
        stopped: 1,
        total: 1,
      },
      workbenchList: [
        { id: 'wb26', name: 'resnet-training', status: 'Stopped' },
      ],
    },
    {
      id: '22',
      name: 'supply-chain-optimization',
      owner: 'operations',
      created: '6/17/2024, 8:20:40 AM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
      workbenchList: [],
    },
    {
      id: '23',
      name: 'credit-scoring-model',
      owner: 'fintech-team',
      created: '1/20/2025, 4:50:25 PM',
      workbenches: {
        running: 1,
        stopped: 0,
        total: 1,
      },
      workbenchList: [
        { id: 'wb27', name: 'xgboost-training', status: 'Running' },
      ],
    },
    {
      id: '24',
      name: 'document-classification',
      owner: 'legal-tech',
      description: 'Automated legal document categorization',
      created: '11/28/2024, 1:10:55 PM',
      workbenches: {
        running: 0,
        stopped: 2,
        total: 2,
      },
      workbenchList: [
        { id: 'wb28', name: 'bert-classifier', status: 'Stopped' },
        { id: 'wb29', name: 'pdf-processor', status: 'Stopped' },
      ],
    },
    {
      id: '25',
      name: 'energy-consumption-forecast',
      owner: 'sustainability',
      created: '7/5/2024, 10:25:30 AM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
      workbenchList: [],
    },
    {
      id: '26',
      name: 'video-analytics',
      owner: 'security-ops',
      created: '2/28/2025, 3:40:15 PM',
      workbenches: {
        running: 1,
        stopped: 1,
        total: 2,
      },
      workbenchList: [
        { id: 'wb30', name: 'object-tracking', status: 'Running' },
        { id: 'wb31', name: 'face-recognition', status: 'Stopped' },
      ],
    },
    {
      id: '27',
      name: 'weather-prediction',
      owner: 'climate-team',
      created: '5/5/2025, 7:15:45 AM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
      workbenchList: [],
    },
    {
      id: '28',
      name: 'protein-folding-research',
      owner: 'biotech-lab',
      description: 'AlphaFold-based protein structure prediction',
      created: '9/15/2024, 6:00:00 PM',
      workbenches: {
        running: 0,
        stopped: 1,
        total: 1,
      },
      workbenchList: [
        { id: 'wb32', name: 'alphafold-compute', status: 'Stopped' },
      ],
    },
    {
      id: '29',
      name: 'retail-price-optimization',
      owner: 'pricing-team',
      created: '4/22/2025, 2:35:20 PM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
      workbenchList: [],
    },
    {
      id: '30',
      name: 'network-intrusion-detection',
      owner: 'cybersecurity',
      created: '12/12/2024, 9:50:10 AM',
      workbenches: {
        running: 2,
        stopped: 0,
        total: 2,
      },
      workbenchList: [
        { id: 'wb33', name: 'packet-analyzer', status: 'Running' },
        { id: 'wb34', name: 'threat-classifier', status: 'Running' },
      ],
    },
    {
      id: '31',
      name: 'autonomous-driving-sim',
      owner: 'automotive-ai',
      description: 'Self-driving car simulation environment',
      created: '8/30/2024, 11:15:35 AM',
      workbenches: {
        running: 0,
        stopped: 3,
        total: 3,
      },
      workbenchList: [
        { id: 'wb35', name: 'perception-model', status: 'Stopped' },
        { id: 'wb36', name: 'path-planning', status: 'Stopped' },
        { id: 'wb37', name: 'simulator', status: 'Stopped' },
      ],
    },
    {
      id: '32',
      name: 'customer-churn-prediction',
      owner: 'marketing-analytics',
      created: '3/10/2025, 1:20:45 PM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
      workbenchList: [],
    },
    {
      id: '33',
      name: 'drug-discovery-pipeline',
      owner: 'pharma-research',
      created: '10/20/2024, 8:30:00 AM',
      workbenches: {
        running: 1,
        stopped: 0,
        total: 1,
      },
      workbenchList: [
        { id: 'wb38', name: 'molecule-generation', status: 'Running' },
      ],
    },
    {
      id: '34',
      name: 'smart-home-automation',
      owner: 'iot-dev',
      created: '6/1/2024, 5:45:25 PM',
      workbenches: {
        running: 0,
        stopped: 1,
        total: 1,
      },
      workbenchList: [
        { id: 'wb39', name: 'device-controller', status: 'Stopped' },
      ],
    },
    {
      id: '35',
      name: 'fake-news-detection',
      owner: 'content-moderation',
      description: 'Misinformation detection and fact-checking',
      created: '1/15/2025, 10:05:50 AM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
      workbenchList: [],
    },
    {
      id: '36',
      name: 'inventory-forecasting',
      owner: 'supply-chain',
      created: '11/11/2024, 3:25:15 PM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
      workbenchList: [],
    },
    {
      id: '37',
      name: 'emotion-recognition',
      owner: 'user-experience',
      created: '7/20/2024, 12:40:30 PM',
      workbenches: {
        running: 1,
        stopped: 1,
        total: 2,
      },
      workbenchList: [
        { id: 'wb40', name: 'facial-analysis', status: 'Running' },
        { id: 'wb41', name: 'voice-analysis', status: 'Stopped' },
      ],
    },
    {
      id: '38',
      name: 'financial-time-series',
      owner: 'quant-team',
      description: 'Stock market prediction with LSTM models',
      created: '2/5/2025, 9:15:40 AM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
      workbenchList: [],
    },
    {
      id: '39',
      name: 'image-super-resolution',
      owner: 'media-tech',
      created: '9/1/2024, 4:50:20 PM',
      workbenches: {
        running: 0,
        stopped: 1,
        total: 1,
      },
      workbenchList: [
        { id: 'wb42', name: 'esrgan-training', status: 'Stopped' },
      ],
    },
    {
      id: '40',
      name: 'traffic-flow-optimization',
      owner: 'smart-city',
      created: '5/25/2025, 7:30:10 AM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
      workbenchList: [],
    },
    {
      id: '41',
      name: 'hate-speech-detection',
      owner: 'trust-safety',
      created: '12/20/2024, 2:10:35 PM',
      workbenches: {
        running: 1,
        stopped: 0,
        total: 1,
      },
      workbenchList: [
        { id: 'wb43', name: 'toxicity-classifier', status: 'Running' },
      ],
    },
    {
      id: '42',
      name: 'earthquake-prediction',
      owner: 'geoscience',
      description: 'Seismic data analysis and prediction models',
      created: '4/5/2025, 11:45:55 AM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
      workbenchList: [],
    },
    {
      id: '43',
      name: 'music-generation',
      owner: 'creative-ai',
      created: '8/15/2024, 1:20:15 PM',
      workbenches: {
        running: 0,
        stopped: 2,
        total: 2,
      },
      workbenchList: [
        { id: 'wb44', name: 'transformer-composer', status: 'Stopped' },
        { id: 'wb45', name: 'audio-synthesizer', status: 'Stopped' },
      ],
    },
    {
      id: '44',
      name: 'waste-classification',
      owner: 'environmental',
      created: '3/25/2025, 6:00:00 AM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
      workbenchList: [],
    },
  ];

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const sortedProjects = React.useMemo(() => {
    if (activeSortIndex === undefined) return filteredProjects;
    
    const sorted = [...filteredProjects];
    if (activeSortIndex === 0) {
      // Sort by name
      sorted.sort((a, b) => {
        const aValue = a.name.toLowerCase();
        const bValue = b.name.toLowerCase();
        return activeSortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      });
    } else if (activeSortIndex === 1) {
      // Sort by created date
      sorted.sort((a, b) => {
        const aDate = new Date(a.created).getTime();
        const bDate = new Date(b.created).getTime();
        return activeSortDirection === 'asc' ? aDate - bDate : bDate - aDate;
      });
    }
    return sorted;
  }, [filteredProjects, activeSortIndex, activeSortDirection]);

  const paginatedProjects = sortedProjects.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number
  ) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  const toggleRowExpansion = (projectId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(projectId)) {
      newExpandedRows.delete(projectId);
    } else {
      newExpandedRows.add(projectId);
    }
    setExpandedRows(newExpandedRows);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Running':
        return <PlayIcon style={{ color: 'var(--pf-v6-global--success-color--100)' }} />;
      case 'Stopped':
        return <CircleIcon style={{ color: 'var(--pf-v6-global--Color--200)' }} />;
      case 'Starting':
        return <SyncIcon style={{ color: 'var(--pf-v6-global--info-color--100)' }} />;
      case 'Failed':
        return <ExclamationCircleIcon style={{ color: 'var(--pf-v6-global--danger-color--100)' }} />;
      default:
        return <CircleIcon />;
    }
  };

  const getStatusLabel = (status: string) => {
    const colors: Record<string, 'grey' | 'green' | 'blue' | 'red'> = {
      'Stopped': 'grey',
      'Running': 'green',
      'Starting': 'blue',
      'Failed': 'red',
    };
    return (
      <Label color={colors[status] || 'grey'} icon={getStatusIcon(status)} id={`status-label-${status}`}>
        {status}
      </Label>
    );
  };

  const getSortParams = (columnIndex: number) => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
    },
    onSort: (_event: any, index: number, direction: 'asc' | 'desc') => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex,
  });

  const columnNames = {
    name: 'Name',
    created: 'Created',
    workbenches: 'Workbenches',
  };

  return (
    <PageSection>
      {/* Page Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: 'var(--pf-v6-global--spacer--md)',
      }}>
        <div>
          <Title headingLevel="h1" size="2xl" id="projects-page-title">
            <FolderIcon style={{ marginRight: 'var(--pf-v6-global--spacer--sm)' }} />
            Projects
          </Title>
          <Content component={ContentVariants.p} id="projects-page-description">
            View your existing projects or create new projects.
          </Content>
        </div>
        <Button variant="secondary" id="start-basic-workbench-button">
          Start basic workbench
        </Button>
      </div>

      {/* Toolbar with filter and create button */}
      <Toolbar id="projects-toolbar" clearAllFilters={() => setSearchValue('')}>
        <ToolbarContent>
          <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl" id="projects-filter-toggle">
            <ToolbarGroup variant="filter-group" id="projects-filter-group">
              <ToolbarItem>
                <Dropdown
                  isOpen={nameFilterOpen}
                  onSelect={() => setNameFilterOpen(false)}
                  onOpenChange={(isOpen) => setNameFilterOpen(isOpen)}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setNameFilterOpen(!nameFilterOpen)}
                      isExpanded={nameFilterOpen}
                      id="name-filter-toggle"
                    >
                      Name
                    </MenuToggle>
                  )}
                  id="name-filter-dropdown"
                >
                  <DropdownList>
                    <DropdownItem key="name-filter" id="name-filter-item">
                      <SearchInput
                        placeholder="Filter by name"
                        value={searchValue}
                        onChange={(_event, value) => setSearchValue(value)}
                        onClear={() => setSearchValue('')}
                        id="projects-search-input"
                      />
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarToggleGroup>
          <ToolbarItem>
            <Button variant="primary" id="create-project-button">
              Create project
            </Button>
          </ToolbarItem>
          <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
            <Pagination
              itemCount={sortedProjects.length}
              perPage={perPage}
              page={page}
              onSetPage={onSetPage}
              onPerPageSelect={onPerPageSelect}
              variant="top"
              id="projects-pagination-top"
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      {/* Projects Table */}
      <Table aria-label="Data science projects table" variant="compact" id="projects-table">
        <Thead>
          <Tr>
            <Th />
            <Th sort={getSortParams(0)}>{columnNames.name}</Th>
            <Th sort={getSortParams(1)}>{columnNames.created}</Th>
            <Th>
              {columnNames.workbenches}{' '}
              <OutlinedQuestionCircleIcon 
                style={{ 
                  fontSize: '0.875rem',
                  color: 'var(--pf-v6-global--Color--200)',
                  verticalAlign: 'middle',
                }} 
              />
            </Th>
            <Th screenReaderText="Row actions" />
          </Tr>
        </Thead>
        <Tbody>
          {paginatedProjects.map((project) => {
            const isExpanded = expandedRows.has(project.id);
            return (
              <React.Fragment key={project.id}>
                <Tr>
                  <Td
                    expand={{
                      rowIndex: parseInt(project.id),
                      isExpanded: isExpanded,
                      onToggle: () => toggleRowExpansion(project.id),
                    }}
                  />
                  <Td dataLabel={columnNames.name}>
                    <div>
                      <Link
                        to={`/projects/${project.name}`}
                        style={{
                          color: 'var(--pf-v6-global--link--Color)',
                          textDecoration: 'none',
                          maxWidth: '400px',
                          display: 'inline-block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        id={`project-link-${project.id}`}
                      >
                        {project.name}
                      </Link>
                      {project.description && (
                        <>
                          {' '}
                          <OutlinedQuestionCircleIcon 
                            style={{ 
                              color: 'var(--pf-v6-global--Color--200)',
                              verticalAlign: 'middle',
                            }} 
                          />
                        </>
                      )}
                    </div>
                    {project.owner && (
                      <div style={{ fontSize: 'var(--pf-v6-global--FontSize--sm)', color: 'var(--pf-v6-global--Color--200)' }}>
                        {project.owner}
                      </div>
                    )}
                    {project.description && (
                      <div style={{ 
                        fontSize: 'var(--pf-v6-global--FontSize--sm)', 
                        color: 'var(--pf-v6-global--Color--200)',
                        maxWidth: '500px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {project.description}
                      </div>
                    )}
                  </Td>
                  <Td dataLabel={columnNames.created}>{project.created}</Td>
                  <Td dataLabel={columnNames.workbenches}>
                    <PlayIcon 
                      style={{ 
                        fontSize: '0.75rem',
                        marginRight: '4px', 
                        color: 'var(--pf-v6-global--success-color--100)',
                        verticalAlign: 'middle',
                      }} 
                    />
                    {project.workbenches.running}{' '}
                    <CircleIcon 
                      style={{ 
                        fontSize: '0.75rem',
                        marginLeft: '8px', 
                        marginRight: '4px', 
                        color: 'var(--pf-v6-global--Color--200)',
                        verticalAlign: 'middle',
                      }} 
                    />
                    {project.workbenches.total}
                  </Td>
                  <Td isActionCell>
                    <Dropdown
                      isOpen={openActionMenuId === project.id}
                      onSelect={() => setOpenActionMenuId(null)}
                      onOpenChange={(isOpen) => setOpenActionMenuId(isOpen ? project.id : null)}
                      popperProps={{ appendTo: () => document.body }}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          variant="plain"
                          onClick={() =>
                            setOpenActionMenuId(openActionMenuId === project.id ? null : project.id)
                          }
                          isExpanded={openActionMenuId === project.id}
                          id={`project-actions-toggle-${project.id}`}
                        >
                          <EllipsisVIcon />
                        </MenuToggle>
                      )}
                      id={`project-actions-dropdown-${project.id}`}
                    >
                      <DropdownList>
                        <DropdownItem key="edit" id={`edit-project-${project.id}`}>
                          Edit project
                        </DropdownItem>
                        <DropdownItem key="delete" id={`delete-project-${project.id}`}>
                          Delete project
                        </DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </Td>
                </Tr>
                {isExpanded && project.workbenchList.length > 0 && (
                  <Tr isExpanded={isExpanded}>
                    <Td colSpan={5} style={{ padding: 0, backgroundColor: 'var(--pf-v6-global--BackgroundColor--200)' }}>
                      <ExpandableRowContent>
                        <div style={{ padding: 'var(--pf-v6-global--spacer--md)' }}>
                          <Table variant="compact" borders={false} id={`workbenches-table-${project.id}`}>
                            <Thead>
                              <Tr>
                                <Th>Name</Th>
                                <Th>Status</Th>
                                <Th screenReaderText="Actions" />
                              </Tr>
                            </Thead>
                            <Tbody>
                              {project.workbenchList.map((workbench) => (
                                <Tr key={workbench.id}>
                                  <Td dataLabel="Name">
                                    <Link
                                      to={`/workbenches/${workbench.name}`}
                                      style={{
                                        color: 'var(--pf-v6-global--Color--200)',
                                        textDecoration: 'none',
                                      }}
                                      id={`workbench-link-${workbench.id}`}
                                    >
                                      {workbench.name}{' '}
                                      <ExternalLinkAltIcon style={{ fontSize: '0.75rem', verticalAlign: 'middle' }} />
                                    </Link>
                                  </Td>
                                <Td dataLabel="Status">
                                  {getStatusLabel(workbench.status)}
                                  {workbench.message && (
                                    <>
                                      {' '}
                                      <Link
                                        to="#"
                                        style={{
                                          color: 'var(--pf-v6-global--link--Color)',
                                          textDecoration: 'underline',
                                        }}
                                        id={`workbench-message-${workbench.id}`}
                                      >
                                        {workbench.message}
                                      </Link>
                                    </>
                                  )}
                                </Td>
                                <Td isActionCell>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--pf-v6-global--spacer--sm)' }}>
                                    {workbench.status === 'Stopped' && (
                                      <Button variant="link" isInline id={`start-workbench-${workbench.id}`}>
                                        Start
                                      </Button>
                                    )}
                                    {workbench.status === 'Running' && (
                                      <Button variant="link" isInline id={`stop-workbench-${workbench.id}`}>
                                        Stop
                                      </Button>
                                    )}
                                    {workbench.status === 'Starting' && (
                                      <Button variant="link" isInline id={`stop-workbench-${workbench.id}`}>
                                        Stop
                                      </Button>
                                    )}
                                    <Dropdown
                                      isOpen={openWorkbenchActionId === workbench.id}
                                      onSelect={() => setOpenWorkbenchActionId(null)}
                                      onOpenChange={(isOpen) =>
                                        setOpenWorkbenchActionId(isOpen ? workbench.id : null)
                                      }
                                      popperProps={{ appendTo: () => document.body }}
                                      toggle={(toggleRef) => (
                                        <MenuToggle
                                          ref={toggleRef}
                                          variant="plain"
                                          onClick={() =>
                                            setOpenWorkbenchActionId(
                                              openWorkbenchActionId === workbench.id ? null : workbench.id
                                            )
                                          }
                                          isExpanded={openWorkbenchActionId === workbench.id}
                                          id={`workbench-actions-toggle-${workbench.id}`}
                                        >
                                          <EllipsisVIcon />
                                        </MenuToggle>
                                      )}
                                      id={`workbench-actions-dropdown-${workbench.id}`}
                                    >
                                      <DropdownList>
                                        <DropdownItem key="edit" id={`edit-workbench-${workbench.id}`}>
                                          Edit workbench
                                        </DropdownItem>
                                        <DropdownItem key="delete" id={`delete-workbench-${workbench.id}`}>
                                          Delete workbench
                                        </DropdownItem>
                                      </DropdownList>
                                    </Dropdown>
                                  </div>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                        </div>
                      </ExpandableRowContent>
                    </Td>
                  </Tr>
                )}
              </React.Fragment>
            );
          })}
        </Tbody>
      </Table>

      {/* Bottom Pagination */}
      <Toolbar id="projects-toolbar-bottom">
        <ToolbarContent>
          <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
            <Pagination
              itemCount={sortedProjects.length}
              perPage={perPage}
              page={page}
              onSetPage={onSetPage}
              onPerPageSelect={onPerPageSelect}
              variant="bottom"
              id="projects-pagination-bottom"
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
    </PageSection>
  );
};

export { DataScienceProjects };


