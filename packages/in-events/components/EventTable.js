/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { findIndex } from 'lodash';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';
import { on } from '@instana/observables';

import NavigatorSplitScreen from 'in-applications/analyze/components/TraceDetails/components/NavigatorSplitScreen/NavigatorSplitScreen';
import { getEventType, EVENT_TYPES, getEvent, getEventSeverityLabelWithEventType } from 'in-stores/events';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { isAppDataEntityType } from 'in-services/entityUtils';
import DashboardHeader from 'in-components/DashboardHeader';
import EventsList from 'in-events/components/EventsList';
import { eventsPath } from 'in-events/navigation/paths';
import EventIcon from 'in-events/components/EventIcon';
import { eventId } from 'in-events/navigation/matrix';
import tabs from 'in-events/components/tabs/index';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-components/Pill';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './EventTable.mless';

/**
 * The maximum number of events the backend will return for any query,
 * due to internal limits configured for ElasticSearch.
 */
const eventResponseLimit = 10000;

export default class extends React.Component {
  static displayName = 'EventTableWithMouseEvent';

  componentDidMount() {
    this.setupSubscriptions();
  }

  componentDidUpdate() {
    this.disposeSubscriptions();
    this.setupSubscriptions();
  }

  componentWillUnmount() {
    this.disposeSubscriptions();
  }

  setupSubscriptions = () => {
    if (!this.table) {
      return;
    }

    this.onMouseMoveSubscription = on(this.table, 'mousemove').subscribe(() =>
      this.props.mouseMoveSignal$.emit(Date.now())
    );
  };

  disposeSubscriptions = () => {
    if (this.onMouseMoveSubscription) {
      this.onMouseMoveSubscription.dispose();
      this.onMouseMoveSubscription = null;
    }
  };

  render() {
    return (
      <div ref={table => (this.table = table)}>
        <ViewTrackingMeta
          data={{
            productArea: 'Events',
            pageRootName: 'Events List'
          }}
        />

        <EventTable {...this.props} />
      </div>
    );
  }
}

function EventTable(props) {
  const { selectedEventId, items, onChange, progress } = props;

  if (!items) {
    return null;
  }

  function onItemClicked(eventId) {
    onChange({ eventId: selectedEventId === eventId ? null : eventId });
  }

  if (!selectedEventId) {
    return <EventsList {...props} onItemClicked={onItemClicked} progress={progress} />;
  }

  return (
    <NavigatorSplitScreen
      {...props}
      items={items}
      navigator={<EventsList {...props} onItemClicked={onItemClicked} />}
      typeLabel={t('in-events:labelEvent')}
      openItemIndex={findIndex(items, event => event.id === selectedEventId)}
      openItem={e => onChange({ eventId: e.id })}
      resultCountLimit={eventResponseLimit}
    >
      <TabView
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        result$={getEvent(selectedEventId).map(data => ({
          data,
          errors: [],
          progress: { percentage: null, loading: false }
        }))}
        props={props}
        withoutBreadcrumb
      />
    </NavigatorSplitScreen>
  );
}

function Header(props) {
  if (!props.result) {
    return (
      <DashboardHeader
        title={t('in-events:titleEvent')}
        icon=""
        result={{ data: null }}
        renderTimeSelection={renderTimeSelection}
        hideUrlShortener
      />
    );
  }

  return (
    <DashboardHeader
      event={props.result.data}
      title={t('in-events:titleEvent')}
      renderIcon={() => renderIcon(props.result.data)}
      label={props.result.data.getIn(['problem', 'problemText'], '')}
      renderMetaInformation={renderMetaInformation}
      renderTimeSelection={renderTimeSelection}
      hideUrlShortener
    />
  );
}

function renderMetaInformation({ event }) {
  return <TriggeredMarker event={event} />;
}

function renderTimeSelection() {
  return (
    <Link href$={getModifiedUrlStream(location => setOrDeleteMatrixKey(location, eventsPath, eventId, null))}>
      <Tooltip content={t('in-events:tooltipCloseEventDetail')}>
        <SvgIcon
          className={locals.closeIcon}
          aria-label={t('in-events:tooltipCloseEventDetail')}
          type="lib_openclose_cancel"
        />
      </Tooltip>
    </Link>
  );
}

function TriggeredMarker({ event }) {
  return getEventType(event) !== EVENT_TYPES.INCIDENT && hasServiceImpact(event) ? (
    <Pill color={theme.lib.colors.cyan800}>{t('in-events:markerServiceImpact')}</Pill>
  ) : null;
}

function hasServiceImpact(event) {
  const entityType = event.get('entityType');
  return isAppDataEntityType(entityType);
}

function renderIcon(event) {
  return (
    <EventIcon
      className={locals.icon}
      event={event}
      tooltipLabel={getEventSeverityLabelWithEventType(event)}
      size="l"
    />
  );
}
