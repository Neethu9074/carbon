/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import irpt from 'react-immutable-proptypes';
import rpt from 'prop-types';
import React from 'react';

import EntityWithParentInformation from 'in-events/components/EntityInformation/EntityWithParentInformation';
import ApplicationEventListItemContent from 'in-events/components/legacy/ApplicationEventListItemContent';
import { getTimeConfigFromEvent, getTimeConfigFromEventForSnapshotRetrieval } from 'in-events/timeframe';
import ApplicationScopePath from 'in-alerting/smart-alerts/applications/components/ApplicationScopePath';
import WebsiteEventListItemContent from 'in-events/components/legacy/WebsiteEventListItemContent';
import WebsiteScopePath from 'in-alerting/smart-alerts/websites/components/WebsiteScopePath';
import useApplicationEventAlertConfig from 'in-events/hooks/useApplicationEventAlertConfig';
import EventDurationMarker from 'in-events/components/legacy/marker/EventDurationMarker';
import EventListItemContent from 'in-events/components/legacy/EventListItemContent';
import useApplicationEventEntity from 'in-events/hooks/useApplicationEventEntity';
import { getColorForEventAtFocusedMomentAsStream } from 'in-stores/events';
import useWebsiteEventEntity from 'in-events/hooks/useWebsiteEventEntity';
import EndedMarker from 'in-events/components/legacy/marker/EndedMarker';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { timeConfig$, urlQueryKeys } from 'in-stores/time/config';
import { isAppDataEntityType } from 'in-services/entityUtils';
import { formatTime } from 'in-services/formatters/date';
import Marker from 'in-events/components/legacy/Marker';
import EventIcon from 'in-events/components/EventIcon';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

import 'in-events/components/legacy/EventListItem.less';

const block = 'in-event-view-incident-event-list-item';

export default connectTo(
  props => {
    return {
      background: getColorForEventAtFocusedMomentAsStream(props.event, { defaultColor: '#bababa' })
    };
  },
  class extends React.Component {
    static displayName = 'EventListItem';

    static propTypes = {
      triggeringProblemId: rpt.string,
      event: irpt.map.isRequired,
      background: rpt.string
    };

    state = {
      isExpanded: false
    };

    render() {
      const triggeringProblemId = this.props.triggeringProblemId;
      const isExpanded = this.state.isExpanded;
      const background = this.props.background;
      const event = this.props.event;
      const timeConfigFromEvent = getTimeConfigFromEventForSnapshotRetrieval(event);

      let rightClassName = `${block}__right`;

      const serviceImpact = hasServiceImpact(event);
      let className = block;
      if (serviceImpact) {
        className += ` ${className}__service-impact`;
      }

      const isTriggeringEvent = triggeringProblemId === event.getIn(['problem', 'id']);

      return (
        <div className={className} id={`event-${event.get('id')}`}>
          {serviceImpact && (
            <Marker className={`${block}__affected-service-marker`} label={t('in-events:labelServiceImpact')} />
          )}

          {isTriggeringEvent && serviceImpact && (
            <Marker className={`${block}__triggering-event-marker`} label={t('in-events:labelTriggeringEvent')} />
          )}

          <TimeIndicator event={event} isTriggeringEvent={isTriggeringEvent} />

          <div className={rightClassName}>
            <div className={`${block}__background`} style={{ background }} />

            <div className={`${block}__left-border`} style={{ background }} />

            <div className={`${block}__content-wrapper`}>
              <DetailsHeader
                event={event}
                iconType={isExpanded ? 'lib_openclose_remove_circle_outline' : 'lib_openclose_add_circle_outline'}
                background={background}
                timeConfig={timeConfigFromEvent}
                onClick={() => this.setState({ isExpanded: !isExpanded })}
              />
              {isExpanded ? <div className={`${block}__border`} style={{ background }} /> : null}
              {isExpanded ? (
                <div className={`${block}__expanded-details`}>
                  <ListItemContent event={event} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      );
    }
  }
);

function TimeIndicator({ event, isTriggeringEvent }) {
  let timeClass = `${block}__time`;
  if (isTriggeringEvent) {
    timeClass += ` ${timeClass}--triggering`;
  }
  return (
    <div className={`${block}__time-indicator`}>
      <Link href$={getCurrentViewWithTimeFocusedAt(event.get('start'))}>
        <span className={timeClass}>{formatTime(event.get('start'))}</span>
      </Link>
      <div className={`${block}__line`} />
      <div className={`${block}__dot`} />
    </div>
  );
}

function DetailsHeader({ event, onClick, iconType, background, timeConfig }) {
  const className = `${block}__heading`;
  return (
    <div className={className} id={`event-${event.get('id')}`} onClick={onClick}>
      <div className={`${block}__left`}>
        <div className={`${block}__icon-wrapper`} style={{ background }}>
          <EventIcon event={event} disableColorCalculation size="xs" />
        </div>

        <div className={`${block}__entity`}>
          <div>
            <span className={`${block}__problem-text`}>{event.getIn(['problem', 'problemText'])}</span>
            <EndedMarker event={event} />
            <EventDurationMarker event={event} />
          </div>
          <DetailsHeaderEntity event={event} timeConfig={timeConfig} />
        </div>
      </div>

      <SvgIcon type={iconType} size="xs" color="#7b8e96" />
    </div>
  );
}

function DetailsHeaderEntity({ event, timeConfig }) {
  if (isWebsiteSmartAlertEvent(event)) {
    return <WebsiteDetailsHeaderEntity event={event} />;
  } else if (isApplicationSmartAlertEvent(event)) {
    return <ApplicationDetailsHeaderEntity event={event} />;
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

function ListItemContent({ event }) {
  if (isWebsiteSmartAlertEvent(event)) {
    return <WebsiteEventListItemContent event={event} />;
  } else if (isApplicationSmartAlertEvent(event)) {
    return <ApplicationEventListItemContent event={event} />;
  }
  return <EventListItemContent event={event} />;
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

function getCurrentViewWithTimeFocusedAt(moment) {
  return timeConfig$.flatMap(({ windowSize }) => {
    return getModifiedUrlStream(params => {
      params.query[urlQueryKeys.to] = moment;
      params.query[urlQueryKeys.focusedMoment] = moment;
      params.query[urlQueryKeys.windowSize] = windowSize;
    });
  });
}
