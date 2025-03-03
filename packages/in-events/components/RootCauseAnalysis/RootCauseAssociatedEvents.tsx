/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography, CarbonLayer, Collapsible } from '@instana/components';
import { combineLatest } from '@instana/observables';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

// eslint-disable-next-line no-restricted-imports
import { ProbableCauseType } from './utils/rootCauseUtil';
import { EVENT_RCA_ASSOCIATED_EVENTS_CLICK, EVENT_RCA_EXPANDED_CARD } from 'in-services/tracking/tracking';
//@ts-expect-error file needs to be converted
import getRawEvents from 'in-subscription/getRawEvents';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import EventListItem from 'in-events/components/legacy/EventListItem';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
// @ts-expect-error
import { getEvent } from 'in-stores/events';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { Snapshot, RawEvent } from 'in-types';
import { EventOrMap } from 'in-events/types';
import { t } from 'in-i18n';

import locals from 'in-events/components/legacy/EventList.mless';

interface AssociatedEventsProps {
  latestSnapshot: Snapshot;
  rootCause: ProbableCauseType;
}

type TYPE_ASSOCIATED_EVENTS = EventOrMap[] | unknown[] | null | undefined;

export default function AssociatedEvents({ latestSnapshot, rootCause }: AssociatedEventsProps) {
  const SEGMENT_EVENT_PROPERTY_CHANNEL = 'root cause analysis';
  const { trackCta } = useSegmentTracking();

  const userTimeConfig = useTimeConfig();

  const steadyId = rootCause.getIn(['entityID', 'steadyId']);
  const pluginId = rootCause.getIn(['entityID', 'pluginId']);
  const hostIdValue = rootCause.getIn(['entityID', 'host']);

  const rawEventsQueryForAssociatedEvents: any = useObservable(
    getRawEvents({
      timeConfig: userTimeConfig,
      query: `(event.steadyId:"${steadyId}") AND (event.pluginId:"${pluginId}") AND (event.host:"${hostIdValue}") AND !event.type:prc_issue`,
      pagination: {
        cursor: null,
        retrievalSize: 200
      },
      order: {
        by: 'start',
        direction: 'DESC'
      }
    }),
    [userTimeConfig]
  );

  const associatedEvMetadata = rawEventsQueryForAssociatedEvents?.data?.items || [];
  const associatedEvIds = associatedEvMetadata.map((e: RawEvent) => e.id);
  // TODO: remove the usage of getEvent to reduce computation.
  const associatedEvents: TYPE_ASSOCIATED_EVENTS =
    useObservable(combineLatest(associatedEvIds.map(getEvent)).throttle(250), [associatedEvIds.length]) ?? null;

  if (!associatedEvents) return <LoadingIndicator />;

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
              number_of_events: associatedEvents?.length || 0
            })}
          </Typography>
        </Collapsible.Header>
        <Collapsible.Content>
          <div className={locals.accordionContent}>
            {associatedEvents?.map(_event => {
              return (
                <div
                  onClick={() => {
                    trackCta(EVENT_RCA_EXPANDED_CARD, {}, SEGMENT_EVENT_PROPERTY_CHANNEL);
                  }}
                >
                  <EventListItem
                    // @ts-expect-error need to fix the ts types here
                    key={_event?.get('id') || undefined}
                    triggeringProblemId={
                      // @ts-expect-error need to fix the ts types here
                      associatedEvents?.length > 0 ? associatedEvents?.[0]?.get('id') : undefined
                    }
                    event={_event}
                    latestSnapshot={latestSnapshot}
                    setBackground={themes.default.ids.color.option['deep-purple'][500]}
                    setIconColor={themes.default.ids.color.option.white}
                  />
                </div>
              );
            })}
          </div>
        </Collapsible.Content>
      </Collapsible>
    </CarbonLayer>
  );
}
