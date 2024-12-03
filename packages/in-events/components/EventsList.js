/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import {
  Table,
  TableHorizontalIndicatorRow,
  TableLoadingSkeletonRows,
  SortableTh,
  Thead,
  Tbody,
  Tr,
  Th,
  TableLoadMoreRow
} from '@instana/legacy';
import { Card, Checkbox, Stack, Button } from '@instana/components';
import { DataTable as CarbonDataTable } from '@instana/components';

import HeightRestrictedView from 'in-components/layout/HeightRestrictedView/HeightRestrictedView';
import HighlightedTimeframeMarkerRow from 'in-events/components/HighlightedTimeframeMarkerRow';
import { aqmDataGridEventTableEnabled, carbonTableEnabled } from 'in-services/featureFlags';
import useTimeConfigUpdatingScale from 'in-events/components/useTimeConfigUpdatingScale';
import { manuallyCloseEventEnabled, multiCloseEnabled } from 'in-services/featureFlags';
import MultiCloseIssueConfigForm from 'in-events/components/MultiCloseIssueConfigForm';
import FailedIncidentsList from 'in-events/components/FailedIncidentsList.tsx';
import EventsTable from 'in-events/components/EventsPage/EventsTable/EventsTable';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import EmptyEventList from 'in-events/components/EmptyEventsList';
import EventListRow from 'in-events/components/EventsListRow';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './EventsList.mless';

export default function EventsList(props) {
  const list = <List {...props} />;
  if (!props.selectedEventId) {
    return list;
  }
  return <HeightRestrictedView render={() => list} />;
}

function List(props) {
  const {
    selectedEventId,
    onItemClicked,
    items: rawEventList,
    canLoadMore,
    loadMore,
    progress,
    eventType,
    isPresentingHighlightedTimeframe,
    timeConfig,
    headers,
    isPreview,
    title,
    cardHeader,
    leftHeaderContent,
    isCustomDashboard,
    orderBy,
    orderDirection,
    disableCard = false
  } = props;

  // Added state for selected events and select all
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    setSelectedRows([]);
    setSelectAll(false);
  }, [eventType]);

  const canMultiCloseEvents = multiCloseEnabled && role?.canManuallyCloseIssue;

  const eventTypeSupported = eventType === 'incident' || eventType === 'issue';
  const canCloseManually = manuallyCloseEventEnabled && role?.canManuallyCloseIssue;
  const isDenseList = !!selectedEventId;
  let cols = 0;

  if (isDenseList) {
    cols = 2;
  } else {
    if (eventTypeSupported) {
      cols = canCloseManually ? 8 : 7;
    } else {
      cols = canCloseManually ? 7 : 6;
    }
  }

  const timeScale = useTimeConfigUpdatingScale(timeConfig);
  const filteredRawEventList = filterManuallyClosedEventsByTimeScale(rawEventList, timeScale);

  const selectableRows = filteredRawEventList.filter(
    event => event.state !== 'closed' && event.state !== 'manually_closed'
  );
  const selectableRowsCount = selectableRows.length;
  const selectedRowsCount = selectedRows.length;

  const isIndeterminate = selectedRowsCount > 0 && selectedRowsCount < selectableRowsCount;
  const isChecked = selectedRowsCount === selectableRowsCount && selectableRowsCount > 0;
  
  if (aqmDataGridEventTableEnabled && eventType == 'issue') {
    return (
      <EventsTable
        onItemClicked={onItemClicked}
        rawEvents={filteredRawEventList}
        eventType={eventType}
        isDenseList={isDenseList}
        loading={progress.loading}
        loadMore={loadMore}
        canLoadMore={canLoadMore}
        orderBy={orderBy}
        orderDirection={orderDirection}
        onChange={props?.onChange}
      />
    );
  }

  if (!progress.loading && filteredRawEventList.length === 0) {
    return (
      <Card title={title} header={cardHeader} leftHeaderContent={leftHeaderContent}>
        <div
          className={classNames({
            [locals.widgetCard]: isCustomDashboard
          })}
        >
          <EmptyEventList
            eventType={eventType}
            isDenseList={isDenseList}
            isPresentingHighlightedTimeframe={isPresentingHighlightedTimeframe}
            cols={cols}
          />
        </div>
      </Card>
    );
  }

  const handleSelectRow = id => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
      setSelectAll(false);
    } else {
      const selectableRows = filteredRawEventList
        .filter(event => event.state !== 'closed' && event.state !== 'manually_closed')
        .map(event => event.id);
      setSelectedRows(selectableRows);
      setSelectAll(true);
    }
  };

  // Function to close incidents
  const closeSelectedIncidents = () => {
    addActiveDialog(
      <MultiCloseIssueConfigForm
        onSaveSuccess={() => {
          rawEventList.forEach(event => {
            if (selectedRows.includes(event.id)) {
              event.state = 'manually_closed';
            }
          });

          addMessage({
            type: 'success',
            timeout: 5000,
            title:
              eventType === 'incident'
                ? t('in-events:multiClose.incidentsCloseSuccessTitle')
                : t('in-events:multiClose.issuesCloseSuccessTitle'),
            content: (
              <div>
                <p>
                  {selectedRows.length > 1
                    ? eventType === 'incident'
                      ? t('in-events:multiClose.multipleIncidentsCloseSuccessMessage', { count: selectedRows.length })
                      : t('in-events:multiClose.multipleIssuesCloseSuccessMessage', { count: selectedRows.length })
                    : eventType === 'incident'
                    ? t('in-events:multiClose.singleCloseIncidentSuccessMessage')
                    : t('in-events:multiClose.singleCloseIssueSuccessMessage')}
                </p>
              </div>
            )
          });

          setSelectedRows([]);
          setSelectAll(false);
        }}
        eventIds={selectedRows}
        eventType={eventType}
        onSaveError={failedEvents => {
          addMessage({
            type: 'danger',
            title:
              eventType === 'incident'
                ? t('in-events:multiClose.incidentsCloseUnsuccessTitle')
                : t('in-events:multiClose.issuesCloseUnsuccessTitle'),
            content: (
              <div>
                <p>
                  {failedEvents.length > 1
                    ? eventType === 'incident'
                      ? t('in-events:multiClose.multipleIncidentsCloseMessageUnsuccessful', {
                          count: failedEvents.length
                        })
                      : t('in-events:multiClose.multipleIssuesCloseMessageUnsuccessful', { count: failedEvents.length })
                    : eventType === 'incident'
                    ? t('in-events:multiClose.singleIncidentCloseMessageUnsuccessful')
                    : t('in-events:multiClose.singleIssueCloseMessageUnsuccessful')}
                </p>
                <Button
                  kind="tertiary"
                  size="compact"
                  onClick={() =>
                    addActiveDialog(
                      <FailedIncidentsList
                        failedEventIds={failedEvents}
                        eventType={eventType}
                        eventIds={selectedRows}
                      />
                    )
                  }
                >
                  {t('in-events:multiClose.viewUnsuccessfulEventsList')}
                </Button>
              </div>
            )
          });
          setSelectedRows(failedEvents);
          setSelectAll(false);
        }}
      />
    );
  };

  const handleCancel = () => {
    setSelectedRows([]);
    setSelectAll(false);
  };

  // Rendering the top row when checkboxes are selected
  const renderTopRow = () => {
    if (selectedRows.length > 0 && eventTypeSupported) {
      return (
        <div className={locals.topRowBorder}>
          <Stack direction="horizontal" gap="disabled" align="center">
            <div className={locals.topRowGap}>
              {selectedRows.length} {t('in-events:multiClose.itemsSelected')}
            </div>
            <Button kind="primary" darkTheme="true" onClick={closeSelectedIncidents}>
              {eventType === 'incident'
                ? t('in-events:multiClose.closeIncidents')
                : t('in-events:multiClose.closeIssues')}
            </Button>
            <div className={locals.divider} />
            <Button kind="primary" darkTheme="true" onClick={handleCancel}>
              {t('in-events:multiClose.cancelSelection')}
            </Button>
          </Stack>
        </div>
      );
    }
    return null;
  };

  const renderTableHeader = () => {
    if (!eventTypeSupported) {
      return null;
    }

    return (
      <Th useMinimumAmountOfHorizontalSpace>
        <Checkbox onChange={handleSelectAll} checked={isChecked} indeterminate={isIndeterminate} />
      </Th>
    );
  };

  if (carbonTableEnabled && !canMultiCloseEvents) {
    const sortedRows = filteredRawEventList;

    // Carbon interprets keys differently than the how the sorting works
    // Convert the carbon row key to the request query value expected
    const sortingMapper = {
      title: 'problem.problemText',
      started: 'start',
      state: 'state',
      ended: 'end'
    };

    const carbonHeaders = [
      ...(eventType === 'cve_issue'
        ? [
            isDisplayColumn(headers, 'icon') && { key: 'icon' },
            isDisplayColumn(headers, 'title') && {
              header: t('in-events:headerVulnerability'),
              key: 'title',
              isSortable: !isPreview,
              sortDirection: orderBy === sortingMapper.title ? orderDirection : 'NONE'
            },
            isDisplayColumn(headers, 'entityLabel') && {
              header: t('in-events:headerReportedOn'),
              key: 'entityLabel'
            },
            isDisplayColumn(headers, 'started') && {
              header: t('in-events:headerReportedDate'),
              key: 'started',
              isSortable: !isPreview,
              sortDirection: orderBy === sortingMapper.started ? orderDirection : 'NONE'
            },
            isDisplayColumn(headers, 'cvssScore') && {
              header: t('in-events:headerCvssScore'),
              key: 'cvssScore'
            },
            isDisplayColumn(headers, 'state') && {
              header: t('in-events:headerStatus'),
              key: 'state',
              isSortable: !isPreview,
              sortDirection: orderBy === sortingMapper.state ? orderDirection : 'NONE'
            }
          ]
        : isDenseList
        ? [
            {
              header: t('in-events:headerStarted'),
              key: 'start'
            }
          ]
        : [
            isDisplayColumn(headers, 'icon') && { key: 'icon' },
            isDisplayColumn(headers, 'title') && {
              header: t('in-events:headerTitle'),
              key: 'title',
              isSortable: !isPreview,
              sortDirection: orderBy === sortingMapper.title ? orderDirection : 'NONE'
            },
            isDisplayColumn(headers, 'entityLabel') && {
              header: t('in-events:headerOn'),
              key: 'entityLabel'
            },
            isDisplayColumn(headers, 'started') && {
              header: t('in-events:headerStarted'),
              key: 'started',
              isSortable: !isPreview,
              sortDirection: orderBy === sortingMapper.started ? orderDirection : 'NONE'
            },
            isDisplayColumn(headers, 'ended') && {
              header: t('in-events:headerEnd'),
              key: 'ended',
              isSortable: !isPreview,
              sortDirection: orderBy === sortingMapper.ended ? orderDirection : 'NONE'
            },
            isDisplayColumn(headers, 'timeline') && {
              header: t('in-events:headerTimeline'),
              key: 'timeline'
            },
            canCloseManually &&
              isDisplayColumn(headers, 'state') && {
                header: t('in-events:headerState'),
                key: 'state',
                isSortable: !isPreview,
                sortDirection: orderBy === sortingMapper.state ? orderDirection : 'NONE'
              },
            headers &&
              isDisplayColumn(headers, 'duration') && {
                header: t('in-events:titleDuration'),
                key: 'duration'
              }
          ]
      ).filter(Boolean)
    ];

    const carbonRows = sortedRows.map(event => ({
      id: event.id,
      ...EventListRow({
        event,
        selectedEventId,
        state: event.state,
        isDenseList,
        isPreview,
        timeScale,
        timeConfig,
        headers,
        onItemClicked,
        selectedType: eventType
      })
    }));

    if (!isDenseList) {
      let content = (
        <>
          {/* TODO: convert this to a carbon datagrid */}
          <CarbonDataTable
            headers={carbonHeaders}
            loading={progress.loading}
            rows={carbonRows}
            isSearchEnabled={false}
            onClickingRow={e => onItemClicked(e.id)}
            sortRow={({ sortHeaderKey }) => {
              if (['title', 'started', 'ended', 'state'].includes(sortHeaderKey)) {
                props?.onChange({
                  orderBy: sortingMapper[sortHeaderKey],
                  orderDirection:
                    props?.orderBy === sortingMapper[sortHeaderKey]
                      ? props?.orderDirection === 'ASC'
                        ? 'DESC'
                        : 'ASC'
                      : 'ASC'
                });
              }
            }}
          />
          {canLoadMore && (
            <TableLoadMoreRow className={locals.carbonLoadMore} loadMore={loadMore} cols={2} size="compact" />
          )}
        </>
      );
      if (disableCard) return content;
      return (
        <>
          <Card title={title ?? null} header={cardHeader ?? null} leftHeaderContent={leftHeaderContent ?? null}>
            <div
              className={classNames({
                [locals.widgetCard]: isCustomDashboard
              })}
            >
              <CarbonDataTable
                headers={carbonHeaders}
                loading={progress.loading}
                rows={carbonRows}
                isSearchEnabled={false}
                onClickingRow={e => onItemClicked(e.id)}
                sortRow={({ sortHeaderKey }) => {
                  if (['title', 'started', 'ended', 'state'].includes(sortHeaderKey)) {
                    props?.onChange({
                      orderBy: sortingMapper[sortHeaderKey],
                      orderDirection:
                        props?.orderBy === sortingMapper[sortHeaderKey]
                          ? props?.orderDirection === 'ASC'
                            ? 'DESC'
                            : 'ASC'
                          : 'ASC'
                    });
                  }
                }}
              />
              {canLoadMore && (
                <TableLoadMoreRow className={locals.carbonLoadMore} loadMore={loadMore} cols={2} size="compact" />
              )}
            </div>
          </Card>
        </>
      );
    } else {
      <>
        <CarbonDataTable
          headers={carbonHeaders}
          rows={carbonRows}
          isSearchEnabled={false}
          loading={progress.loading}
          onClickingRow={e => onItemClicked(e.id)}
          sortRow={({ sortHeaderKey }) => {
            if (['title', 'started', 'end', 'state'].includes(sortHeaderKey)) {
              props?.onChange({
                orderBy: sortingMapper[sortHeaderKey],
                orderDirection:
                  props?.orderBy === sortingMapper[sortHeaderKey]
                    ? props?.orderDirection === 'ASC'
                      ? 'DESC'
                      : 'ASC'
                    : 'ASC'
              });
            }
          }}
        />
        {canLoadMore && (
          <TableLoadMoreRow className={locals.carbonLoadMore} loadMore={loadMore} cols={2} size="compact" />
        )}
      </>;
    }
  }

  if (!isDenseList) {
    const titleWidth = 30;
    return (
      <Card title={title ?? null} header={cardHeader ?? null} leftHeaderContent={leftHeaderContent ?? null}>
        <Stack>
          <div
            className={classNames({
              [locals.widgetCard]: isCustomDashboard
            })}
          >
            <Stack>{renderTopRow()}</Stack>
            <Table fixedLayout={!isCustomDashboard && eventType !== 'cve_issue'}>
              <Thead>
                <Tr size="compact">
                  {renderTableHeader()}
                  <Th useMinimumAmountOfHorizontalSpace />
                  {eventType === 'cve_issue' ? (
                    <>
                      {isDisplayColumn(headers, 'title') && (
                        <SortableColumn {...props} technicalName="problem.problemText" sortable={!isPreview}>
                          {t('in-events:headerVulnerability')}
                        </SortableColumn>
                      )}
                      {isDisplayColumn(headers, 'entityLabel') && <Th>{t('in-events:headerReportedOn')}</Th>}
                      {isDisplayColumn(headers, 'started') && (
                        <SortableColumn {...props} technicalName="start" sortable={!isPreview}>
                          {t('in-events:headerReportedDate')}
                        </SortableColumn>
                      )}
                      {isDisplayColumn(headers, 'cvssScore') && <Th>{t('in-events:headerCvssScore')}</Th>}
                      {isDisplayColumn(headers, 'state') && (
                        <SortableColumn {...props} technicalName="state" sortable={!isPreview}>
                          {t('in-events:headerStatus')}
                        </SortableColumn>
                      )}
                    </>
                  ) : isDenseList ? (
                    <SortableColumn {...props} technicalName="start">
                      {t('in-events:headerStarted')}
                    </SortableColumn>
                  ) : (
                    <>
                      {isDisplayColumn(headers, 'title') && (
                        <SortableColumn
                          {...props}
                          technicalName="problem.problemText"
                          sortable={!isPreview}
                          width={titleWidth}
                        >
                          {t('in-events:headerTitle')}
                        </SortableColumn>
                      )}
                      {isDisplayColumn(headers, 'entityLabel') && <Th>{t('in-events:headerOn')}</Th>}
                      {isDisplayColumn(headers, 'started') && (
                        <SortableColumn {...props} technicalName="start" sortable={!isPreview}>
                          {t('in-events:headerStarted')}
                        </SortableColumn>
                      )}
                      {isDisplayColumn(headers, 'ended') && (
                        <SortableColumn {...props} technicalName="end" sortable={!isPreview}>
                          {t('in-events:headerEnd')}
                        </SortableColumn>
                      )}
                      {isDisplayColumn(headers, 'timeline') && (
                        <Th className={locals.timelineColumn}>{t('in-events:headerTimeline')}</Th>
                      )}
                      {canCloseManually && isDisplayColumn(headers, 'state') && (
                        <SortableColumn {...props} technicalName="state" sortable={!isPreview}>
                          {t('in-events:headerState')}
                        </SortableColumn>
                      )}
                      {headers && isDisplayColumn(headers, 'duration') && <Th>{t('in-events:titleDuration')}</Th>}
                    </>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {isPresentingHighlightedTimeframe && <HighlightedTimeframeMarkerRow cols={cols} />}
                {filteredRawEventList.map(event => (
                  <EventListRow
                    key={event.id}
                    state={event.state}
                    selectedEventId={selectedEventId}
                    onItemClicked={onItemClicked}
                    isDenseList={isDenseList}
                    event={event}
                    timeScale={timeScale}
                    timeConfig={timeConfig}
                    headers={headers}
                    isPreview={isPreview}
                    selectedRows={selectedRows}
                    handleSelectRow={handleSelectRow}
                    selectedType={eventType}
                  />
                ))}
                {canLoadMore && <TableLoadMoreRow loadMore={loadMore} size="compact" cols={cols} />}
                <TableHorizontalIndicatorRow cols={cols} progress={progress} />
                {progress.loading && <TableLoadingSkeletonRows cols={headers ? headers.length + 1 : cols} />}
              </Tbody>
            </Table>
          </div>
        </Stack>
      </Card>
    );
  } else {
    return (
      <Table fixedLayout>
        <Thead>
          <Tr size="compact">
            <Th useMinimumAmountOfHorizontalSpace />
            {isDenseList ? (
              <SortableColumn {...props} technicalName="start">
                {t('in-events:headerStarted')}
              </SortableColumn>
            ) : (
              <>
                <SortableColumn {...props} technicalName="problem.problemText">
                  {t('in-events:headerTitle')}
                </SortableColumn>
                <Th>{t('in-events:headerOn')}</Th>
                <SortableColumn {...props} technicalName="start">
                  {t('in-events:headerStarted')}
                </SortableColumn>
                <SortableColumn {...props} technicalName="end">
                  {t('in-events:headerEnd')}
                </SortableColumn>
                <Th className={locals.timelineColumn}>{t('in-events:headerTimeline')}</Th>
                {canCloseManually && (
                  <SortableColumn {...props} technicalName="state">
                    {t('in-events:headerState')}
                  </SortableColumn>
                )}
              </>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {isPresentingHighlightedTimeframe && <HighlightedTimeframeMarkerRow cols={cols} />}
          {filteredRawEventList.map(event => (
            <EventListRow
              key={event.id}
              selectedEventId={selectedEventId}
              onItemClicked={onItemClicked}
              isDenseList={isDenseList}
              event={event}
              timeScale={timeScale}
              timeConfig={timeConfig}
              selectedRows={selectedRows}
              handleSelectRow={handleSelectRow}
              selectedType={eventType}
            />
          ))}

          {canLoadMore && <TableLoadMoreRow loadMore={loadMore} size="compact" cols={cols} />}
          <TableHorizontalIndicatorRow cols={cols} progress={progress} />
          {progress.loading && <TableLoadingSkeletonRows cols={cols} />}
        </Tbody>
      </Table>
    );
  }
}

function filterManuallyClosedEventsByTimeScale(rawEventList, timeScale) {
  return rawEventList.filter(event =>
    event.manuallyClosed
      ? event.manualCloseTimestamp <= timeScale.domainTo + 15000 &&
        event.manualCloseTimestamp >= timeScale.domainFrom - 15000
      : true
  );
}

function SortableColumn({ children, orderBy, orderDirection, onChange, technicalName, sortable, width }) {
  if (!sortable) {
    return <Th>{children}</Th>;
  }
  return (
    <SortableTh
      isSortedByThisColumn={orderBy === technicalName}
      sortDirection={orderDirection}
      onClick={e => {
        stopPropagationAndPreventDefault(e);
        onChange({
          orderBy: technicalName,
          orderDirection: orderBy === technicalName ? (orderDirection === 'ASC' ? 'DESC' : 'ASC') : 'ASC'
        });
      }}
      width={width ?? undefined}
    >
      {children}
    </SortableTh>
  );
}

export function isDisplayColumn(headers, item) {
  if (!headers) {
    return true;
  }
  return headers.length > 0 && headers.includes(item);
}
