/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import { getColorForEventAtFocusedMomentAsStream, getEventSeverityLabelWithEventType } from 'in-stores/events';
import EntityWithParentInformation from 'in-events/components/EntityInformation/EntityWithParentInformation';
import ApplicationEventListItemContent from 'in-events/components/legacy/ApplicationEventListItemContent';
import ApplicationScopePath from 'in-alerting/smart-alerts/applications/components/ApplicationScopePath';
import MobileAppEventListItemContent from 'in-events/components/legacy/MobileAppEventListItemContent';
import WebsiteEventListItemContent from 'in-events/components/legacy/WebsiteEventListItemContent';
import MobileAppScopePath from 'in-alerting/smart-alerts/mobileApp/components/MobileAppScopePath';
import WebsiteScopePath from 'in-alerting/smart-alerts/websites/components/WebsiteScopePath';
import useApplicationEventAlertConfig from 'in-events/hooks/useApplicationEventAlertConfig';
import EventDurationMarker from 'in-events/components/legacy/marker/EventDurationMarker';
import EventListItemContent from 'in-events/components/legacy/EventListItemContent';
import { getTimeConfigForSnapshotRetrieval } from 'in-events/components/eventUtil';
import useApplicationEventEntity from 'in-events/hooks/useApplicationEventEntity';
import useMobileAppEventEntity from 'in-events/hooks/useMobileAppEventEntity';
import { isMobileAppSmartAlertEvent } from 'in-events/components/eventUtil';
import useWebsiteEventEntity from 'in-events/hooks/useWebsiteEventEntity';
import EndedMarker from 'in-events/components/legacy/marker/EndedMarker';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { isAppDataEntityType } from 'in-services/entityUtils';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import { formatTime } from 'in-services/formatters/date';
import Marker from 'in-events/components/legacy/Marker';
import EventIcon from 'in-events/components/EventIcon';
import { urlQueryKeys } from 'in-stores/time/config';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { useTheme } from 'in-themes';
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
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(expandedFromTimeline || false);
  const [activeEventBackground, setActiveEventBackground] = useState(setBackground ? setBackground : '');
  const background =
    useObservable(
      getColorForEventAtFocusedMomentAsStream(event, {
        defaultColor: setBackground ? setBackground : theme.cds['background-active']
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
              <ListItemContent event={event} latestSnapshot={latestSnapshot} />
            </div>
          ) : null}
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
      <Link href={createHref(getCurrentViewWithTimeFocusedAt(event.get('start'), windowSize, location))}>
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
  const theme = useTheme();
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
          <DetailsHeaderEntity event={event} timeConfig={timeConfig} />
        </div>
      </div>

      <SvgIcon type={iconType} size="xs" color={theme.ids.color.option.neutral[600]} />
    </div>
  );
}

function DetailsHeaderEntity({ event, timeConfig }) {
  if (isWebsiteSmartAlertEvent(event)) {
    return <WebsiteDetailsHeaderEntity event={event} />;
  } else if (isApplicationSmartAlertEvent(event)) {
    return <ApplicationDetailsHeaderEntity event={event} />;
  } else if (isMobileAppSmartAlertEvent(event)) {
    return <MobileAppDetailsHeaderEntity event={event} />;
  }

  return (
    <EntityWithParentInformation
      entityId={event.get('entityId')}
      entityType={event.get('entityType')}
      metadata={event.get('metadata')}
      timeConfig={timeConfig}
      linkTimeConfig={getTimeConfigFromEvent(event)}
    />
  );
}

function ApplicationDetailsHeaderEntity({ event }) {
  const alertConfig = useApplicationEventAlertConfig(event);
  const eventEntity = useApplicationEventEntity(event);

  if (!eventEntity || !alertConfig) {
    return null;
  }

  return (
    <ApplicationScopePath
      {...eventEntity}
      boundaryScope={alertConfig.boundaryScope}
      timeConfig={getTimeConfigFromEvent(event)}
      iconSize="xs"
      showDashboardLinks
      noBottomMargin
    />
  );
}

function WebsiteDetailsHeaderEntity({ event }) {
  const eventEntity = useWebsiteEventEntity(event);

  if (!eventEntity) {
    return null;
  }

  return (
    <WebsiteScopePath
      {...eventEntity}
      timeConfig={getTimeConfigFromEvent(event)}
      iconSize="xs"
      showDashboardLinks
      noBottomMargin
    />
  );
}

function MobileAppDetailsHeaderEntity({ event }) {
  const eventEntity = useMobileAppEventEntity(event);

  if (!eventEntity) {
    return null;
  }

  return (
    <MobileAppScopePath
      {...eventEntity}
      timeConfig={getTimeConfigFromEvent(event)}
      iconSize="xs"
      showDashboardLinks
      noBottomMargin
    />
  );
}

function ListItemContent({ event, latestSnapshot }) {
  if (isWebsiteSmartAlertEvent(event)) {
    return <WebsiteEventListItemContent event={event} />;
  } else if (isApplicationSmartAlertEvent(event)) {
    return <ApplicationEventListItemContent event={event} />;
  } else if (isMobileAppSmartAlertEvent(event)) {
    return <MobileAppEventListItemContent event={event} />;
  }
  return <EventListItemContent event={event} latestSnapshot={latestSnapshot} />;
}

function hasServiceImpact(event) {
  const entityType = event.get('entityType');
  return isAppDataEntityType(entityType);
}

function isWebsiteSmartAlertEvent(event) {
  return event.hasIn(['metadata', 'websiteId']);
}

function isApplicationSmartAlertEvent(event) {
  return event.hasIn(['metadata', 'applicationId']);
}

function getCurrentViewWithTimeFocusedAt(moment, windowSize, location) {
  location.query[urlQueryKeys.to] = moment;
  location.query[urlQueryKeys.focusedMoment] = moment;
  location.query[urlQueryKeys.windowSize] = windowSize;
  return {
    ...location,
    query: {
      ...location.query,
      [urlQueryKeys.to]: moment,
      [urlQueryKeys.focusedMoment]: moment,
      [urlQueryKeys.windowSize]: windowSize
    }
  };
}
