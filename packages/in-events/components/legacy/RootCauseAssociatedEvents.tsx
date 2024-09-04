/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useState, useEffect } from 'react';
import { List } from 'immutable';
import React from 'react';

import { Card, Typography, IconButton } from '@instana/components';
import { Observable, combineLatest } from '@instana/observables';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import { RCAAssociatedEventsClick, expandedRCAEventCardTracker } from 'in-events/tracker';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
//@ts-expect-error
import { getEvent } from 'in-stores/events';
import { EventOrMap } from 'in-events/types';
import EventListItem from './EventListItem';
import { Snapshot } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-events/components/legacy/EventList.mless';

interface AssociatedEventsProps {
  associatedEvents: List<string>;
  latestSnapshot: Snapshot;
}

export default function AssociatedEvents({ associatedEvents, latestSnapshot }: AssociatedEventsProps) {
  const [associatedEventsObservables, setAssociatedEventsObservables] = useState<Observable<EventOrMap[]> | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);

  const associatedEventsData = useObservable(associatedEventsObservables, [associatedEventsObservables]);

  useEffect(() => {
    setAssociatedEventsObservables(combineLatest(associatedEvents.toArray().map(getEvent)));
  }, [associatedEvents]);

  if (!associatedEventsData) return <LoadingIndicator />;

  return (
    <Card
      leftHeaderContent={
        <Typography variant="body-bold">
          {t('in-events:RCA.relatedEventsLabel', {
            number_of_events: Array.isArray(associatedEventsData) ? associatedEventsData.length : 0
          })}
        </Typography>
      }
      onHeaderBackgroundClicked={() => {
        RCAAssociatedEventsClick({ expanded: !expanded });
        setExpanded(!expanded);
      }}
      headerClassName={locals.associatedEventsCardHeader}
      rightHeaderContent={
        <IconButton color="black" type={expanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'} size="compact" />
      }
      className={locals.associatedEventsCard}
      hasMarginBottom={expanded}
      useMaxAvailableHeight={false}
    >
      {expanded &&
        associatedEventsData?.map((_event: EventOrMap) => (
          <div onClick={expandedRCAEventCardTracker}>
            <EventListItem
              key={_event.get('id') as string}
              triggeringProblemId={
                associatedEventsData.length > 0 ? (associatedEventsData[0].get('id') as string) : undefined
              }
              event={_event}
              latestSnapshot={latestSnapshot}
              setBackground={themes.default.ids.color.option['deep-purple'][500]}
              setIconColor={themes.default.ids.color.option.white}
            />
          </div>
        ))}
    </Card>
  );
}
