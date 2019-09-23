import irpt from 'react-immutable-proptypes';
import React, { Fragment } from 'react';
import rpt from 'prop-types';

import EntityWithParentInformation from 'in-components/EntityInformation/EntityWithParentInformation';
import OfflineEventDescription from 'in-events/components/legacy/OfflineEventDescription';
import AnalyzeIssueCallsButton from 'in-events/components/legacy/AnalyzeIssueCallsButton';
import EventDurationMarker from 'in-events/components/legacy/marker/EventDurationMarker';
import EventSpecificationLink from 'in-events/components/legacy/EventSpecificationLink';
import { getTimeConfigFromEventForSnapshotRetrieval } from 'in-events/timeframe';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import Marker, { hasServiceImpact } from 'in-events/components/legacy/Marker';
import { getColorForEventAtFocusedMomentAsStream } from 'in-stores/events';
import { getCurrentViewWithTimelineFocusedAt } from 'in-stores/timeline';
import EndedMarker from 'in-events/components/legacy/marker/EndedMarker';
import EventChart from 'in-events/components/legacy/EventChart';
import { formatTime } from 'in-services/formatters/date';
import Spacer from 'in-events/components/legacy/Spacer';
import EventIcon from 'in-components/EventIcon';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

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
      const isOfflineEvent = event => event.hasIn(['metadata', 'entityVerificationSnapshotId']);

      return (
        <div className={className} id={`event-${event.get('id')}`}>
          {serviceImpact ? (
            <Marker className={`${block}__affected-service-marker`} label="service impact" event={event} />
          ) : null}

          {isTriggeringEvent ? (
            <Marker className={`${block}__triggering-event-marker`} label="triggering event" event={event} />
          ) : null}

          <TimeIndicator event={event} isTriggeringEvent={isTriggeringEvent} />

          <div className={rightClassName}>
            <div className={`${block}__background`} style={{ background }} />

            <div className={`${block}__left-border`} style={{ background }} />

            <div className={`${block}__content-wrapper`}>
              <DetailsHeader
                event={event}
                iconType={isExpanded ? 'timeline_close' : 'timeline_open'}
                background={background}
                timeConfig={timeConfigFromEvent}
                onClick={() => this.setState({ isExpanded: !isExpanded })}
              />
              {isExpanded ? <div className={`${block}__border`} style={{ background }} /> : null}
              {isExpanded ? (
                <div className={`${block}__expanded-details`}>
                  <ProblemDescription event={event} />
                  <EventSpecificationLink event={event} />
                  <Spacer />
                  {isOfflineEvent(event) ? (
                    <OfflineEventDescription event={event} />
                  ) : (
                    <Fragment>
                      <EventChart event={event} />
                      <Spacer />
                      <AnalyzeIssueCallsButton event={event} />
                    </Fragment>
                  )}
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
      <Link href$={getCurrentViewWithTimelineFocusedAt(event.get('start'))}>
        <span className={timeClass}>{formatTime(event.get('start'))}</span>
      </Link>
      <div className={`${block}__line`} />
      <div className={`${block}__dot`} />
    </div>
  );
}

function DetailsHeader({ event, onClick, iconType, background, timeConfig }) {
  const className = `${block}__heading`;
  const entityId = event.get('entityId');
  const entityType = event.get('entityType');
  return (
    <div className={className} id={`event-${event.get('id')}`} onClick={onClick}>
      <div className={`${block}__left`}>
        <div className={`${block}__icon-wrapper`} style={{ background }}>
          <EventIcon event={event} size="xxs" />
        </div>

        <div className={`${block}__entity`}>
          <div>
            <span className={`${block}__problem-text`}>{event.getIn(['problem', 'problemText'])}</span>
            <EndedMarker event={event} />
            <EventDurationMarker event={event} />
          </div>
          <EntityWithParentInformation
            entityId={entityId}
            entityType={entityType}
            metadata={event.get('metadata')}
            timeConfig={timeConfig}
          />
        </div>
      </div>

      <SvgIcon className={`${block}__expand-icon`} type={iconType} size="xxs" color="#7b8e96" />
    </div>
  );
}
