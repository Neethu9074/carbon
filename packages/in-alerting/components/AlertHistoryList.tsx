/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Li, LiLoadMore, Stack, Ul } from '@instana/components';
import { Disposable, on } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Link } from '@instana/components';

import SmartAlertsNoDataAvailable from 'in-alerting/smart-alerts/components/SmartAlertsNoDataAvailable';
import { GetEventsViewProps, useGetEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { getDesignLibraryColorBySeverity, getIcon, getEventType } from 'in-stores/events';
import { formatDateTime, formatDurationAccurately } from 'in-services/formatters/date';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { useModifiedTimeConfig } from 'in-events/hooks/useModifiedTimeConfig';
//@ts-expect-error
import getRawEvents from 'in-subscription/getRawEvents';
import useCursorPagination, { State } from 'in-hooks/useCursorPagination';
import AlertDetailsCard from 'in-alerting/components/AlertDetailsCard';
import { TimeConfig, RawEvent, Result, Cursor } from 'in-types';
import { isLoading } from 'in-services/util/result';
import ListTitle from 'in-components/lists/Title';
import WithIcon from 'in-components/WithIcon';
import { t } from 'in-i18n';

import locals from 'in-events/components/EventsListRowDense.mless';

interface AlertHistoryListPresenterProps {
  timeConfig: TimeConfig;
  tableProps: State<Cursor, RawEvent> & {
    loadMore: () => void;
    reload: () => void;
  };
}

interface EventListItemProps {
  event: RawEvent;
  timeConfig: TimeConfig;
}

const EventListItem = ({ event, timeConfig }: EventListItemProps) => {
  const viewFilterParams: GetEventsViewProps = {
    eventId: event.id,
    eventTypeFilter: 'issue',
    timeConfig
  };
  if (event.entityType === 'App20') {
    viewFilterParams.applicationId = event.entityId;
  }

  const { getEventsViewFilteredBy } = useGetEventsViewFilteredBy();
  const analyseEvent = getEventsViewFilteredBy(viewFilterParams);

  const eventType = getEventType(event);
  const severity = event.severity;

  return (
    <Li key={event.id}>
      <Link href={analyseEvent} ellipsis>
        <WithIcon icon={getIcon(eventType)} iconColor={getDesignLibraryColorBySeverity(severity)}>
          <div className={locals.label}>
            <time dateTime={new Date(event.start).toISOString()}>{formatDateTime(event.start)}</time>
            &nbsp;
            <span>{getDurationOrActive(event)}</span>
          </div>
        </WithIcon>
      </Link>
    </Li>
  );
};

export const AlertHistoryListPresenter = ({ timeConfig, tableProps }: AlertHistoryListPresenterProps) => {
  const { canLoadMore, items = [], totalRepresentedItemCount = 0, loadMore } = tableProps;

  const loading = isLoading(tableProps as Result<RawEvent>);

  return (
    <>
      <ListTitle>
        {t('in-alerting:components.alertHistoryListTitleWithTotalRepresentedItemCount', {
          totalRepresentedItemCount
        })}
      </ListTitle>
      <Ul>
        {items.map(event => (
          <EventListItem key={event.id} event={event} timeConfig={timeConfig} />
        ))}
        {
          //@ts-expect-error
          canLoadMore && <LiLoadMore loadMore={loadMore} />
        }
        {loading && <LoadingList numSkeletonRows={items?.length ? 1 : 3} />}
        {!loading && !items?.length && (
          <SmartAlertsNoDataAvailable
            text={t('in-alerting:smartAlerts.titleNoSmartAlertsCreated')}
            type="lib_alerts_create"
          />
        )}
      </Ul>
    </>
  );
};
function getDurationOrActive(event: RawEvent) {
  if (event.state === 'open') {
    return `(${t('in-alerting:components.alertStateActive')})`;
  } else {
    return `(${formatDurationAccurately(event.end - event.start, 60000)})`;
  }
}

interface AlertHistoryListProps {
  alertConfigId: string;
  timeConfig: TimeConfig;
}
export default function AlertHistoryList(props: AlertHistoryListProps) {
  const templateRef: React.MutableRefObject<any> = useRef();
  const onMouseMoveSubscriptionRef: React.MutableRefObject<Disposable | undefined | null> = useRef();
  const { alertConfigId, timeConfig } = props;

  const [timeConfigs, setTimeConfigs] = useState(timeConfig);

  // Observable to update the timeConfig at regular intervals in live mode
  const { modifiedTimeConfig$, mouseMoveSignal$ } = useModifiedTimeConfig();
  const modifiedTimeConfig = useObservable(modifiedTimeConfig$, []);

  useEffect(() => {
    if (modifiedTimeConfig) {
      setTimeConfigs(modifiedTimeConfig);
    }
  }, [modifiedTimeConfig]);

  const setupSubscriptions = useCallback(() => {
    if (!templateRef.current) {
      return;
    }

    onMouseMoveSubscriptionRef.current = on(templateRef.current!, 'mousemove').subscribe(() =>
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

  function disposeSubscriptions() {
    if (onMouseMoveSubscriptionRef.current) {
      onMouseMoveSubscriptionRef.current?.dispose();
      onMouseMoveSubscriptionRef.current = null;
    }
  }

  const tableProps: State<Cursor, RawEvent> & {
    loadMore: () => void;
    reload: () => void;
  } = useCursorPagination<Cursor, RawEvent>(
    ({ cursor }) =>
      getRawEvents({
        timeConfig: timeConfigs,
        query: `(event.specification.id:"${alertConfigId}") AND (event.type:issue)`,
        pagination: {
          cursor,
          retrievalSize: 15
        },
        order: {
          by: 'start',
          direction: 'DESC'
        }
      }),
    [alertConfigId, timeConfigs]
  );

  return (
    <Stack ref={template => (templateRef.current = template)}>
      <AlertDetailsCard>{<AlertHistoryListPresenter {...props} tableProps={tableProps} />}</AlertDetailsCard>
    </Stack>
  );
}
