import {combineLatest} from 'reactive-observables';
import Immutable from 'immutable';

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
  return existingEvents.filter(existing => {
    const id = existing.get('id');
    return eventUpdates.findIndex(updated => updated.get('id') === id) === -1;
  })
  .concat(eventUpdates);
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
          .filter(event => event.get('end') === undefined);
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
  observable: prepareEvents$(getOpenEvents())
                .scan(openEventsReducer, emptyList)
                .nextFrame()
}).observable;


export const combinedEvents$ = combineLatest([historicalEvents$, openEvents$])
  .map(([historical, open]) => {
    const result = historical.toArray();
    const addedEvents = {};

    result.forEach(event => {
      addedEvents[event.get('id')] = true;
    });

    open.forEach(event => {
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

export function getProblemsById(snapshotId) {
  return getEventsById(snapshotId).map(events => events.map(event => event.get('problem')));
}


/**
 * Gets the max severity of all problems and maps them to a health string. This
 * works by subscribing to all problems that occured for this snapshot and
 * returning a reactive observable.
 *
 * @param {Immutable<Snapshot>} snapshot The snapshot for which the health
 *   should be determined.
 * @returns {ReactiveObservable<string>} A stream that emits whenever the health
 *   changes.
 */
export function getHealth(snapshotId) {
  return getProblemsById(snapshotId)
    .map(problems => {
      return problems.reduce((acc, problem) => {
        return Math.max(problem.get('severity'), acc);
      }, 0);
    })
    .map(mapSeverityToHealth)
    .distinct();
}

/**
 * Gets the color for an event. If an event is closed it should be some kind
 * grey, if it's open and critical it has a danger color and so on.
 *
 * @param {Immutable<Event>} Event The event for which the color should be determined.
 * @returns {string} The color string in hex (e.g. #F03249)
 */
export function getColorForEvent(event) {
  const defaultColor = theme.health[0];

  return timelineStore.timeframe.map(timeframe => {
    if (!event) {
      return defaultColor;
    }
    const eventType = getEventType(event);
    if (eventType === EVENT_TYPES.INCIDENT ||
        eventType === EVENT_TYPES.CHANGE) {
      return defaultColor;
    }
    if (!timeframe.to) {
      if (!event.get('end')) {
        // live mode and event is open
        return getColorForProblem(event.get('problem'));
      }
      // live mode and event is closed
      return defaultColor;
    } else if (event.get('end') < timeframe.to) {
      // event is closed
      return defaultColor;
    }

    return getColorForProblem(event.get('problem'));
  });
}

/**
 * The same as getColorForIssue but with Problem object
 *
 * @param {Immutable<Problem>} Problem The problem for which the color should be determined.
 * @returns {string} The color string in hex (e.g. #F03249)
 */
export function getColorForProblem(problem) {
  const severity = problem.get('severity');
  throwExceptionIfUndefined(severity);
  return theme.health[severity];
}

function throwExceptionIfUndefined(property) {
  if (property === undefined) {
    throw new Error('Missing argument:', property);
  }
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
