/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import { findIndex } from 'lodash';

import { Stack, Typography, Pill, IconButton } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { on } from '@instana/observables';

import {
  EVENT_FEEDBACK_NEGATIVE,
  EVENT_FEEDBACK_POSITIVE,
  EVENT_FEEDBACK_SKIP,
  EVENT_FEEDBACK_NEXT,
  EVENT_FEEDBACK_SUBMIT,
  EVENT_FEEDBACK_CLOSED_MANUALLY
} from 'in-services/tracking/tracking';
import {
  getKubernetesProblemText,
  getKubernetesProblemTextReplacement
} from 'in-events/components/EventContent/KubernetesEventContent';
import { NotesAndActivity, OpenNotesAndActivity } from 'in-events/components/NotesAndActivity/NotesAndActivity';
import NavigatorSplitScreen from 'in-events/components/NavigatorSplitScreen/NavigatorSplitScreen';
import { getEventType, EVENT_TYPES, getEventSeverityLabelWithEventType } from 'in-stores/events';
import EventsNavItems from 'in-events/components/EventContent/EventsNavItems/EventsNavItems';
import { eventFeedbackEnabled, notesAndActivityEnabled } from 'in-services/featureFlags';
import EventFeedbackDialog from 'in-events/components/feedback/EventFeedbackDialog';
import EventsTable from 'in-events/components/EventsPage/EventsTable/EventsTable';
import { eventStepConfig } from 'in-events/components/feedback/eventStepConfig';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { aqmDataGridEventTableEnabled } from 'in-services/featureFlags';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { isAppDataEntityType } from 'in-services/entityUtils';
import DashboardHeader from 'in-components/DashboardHeader';
import { pageNames } from 'in-services/tracking/pageNames';
import EventsList from 'in-events/components/EventsList';
import { eventsPath } from 'in-events/navigation/paths';
import EventIcon from 'in-events/components/EventIcon';
import { eventId } from 'in-events/navigation/matrix';
import { isLoading } from 'in-services/util/result';
import tabs from 'in-events/components/tabs/index';
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
            productArea: productAreas.events,
            pageRootName: pageNames.events
          }}
        />

        <EventTable {...this.props} />
      </div>
    );
  }
}

function EventTable(props) {
  const { selectedEventId, onChange, progress, eventObservable, isApplicationDirect } = props;
  const { location, navigate } = useNavigation();
  location.pathname = eventsPath;
  const items = props.items.map(item => updateTitle(item));
  if (!items) {
    return null;
  }

  function onItemClicked(eventId) {
    if (isApplicationDirect) {
      setOrDeleteMatrixKey(location, eventsPath, 'view', 'cve_issue');
      setOrDeleteMatrixKey(location, eventsPath, 'eventId', eventId);
      navigate(location);
    }
    onChange({ eventId, relatedEventsPage: 1 });
  }

  if (!selectedEventId) {
    if (aqmDataGridEventTableEnabled) {
      return <EventsTable {...props} items={items} onItemClicked={onItemClicked} progress={progress} disableCard />;
    }
    return <EventsList {...props} items={items} onItemClicked={onItemClicked} progress={progress} disableCard />;
  }

  return (
    <NavigatorSplitScreen
      {...props}
      items={items}
      navigator={
        <EventsNavItems {...props} items={items} onItemClicked={onItemClicked} progress={progress} disableCard />
      }
      typeLabel="event"
      openItemIndex={findIndex(items, event => event.id === selectedEventId)}
      openItem={e => onChange({ eventId: e.id })}
      resultCountLimit={eventResponseLimit}
    >
      <TabView HeaderComponent={Header} location={location} tabs={tabs} result$={eventObservable} props={props} />
    </NavigatorSplitScreen>
  );
}

function Header(props) {
  if (isLoading(props.result)) {
    return (
      <DashboardHeader
        title={t('in-events:titleEvent')}
        icon=""
        result={{ data: null }}
        renderTimeSelection={TimeSelection}
        hideUrlShortener
      />
    );
  }

  const isIncident = getEventType(props.result.data) === EVENT_TYPES.INCIDENT;

  if (isIncident) {
    return <IncidentHeader event={props.result.data} timeConfig={props.timeConfig} />;
  }

  return (
    <DashboardHeader
      className={locals.eventsDashboardHeader}
      event={props.result.data}
      title={t('in-events:titleEvent')}
      renderIcon={() => renderIcon(props.result.data, props.timeConfig)}
      label={getLabelText(props.result.data)}
      renderMetaInformation={renderMetaInformation}
      renderTimeSelection={() => {
        // Pass in Event to TimeSelection for Notes and Activity usage
        return <TimeSelection event={props.result.data} />;
      }}
      hideUrlShortener
    />
  );
}

const IncidentHeader = ({ event, timeConfig }) => {
  const { location, createHref } = useNavigation();
  setOrDeleteMatrixKey(location, eventsPath, eventId, null);
  const [displayNotes, setDisplayNotes] = useState(false);

  return (
    <LeftRightPadding className={locals.incidentHeader}>
      <Stack gap="disabled">
        <Stack direction="horizontal" distribution="spaceBetween" align="center">
          <Stack align="center" direction="horizontal">
            {renderIcon(event, timeConfig, 's')}
            <Typography noMargin variant="heading-300">
              {getLabelText(event)}
            </Typography>
          </Stack>
          <Stack align="center" direction="horizontal">
            {notesAndActivityEnabled && (
              <OpenNotesAndActivity event={event} displayNotes={displayNotes} setDisplayNotes={setDisplayNotes} />
            )}
            <IconButton
              href={createHref(location)}
              type="lib_openclose_cancel"
              className={locals.closeEventDetail}
              iconDescription={t('in-events:tooltipCloseEventDetail')}
              isWrapperedByTooltip
              align="left"
              size="normal"
            />
            {notesAndActivityEnabled && (
              <NotesAndActivity event={event} displayNotes={displayNotes} setDisplayNotes={setDisplayNotes} />
            )}
          </Stack>
        </Stack>
      </Stack>
    </LeftRightPadding>
  );
};

function renderMetaInformation({ event }) {
  return <TriggeredMarker event={event} />;
}

export function FeedbackComponents({ eventData, textVariant = 'body-regular', iconSize = 's' }) {
  const { trackCta } = useSegmentTracking();
  const SEGMENT_EVENT_PROPERTY_CHANNEL = 'event feedback';
  const tup = 'thumbsUp';
  const tdown = 'thumbsDown';
  const [feedbackState, setFeedbackState] = useState('');
  const { location } = useNavigation();
  const [selectedID, setSelectedID] = useState(location.matrix[eventsPath].eventId);

  // If event ID changes then we need to trigger an update for our feedback state
  useEffect(() => {
    if (selectedID !== location.matrix[eventsPath].eventId) {
      setSelectedID(location.matrix[eventsPath].eventId);
    }
  }, [location, selectedID]);

  // If event ID changed reset thumbs up and down filled
  useEffect(() => {
    setFeedbackState('');
  }, [selectedID]);

  // If user pressed thumbs down then bring up feedback dialog
  useEffect(() => {
    if (feedbackState === tdown)
      addActiveDialog(
        <EventFeedbackDialog
          stepConfig={eventStepConfig}
          closedManuallyTracker={instrumentationEventProperties => {
            trackCta(EVENT_FEEDBACK_CLOSED_MANUALLY, instrumentationEventProperties, SEGMENT_EVENT_PROPERTY_CHANNEL);
          }}
          nextStepTracker={instrumentationEventProperties => {
            trackCta(EVENT_FEEDBACK_NEXT, instrumentationEventProperties, SEGMENT_EVENT_PROPERTY_CHANNEL);
          }}
          skipStepTracker={instrumentationEventProperties => {
            trackCta(EVENT_FEEDBACK_SKIP, instrumentationEventProperties, SEGMENT_EVENT_PROPERTY_CHANNEL);
          }}
          submitTracker={instrumentationEventProperties => {
            trackCta(EVENT_FEEDBACK_SUBMIT, instrumentationEventProperties, SEGMENT_EVENT_PROPERTY_CHANNEL);
          }}
          eventData={eventData}
        />
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedbackState]);

  return (
    <Stack direction="horizontal" gap="xxsmall" distribution="start" align="center">
      <Typography variant={textVariant} align="center">
        {feedbackState === '' ? t('in-events:eventHelpfulText') : t('in-events:thankYouForYourFeedback')}
      </Typography>

      <Stack direction="horizontal" align="center" gap="xxsmall">
        <IconButton
          kind="subtle"
          // I acknowledge this isn't ideal but we will release a preliminary version and a discussion will take place to find a new way to do this
          //TODO: Find an alternative to this (i.e. bring in a filled in thumbs up icon)
          color={feedbackState === tup ? themes.default.ids.color.option.neutral['300'] : undefined}
          size="compact"
          type="lib_thumbs_up"
          iconSize={iconSize}
          onClick={() => {
            const instrumentationEventProperties = {
              eventID: location.matrix[eventsPath]?.eventId,
              eventType: location.matrix[eventsPath]?.view
            };
            trackCta(EVENT_FEEDBACK_POSITIVE, instrumentationEventProperties, SEGMENT_EVENT_PROPERTY_CHANNEL);
            if (feedbackState === tup) {
              setFeedbackState('');
            } else {
              setFeedbackState(tup);
            }
          }}
        />
        <IconButton
          kind="subtle"
          // I acknowledge this isn't ideal but we will release a preliminary version and a discussion will take place to find a new way to do this
          //TODO: Find an alternative to this (i.e. bring in a filled in thumbs down icon)
          color={feedbackState === tdown ? themes.default.ids.color.option.neutral['300'] : undefined}
          size="compact"
          iconSize={iconSize}
          type="lib_thumbs_down"
          onClick={() => {
            const instrumentationEventProperties = {
              eventID: location.matrix[eventsPath]?.eventId,
              eventType: location.matrix[eventsPath]?.view
            };
            trackCta(EVENT_FEEDBACK_NEGATIVE, instrumentationEventProperties, SEGMENT_EVENT_PROPERTY_CHANNEL);
            if (feedbackState === tdown) {
              setFeedbackState('');
            } else {
              setFeedbackState(tdown);
            }
          }}
        />
      </Stack>
    </Stack>
  );
}

function TimeSelection({ event }) {
  const { location, createHref } = useNavigation();

  setOrDeleteMatrixKey(location, eventsPath, eventId, null);
  return (
    <Stack direction="horizontal">
      {eventFeedbackEnabled && event && <FeedbackComponents eventData={event} />}
      <IconButton
        href={createHref(location)}
        type="lib_openclose_cancel"
        iconDescription={t('in-events:tooltipCloseEventDetail')}
        isWrapperedByTooltip
        align="left"
      />
    </Stack>
  );
}

function TriggeredMarker({ event }) {
  return getEventType(event) !== EVENT_TYPES.INCIDENT && hasServiceImpact(event) ? (
    <Pill color={themes.default.ids.color.option.teal['400']}>{t('in-events:markerServiceImpact')}</Pill>
  ) : null;
}

function hasServiceImpact(event) {
  const entityType = event.get('entityType');
  return isAppDataEntityType(entityType);
}

function renderIcon(event, timeConfig, size = 'l') {
  return (
    <EventIcon
      className={locals.icon}
      event={event}
      tooltipLabel={getEventSeverityLabelWithEventType(event, timeConfig)}
      size={size}
    />
  );
}

function getLabelText(event) {
  const kubernetesProblemText = getKubernetesProblemText(event);
  if (kubernetesProblemText) {
    return kubernetesProblemText;
  }

  return event.getIn(['problem', 'problemText'], '');
}
function updateTitle(item) {
  const kubernetesProblemText = getKubernetesProblemTextReplacement(item.title);
  if (kubernetesProblemText) {
    return { ...item, title: kubernetesProblemText };
  }
  return { ...item };
}
