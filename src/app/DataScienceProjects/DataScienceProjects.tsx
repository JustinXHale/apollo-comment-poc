import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Content,
  ContentVariants,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  PageSection,
  Pagination,
  SearchInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { CubesIcon, EllipsisVIcon } from '@patternfly/react-icons';

interface Project {
  id: string;
  name: string;
  owner: string;
  created: string;
  workbenches: {
    running: number;
    stopped: number;
    total: number;
  };
}

const DataScienceProjects: React.FunctionComponent = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [openActionMenuId, setOpenActionMenuId] = React.useState<string | null>(null);

  // Mock data matching the screenshot
  const projects: Project[] = [
    {
      id: '1',
      name: 'emptyProject',
      owner: 'juhale@redhat.com',
      created: '10/16/2025, 12:34:50 PM',
      workbenches: {
        running: 0,
        stopped: 0,
        total: 0,
      },
    },
  ];

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const paginatedProjects = filteredProjects.slice(
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

  const columnNames = {
    name: 'Name',
    created: 'Created',
    workbenches: 'Workbenches',
  };

  return (
    <PageSection>
      {/* Page Header */}
      <div style={{ marginBottom: 'var(--pf-v6-global--spacer--md)' }}>
        <Title headingLevel="h1" size="2xl" id="projects-page-title">
          <CubesIcon style={{ marginRight: 'var(--pf-v6-global--spacer--sm)' }} />
          Data science projects
        </Title>
        <Content component={ContentVariants.p} id="projects-page-description">
          View your existing projects or create new projects.
        </Content>
      </div>

      {/* Toolbar with filter and create button */}
      <Toolbar id="projects-toolbar">
        <ToolbarContent>
          <ToolbarItem>
            <SearchInput
              placeholder="Filter by name"
              value={searchValue}
              onChange={(_event, value) => setSearchValue(value)}
              onClear={() => setSearchValue('')}
              id="projects-search-input"
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button variant="primary" id="create-project-button">
              Create project
            </Button>
          </ToolbarItem>
          <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
            <Pagination
              itemCount={filteredProjects.length}
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
            <Th>{columnNames.name}</Th>
            <Th>{columnNames.created}</Th>
            <Th>{columnNames.workbenches}</Th>
            <Th screenReaderText="Row actions" />
          </Tr>
        </Thead>
        <Tbody>
          {paginatedProjects.map((project) => (
            <Tr key={project.id}>
              <Td dataLabel={columnNames.name}>
                <Link
                  to={`/projects/${project.name}`}
                  style={{
                    color: 'var(--pf-v6-global--link--Color)',
                    textDecoration: 'none',
                  }}
                  id={`project-link-${project.id}`}
                >
                  {project.name}
                </Link>
                <br />
                <span style={{ fontSize: 'var(--pf-v6-global--FontSize--sm)', color: 'var(--pf-v6-global--Color--200)' }}>
                  {project.owner}
                </span>
              </Td>
              <Td dataLabel={columnNames.created}>{project.created}</Td>
              <Td dataLabel={columnNames.workbenches}>
                <span style={{ marginRight: 'var(--pf-v6-global--spacer--sm)' }}>
                  ▶ {project.workbenches.running}
                </span>
                <span style={{ marginRight: 'var(--pf-v6-global--spacer--sm)' }}>
                  ⏸ {project.workbenches.stopped}
                </span>
                <span>⊙ {project.workbenches.total}</span>
              </Td>
              <Td isActionCell>
                <Dropdown
                  isOpen={openActionMenuId === project.id}
                  onSelect={() => setOpenActionMenuId(null)}
                  onOpenChange={(isOpen) => setOpenActionMenuId(isOpen ? project.id : null)}
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
          ))}
        </Tbody>
      </Table>

      {/* Bottom Pagination */}
      <Toolbar id="projects-toolbar-bottom">
        <ToolbarContent>
          <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
            <Pagination
              itemCount={filteredProjects.length}
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


