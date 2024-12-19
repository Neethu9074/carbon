/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useCallback, useEffect, useRef } from 'react';
import classNames from 'classnames';

import { DataTable as CarbonDataTable, Card } from '@instana/components';
import { Disposable, on } from '@instana/observables';
import { formatDateTime } from '@instana/format-date';
import { TableLoadMoreRow } from '@instana/legacy';

import { EventsTitle, TablePresenterProps } from 'in-custom-dashboards/widgets/Table/eventsTable/TablePresenter';
//@ts-expect-error TS migration
import EventIcon from 'in-events/components/EventIcon';
import EntityPageMainNotification from 'in-components/EntityPageMainNotification';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getEventSeverityLabelWithEventType } from 'in-stores/events';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import PluginIcon from 'in-components/PluginIcon';
import { RawEvent, TimeConfig } from 'in-types';
import { t } from 'in-i18n';

import locals from './KubernetesTablePresenter.mless';

interface KubernetesTablePresenterProps extends TablePresenterProps {
  orderBy?: string;
  orderDirection?: string;
}

export const orderByConfigForK8s: Record<string, string> = {
  type: 'metadata.k8sEventType.sort',
  reason: 'problem.problemText',
  message: 'problem.fixSuggestion',
  namespace: 'metadata.k8sNamespace.sort',
  involvedObject: 'metadata.k8sName.sort',
  kind: 'metadata.k8sKind.sort',
  time: 'start'
};

export function KubernetesTablePresenter(props: KubernetesTablePresenterProps) {
  const tableRef: React.MutableRefObject<EventTarget | undefined> = useRef();
  const onMouseMoveSubscriptionRef: React.MutableRefObject<Disposable | undefined | null> = useRef();
  const {
    items: rawEventList,
    progress,
    timeConfig,
    title,
    dragHandle,
    actions,
    loadMoreData,
    setSorting,
    config,
    topLevelFilterNote,
    mouseMoveSignal$,
    headers,
    canLoadMore,
    isPreview,
    orderBy,
    orderDirection
  } = props;

  const { location, createHref } = useNavigation();

  const setupSubscriptions = useCallback(() => {
    if (!tableRef.current) {
      return;
    }

    onMouseMoveSubscriptionRef.current = on(tableRef.current!, 'mousemove').subscribe(() =>
      mouseMoveSignal$?.emit(Date.now())
    );
  }, [mouseMoveSignal$]);

  useEffect(() => {
    setupSubscriptions();

    return function cleanUp() {
      disposeSubscriptions();
    };
  }, [setupSubscriptions]);

  useEffect(() => {
    disposeSubscriptions();
    setupSubscriptions();
  });

  function createLocationToInvolvedObject(event: RawEvent) {
    const k8sKind = event.metadata?.k8sKind;
    const entityId = event.entityId;

    const basePath = '/kubernetes';
    const involvedObjectPath = `/${k8sKind.toLowerCase()}`;

    const involvedObjectLocation = { ...location, pathname: `${basePath}${involvedObjectPath}` };

    setOrDeleteMatrixKey(
      involvedObjectLocation,
      involvedObjectPath,
      k8sKind.charAt(0).toLowerCase() + k8sKind.slice(1) + 'Id',
      entityId
    );

    return createHref(involvedObjectLocation);
  }

  function disposeSubscriptions() {
    if (onMouseMoveSubscriptionRef.current) {
      onMouseMoveSubscriptionRef.current?.dispose();
      onMouseMoveSubscriptionRef.current = null;
    }
  }

  const rowsData = rawEventList.map(event =>
    getRowsForKubernetesTable(event as RawEvent, timeConfig, isPreview, createLocationToInvolvedObject)
  );

  function sortTable(sortHeaderKey: string) {
    setSorting({
      orderBy: orderByConfigForK8s[sortHeaderKey],
      orderDirection:
        orderByConfigForK8s[sortHeaderKey] === orderBy ? (orderDirection === 'ASC' ? 'DESC' : 'ASC') : 'ASC'
    });
  }

  function getExplanationForEmptyTable() {
    return (
      <p className={locals.emptyTableExplanation}>{t('in-custom-dashboards:widgets.table.emptyTable.explanation')}</p>
    );
  }

  const EmptyTable = () => (
    <>
      <CarbonDataTable
        headers={getHeadersForKubernetesEvents(orderByConfigForK8s, headers, isPreview, orderBy, orderDirection)}
        rows={[]}
        isSearchEnabled={false}
        loading={progress.loading}
      />
      <CenterAlignmentColumn>
        <EntityPageMainNotification
          title={t('in-custom-dashboards:widgets.table.emptyTable.title')}
          icon="lib_missing_data"
          explanation={getExplanationForEmptyTable}
        />
      </CenterAlignmentColumn>
    </>
  );

  const TableWithData = () => {
    return (
      <>
        <CarbonDataTable
          headers={getHeadersForKubernetesEvents(orderByConfigForK8s, headers, isPreview, orderBy, orderDirection)}
          rows={rowsData}
          isSearchEnabled={false}
          loading={progress.loading}
          sortRow={({ sortHeaderKey }) => {
            if (Object.keys(orderByConfigForK8s).includes(sortHeaderKey)) {
              sortTable(sortHeaderKey);
            }
          }}
        />
        {canLoadMore && (
          <TableLoadMoreRow
            className={locals.carbonLoadMore}
            loadMore={() => loadMoreData?.() ?? {}}
            cols={2}
            size="compact"
          />
        )}
      </>
    );
  };

  return (
    <div ref={table => (tableRef.current = table as EventTarget)} className={locals.container}>
      <Card
        leftHeaderContent={
          title ? <EventsTitle title={title} config={config} topLevelFilterNote={topLevelFilterNote} /> : undefined
        }
        rightHeaderContent={
          title ? (
            <>
              {dragHandle}
              {actions}
            </>
          ) : undefined
        }
      >
        <div className={locals.widgetCard}>
          {!progress.loading && rawEventList.length === 0 ? <EmptyTable /> : <TableWithData />}
        </div>
      </Card>
    </div>
  );
}

function isDisplayColumn(headers: string[] | undefined, headerToDisplay: string) {
  if (!headers) {
    return true;
  }
  return headers.length > 0 && headers.includes(headerToDisplay);
}

function getHeadersForKubernetesEvents(
  sortingMapperForK8s: Record<string, string>,
  headers?: string[],
  isPreview?: boolean,
  orderBy?: string,
  orderDirection?: string
) {
  return [
    isDisplayColumn(headers, 'type') && {
      header: t('in-custom-dashboards:widgets.table.kubernetesEventColumns.type'),
      key: 'type',
      isSortable: !isPreview,
      sortDirection: orderBy === sortingMapperForK8s.type ? orderDirection : 'NONE'
    },
    isDisplayColumn(headers, 'reason') && {
      header: t('in-custom-dashboards:widgets.table.kubernetesEventColumns.reason'),
      key: 'reason',
      isSortable: !isPreview,
      sortDirection: orderBy === sortingMapperForK8s.reason ? orderDirection : 'NONE'
    },
    isDisplayColumn(headers, 'message') && {
      header: t('in-custom-dashboards:widgets.table.kubernetesEventColumns.message'),
      key: 'message',
      isSortable: !isPreview,
      sortDirection: orderBy === sortingMapperForK8s.message ? orderDirection : 'NONE'
    },
    isDisplayColumn(headers, 'namespace') && {
      header: t('in-custom-dashboards:widgets.table.kubernetesEventColumns.namespace'),
      key: 'namespace',
      isSortable: !isPreview,
      sortDirection: orderBy === sortingMapperForK8s.namespace ? orderDirection : 'NONE'
    },
    isDisplayColumn(headers, 'involvedObject') && {
      header: t('in-custom-dashboards:widgets.table.kubernetesEventColumns.involvedObject'),
      key: 'involvedObject',
      isSortable: !isPreview,
      sortDirection: orderBy === sortingMapperForK8s.involvedObject ? orderDirection : 'NONE'
    },
    isDisplayColumn(headers, 'kind') && {
      header: t('in-custom-dashboards:widgets.table.kubernetesEventColumns.kind'),
      key: 'kind',
      isSortable: !isPreview,
      sortDirection: orderBy === sortingMapperForK8s.kind ? orderDirection : 'NONE'
    },
    isDisplayColumn(headers, 'time') && {
      header: t('in-custom-dashboards:widgets.table.kubernetesEventColumns.time'),
      key: 'time',
      isSortable: !isPreview,
      sortDirection: orderBy === sortingMapperForK8s.time ? orderDirection : 'NONE'
    }
  ].filter(Boolean);
}

function getRowsForKubernetesTable(
  event: RawEvent,
  timeConfig: TimeConfig,
  isPreview: boolean | undefined,
  createLocationToInvolvedObject: (event: RawEvent) => string
) {
  return {
    id: event.id,
    icon: <EventIcon event={event} tooltipLabel={getEventSeverityLabelWithEventType(event, timeConfig)} />,
    type: (
      <TableColumnContentWrapper title={event.metadata?.k8sEventType}>
        {event.metadata?.k8sEventType}
      </TableColumnContentWrapper>
    ),
    reason: <TableColumnContentWrapper title={event.title}>{event.title}</TableColumnContentWrapper>,
    message: <TableColumnContentWrapper title={event.description}>{event.description}</TableColumnContentWrapper>,
    namespace: (
      <TableColumnContentWrapper title={event.metadata?.k8sNamespace}>
        {event.metadata?.k8sNamespace}
      </TableColumnContentWrapper>
    ),
    involvedObject: (
      <InvolvedObjectWrapper
        isPreview={isPreview}
        createLocationToInvolvedObject={createLocationToInvolvedObject}
        event={event}
      >
        <div className={classNames(locals.entityWrapper, locals.smallColumn)}>
          <PluginIcon className={locals.entityIcon} size="s" plugin={event.plugin ?? ''} />
          <div className={locals.smallColumn} title={event.metadata?.k8sName}>
            {event.metadata?.k8sName}
          </div>
        </div>
      </InvolvedObjectWrapper>
    ),
    kind: (
      <TableColumnContentWrapper title={event.metadata?.k8sKind}>{event.metadata?.k8sKind}</TableColumnContentWrapper>
    ),
    time: <span className={locals.text}>{formatDateTime(event.start)}</span>
  };
}

function TableColumnContentWrapper({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className={classNames(locals.smallColumn, locals.title)} title={title}>
      {children}
    </div>
  );
}

function InvolvedObjectWrapper({
  isPreview,
  children,
  createLocationToInvolvedObject,
  event
}: {
  isPreview?: boolean;
  children: JSX.Element;
  createLocationToInvolvedObject: (event: RawEvent) => string;
  event: RawEvent;
}) {
  if (isPreview) {
    return <>{children}</>;
  }
  return <a href={createLocationToInvolvedObject(event)}>{children}</a>;
}
