/* eslint-disable new-cap */
import {combineLatest} from 'reactive-observables';
import Immutable from 'immutable';

import {getHistoricalIssues as getHistoricalIssuesStore} from 'in-stores/historicalIssues';
import {getOpenIssues as getOpenIssuesStore} from 'in-stores/openIssues';
import {emptyList} from 'in-services/fixedImmutables';
import {isDemoEnvironment} from 'in-services/config';
import {createTrackingStore} from 'in-stores/store';
import * as timelineStore from 'in-stores/timeline';
import * as settings from 'in-services/settings';
import {theme} from 'in-services/theme';

import {mapSeverityToHealth} from '../health';


// CPU steal issues shouldn't be shown in the demo environment as we are using
// small EC2 instances. These almost always have high CPU steal.
const withoutCpuStealMapper = (issues) => {
  return issues.filter(issue =>
    issue.getIn(['problem', 'problemText'], '').indexOf('Steal') === -1
  );
};

function collectingReducer(existingIssues, issueUpdates) {
  // a issue may already exist in our list of issues.
  // We assume that it is an update in such cases. An update may change a
  // problem's end time and other properties.
  //
  // Remove all issues for which we get updates from the backend
  // and add the updated ones.
  return existingIssues.filter(existingIssue => {
    return issueUpdates.findIndex(updatedIssue => {
      return updatedIssue.get('id') === existingIssue.get('id');
    }) === -1;
  })
  .concat(issueUpdates);
}

function prepareIssue$(issue$) {
  let stream = issue$;

  if (isDemoEnvironment()) {
    stream = stream.map(withoutCpuStealMapper);
  }

  stream = combineLatest([
    settings.getIn(['experiments']),
    stream
  ]).map(([withExperiments, issues]) => {
    if (withExperiments) {
      return issues;
    }
    return issues.filter(issue => !issue.getIn(['problem', 'experimental'], false));
  });

  return stream;
}

export const historicalIssues$ = createTrackingStore({
  name: 'historicalIssuesStore',
  observable: prepareIssue$(timelineStore.timeframe
                              .distinct()
                              .flatMap(timeframe =>
                                getHistoricalIssuesStore(timeframe)
                                  .scan(collectingReducer, emptyList)
                              ))
                .nextFrame()
}).observable;


export const openIssues$ = createTrackingStore({
  name: 'openIssuesStore',
  observable: prepareIssue$(getOpenIssuesStore())
                .scan(collectingReducer, emptyList)
                .nextFrame()
}).observable;


const combinedIssues$ = combineLatest([historicalIssues$, openIssues$])
  .map(([historical, open]) => {
    const result = historical.toArray();
    const addedIssues = {};

    result.forEach(issue => {
      addedIssues[issue.get('id')] = true;
    });

    open.forEach(issue => {
      if (!addedIssues[issue.get('id')]) {
        result.push(issue);
      }
    });

    return Immutable.List(result);
  });

export function getCombinedIssuesStream() {
  return combinedIssues$;
}


export function getIssuesById(snapshotId) {
  return openIssues$.map(issues => {
    let size = 0;
    const result = Immutable.List().asMutable();

    issues.forEach(issue => {
      if (issue.getIn(['problem', 'snapshotId']) === snapshotId) {
        result.set(size++, issue);
      }
    });

    return result.asImmutable();
  });
}

export function getMostImportantIssue(snapshotId) {
  return getIssuesById(snapshotId)
           .map(issues => issues.reduce((acc, issue) => {
             if (issue.getIn(['problem', 'severity']) >= acc.getIn(['problem', 'severity'])) {
               return issue;
             }
             return acc;
           }, issues.get(0)));
}

export function getProblemsById(snapshotId) {
  return getIssuesById(snapshotId).map(issues => issues.map(issue => issue.get('problem')));
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
 * Gets the color for an issue. If an issue is closed it should be some kind
 * grey, if it's open and critical it has a danger color and so on.
 *
 * @param {Immutable<Issue>} Issue The issue for which the color should be determined.
 * @returns {string} The color string in hex (e.g. #F03249)
 */
export function getColorForIssue(issue) {
  throwExceptionIfUndefined(issue);

  // if there is no end time, the issue is open
  return !issue.get('end') ? getColorForProblem(issue.get('problem')) : theme.health[0];
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
