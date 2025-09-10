/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { Fragment, useMemo, ChangeEvent, useState, useEffect } from 'react';
import { Add, Filter, Close } from '@carbon/icons-react';
import cx from 'classnames';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbarSearch,
  TableToolbar,
  TableToolbarContent,
  Button,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
  IconButton,
  Tile
} from '@instana/carbon';
import { Pagination, TableSkeleton, Typography } from '@instana/components';
import { ErrorEmptyState, NoDataEmptyState } from '@instana/ibm-products';
import { Stack } from '@instana/components';

import {
  headers,
  capabilityLabels,
  modelTypesLabels,
  CapabilityKey
} from 'in-aihub/GatewaysCatalogComponents/constants';
import CreateGatewayTearsheet from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/CreateGatewayTearsheet';
import useGatewaysData, { Gateway, refreshGatewaysData } from 'in-aihub/GatewaysCatalogComponents/useGatewaysData';
import FilterPanel, { useFilterPanelAnimation } from 'in-aihub/GatewaysCatalogComponents/FilterPanel';
import { useSegmentTracking, CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import GatewaysFilterPanel from 'in-aihub/GatewaysCatalogComponents/GatewaysFilterPanel';
import useCapabilitiesData from 'in-aihub/GatewaysCatalogComponents/useCapabilitiesData';
import StatusColumnContent from 'in-aihub/GatewaysCatalogComponents/StatusColumnContent';
import ExpandedRowContent from 'in-aihub/GatewaysCatalogComponents/ExpandedRowContent';
import TagFilters from 'in-aihub/GatewaysCatalogComponents/FilterPanel/TagFilters';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import MoreMenuButton from 'in-components/MoreMenu/MoreMenuButton';
import { productAreas } from 'in-services/tracking/productAreas';
import { DELETE_GATEWAY } from 'in-aihub/constants/eventNames';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import MoreMenu from 'in-components/MoreMenu/MoreMenu';
import AIHubTabs from 'in-aihub/AIHubTabs/AIHubTabs';
import { seconds } from 'in-services/time/time';
import { deleteGateway } from 'in-aihub/api';
import { t, Trans } from 'in-i18n';

import locals from './GatewaysCatalog.mless';

export default function GatewaysCatalog() {
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.ai_gateway,
          pageRootName: pageNames.aiGateway_llmGateways
        }}
      />
      <AIHubTabs>
        <GatewaysCatalogTab />
      </AIHubTabs>
    </>
  );
}

// Define interface for gateway tearsheet props

function GatewaysCatalogTab() {
  const [gateways, status, errors] = useGatewaysData();
  const [capabilitiesResult] = useCapabilitiesData();
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [selectedModelFilters, setSelectedModelFilters] = useState<string[]>([]);
  const [selectedCapabilityFilters, setSelectedCapabilityFilters] = useState<string[]>([]);
  const [localModelFilters, setLocalModelFilters] = useState<string[]>(selectedModelFilters);
  const [localCapabilityFilters, setLocalCapabilityFilters] = useState<string[]>(selectedCapabilityFilters);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState(headers?.[0]?.key || '');
  const [sortDirection, setSortDirection] = useState('DESC');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { trackCta } = useSegmentTracking();

  // Keep local filters in sync with selected filters
  useEffect(() => {
    setLocalModelFilters(selectedModelFilters);
    setLocalCapabilityFilters(selectedCapabilityFilters);
  }, [selectedModelFilters, selectedCapabilityFilters]);

  // Update local filters when filter panel opens
  useEffect(() => {
    if (isFilterPanelOpen) {
      setLocalModelFilters(selectedModelFilters);
      setLocalCapabilityFilters(selectedCapabilityFilters);
    }
  }, [isFilterPanelOpen, selectedModelFilters, selectedCapabilityFilters]);

  const loading = status === 'pending';
  const error = status === 'rejected' ? errors?.[0] : null;

  // Prepare data for the table
  const gatewaysWithFormattedData = useMemo(() => {
    if (!gateways) return [];

    return gateways.map(gateway => ({
      ...gateway,
      // Format endpoint URL
      endpointUrl: gateway.endpointUrl,
      // Add id if missing
      id: gateway.id || `gateway-${Math.random().toString(36).substring(2, 10)}`,
      // Add default capabilities if missing
      capabilities: gateway.supports.capabilities || []
    }));
  }, [gateways]);

  //  Get unique AI models for filtering
  const modelOptions = useMemo(() => {
    if (!gatewaysWithFormattedData) return [];

    const uniqueModels = new Map<string, { value: string; label: string }>();
    gatewaysWithFormattedData.forEach(gateway => {
      if (gateway.aiModel) {
        uniqueModels.set(gateway.aiModel, {
          value: gateway.aiModel,
          label: modelTypesLabels[gateway.aiModel] || gateway.aiModel
        });
      }
    });

    return Array.from(uniqueModels.values());
  }, [gatewaysWithFormattedData]);

  // Get capabilities for filtering
  const capabilityOptions = useMemo(() => {
    // Use the capabilities from the API if available
    if (capabilitiesResult?.data?.capabilities && Array.isArray(capabilitiesResult.data.capabilities)) {
      return capabilitiesResult.data.capabilities.map((capability: string) => ({
        value: capability,
        label: capabilityLabels[capability as CapabilityKey] || capability
      }));
    }

    // If API data is not available, use default capabilities from the labels
    // Only use the uppercase versions to avoid duplicates
    const uniqueCapabilities = new Set<string>();
    const options: Array<{ value: string; label: string }> = [];

    Object.entries(capabilityLabels).forEach(([key, label]) => {
      // Convert to uppercase for comparison
      const upperKey = key.toUpperCase();

      // Only add if we haven't seen this capability yet
      if (!uniqueCapabilities.has(upperKey)) {
        uniqueCapabilities.add(upperKey);
        options.push({
          value: key,
          label
        });
      }
    });

    return options;
  }, [capabilitiesResult]);
  // Apply search filter
  const searchFilteredRows = useMemo(() => {
    if (!searchTerm) {
      return gatewaysWithFormattedData;
    }

    return gatewaysWithFormattedData.filter(row => {
      return Object.values(row).some(
        value => value && typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm, gatewaysWithFormattedData]);

  // Apply model filter
  const modelFilteredRows = useMemo(() => {
    if (!selectedModelFilters.length) {
      return searchFilteredRows;
    }

    return searchFilteredRows.filter(row => {
      return selectedModelFilters.includes(row.aiModel);
    });
  }, [searchFilteredRows, selectedModelFilters]);

  // Apply capability filter
  const capabilityFilteredRows = useMemo(() => {
    if (!selectedCapabilityFilters.length) {
      return modelFilteredRows;
    }

    return modelFilteredRows.filter(row => {
      // Check in row.capabilities
      if (row.capabilities && Array.isArray(row.capabilities)) {
        const matchInCapabilities = selectedCapabilityFilters.some(capability =>
          row.capabilities.some(cap => cap.toUpperCase() === capability.toUpperCase())
        );
        if (matchInCapabilities) return true;
      }

      // Check in row.supports.capabilities
      if (row.supports?.capabilities && Array.isArray(row.supports.capabilities)) {
        return selectedCapabilityFilters.some(
          capability => row.supports?.capabilities?.some(cap => cap.toUpperCase() === capability.toUpperCase()) || false
        );
      }

      return false;
    });
  }, [modelFilteredRows, selectedCapabilityFilters]);

  // Apply status filter
  const filteredRows = useMemo(() => {
    if (statusFilter === null) {
      return capabilityFilteredRows;
    }

    return capabilityFilteredRows.filter(row => {
      if (statusFilter === 'active') {
        return row.enabled === true;
      } else if (statusFilter === 'disabled') {
        return row.enabled === false;
      }
      return true;
    });
  }, [capabilityFilteredRows, statusFilter]);

  // Apply sorting
  const sortedFilteredRows = useMemo(() => {
    if (!sortKey) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
      const lhs = a[sortKey as keyof Gateway] || '';
      const rhs = b[sortKey as keyof Gateway] || '';

      if (sortDirection === 'ASC') {
        return collator.compare(String(lhs), String(rhs));
      } else {
        return collator.compare(String(rhs), String(lhs));
      }
    });
  }, [filteredRows, sortKey, sortDirection]);

  // Get paginated rows
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedFilteredRows.slice(startIndex, endIndex);
  }, [sortedFilteredRows, currentPage, pageSize]);

  // Setup filter panel animation
  const { tableContainerRef, animatePanel } = useFilterPanelAnimation({
    currentPage,
    totalItems: sortedFilteredRows.length
  });

  // Track expanded rows
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});

  const toggleRowExpanded = (rowId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };

  // Handle search input changes
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement> | string) => {
    const searchValue = typeof event === 'string' ? event : event.target.value;
    setSearchTerm(searchValue);
    setCurrentPage(1);
  };

  // Handle header click for sorting
  const handleHeaderClick = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortKey(key);
      setSortDirection('DESC');
    }
    setCurrentPage(1);
  };

  // Open create gateway tearsheet
  const openCreateGatewayTearsheet = () => {
    addActiveDialog(<CreateGatewayTearsheet mode="NEW" />);
  };

  // Open edit gateway tearsheet
  const openEditGatewayTearsheet = (gateway: Gateway) => {
    addActiveDialog(<CreateGatewayTearsheet mode="EDIT" gatewayId={gateway.id} gateway={gateway} />);
  };

  // Check if any filters are active
  const hasActiveFilters = selectedModelFilters.length > 0 || selectedCapabilityFilters.length > 0;

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedModelFilters([]);
    setSelectedCapabilityFilters([]);
    setStatusFilter(null);
    setCurrentPage(1);
  };

  const pageSizes = [5, 10, 15, 20];
  const totalItems = filteredRows.length;

  // Calculate counts for status tiles
  const statusCounts = useMemo(() => {
    const total = gatewaysWithFormattedData.length;
    const active = gatewaysWithFormattedData.filter(gateway => gateway.enabled === true).length;
    const disabled = gatewaysWithFormattedData.filter(gateway => gateway.enabled === false).length;

    return { total, active, disabled };
  }, [gatewaysWithFormattedData]);

  // Handle status tile click
  const handleStatusTileClick = (status: string | null) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  return (
    <div ref={tableContainerRef}>
      {/* Status Section */}
      {!loading && !error && (
        <div className={locals['status-section']}>
          <Tile className={locals['status-tile']}>
            <h2 className={locals['status-section-title']}>{t('in-aihub:gateways.statusTiles.status')}</h2>
            <div className={locals['status-tile-content']}>
              <div
                className={cx(locals['status-tile-item'])}
                // onClick={() => handleStatusTileClick(null)}
              >
                <div className={locals['status-tile-label']}>{t('in-aihub:gateways.statusTiles.total')}</div>
                <div className={locals['status-tile-count']}>{String(statusCounts.total).padStart(2, '0')}</div>
              </div>
              <div className={cx(locals['status-tile-item'])}>
                <div className={locals['status-tile-label']}>{t('in-aihub:gateways.statusTiles.active')}</div>
                <div className={locals['status-tile-count']}>{String(statusCounts.active).padStart(2, '0')}</div>

                <Button
                  kind="ghost"
                  onClick={() => handleStatusTileClick('active')}
                  className={cx(locals['status-tile-button'], { [locals['active-button']]: statusFilter === 'active' })}
                >
                  {t('in-aihub:gateways.statusTiles.showInTable')}
                </Button>
              </div>
              <div className={cx(locals['status-tile-item'])}>
                <div className={locals['status-tile-label']}>{t('in-aihub:gateways.statusTiles.disabled')}</div>
                <div className={locals['status-tile-count']}>{String(statusCounts.disabled).padStart(2, '0')}</div>

                <Button
                  kind="ghost"
                  onClick={() => handleStatusTileClick('disabled')}
                  className={cx(locals['status-tile-button'], {
                    [locals['active-button']]: statusFilter === 'disabled'
                  })}
                >
                  {t('in-aihub:gateways.statusTiles.showInTable')}
                </Button>
              </div>
            </div>
          </Tile>
        </div>
      )}

      <TableContainer
        title={t('in-aihub:gateways.tableTitle')}
        description={t('in-aihub:gateways.tableDescription')}
        id={locals['gateways-table-container']}
        className={cx({ [locals['popover-open']]: isFilterPanelOpen })}
      >
        <TableToolbar>
          <TableToolbarContent className={locals['toolbar-content']}>
            {/* Filter button */}
            <IconButton
              label={t('in-aihub:gateways.filter')}
              wrapperClasses={locals['filter-button-container']}
              onClick={() => {
                setIsFilterPanelOpen(prev => !prev);
                animatePanel && animatePanel(isFilterPanelOpen);
              }}
              className={hasActiveFilters ? 'active-filter' : ''}
              kind="ghost"
            >
              <Filter />
            </IconButton>
            <TableToolbarSearch
              persistent
              value={searchTerm}
              disabled={error !== null}
              placeholder={t('in-aihub:gateways.searchGateways')}
              onChange={handleSearchChange}
            />

            <Button renderIcon={Add} onClick={openCreateGatewayTearsheet} kind="primary">
              {t('in-aihub:gateways.newGateway')}
            </Button>
          </TableToolbarContent>
        </TableToolbar>

        {/* Tag Filters */}
        {!loading && hasActiveFilters && (
          <TagFilters
            selectedModelFilters={selectedModelFilters}
            selectedCapabilityFilters={selectedCapabilityFilters}
            modelOptions={modelOptions}
            capabilityOptions={capabilityOptions}
            clearAllFilters={clearAllFilters}
            onModelFilterChange={setSelectedModelFilters}
            onCapabilityFilterChange={setSelectedCapabilityFilters}
          />
        )}

        <FilterPanel
          popoverOpen={isFilterPanelOpen}
          closeButton={
            <IconButton
              wrapperClasses={locals['filter--panel__close-wrapper']}
              kind="ghost"
              className={locals['filter--panel__close']}
              aria-label={t('in-aihub:gateways.closeFilter')}
              label={t('in-aihub:gateways.closeFilter')}
              align="left"
              onClick={() => {
                setIsFilterPanelOpen(false);
                animatePanel(isFilterPanelOpen);
              }}
            >
              <Close />
            </IconButton>
          }
          filters={
            <GatewaysFilterPanel
              modelOptions={modelOptions}
              capabilityOptions={capabilityOptions}
              selectedModelFilters={localModelFilters}
              selectedCapabilityFilters={localCapabilityFilters}
              onModelFilterChange={setLocalModelFilters}
              onCapabilityFilterChange={setLocalCapabilityFilters}
            />
          }
          secondaryButton={
            <Button
              kind="secondary"
              onClick={() => {
                setIsFilterPanelOpen(false);
                animatePanel(isFilterPanelOpen);
                clearAllFilters();
                setLocalModelFilters([]);
                setLocalCapabilityFilters([]);
              }}
            >
              {t('in-aihub:gateways.clearFilters')}
            </Button>
          }
          primaryButton={
            <Button
              kind="primary"
              onClick={() => {
                setIsFilterPanelOpen(false);
                animatePanel(isFilterPanelOpen);
                setSelectedModelFilters(localModelFilters);
                setSelectedCapabilityFilters(localCapabilityFilters);
                setCurrentPage(1);
              }}
            >
              {t('in-aihub:gateways.apply')}
            </Button>
          }
        />

        {loading ? (
          <TableSkeleton
            className={locals['table-skeleton']}
            showHeader={false}
            showToolbar={false}
            rowCount={pageSize}
            columnCount={headers.length}
          />
        ) : (
          <Table
            size="lg"
            className={cx({
              [locals['empty-table-wrapper']]: paginatedRows.length === 0,
              [locals['table-fixed-layout']]: true
            })}
          >
            <TableHead>
              <TableRow>
                <TableExpandHeader className={locals['empty-column']} />
                {headers.map(header => (
                  <TableHeader
                    key={header.key}
                    className={
                      locals[
                        `w-${
                          header.key === 'name'
                            ? '15'
                            : header.key === 'capability'
                            ? '15'
                            : header.key === 'type'
                            ? '10'
                            : header.key === 'serviceUsed'
                            ? '15'
                            : header.key === 'status'
                            ? '10'
                            : header.key === 'actions'
                            ? '10'
                            : '15'
                        }`
                      ]
                    }
                    isSortHeader={sortKey === header.key}
                    isSortable={header.key !== 'actions'}
                    sortDirection={sortDirection}
                    onClick={() => header.key !== 'actions' && handleHeaderClick(header.key)}
                  >
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody
              className={cx({
                [locals['empty-table-body']]: paginatedRows.length === 0
              })}
            >
              {paginatedRows.length === 0 && error === null && (!gateways || gateways.length === 0) && (
                <TableRow>
                  <TableCell colSpan={headers.length + 1}>
                    <NoDataEmptyState
                      title={t('in-aihub:gateways.noDataEmptyStateTitle')}
                      subtitle={t('in-aihub:gateways.noDataEmptyStateSubtitle')}
                      illustrationDescription={t('in-aihub:gateways.noDataEmptyStateIllustrationDescription')}
                      className={locals['empty-table']}
                    />
                  </TableCell>
                </TableRow>
              )}
              {error !== null && (
                <TableRow>
                  <TableCell colSpan={headers.length + 1}>
                    <ErrorEmptyState
                      title={t('in-aihub:gateways.errorStateTitle')}
                      subtitle={t('in-aihub:gateways.errorStateDescription')}
                      className={locals['empty-table']}
                    />
                  </TableCell>
                </TableRow>
              )}
              {paginatedRows.map(row => {
                const isExpanded = expandedRows[row.id] || false;

                return (
                  <Fragment key={row.id}>
                    <TableExpandRow
                      onExpand={() => toggleRowExpanded(row.id)}
                      isExpanded={isExpanded}
                      aria-label="Row expander"
                    >
                      {headers.map(header => {
                        if (header.key === 'actions' && row.metadata?.source !== 'system') {
                          return (
                            <TableCell key={`${row.id}-${header.key}`}>
                              <GatewayCatalogMoreMenu
                                trackCta={trackCta}
                                gateway={row}
                                onEdit={openEditGatewayTearsheet}
                              />
                            </TableCell>
                          );
                        }

                        let cellValue: React.ReactNode = row[header.key as keyof Gateway];

                        // Handle capability column
                        if (header.key === 'capability') {
                          const capabilities = row.supports?.capabilities || [];
                          if (capabilities.length > 0) {
                            const capabilityLabelsArray = capabilities.map(
                              cap => capabilityLabels[cap as CapabilityKey] || cap
                            );
                            cellValue = capabilityLabelsArray.join(', ');
                          } else {
                            cellValue = '';
                          }
                        }

                        // Handle type column
                        if (header.key === 'type') {
                          if (row.metadata?.source) {
                            if (typeof row.metadata.source === 'string') {
                              cellValue = row.metadata.source === 'system' ? 'Default' : 'User';
                            }
                          } else {
                            cellValue = '';
                          }
                        }

                        if (header.key === 'endpointUrl') {
                          cellValue = row.watsonxUrl ? row.watsonxUrl : row.endpointUrl;
                        }

                        // Handle service used column
                        if (header.key === 'serviceUsed') {
                          cellValue = row.watsonxUrl ? 'IBM watsonx' : row.endpointUrl ? 'Other' : '';
                        }
                        if (header.key === 'aiModel') {
                          cellValue = modelTypesLabels[row.aiModel] || row.aiModel;
                        }

                        // Handle status column
                        if (header.key === 'status') {
                          return (
                            <TableCell key={`${row.id}-${header.key}`}>
                              <StatusColumnContent gateway={row} />
                            </TableCell>
                          );
                        }

                        return <TableCell key={`${row.id}-${header.key}`}>{cellValue}</TableCell>;
                      })}
                    </TableExpandRow>
                    <TableExpandedRow colSpan={headers.length + 1}>
                      <ExpandedRowContent gateway={row} />
                    </TableExpandedRow>
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        )}
        {totalItems > 5 && (
          <Pagination
            disabled={error !== null}
            page={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            pageSizes={pageSizes}
            onChange={({ page, pageSize: newPageSize }) => {
              if (newPageSize !== pageSize) {
                // When page size changes, reset to page 1
                setPageSize(newPageSize);
                setCurrentPage(1);
              } else {
                // Just a page change
                setCurrentPage(page);
              }
            }}
          />
        )}
      </TableContainer>
    </div>
  );
}

interface GatewayCatalogMoreMenuProps {
  gateway: Gateway;
  onEdit: (gateway: Gateway) => void;
  trackCta: CtaTrackingFunction;
}

function GatewayCatalogMoreMenu({ gateway, onEdit, trackCta }: GatewayCatalogMoreMenuProps) {
  return (
    <Stack align="end">
      <MoreMenu kind="subtle">
        <MoreMenuButton icon="lib_actions_edit" onClick={() => onEdit(gateway)}>
          {t('in-automation:edit')}
        </MoreMenuButton>
        <MoreMenuButton icon="lib_actions_delete" onClick={() => showDeleteConfirmationDialog(gateway, trackCta)}>
          {t('in-automation:delete')}
        </MoreMenuButton>
      </MoreMenu>
    </Stack>
  );
}

function showDeleteConfirmationDialog(gateway: Gateway, trackCta: CtaTrackingFunction) {
  const { id, name } = gateway;

  addActiveDialog(
    <ConfirmationDialog
      header={t('in-aihub:gateways.deleteDialog.confirmRemove')}
      description={
        <Typography variant="body-regular">
          <Trans i18nKey="in-aihub:gateways.deleteDialog.confirmRemoveMsg" values={{ name }} />
        </Typography>
      }
      confirmButtonLabel={t('in-aihub:gateways.deleteDialog.delete')}
      onSubmit={() => {
        trackCta(DELETE_GATEWAY, {
          gatewayId: id,
          gatewayName: name
        });
        onDeleteGateway(id);
      }}
    />
  );
}

function onDeleteGateway(id: string) {
  deleteGateway(id).once(
    () => {
      close();

      onDeleteGatewaySuccess();
      refreshGatewaysData();
    },
    error => {
      onDeleteGatewayFailed(error);
    }
  );
}

function onDeleteGatewaySuccess() {
  addMessage(
    {
      type: 'info',
      timeout: seconds.toMillis(2),
      content: t('in-aihub:gateways.deleteDialog.success')
    },
    'gateway-delete-info'
  );
}

function onDeleteGatewayFailed(error: Error) {
  addMessage(
    {
      type: 'danger',
      timeout: seconds.toMillis(15),
      content: <Trans i18nKey="in-aihub:gateways.deleteDialog.failure" values={{ errorMessage: error.message }} />
    },
    'gateway-delete-error'
  );
}
