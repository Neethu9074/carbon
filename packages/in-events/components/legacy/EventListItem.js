/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { LoadingSkeleton, LoadingSpinner, SvgIcon } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { Link } from '@instana/components';

import { getColorForEventAtFocusedMomentAsStream, getEventSeverityLabelWithEventType } from 'in-stores/events';
import ApplicationEventListItemContent from 'in-events/components/legacy/ApplicationEventListItemContent';
import { getTimeConfigForSnapshotRetrieval, isSloSmartAlertEvent } from 'in-events/components/eventUtil';
import MobileAppEventListItemContent from 'in-events/components/legacy/MobileAppEventListItemContent';
import WebsiteEventListItemContent from 'in-events/components/legacy/WebsiteEventListItemContent';
import SloEventListItemContent from 'in-events/components/legacy/SloEventListItemContent';
import EventDurationMarker from 'in-events/components/legacy/marker/EventDurationMarker';
import EventListItemContent from 'in-events/components/legacy/EventListItemContent';
import { isMobileAppSmartAlertEvent } from 'in-events/components/eventUtil';
import EndedMarker from 'in-events/components/legacy/marker/EndedMarker';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { eventsPath } from 'in-stores/navigation/paths/mainPaths';
import { isAppDataEntityType } from 'in-services/entityUtils';
import { formatTime } from 'in-services/formatters/date';
import Marker from 'in-events/components/legacy/Marker';
import EventIcon from 'in-events/components/EventIcon';
import EventEntityDetails from './EventEntityDetails';
import { urlQueryKeys } from 'in-stores/time/config';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from './EventListItem.mless';

export default function EventListItem({
  triggeringProblemId,
  event,
  latestSnapshot,
  expandedFromTimeline,
  setExpandedEventOnClickInTimeline,
  highlightEventOnHover,
  setBackground,
  setIconColor
}) {
  const [isExpanded, setIsExpanded] = useState(expandedFromTimeline || false);
  const [activeEventBackground, setActiveEventBackground] = useState(setBackground ? setBackground : '');
  const background =
    useObservable(
      getColorForEventAtFocusedMomentAsStream(event, {
        defaultColor: setBackground ? setBackground : themes.default.cds['background-active']
      }),
      [event]
    ) ?? '';

  useEffect(() => {
    if (background && background !== activeEventBackground) {
      setActiveEventBackground(background);
    }
  }, [activeEventBackground, background]);

  useEffect(() => {
    if (expandedFromTimeline && expandedFromTimeline !== isExpanded) {
      setIsExpanded(true);
    }

    if (isExpanded && expandedFromTimeline) {
      setExpandedEventOnClickInTimeline('');
    }
  }, [expandedFromTimeline, isExpanded, setExpandedEventOnClickInTimeline]);

  const timeConfigFromEvent = getTimeConfigForSnapshotRetrieval(event, latestSnapshot);
  const serviceImpact = hasServiceImpact(event);

  const isTriggeringEvent = triggeringProblemId === event.getIn(['problem', 'id']);

  return (
    <div
      className={classNames({
        [locals.inEventViewIncidentEventListItem]: true,
        [locals.serviceImpact]: serviceImpact
      })}
      id={`event-${event.get('id')}`}
    >
      {serviceImpact && <Marker className={locals.affectedServiceMarker} label={t('in-events:labelServiceImpact')} />}

      {isTriggeringEvent && serviceImpact && (
        <Marker className={locals.triggeringEventMarker} label={t('in-events:labelTriggeringEvent')} />
      )}

      <TimeIndicator event={event} isTriggeringEvent={isTriggeringEvent} />

      <div className={classNames({ [locals.right]: true, [locals.highlighted]: highlightEventOnHover })}>
        <div className={locals.background} style={{ background: setBackground ? setBackground : background }} />

        <div className={locals.leftBorder} style={{ background: setBackground ? setBackground : background }} />

        <div className={locals.contentWrapper}>
          <DetailsHeader
            event={event}
            iconType={
              isExpanded || expandedFromTimeline
                ? 'lib_openclose_remove_circle_outline'
                : 'lib_openclose_add_circle_outline'
            }
            background={background}
            timeConfig={timeConfigFromEvent}
            onClick={() => setIsExpanded(!isExpanded)}
            setBackground={setBackground}
            setIconColor={setIconColor}
          />
          {isExpanded || expandedFromTimeline ? <div className={locals.border} style={{ background }} /> : null}
          {isExpanded || expandedFromTimeline ? (
            <div className={locals.expandedDetails}>
              <CombinedEventListItemContent event={event} latestSnapshot={latestSnapshot} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function EventListItemSkeleton(id) {
  return (
    <div
      className={classNames({
        [locals.inEventViewIncidentEventListItem]: true
      })}
      id={`event-${id}`}
    >
      <div className={locals.timeIndicator}>
        <LoadingSkeleton className={locals.skeletonTime} />
      </div>

      <div className={locals.right}>
        <div className={locals.background} style={{ background: themes.default.cds.background }} />

        <div className={locals.leftBorder} style={{ background: themes.default.cds['background-active'] }} />

        <div className={locals.contentWrapper}>
          <DetailsHeaderSkeleton id={id} />
        </div>
      </div>
    </div>
  );
}

function TimeIndicator({ event, isTriggeringEvent }) {
  const { location, createHref } = useNavigation();
  const { windowSize } = useTimeConfig();
  return (
    <div className={locals.timeIndicator}>
      <Link
        href={createHref(
          getEventViewWithTimeFocusedAt(event.get('start'), windowSize, location, event.get('id'), event.get('type'))
        )}
      >
        <span className={classNames({ [locals.time]: true, [locals.triggeringTime]: isTriggeringEvent })}>
          {formatTime(event.get('start'))}
        </span>
      </Link>
      <div className={locals.line} />
      <div className={locals.dot} />
    </div>
  );
}

function DetailsHeader({ event, onClick, iconType, background, timeConfig, setBackground, setIconColor }) {
  if (setBackground) background = setBackground; //50% opacity of background colour
  return (
    <div className={locals.heading} id={`event-${event.get('id')}`} onClick={onClick}>
      <div className={locals.left}>
        <div className={locals.iconWrapper} style={{ background: setBackground ? setBackground : background }}>
          <EventIcon
            event={event}
            tooltipLabel={getEventSeverityLabelWithEventType(event, timeConfig)}
            disableColorCalculation
            size="xs"
            color={setIconColor ? setIconColor : undefined}
          />
        </div>

        <div className={locals.entity}>
          <div>
            <span className={locals.problemText}>{event.getIn(['problem', 'problemText'])}</span>
            <EndedMarker event={event} />
            <EventDurationMarker event={event} />
          </div>
          <EventEntityDetails triggeringEvent={event} timeConfig={timeConfig} />
        </div>
      </div>

      <SvgIcon type={iconType} size="xs" color={themes.default.ids.color.option.neutral['600']} />
    </div>
  );
}

function DetailsHeaderSkeleton(id) {
  return (
    <div className={locals.heading} id={`event-${id}`}>
      <div className={locals.left}>
        <div className={locals.iconWrapper}>
          {/* <SvgIcon type="lib_actions_loading" size="xs" /> */}
          <LoadingSpinner small withOverlay={false} />
        </div>

        <div className={locals.entity}>
          <div>
            <span className={locals.problemText}>
              <LoadingSkeleton />
            </span>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    </div>
  );
}

export function CombinedEventListItemContent({ event, latestSnapshot, justChart = false }) {
  if (isSloSmartAlertEvent(event)) {
    return <SloEventListItemContent event={event} justChart={justChart} />;
  } else if (isWebsiteSmartAlertEvent(event)) {
    return <WebsiteEventListItemContent event={event} justChart={justChart} />;
  } else if (isApplicationSmartAlertEvent(event)) {
    return <ApplicationEventListItemContent event={event} justChart={justChart} />;
  } else if (isMobileAppSmartAlertEvent(event)) {
    return <MobileAppEventListItemContent event={event} justChart={justChart} />;
  }

  return <EventListItemContent event={event} latestSnapshot={latestSnapshot} justChart={justChart} />;
}

function hasServiceImpact(event) {
  const entityType = event.get('entityType');
  return isAppDataEntityType(entityType);
}

export function isWebsiteSmartAlertEvent(event) {
  return event.hasIn(['metadata', 'websiteId']);
}

export function isApplicationSmartAlertEvent(event) {
  return event.hasIn(['metadata', 'applicationId']);
}

export function getEventViewWithTimeFocusedAt(moment, windowSize, location, eventId, eventType) {
  location.query[urlQueryKeys.to] = moment;
  location.query[urlQueryKeys.focusedMoment] = moment;
  location.query[urlQueryKeys.windowSize] = windowSize;
  return {
    ...location,
    matrix: {
      ...location.matrix,
      [eventsPath]: {
        ...location.matrix[eventsPath],
        eventId: eventId,
        view: eventType
      }
    },
    query: {
      ...location.query,
      [urlQueryKeys.to]: moment,
      [urlQueryKeys.focusedMoment]: moment,
      [urlQueryKeys.windowSize]: windowSize
    }
  };
}

/**
 * Function to get the event location given the event id.
 * @param {string} eventId Id of the event
 * @param {Location} location location object from useNavigation
 * @param {string} eventType type of event
 * @returns {Location} new location with updated path
 */
export const getEventUrl = (eventId, location, eventType) => {
  return {
    ...location,
    matrix: {
      ...location.matrix,
      [eventsPath]: {
        ...location.matrix[eventsPath],
        eventId,
        view: eventType
      }
    },
    query: {
      ...location.query
    }
  };
};
