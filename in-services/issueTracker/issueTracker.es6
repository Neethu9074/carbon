import {combineLatest} from 'reactive-observables';
import Immutable from 'immutable';

import {getHistoricalEvents} from 'in-stores/historicalEvents';
import {mapSeverityToHealth, health} from 'in-services/health';
import {setSelectedIncidentId} from 'in-stores/incident';
import {setSelectedSnapshotId} from 'in-stores/snapshot';
import {emptyList} from 'in-services/fixedImmutables';
import {isDemoEnvironment} from 'in-services/config';
import {createTrackingStore} from 'in-stores/store';
import * as timelineStore from 'in-stores/timeline';
import {getOpenEvents} from 'in-stores/openEvents';
import * as settings from 'in-services/settings';
import {theme} from 'in-services/theme';


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
function historicalEventsReducer(existingEvents, eventUpdates) {
  return existingEvents.filter(existing => {
    const id = existing.get('id');
    return eventUpdates.findIndex(updated => updated.get('id') === id) === -1;
  })
  .concat(eventUpdates);
}

/**
 * The same as historicalEventsReducer but this reducer removes all events
 * inside updates which have an end timestamp
 *
 * @param {Immutable<Event>} existingEvents All current event since the last scan
 * @param {Immutable<Event>} eventUpdates All updates
 * @returns {Immutable≤Issue>} existingEvents + eventUpdates - dublicates - events with end date
 */
function openEventsReducer(existingEvents, eventUpdates) {
  return historicalEventsReducer(existingEvents, eventUpdates)
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
  throwExceptionIfUndefined(event);

  // if there is no end time, the event is open
  return !event.get('end') ? getColorForProblem(event.get('problem')) : theme.health[0];
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


export const EVENT_TYPES = {
  CHANGE: 0,
  ISSUE_WARNING: 1,
  ISSUE_CRITICAL: 2,
  INCIDENT: 3
};

export function getEventType(event) {
  const eventType = event.get('type');
  if (eventType === 'incident') {
    return EVENT_TYPES.INCIDENT;
  }

  const eventHealth = mapSeverityToHealth(event.getIn(['problem', 'severity']));
  switch (eventHealth) {
    case health.danger:
      return EVENT_TYPES.ISSUE_CRITICAL;
    case health.warning:
      return EVENT_TYPES.ISSUE_WARNING;
    default:
      return EVENT_TYPES.CHANGE;
  }
}


export function selectEvent(event) {
  if (getEventType(event) === EVENT_TYPES.INCIDENT) {
    setSelectedIncidentId(event.get('id'));
  } else {
    setSelectedSnapshotId(event.getIn(['problem', 'snapshotId']));
  }
}
