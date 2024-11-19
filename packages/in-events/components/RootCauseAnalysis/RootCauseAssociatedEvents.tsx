/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useState, useEffect } from 'react';
import { List } from 'immutable';
import React from 'react';

import { Typography, CarbonLayer, Collapsible } from '@instana/components';
import { Observable, combineLatest } from '@instana/observables';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import { EVENT_RCA_ASSOCIATED_EVENTS_CLICK, EVENT_RCA_EXPANDED_CARD } from 'in-services/tracking/tracking';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
//@ts-expect-error
import { getEvent } from 'in-stores/events';
import EventListItem from '../legacy/EventListItem';
import { EventOrMap } from 'in-events/types';
import { Snapshot } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-events/components/legacy/EventList.mless';

interface AssociatedEventsProps {
  associatedEvents: List<string>;
  latestSnapshot: Snapshot;
}

export default function AssociatedEvents({ associatedEvents, latestSnapshot }: AssociatedEventsProps) {
  const SEGMENT_EVENT_PROPERTY_CHANNEL = 'root cause analysis';
  const { trackCta } = useSegmentTracking();

  const [associatedEventsObservables, setAssociatedEventsObservables] = useState<Observable<EventOrMap[]> | null>(null);
  //const [expanded, setExpanded] = useState<boolean>(false);

  const associatedEventsData = useObservable(associatedEventsObservables, [associatedEventsObservables]);

  useEffect(() => {
    setAssociatedEventsObservables(combineLatest(associatedEvents.toArray().map(getEvent)));
  }, [associatedEvents]);

  if (!associatedEventsData) return <LoadingIndicator />;

  return (
    <CarbonLayer>
      <Collapsible
        onOpen={() => {
          const instrumentationEventProperties = { expanded: true };
          trackCta(EVENT_RCA_ASSOCIATED_EVENTS_CLICK, instrumentationEventProperties, SEGMENT_EVENT_PROPERTY_CHANNEL);
        }}
      >
        <Collapsible.Header>
          <Typography variant="body-regular">
            {t('in-events:RCA.relatedEventsLabel', {
              number_of_events: Array.isArray(associatedEventsData) ? associatedEventsData.length : 0
            })}
          </Typography>
        </Collapsible.Header>
        <Collapsible.Content>
          <div className={locals.accordionContent}>
            {associatedEventsData?.map((_event: EventOrMap) => (
              <div
                onClick={() => {
                  trackCta(EVENT_RCA_EXPANDED_CARD, {}, SEGMENT_EVENT_PROPERTY_CHANNEL);
                }}
              >
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
          </div>
        </Collapsible.Content>
      </Collapsible>
    </CarbonLayer>
  );
}
