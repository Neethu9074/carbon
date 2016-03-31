import {combineLatest} from 'reactive-observables';
import Immutable from 'immutable';

import {getHistoricalEvents} from 'in-stores/historicalEvents';
import {emptyList} from 'in-services/fixedImmutables';
import {isDemoEnvironment} from 'in-services/config';
import {createTrackingStore} from 'in-stores/store';
import * as timelineStore from 'in-stores/timeline';
import {getOpenEvents} from 'in-stores/openEvents';
import * as settings from 'in-services/settings';
import {theme} from 'in-services/theme';

import {mapSeverityToHealth} from '../health';


// CPU steal events shouldn't be shown in the demo environment as we are using
// small EC2 instances. These almost always have high CPU steal.
const withoutCpuStealMapper = (events) => {
  return events.filter(event =>
    event.getIn(['problem', 'problemText'], '').indexOf('Steal') === -1
  );
};

function historicalEventsReducer(existingEvents, eventUpdates) {
  // a event may already exist in our list of events.
  // We assume that it is an update in such cases. An update may change a
  // problem's end time and other properties.
  //
  // Remove all events for which we get updates from the backend and add the updated ones.
  return existingEvents.filter(existing => {
    const id = existing.get('id');
    return eventUpdates.findIndex(updated => updated.get('id') === id) === -1;
  })
  .concat(eventUpdates);
}

function openEventsReducer(existingEvents, eventUpdates) {
  return historicalEventsReducer(existingEvents, eventUpdates)
          .filter(event => event.get('end') === undefined);
}

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
