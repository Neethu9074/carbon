/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { memo, useState } from 'react';
import { get } from 'lodash';

import { Button, CarbonLayer, Collapsible, Typography } from '@instana/components';
import { Event } from '@instana/types';

//@ts-expect-error file needs to be converted
import getRawEvents from 'in-subscription/getRawEvents';
import EventsDatagrid from 'in-events/components/IncidentPage/EventsDatagrid/EventsDatagrid';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import useCursorPagination from 'in-hooks/useCursorPagination';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { EventOrMap } from 'in-events/types';
import { RawEvent } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-events/components/legacy/EventList.mless';

interface RelatedEventProps {
  incident: EventOrMap;
  triggeringEventId?: string;
}

const sortRelatedEventIds = (relatedEventsOrder: { [ids: string]: number }) => {
  const entries = Object.entries(relatedEventsOrder);

  entries.sort((a, b) => a[1] - b[1]);

  const sortedIds = entries.map(entry => entry[0]);

  return sortedIds;
};

const RelatedEventsOptimized = ({ incident, triggeringEventId }: RelatedEventProps) => {
  const incidentJSON: Event = incident.toJS();
  const [changesAreVisible, setChangesAreVisible] = useState(true);

  const userTimeConfig = useTimeConfig();

  const [isOpen, setIsOpen] = useState(false);

  let recentEventIds =
    sortRelatedEventIds(get(incidentJSON, 'issueOrderMap', {})) || get(incidentJSON, 'recentEvents', []);
  recentEventIds = recentEventIds.filter(i => i !== triggeringEventId);
  // recent events

  const {
    items: rawRelatedEvents,
    canLoadMore,
    loadMore,
    totalHits: rawRelatedEventsCount,
    progress: { loading: rawRelatedEventsLoading }
  } = useCursorPagination(
    ({ cursor }) =>
      getRawEvents({
        timeConfig: userTimeConfig,
        // TODO: enhance this query to add user changable filters
        query: !changesAreVisible ? 'event.type:issue' : '',
        pagination: {
          cursor,
          retrievalSize: 20
        },
        order: {
          by: 'start',
          direction: 'DESC'
        },
        eventIds: recentEventIds
      }),
    [changesAreVisible, triggeringEventId]
  );

  // end of getRawEventsQuery

  if (recentEventIds.length === 0) {
    return <RelatedEventsEmptyState open={isOpen} />;
  }

  return (
    <div className={locals.layerBackground}>
      <CarbonLayer>
        <Collapsible initiallyOpen={isOpen} onOpen={() => setIsOpen(true)}>
          <Collapsible.Header>
            <Typography variant="body-regular">
              {t('in-events:titleRelatedEvents', {
                eventCount: rawRelatedEventsCount || 0
              })}
            </Typography>
          </Collapsible.Header>
          <Collapsible.Content>
            <LeftRightPadding>
              <div className={locals.accordionContent}>
                <Button type="button" kind="secondary" onClick={() => setChangesAreVisible(!changesAreVisible)}>
                  {changesAreVisible ? t('in-events:buttonHideChanges') : t('in-events:buttonShowChanges')}
                </Button>
                {recentEventIds.length !== 0 && !rawRelatedEvents && <LoadingIndicator size="xl" />}
                <EventsDatagrid
                  events={rawRelatedEvents as RawEvent[]}
                  loading={rawRelatedEventsLoading}
                  loadMore={loadMore}
                  canLoadMore={canLoadMore}
                />
              </div>
            </LeftRightPadding>
          </Collapsible.Content>
        </Collapsible>
      </CarbonLayer>
    </div>
  );
};

const RelatedEventsEmptyState = ({ open }: { open: boolean }) => (
  <div className={locals.layerBackground}>
    <CarbonLayer>
      <Collapsible initiallyOpen={open}>
        <Collapsible.Header>
          {t('in-events:titleRelatedEvents', {
            eventCount: 0
          })}
        </Collapsible.Header>
        <Collapsible.Content>
          <LeftRightPadding>
            <NoDataAvailable text={t('in-events:noRelatedEvents')} height={200} />
          </LeftRightPadding>
        </Collapsible.Content>
      </Collapsible>
    </CarbonLayer>
  </div>
);

export default memo(RelatedEventsOptimized, (prev, next) => prev.triggeringEventId !== next.triggeringEventId);
