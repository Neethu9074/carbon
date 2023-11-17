/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import { findIndex } from 'lodash';

import { Button, Stack, SvgIcon, Typography } from '@instana/components';
import { Link } from '@instana/components';
import { on } from '@instana/observables';

import { getKubernetesProblemText, getKubernetesProblemTextReplacement } from './EventContent/KubernetesEventContent';
import { getEventType, EVENT_TYPES, getEvent, getEventSeverityLabelWithEventType } from 'in-stores/events';
import NavigatorSplitScreen from 'in-events/components/NavigatorSplitScreen/NavigatorSplitScreen';
import { eventFeedbackNegativeTracker, eventFeedbackPositiveTracker } from 'in-events/tracker';
import FeedbackDialog from 'in-events/components/feedback/FeedbackDialog';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { productAreas } from 'in-services/tracking/productAreas';
import { eventFeedbackEnabled } from 'in-services/featureFlags';
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
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-components/Pill';
import { useTheme } from 'in-themes';
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
  const { selectedEventId, onChange, progress } = props;
  const items = props.items.map(item => updateTitle(item));
  if (!items) {
    return null;
  }

  function onItemClicked(eventId) {
    onChange({ eventId });
  }

  if (!selectedEventId) {
    return <EventsList {...props} items={items} onItemClicked={onItemClicked} progress={progress} />;
  }

  return (
    <NavigatorSplitScreen
      {...props}
      items={items}
      navigator={<EventsList {...props} items={items} onItemClicked={onItemClicked} />}
      typeLabel="event"
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
  const theme = useTheme();
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
  return (
    <DashboardHeader
      event={props.result.data}
      title={t('in-events:titleEvent')}
      renderIcon={() => renderIcon(props.result.data, props.timeConfig)}
      label={getLabelText(props.result.data)}
      renderMetaInformation={renderMetaInformation}
      renderTimeSelection={TimeSelection}
      hideUrlShortener
      theme={theme}
    />
  );
}

function renderMetaInformation({ event, theme }) {
  return <TriggeredMarker event={event} theme={theme} />;
}

function FeedbackComponents() {
  const tup = 'thumbsUp';
  const tdown = 'thumbsDown';
  const theme = useTheme();
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
    if (feedbackState === tdown) addActiveDialog(<FeedbackDialog />);
  }, [feedbackState]);

  return (
    <Stack direction="horizontal" gap="xxsmall" distribution="center" align="center">
      {feedbackState === '' ? (
        <Typography variant="body-regular" align="center">
          {t('in-events:eventHelpfulText')}
        </Typography>
      ) : (
        <Typography variant="body-regular" align="center">
          {t('in-events:thankYouForYourFeedback')}
        </Typography>
      )}

      <Button
        kind="subtle"
        // I acknowledge this isn't ideal but we will release a preliminary version and a discussion will take place to find a new way to do this
        //TODO: Find an alternative to this (i.e. bring in a filled in thumbs up icon)
        style={feedbackState === tup ? { background: `${theme.ids.color.option.neutral[300]}` } : undefined}
        size="compact"
        icon={'lib_thumbs_up'}
        iconSize="s"
        onClick={() => {
          eventFeedbackPositiveTracker({
            eventID: location.matrix[eventsPath]?.eventId,
            eventType: location.matrix[eventsPath]?.view
          });
          if (feedbackState === tup) {
            setFeedbackState('');
          } else {
            setFeedbackState(tup);
          }
        }}
      />
      <Button
        kind="subtle"
        // I acknowledge this isn't ideal but we will release a preliminary version and a discussion will take place to find a new way to do this
        //TODO: Find an alternative to this (i.e. bring in a filled in thumbs down icon)
        style={feedbackState === tdown ? { background: `${theme.ids.color.option.neutral[300]}` } : undefined}
        size="compact"
        iconSize="s"
        icon={'lib_thumbs_down'}
        onClick={() => {
          eventFeedbackNegativeTracker({
            eventID: location.matrix[eventsPath]?.eventId,
            eventType: location.matrix[eventsPath]?.view
          });
          if (feedbackState === tdown) {
            setFeedbackState('');
          } else {
            setFeedbackState(tdown);
          }
        }}
      />
    </Stack>
  );
}

function TimeSelection() {
  const { location, createHref } = useNavigation();

  setOrDeleteMatrixKey(location, eventsPath, eventId, null);

  return (
    <Stack direction="horizontal">
      {eventFeedbackEnabled && <FeedbackComponents />}

      <Link href={createHref(location)}>
        <Tooltip content={t('in-events:tooltipCloseEventDetail')}>
          <SvgIcon
            className={locals.closeIcon}
            aria-label={t('in-events:tooltipCloseEventDetail')}
            type="lib_openclose_cancel"
          />
        </Tooltip>
      </Link>
    </Stack>
  );
}

function TriggeredMarker({ event, theme }) {
  return getEventType(event) !== EVENT_TYPES.INCIDENT && hasServiceImpact(event) ? (
    <Pill color={theme.ids.color.option.teal['400']}>{t('in-events:markerServiceImpact')}</Pill>
  ) : null;
}

function hasServiceImpact(event) {
  const entityType = event.get('entityType');
  return isAppDataEntityType(entityType);
}

function renderIcon(event, timeConfig) {
  return (
    <EventIcon
      className={locals.icon}
      event={event}
      tooltipLabel={getEventSeverityLabelWithEventType(event, timeConfig)}
      size="l"
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
