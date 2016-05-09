import {combineLatest} from 'reactive-observables';
import Immutable from 'immutable';
import {createLogger} from 'instalog';

import createEventObservable from 'in-services/subscription/event';
import {getHistoricalEvents} from 'in-stores/historicalEvents';
import {mapSeverityToHealth, health} from 'in-services/health';
import {setSelectedSnapshotId} from 'in-stores/snapshot';
import {setSelectedIncident} from 'in-stores/incident';
import {emptyList} from 'in-services/fixedImmutables';
import {isDemoEnvironment} from 'in-services/config';
import {createTrackingStore} from 'in-stores/store';
import * as timelineStore from 'in-stores/timeline';
import {getOpenEvents} from 'in-stores/openEvents';
import * as settings from 'in-services/settings';
import {theme} from 'in-services/theme';

const logger = createLogger('in-services/issueTracker/issueTracker');

export const EVENT_TYPES = {
  CHANGE: 0,
  ISSUE_WARNING: 1,
  ISSUE_CRITICAL: 2,
  ISSUE_OK: 3,
  INCIDENT: 4
};

// CPU steal events shouldn't be shown in the demo environment as we are using
// small EC2 instances. These almost always have high CPU steal.
const withoutCpuStealMapper = (events) => {
  return events.filter(event =>
    event.getIn(['problem', 'problemText'], '').indexOf('Steal') === -1
  );
};

/**
 * An isue may already exist in our list of events.
 * We assume that it is an update in such cases. An update may change a
 * problem's end time and other properties.
 *
 * Remove all events for which we get updates from the backend and add the updated ones.
 *
 * @param {Immutable<Event>} existingEvents All current event since the last scan
 * @param {Immutable<Event>} eventUpdates All updates
 * @returns {Immutable≤Issue>} existingEvents + eventUpdates - dublicates
 */
function issuesReducer(existingEvents, eventUpdates) {
  const updatedEventIds = {};
  const updatesToApply = [];
  eventUpdates.forEach(event => {
    if (updatedEventIds[event.get('id')]) {
      logger.info(`Update contains the event with ID ${event.get('id')} (at least) twice.`);
    } else {
      updatedEventIds[event.get('id')] = event;
      updatesToApply.push(event);
    }
  });

  const result = existingEvents.filter(existing => {
    return !updatedEventIds[existing.get('id')];
  })
  .concat(Immutable.List(updatesToApply));

  return result;
}


/**
 * The same as issuesReducer but this reducer removes all issues
 * which are not inside the timeframe anymore
 *
 * @param {Immutable<Issue>} existingIssues All current issue since the last scan
 * @param {Immutable<Issue>} issueUpdates All updates
 * @returns {Immutable≤Issue>} existingIssues + issueUpdates - dublicates - issues outside timeframe
 */
function historicalEventsReducer(existingIssues, issueUpdates) {
  return issuesReducer(existingIssues, issueUpdates);
}

/**
 * The same as issuesReducer but this reducer removes all issues
 * inside updates which have an end timestamp
 *
 * @param {Immutable<Event>} existingEvents All current event since the last scan
 * @param {Immutable<Event>} eventUpdates All updates
 * @returns {Immutable≤Issue>} existingEvents + eventUpdates - dublicates - events with end date
 */
function openEventsReducer(existingEvents, eventUpdates) {
  return issuesReducer(existingEvents, eventUpdates)
    .filter(event => event.get('state') === 'open');
}

/**
 * This method returns any event stream and sort out or leave in all events that are marked
 * as experimental, depending on the settings. Furthermore CPU Steal event are removed on demo environment
 *
 * @param {ReactiveObservable<Event>} event$ The event stream, containing all events
 * @returns {ReactiveObservable<Event>} A cleaned event stream
 */
function prepareEvents$(event$) {
  let stream = event$;

  if (isDemoEnvironment()) {
    stream = stream.map(withoutCpuStealMapper);
  }

  stream = combineLatest([
    settings.getIn(['experiments']),
    stream
  ]).map(([withExperiments, events]) => {
    if (withExperiments) {
      return events;
    }
    return events.filter(event => !event.getIn(['problem', 'experimental'], false));
  });

  return stream;
}

export const historicalEvents$ = createTrackingStore({
  name: 'historicalEventsStore',
  observable: prepareEvents$(timelineStore.timeframe
                              .distinct()
                              .flatMap(timeframe =>
                                getHistoricalEvents(timeframe)
                                  .scan(historicalEventsReducer, emptyList)
                              ))
                .nextFrame()
}).observable;


export const openEvents$ = createTrackingStore({
  name: 'openEventsStore',
  observable: prepareEvents$(timelineStore.timeframe
                              .flatMap(timeframe =>
                                getOpenEvents(timeframe.to)
                                  .scan(openEventsReducer, emptyList)
                              ))
                              .nextFrame()
}).observable;

export const combinedEvents$ = combineLatest([historicalEvents$, openEvents$])
  .map(([historical, open]) => {
    const result = [];
    const addedEvents = {};

    open.forEach(event => {
      if (addedEvents[event.get('id')]) {
        logger.info(`Event with the ID ${event.get('id')} exists (at least) twice!`);
      } else {
        addedEvents[event.get('id')] = event;
        result.push(event);
      }
    });

    historical.forEach(event => {
      if (!addedEvents[event.get('id')]) {
        result.push(event);
      }
    });

    return Immutable.List(result);
  });


export function getEventsById(snapshotId) {
  return openEvents$.map(events => {
    let size = 0;
    const result = Immutable.List().asMutable();

    events.forEach(event => {
      if (event.getIn(['problem', 'snapshotId']) === snapshotId) {
        result.set(size++, event);
      }
    });

    return result.asImmutable();
  });
}

/**
 * Searches for the event with the highest severity and returns it or the first
 * if many have the same severity
 *
 * @param {number} snapshotId The id to filter the event stream
 * @returns {Event} The event with the highest severity
 */
export function getMostImportantEvent(snapshotId) {
  return getEventsById(snapshotId)
           .map(events => events.reduce((acc, event) => {
             if (event.getIn(['problem', 'severity']) >= acc.getIn(['problem', 'severity'])) {
               return event;
             }
             return acc;
           }, events.get(0)));
}

/**
 * Gets the color for an event. If an event is closed it should be some kind
 * grey, if it's open and critical it has a danger color and so on.
 *
 */
export function getColorForEvent(event) {
  if (event.get('state') === 'open') {
    const severity = event.getIn(['problem', 'severity'], 0);

    if (__DEV__ && severity < 0 || severity > 10) {
      logger.info(`Invalid severity ${severity} for event ${event.toString()}`);
    }

    const color = theme.health[severity];
    if (!color) {
      return theme.health[0];
    }
    return color;
  }

  return theme.health[0];
}

/**
 * Gets the icontype, needed for Icon components for an events type.
 *
 * @param {EVENT_TYPES} eventType The event type for which the icon type should be determined.
 * @returns {string} The icon type of the event
 */
export function getIconTypeForEventType(eventType, useAlternativeChangeIcon) {
  switch (eventType) {
    case EVENT_TYPES.ISSUE_WARNING:
      return 'warning';
    case EVENT_TYPES.ISSUE_CRITICAL:
      return 'critical';
    case EVENT_TYPES.INCIDENT:
      return 'incidents';
    default:
      return useAlternativeChangeIcon ? 'instana_change' : 'change';
  }
}

/**
 * Gets the icontype, needed for Icon components for an event.
 *
 * @param {Immutable<Event>} event The event for which the icon type should be determined.
 * @returns {string} The icon type of the event
 */
export function getIconTypeForEvent(event, useAlternativeChangeIcon = false) {
  return getIconTypeForEventType(getEventType(event, useAlternativeChangeIcon));
}

export function getEventType(event) {
  const eventType = event.get('type');
  switch (eventType) {
    case 'incident':
      return EVENT_TYPES.INCIDENT;
    case 'change':
      return EVENT_TYPES.CHANGE;
    case 'issue':
      const eventHealth = mapSeverityToHealth(event.getIn(['problem', 'severity']));
      if (eventHealth === health.warning) {
        return EVENT_TYPES.ISSUE_WARNING;
      } else if (eventHealth === health.danger) {
        return EVENT_TYPES.ISSUE_CRITICAL;
      }
      return EVENT_TYPES.ISSUE_OK;
    default:
      return EVENT_TYPES.CHANGE;
  }
}


export function selectEvent(event) {
  if (getEventType(event) === EVENT_TYPES.INCIDENT) {
    setSelectedIncident(event.get('id'), event.get('start'));
  } else {
    setSelectedSnapshotId(event.getIn(['problem', 'snapshotId']));
  }
}

export function getEvent(eventId, to) {
  return createEventObservable({eventId, to});
}
