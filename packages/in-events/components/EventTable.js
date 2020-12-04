import { on } from 'reactive-observables';
import { findIndex } from 'lodash';
import theme from 'in-themes';
import React from 'react';

import NavigatorSplitScreen from 'in-analyze/TraceDetail/components/NavigatorSplitScreen/NavigatorSplitScreen';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { isAppDataEntityType } from 'in-services/entityUtils';
import { getEventType, EVENT_TYPES, getEvent } from 'in-stores/events';
import EventsList from 'in-events/components/EventsList';
import { eventsPath } from 'in-events/navigation/paths';
import EventIcon from 'in-events/components/EventIcon';
import { eventId } from 'in-events/navigation/matrix';
import tabs from 'in-events/components/tabs/index';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Pill from 'in-new-components/Pill';
import Link from 'in-components/Link';

import locals from './EventTable.mless';

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
  const { selectedEventId, items: rawEventList, items, onChange, progress } = props;

  if (!rawEventList) {
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
      items={rawEventList}
      navigator={<EventsList {...props} onItemClicked={onItemClicked} />}
      typeLabel="event"
      openItemIndex={findIndex(items, event => event.id === selectedEventId)}
      openItem={e => onChange({ eventId: e.id })}
      totalRepresentedItemCount={rawEventList.filter(rawEvent => rawEvent.type !== 'release').length}
      hideResultCount
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
        title="Event"
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
      title="Event"
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
      <Tooltip content="Close event detail">
        <SvgIcon className={locals.closeIcon} aria-label="Close event detail" type="lib_openclose_cancel" />
      </Tooltip>
    </Link>
  );
}

function TriggeredMarker({ event }) {
  return getEventType(event) !== EVENT_TYPES.INCIDENT && hasServiceImpact(event) ? (
    <Pill color={theme.lib.colors.cyan800}>SERVICE IMPACT</Pill>
  ) : null;
}

function hasServiceImpact(event) {
  const entityType = event.get('entityType');
  return isAppDataEntityType(entityType);
}

function renderIcon(event) {
  return <EventIcon className={locals.icon} event={event} size="l" />;
}
