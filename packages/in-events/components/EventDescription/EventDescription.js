/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';

import {
  getColorForEventAtFocusedMomentAsStream,
  fireCallbacksForEventAtFocusedMomentAsStream,
  getIcon,
  getEventType,
  EVENT_TYPES
} from 'in-stores/events';
import { focusEvent } from 'in-stores/navigation/paths/eventPaths';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import IncidentContent from './IncidentContent';
import EventContent from './EventContent';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import './EventDescription.less';

const block = 'in-event-description';

export default connectTo(
  props => {
    return {
      color: getColorForEventAtFocusedMomentAsStream(props.event),
      isOpen: fireCallbacksForEventAtFocusedMomentAsStream(
        props.event,
        () => true,
        () => false
      )
    };
  },
  function EventDescription({
    snapshotId,
    showFullTextIfToLong,
    color,
    event,
    isNotClickable,
    className,
    isOpen,
    isPreview
  }) {
    const eventType = getEventType(event);
    const start = event.get('start');
    const end = event.get('end');

    return (
      <div
        className={classNames({
          [`${block}`]: true,
          [`${className}`]: className
        })}
        onClick={() => {
          if (!isNotClickable) {
            focusEvent(event.get('id'));
          }
        }}
      >
        <SvgIcon
          className={classNames({ [`${block}__icon`]: true, [`${block}__icon_in_preview`]: isPreview })}
          type={getIcon({ eventType })}
          size="xs"
          color={color}
        />
        <div className={`${block}__description`}>
          <Row
            className={classNames({
              [`${block}__time`]: true,
              [`${className}__time`]: className
            })}
          >
            <Col lg={6}>
              {eventType === EVENT_TYPES.INCIDENT ? t('in-events:triggered') : t('in-events:started')}
              <br />
              {formatDateTime(event.get('triggeringTime', event.get('start')))}
            </Col>

            {!isOpen && start !== end ? (
              <Col lg={6} className={block + '__end'}>
                {t('in-events:ended')}
                <br />
                {formatDateTime(end)}
              </Col>
            ) : null}
          </Row>

          <Content snapshotId={snapshotId} event={event} color={color} showFullTextIfToLong={showFullTextIfToLong} />
        </div>
      </div>
    );
  }
);

function Content({ snapshotId, event, color, showFullTextIfToLong = true }) {
  const eventType = getEventType(event);

  if (eventType === EVENT_TYPES.INCIDENT) {
    return <IncidentContent incident={event} />;
  }
  return (
    <EventContent snapshotId={snapshotId} showFullTextIfToLong={showFullTextIfToLong} event={event} color={color} />
  );
}
